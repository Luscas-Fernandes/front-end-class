const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Game state
let gameState = {
  players: [],
  roomFull: false,
  gameStarted: false,
  teams: [],
  currentPlayer: null,
  dominoes: [],
  board: [],
  hands: {},
  scores: { team1: 0, team2: 0 },
  currentRoundPoints: 1,
  lastWinningTeam: null,
  consecutiveTies: 0,
  turnTimeout: null
};

// Generate domino set
function generateDominoSet() {
  const dominoes = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      dominoes.push([i, j]);
    }
  }
  return dominoes;
}

// Shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Check if domino can be placed
function canPlaceDomino(domino, end) {
  if (gameState.board.length === 0) return true;
  
  const [a, b] = domino;
  const boardEnd = gameState.board[end === 'left' ? 0 : gameState.board.length - 1];
  const endValue = end === 'left' ? boardEnd[0] : boardEnd[1];
  
  return a === endValue || b === endValue;
}

// Initialize new game
function initializeGame() {
  const dominoSet = shuffleArray(generateDominoSet());
  gameState.dominoes = dominoSet.slice(28); // Dorme with 4 dominoes (28 pieces total)
  gameState.hands = {};
  gameState.board = [];
  
  // Assign 6 dominoes to each player
  for (let i = 0; i < 4; i++) {
    const playerId = gameState.players[i].id;
    gameState.hands[playerId] = dominoSet.slice(i * 6, (i + 1) * 6);
  }
  
  // Determine starting player (highest double)
  let maxDouble = -1;
  let startingPlayer = null;
  
  for (let i = 0; i < 4; i++) {
    const playerId = gameState.players[i].id;
    const hand = gameState.hands[playerId];
    for (const [a, b] of hand) {
      if (a === b && a > maxDouble) {
        maxDouble = a;
        startingPlayer = playerId;
      }
    }
  }
  
  // If no doubles, choose random player
  if (maxDouble === -1) {
    startingPlayer = gameState.players[Math.floor(Math.random() * 4)].id;
  }
  
  gameState.currentPlayer = startingPlayer;
  gameState.gameStarted = true;
  
  // Start turn timeout
  startTurnTimeout();
  
  // Send game started event with serializable data
  io.emit('gameStarted', getSerializableGameState());
}

// Get serializable game state
function getSerializableGameState() {
  return {
    players: gameState.players.map(p => ({ id: p.id, name: p.name })),
    teams: gameState.teams,
    currentPlayer: gameState.currentPlayer,
    board: gameState.board,
    hands: gameState.hands,
    scores: gameState.scores,
    currentRoundPoints: gameState.currentRoundPoints,
    consecutiveTies: gameState.consecutiveTies,
    dominoes: gameState.dominoes
  };
}

// Start turn timeout
function startTurnTimeout() {
  if (gameState.turnTimeout) clearTimeout(gameState.turnTimeout);
  
  gameState.turnTimeout = setTimeout(() => {
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
    const currentPlayerHand = gameState.hands[gameState.currentPlayer];
    const possibleMoves = [];
    
    // Check left end
    for (let i = 0; i < currentPlayerHand.length; i++) {
      if (canPlaceDomino(currentPlayerHand[i], 'left')) {
        possibleMoves.push({ index: i, end: 'left' });
      }
    }
    
    // Check right end
    for (let i = 0; i < currentPlayerHand.length; i++) {
      if (canPlaceDomino(currentPlayerHand[i], 'right')) {
        possibleMoves.push({ index: i, end: 'right' });
      }
    }
    
    if (possibleMoves.length > 0) {
      // Choose random move
      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      placeDomino(gameState.currentPlayer, move.index, move.end);
      io.emit('autoPlayed', currentPlayer.name);
    } else {
      // No possible moves, pass turn
      passTurn(gameState.currentPlayer);
      io.emit('autoPlayed', `${currentPlayer.name} passou a vez (tempo esgotado)`);
    }
  }, 20000); // 20 seconds
}

// Place domino on board
function placeDomino(playerId, dominoIndex, end) {
  if (gameState.currentPlayer !== playerId) return false;
  
  const hand = gameState.hands[playerId];
  const domino = hand[dominoIndex];
  
  if (gameState.board.length === 0) {
    // First move
    gameState.board.push(domino);
    hand.splice(dominoIndex, 1);
  } else {
    const [a, b] = domino;
    let boardEnd, endValue;
    
    if (end === 'left') {
      boardEnd = gameState.board[0];
      endValue = boardEnd[0];
    } else {
      boardEnd = gameState.board[gameState.board.length - 1];
      endValue = boardEnd[1];
    }
    
    if (a === endValue || b === endValue) {
      // Rotate domino if needed
      const rotatedDomino = a === endValue ? [b, a] : [a, b];
      
      if (end === 'left') {
        gameState.board.unshift(rotatedDomino);
      } else {
        gameState.board.push(rotatedDomino);
      }
      
      hand.splice(dominoIndex, 1);
    } else {
      return false;
    }
  }
  
  // Check if player won
  if (hand.length === 0) {
    endRound(playerId);
    return true;
  }
  
  // Move to next player
  const currentPlayerIndex = gameState.players.findIndex(p => p.id === playerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % 4;
  gameState.currentPlayer = gameState.players[nextPlayerIndex].id;
  
  // Update game state
  io.emit('gameStateUpdate', getSerializableGameState());
  
  // Start new timeout
  startTurnTimeout();
  
  return true;
}

// Pass turn
function passTurn(playerId) {
  if (gameState.currentPlayer !== playerId) return;
  
  // Check if game is blocked
  let gameBlocked = true;
  for (let i = 0; i < 4; i++) {
    const player = gameState.players[(gameState.players.findIndex(p => p.id === playerId) + i) % 4];
    const hand = gameState.hands[player.id];
    
    for (const domino of hand) {
      if (canPlaceDomino(domino, 'left') || canPlaceDomino(domino, 'right')) {
        gameBlocked = false;
        break;
      }
    }
    
    if (!gameBlocked) break;
  }
  
  if (gameBlocked) {
    // Game is blocked, determine winner by least points
    endRound(null);
    return;
  }
  
  // Move to next player
  const currentPlayerIndex = gameState.players.findIndex(p => p.id === playerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % 4;
  gameState.currentPlayer = gameState.players[nextPlayerIndex].id;
  
  // Update game state
  io.emit('gameStateUpdate', getSerializableGameState());
  
  // Start new timeout
  startTurnTimeout();
}

// End round
function endRound(winningPlayerId) {
  // Clear timeout
  if (gameState.turnTimeout) clearTimeout(gameState.turnTimeout);
  
  let winningTeam = null;
  let points = gameState.currentRoundPoints;
  
  if (winningPlayerId) {
    // Player won by playing all dominoes
    winningTeam = gameState.teams.find(team => team.players.includes(winningPlayerId)).name;
    
    // Check for special scoring conditions
    const lastDomino = gameState.board[gameState.board.length - 1];
    const [a, b] = lastDomino;
    
    if (a === b) {
      // Carroça
      points = 2;
    } else if (gameState.board.length > 1) {
      const leftEnd = gameState.board[0][0];
      const rightEnd = gameState.board[gameState.board.length - 1][1];
      
      if (lastDomino[0] === leftEnd && lastDomino[1] === rightEnd) {
        // Lá e lô
        points = 3;
      } else if (lastDomino[0] === rightEnd && lastDomino[1] === leftEnd) {
        // Lá e lô (reversed)
        points = 3;
      }
    }
    
    // Check for cruzada (double played on both ends)
    if (a === b && gameState.board.length > 1) {
      const leftEnd = gameState.board[0][0];
      const rightEnd = gameState.board[gameState.board.length - 1][1];
      
      if (leftEnd === rightEnd && leftEnd === a) {
        points = 4;
      }
    }
  } else {
    // Game blocked - determine winner by least points
    const team1Points = calculateTeamPoints(gameState.teams[0].players);
    const team2Points = calculateTeamPoints(gameState.teams[1].players);
    
    if (team1Points < team2Points) {
      winningTeam = gameState.teams[0].name;
      points = 1;
    } else if (team2Points < team1Points) {
      winningTeam = gameState.teams[1].name;
      points = 1;
    } else {
      // Tie
      gameState.consecutiveTies++;
      gameState.currentRoundPoints *= 2;
      io.emit('gameStateUpdate', getSerializableGameState());
      setTimeout(() => initializeGame(), 3000);
      return;
    }
  }
  
  // Update scores
  if (winningTeam === gameState.teams[0].name) {
    gameState.scores.team1 += points;
  } else {
    gameState.scores.team2 += points;
  }
  
  gameState.lastWinningTeam = winningTeam;
  gameState.consecutiveTies = 0;
  gameState.currentRoundPoints = 1;
  
  // Check if game is over
  if (gameState.scores.team1 >= 6 || gameState.scores.team2 >= 6) {
    io.emit('gameOver', {
      winningTeam,
      scores: gameState.scores
    });
    
    // Reset game
    gameState = {
      players: [],
      roomFull: false,
      gameStarted: false,
      teams: [],
      currentPlayer: null,
      dominoes: [],
      board: [],
      hands: {},
      scores: { team1: 0, team2: 0 },
      currentRoundPoints: 1,
      lastWinningTeam: null,
      consecutiveTies: 0,
      turnTimeout: null
    };
  } else {
    // Start new round
    io.emit('roundOver', {
      winningTeam,
      points,
      scores: gameState.scores
    });
    
    setTimeout(() => initializeGame(), 3000);
  }
}

// Calculate team points
function calculateTeamPoints(playerIds) {
  let points = 0;
  for (const playerId of playerIds) {
    for (const [a, b] of gameState.hands[playerId]) {
      points += a + b;
    }
  }
  return points;
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join game
  socket.on('joinGame', (playerName) => {
    if (gameState.roomFull) {
      socket.emit('roomFull');
      return;
    }
    
    // Check for duplicate names
    if (gameState.players.some(p => p.name === playerName)) {
      socket.emit('duplicateName');
      return;
    }
    
    const player = {
      id: socket.id,
      name: playerName
    };
    
    gameState.players.push(player);
    
    // Notify player
    socket.emit('joinedGame', {
      playerId: socket.id,
      players: gameState.players.map(p => ({ id: p.id, name: p.name }))
    });
    
    // Notify all players about new player
    io.emit('playerJoined', { id: socket.id, name: playerName });
    
    // Check if room is full
    if (gameState.players.length === 4) {
      gameState.roomFull = true;
      
      // Create teams randomly
      const shuffledPlayers = [...gameState.players];
      shuffleArray(shuffledPlayers);
      
      gameState.teams = [
        { name: 'team1', players: [shuffledPlayers[0].id, shuffledPlayers[1].id] },
        { name: 'team2', players: [shuffledPlayers[2].id, shuffledPlayers[3].id] }
      ];
      
      // Start game
      initializeGame();
    }
  });
  
  // Place domino
  socket.on('placeDomino', ({ dominoIndex, end }) => {
    placeDomino(socket.id, dominoIndex, end);
  });
  
  // Pass turn
  socket.on('passTurn', () => {
    passTurn(socket.id);
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    
    // Remove player from game
    const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      const playerName = gameState.players[playerIndex].name;
      gameState.players.splice(playerIndex, 1);
      gameState.roomFull = false;
      
      // Notify other players
      io.emit('playerLeft', socket.id);
      
      // Reset game if in progress
      if (gameState.gameStarted) {
        if (gameState.turnTimeout) clearTimeout(gameState.turnTimeout);
        gameState = {
          players: [],
          roomFull: false,
          gameStarted: false,
          teams: [],
          currentPlayer: null,
          dominoes: [],
          board: [],
          hands: {},
          scores: { team1: 0, team2: 0 },
          currentRoundPoints: 1,
          lastWinningTeam: null,
          consecutiveTies: 0,
          turnTimeout: null
        };
        
        io.emit('gameReset');
      }
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));