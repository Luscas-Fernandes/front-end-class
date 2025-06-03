import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [screen, setScreen] = useState('welcome');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState('');
  const [error, setError] = useState('');
  const [roundResult, setRoundResult] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  
  const boardRef = useRef(null);
  const dominoRefs = useRef([]);

  const joinGame = () => {
    if (!playerName.trim()) {
      setError('Por favor, digite seu nome');
      return;
    }
    socket.emit('joinGame', playerName.trim());
  };

  const placeDomino = (index, end) => {
    socket.emit('placeDomino', { dominoIndex: index, end });
  };

  const passTurn = () => {
    socket.emit('passTurn');
  };

  const handleDominoDoubleClick = (index) => {
    if (!gameState || gameState.currentPlayer !== playerId) return;
    
    const domino = gameState.hands[playerId][index];
    const canPlaceLeft = canPlaceDomino(domino, 'left');
    const canPlaceRight = canPlaceDomino(domino, 'right');
    
    if (canPlaceLeft && !canPlaceRight) {
      placeDomino(index, 'left');
    } else if (canPlaceRight && !canPlaceLeft) {
      placeDomino(index, 'right');
    }
  };

  const canPlaceDomino = (domino, end) => {
    if (!gameState || gameState.board.length === 0) return true;
    
    const [a, b] = domino;
    const boardEnd = end === 'left' ? gameState.board[0] : gameState.board[gameState.board.length - 1];
    const endValue = end === 'left' ? boardEnd[0] : boardEnd[1];
    
    return a === endValue || b === endValue;
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('dominoIndex', index);
  };

  const handleDrop = (e, end) => {
    e.preventDefault();
    if (gameState.currentPlayer !== playerId) return;
    
    const index = parseInt(e.dataTransfer.getData('dominoIndex'));
    const domino = gameState.hands[playerId][index];
    
    if (canPlaceDomino(domino, end)) {
      placeDomino(index, end);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleJoinedGame = (data) => {
      setPlayerId(data.playerId);
      setPlayers(data.players);
      setScreen(data.players.length === 4 ? 'game' : 'waiting');
    };

    const handlePlayerJoined = (player) => {
      setPlayers(prev => prev.some(p => p.id === player.id) ? prev : [...prev, player]);
    };

    const handlePlayerLeft = (leftPlayerId) => {
      setPlayers(prev => prev.filter(p => p.id !== leftPlayerId));
      setScreen('waiting');
    };

    const handleGameStarted = (state) => {
      setGameState(state);
      setScreen('game');
    };

    socket.on('joinedGame', handleJoinedGame);
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('playerLeft', handlePlayerLeft);
    socket.on('gameStarted', handleGameStarted);
    socket.on('gameStateUpdate', setGameState);
    socket.on('roundOver', (result) => {
      setRoundResult(result);
      setTimeout(() => setRoundResult(null), 3000);
    });
    socket.on('gameOver', setGameOver);
    socket.on('roomFull', () => setError('Sala cheia'));
    socket.on('duplicateName', () => setError('Nome já em uso'));
    socket.on('gameReset', () => {
      setGameState(null);
      setRoundResult(null);
      setGameOver(null);
      setScreen('waiting');
    });

    return () => {
      socket.off('joinedGame', handleJoinedGame);
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('playerLeft', handlePlayerLeft);
      socket.off('gameStarted', handleGameStarted);
      socket.off('gameStateUpdate', setGameState);
      socket.off('roundOver');
      socket.off('gameOver', setGameOver);
      socket.off('roomFull');
      socket.off('duplicateName');
      socket.off('gameReset');
    };
  }, []);

  const renderDomino = (domino, index, isPlayer = false) => {
    const [left, right] = domino;
    return (
      <div 
        className={`domino ${isPlayer ? 'player-domino' : 'opponent-domino'}`}
        key={index}
        onDoubleClick={isPlayer ? () => handleDominoDoubleClick(index) : null}
        draggable={isPlayer && gameState?.currentPlayer === playerId}
        onDragStart={isPlayer ? (e) => handleDragStart(e, index) : null}
        ref={el => dominoRefs.current[index] = el}
      >
        <div className="domino-left">{left}</div>
        <div className="domino-separator"></div>
        <div className="domino-right">{right}</div>
      </div>
    );
  };

  if (screen === 'welcome') {
    return (
      <div className="welcome-screen">
        <h1>Dominó Online</h1>
        <div className="rules">
          <h2>Regras do Jogo</h2>
          <p>Duas duplas competem para ser a primeira a marcar pelo menos 6 pontos.</p>
          <p>Cada rodada pode valer 1, 2, 3 ou 4 pontos dependendo de como o jogo termina.</p>
          <p>Ganha quem baixar todas as peças primeiro ou, em caso de fechamento, quem tiver menos pontos na mão.</p>
        </div>
        <div className="join-form">
          <input
            type="text"
            placeholder="Digite seu nome"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={joinGame}>JOGAR</button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  if (screen === 'waiting') {
    return (
      <div className="waiting-screen">
        <h1>Aguardando jogadores...</h1>
        <p>Jogadores na sala:</p>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
        <p>Aguardando {Math.max(0, 4 - players.length)} jogador(es) para começar...</p>
      </div>
    );
  }

  if (screen === 'game' && gameState) {
    const currentTeam = gameState.teams.find(team => team.players.includes(playerId));
    const team1Players = gameState.players.filter(p => gameState.teams[0].players.includes(p.id));
    const team2Players = gameState.players.filter(p => gameState.teams[1].players.includes(p.id));
    const playerHand = gameState.hands[playerId] || [];
    const otherPlayers = gameState.players.filter(p => p.id !== playerId);

    return (
      <div className="game-screen">
        {roundResult && (
          <div className="round-result">
            <h2>{roundResult.winningTeam === currentTeam.name ? 'Sua dupla ganhou!' : 'Dupla adversária ganhou!'}</h2>
            <p>Pontos: {roundResult.points}</p>
            <p>Placar: {roundResult.scores.team1} x {roundResult.scores.team2}</p>
          </div>
        )}
        
        {gameOver && (
          <div className="game-over">
            <h2>{gameOver.winningTeam === currentTeam.name ? 'Sua dupla venceu o jogo!' : 'Dupla adversária venceu o jogo!'}</h2>
            <p>Placar final: {gameOver.scores.team1} x {gameOver.scores.team2}</p>
            <button onClick={() => window.location.reload()}>Voltar ao início</button>
          </div>
        )}
        
        <div className="game-header">
          <div className="teams">
            <div className={`team ${currentTeam.name === 'team1' ? 'current-team' : ''}`}>
              <h3>DUPLA 1: {team1Players.map(p => p.name).join(' / ')}</h3>
              <p>Pontos: {gameState.scores.team1}</p>
            </div>
            <div className={`team ${currentTeam.name === 'team2' ? 'current-team' : ''}`}>
              <h3>DUPLA 2: {team2Players.map(p => p.name).join(' / ')}</h3>
              <p>Pontos: {gameState.scores.team2}</p>
            </div>
          </div>
          {gameState.consecutiveTies > 0 && (
            <div className="tie-message">
              <p>Empate! Próxima rodada vale {gameState.currentRoundPoints} pontos</p>
            </div>
          )}
        </div>
        
        <div className="board" ref={boardRef} onDragOver={handleDragOver}>
          <div className="board-left" onDrop={(e) => handleDrop(e, 'left')} onDragOver={handleDragOver}>
            {gameState.board.length > 0 && (
              <div className="drop-indicator">
                {gameState.currentPlayer === playerId ? 'Soltar aqui' : ''}
              </div>
            )}
          </div>
          
          <div className="board-center">
            {gameState.board.map((domino, index) => renderDomino(domino, index))}
          </div>
          
          <div className="board-right" onDrop={(e) => handleDrop(e, 'right')} onDragOver={handleDragOver}>
            {gameState.board.length > 0 && (
              <div className="drop-indicator">
                {gameState.currentPlayer === playerId ? 'Soltar aqui' : ''}
              </div>
            )}
          </div>
        </div>
        
        <div className="opponents">
          {otherPlayers.map((player) => (
            <div key={player.id} className="opponent">
              <h4>{player.name} ({gameState.hands[player.id]?.length || 0} peças)</h4>
              <div className="opponent-hand">
                {Array.from({ length: gameState.hands[player.id]?.length || 0 }).map((_, i) => (
                  <div key={i} className="domino-back"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="player-area">
          <div className="player-info">
            <h3>{gameState.players.find(p => p.id === playerId)?.name}</h3>
            <p>{gameState.currentPlayer === playerId ? 'Sua vez!' : 'Aguardando outros jogadores...'}</p>
          </div>
          
          <div className="player-hand">
            {playerHand.map((domino, index) => renderDomino(domino, index, true))}
          </div>
          
          {gameState.currentPlayer === playerId && (
            <div className="player-actions">
              <button 
                onClick={passTurn}
                disabled={playerHand.some(domino => 
                  canPlaceDomino(domino, 'left') || canPlaceDomino(domino, 'right')
                )}
              >
                Passar vez
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div>Carregando...</div>;
}

export default App;