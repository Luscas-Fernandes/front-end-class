const gameState = {
    players: [],
    dealer: {
        name: 'Banca',
        cards: [],
        points: 0,
        status: '',
        isDealer: true
    },
    deck: [],
    currentPlayerIndex: 0,
    round: 1,
    totalRounds: 3,
    timeout: 30,
    timer: null,
    timeLeft: 0,
    scores: {}
};

// DOM elements
const setupPanel = document.getElementById('setupPanel');
const gamePanel = document.getElementById('gamePanel');
const playerNamesContainer = document.getElementById('playerNamesContainer');
const gameSetupForm = document.getElementById('gameSetupForm');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersArea = document.getElementById('playersArea');
const dealerCards = document.getElementById('dealerCards');
const dealerPoints = document.getElementById('dealerPoints');
const dealerStatus = document.getElementById('dealerStatus');
const currentRoundDisplay = document.getElementById('currentRound');
const totalRoundsDisplay = document.getElementById('totalRounds');
const timeoutDisplay = document.getElementById('timeoutDisplay');
const roundResultModal = document.getElementById('roundResultModal');
const roundResultMessage = document.getElementById('roundResultMessage');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const newGameBtn = document.getElementById('newGameBtn');

// Event listeners
addPlayerBtn.addEventListener('click', addPlayerInput);
gameSetupForm.addEventListener('submit', startGame);
nextRoundBtn.addEventListener('click', startNextRound);
newGameBtn.addEventListener('click', resetGame);

// Initialize player inputs
initializePlayerInputs();

function addPlayerInput() {
    const playerCount = document.querySelectorAll('.name-input-container').length;
    
    if (playerCount >= 4) {
        showAddPlayerError("Máximo de 4 jogadores.");
        return;
    }
    
    const container = document.createElement('div');
    container.className = 'name-input-container';
    container.innerHTML = `
        <input type="text" class="player-name-input" placeholder="Nome do Jogador" required>
        <label class="upload-image-btn">
            📷
            <input type="file" class="image-upload" accept="image/*" style="display: none;">
        </label>
        <button type="button" class="remove-name-btn">×</button>
        <div class="image-preview" style="display: none;">
            <img src="" alt="Preview">
        </div>
    `;
    
    const uploadBtn = container.querySelector('.image-upload');
    const preview = container.querySelector('.image-preview');
    const previewImg = preview.querySelector('img');
    
    uploadBtn.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewImg.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    container.querySelector('.remove-name-btn').addEventListener('click', function() {
        if (document.querySelectorAll('.name-input-container').length > 2) {
            container.remove();
        } else {
            showAddPlayerError('O número mínimo de jogadores é 2');
        }
    });
    
    playerNamesContainer.appendChild(container);
}
function showAddPlayerError(message) {
    const errorElement = document.getElementById('addPlayerError');
    errorElement.textContent = message;
    setTimeout(() => errorElement.textContent = '', 3000);
}

function initializePlayerInputs() {
    playerNamesContainer.innerHTML = '';
    for (let i = 0; i < 2; i++) {
        addPlayerInput();
    }
}

function resetGame() {
    if (gameState.timer) clearInterval(gameState.timer);
    gameState.timer = null;
    gameState.players = [];
    gameState.dealer.cards = [];
    gameState.dealer.points = 0;
    gameState.dealer.status = '';
    gameState.currentPlayerIndex = 0;
    gameState.round = 1;
    gameState.scores = {};

    document.getElementById('playersArea').innerHTML = '';
    document.getElementById('dealerCards').innerHTML = '';
    document.getElementById('dealerPoints').textContent = '0';
    document.getElementById('dealerStatus').textContent = '';
    document.getElementById('playerNamesContainer').innerHTML = '';
    document.getElementById('addPlayerError').textContent = '';

    const nameInputs = document.querySelectorAll('#playerNamesContainer input');
    nameInputs.forEach(input => input.value = '');

    document.getElementById('gamePanel').style.display = 'none';
    document.getElementById('setupPanel').style.display = 'block';
    document.getElementById('gameOverModal').style.display = 'none';

    initializePlayerInputs();
}

function startGame(e) {
    e.preventDefault();
    
    gameState.totalRounds = parseInt(document.getElementById('rounds').value);
    gameState.timeout = parseInt(document.getElementById('timeout').value);
    gameState.round = 1;
    
    const nameInputs = document.querySelectorAll('.player-name-input');
    const playerContainers = document.querySelectorAll('.name-input-container');
    
    const players = Array.from(playerContainers).map((container, index) => {
        const nameInput = container.querySelector('.player-name-input');
        const previewImg = container.querySelector('.image-preview img');
        
        return {
            name: nameInput.value.trim() || `Jogador ${index + 1}`,
            avatar: previewImg.style.display !== 'none' ? previewImg.src : null
        };
    });
    
    const uniqueNames = new Set(players.map(p => p.name));
    if (uniqueNames.size !== players.length) {
        showAddPlayerError("Nome de jogador repetido.");
        return;
    }
    
    gameState.players = [];
    gameState.scores = {};

    players.forEach(player => {
        gameState.players.push({
            name: player.name,
            avatar: player.avatar,
            cards: [],
            points: 0,
            status: '',
            isStanding: false,
            isBust: false,
            hasBlackjack: false
        });
        
        gameState.scores[player.name] = 0;
    });
    
    gameState.scores[gameState.dealer.name] = 0;
    
    setupPanel.style.display = 'none';
    gamePanel.style.display = 'flex';
    
    currentRoundDisplay.textContent = gameState.round;
    totalRoundsDisplay.textContent = gameState.totalRounds;
    timeoutDisplay.textContent = gameState.timeout;
    startRound();
}

function startRound() {
    gameState.currentPlayerIndex = 0;
    gameState.dealer.cards = [];
    gameState.dealer.points = 0;
    gameState.dealer.status = '';
    
    gameState.players.forEach(player => {
        player.cards = [];
        player.points = 0;
        player.status = '';
        player.isStanding = false;
        player.isBust = false;
        player.hasBlackjack = false;
    });
    
    gameState.deck = createDeck();
    shuffleDeck(gameState.deck);
    dealInitialCards();
    updateGameUI();
    startPlayerTurn();
}

function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ suit, value });
        }
    }
    
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealInitialCards() {
    // Primeira carta para todos os jogadores
    gameState.players.forEach(player => {
        const card = drawCard();
        player.cards.push(card);
    });
    
    // Primeira carta para o dealer
    gameState.dealer.cards.push(drawCard());
    
    // Segunda carta para todos os jogadores
    gameState.players.forEach(player => {
        const card = drawCard();
        player.cards.push(card);
        player.points = calculatePoints(player.cards);
        checkBlackjack(player);
    });
    
    // Segunda carta para o dealer (virada)
    gameState.dealer.cards.push(drawCard());
    gameState.dealer.points = calculatePoints([gameState.dealer.cards[0]]);
}

function drawCard() {
    return gameState.deck.pop();
}

function calculatePoints(cards) {
    let points = 0;
    let aces = 0;
    
    for (const card of cards) {
        if (card.value === 'A') {
            aces++;
            points += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            points += 10;
        } else {
            points += parseInt(card.value);
        }
    }
    
    while (points > 21 && aces > 0) {
        points -= 10;
        aces--;
    }
    
    return points;
}

function checkBlackjack(player) {
    if (player.cards.length === 2 && player.points === 21) {
        player.hasBlackjack = true;
        player.status = 'BLACKJACK!';
    }
}

function startPlayerTurn() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (currentPlayer.isStanding || currentPlayer.isBust || currentPlayer.hasBlackjack) {
        nextPlayerTurn();
        return;
    }
    
    updateGameUI();
    highlightCurrentPlayer();
    startTimer();
}

function highlightCurrentPlayer() {
    document.querySelectorAll('.player-area').forEach(area => {
        area.classList.remove('glow');
    });
    
    const currentPlayerElement = document.querySelector(`.player-area[data-player-index="${gameState.currentPlayerIndex}"]`);
    if (currentPlayerElement) {
        currentPlayerElement.classList.add('glow');
    }
}

function startTimer() {
    clearTimeout(gameState.timer);
    gameState.timeLeft = gameState.timeout;
    
    const timerElements = document.querySelectorAll('.timer-display');
    timerElements.forEach(el => el.remove());
    
    const currentPlayerElement = document.querySelector(`.player-area[data-player-index="${gameState.currentPlayerIndex}"]`);
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer-display';
    timerDisplay.textContent = gameState.timeLeft;
    currentPlayerElement.appendChild(timerDisplay);
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        timerDisplay.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            clearTimeout(gameState.timer);
            stand();
        }
    }, 1000);
}

function nextPlayerTurn() {
    clearTimeout(gameState.timer);
    gameState.currentPlayerIndex++;
    
    if (gameState.currentPlayerIndex < gameState.players.length) {
        startPlayerTurn();
    } else {
        dealerTurn();
    }
}

function dealerTurn() {
    gameState.dealer.points = calculatePoints(gameState.dealer.cards);
    updateGameUI();
    
    const dealerDrawInterval = setInterval(() => {
        if (gameState.dealer.points < 17) {
            const card = drawCard();
            gameState.dealer.cards.push(card);
            gameState.dealer.points = calculatePoints(gameState.dealer.cards);
            updateGameUI();
            
            if (gameState.dealer.points > 21) {
                gameState.dealer.status = 'ESTOROU!';
                clearInterval(dealerDrawInterval);
                endRound();
            }
        } else {
            clearInterval(dealerDrawInterval);
            endRound();
        }
    }, 1000);
}

function endRound() {
    const dealerPoints = gameState.dealer.points;
    const dealerBust = dealerPoints > 21;
    
    gameState.players.forEach(player => {
        if (player.isBust) {
            player.status = 'PERDEU';
            gameState.scores[gameState.dealer.name] += 10;
        } else if (dealerBust) {
            player.status = 'GANHOU!';
            gameState.scores[player.name] += 10;
        } else if (player.points > dealerPoints) {
            player.status = 'GANHOU!';
            gameState.scores[player.name] += 10;
        } else if (player.points === dealerPoints) {
            player.status = 'EMPATE';
            gameState.scores[player.name] += 5;
            gameState.scores[gameState.dealer.name] += 5;
        } else {
            player.status = 'PERDEU';
            gameState.scores[gameState.dealer.name] += 10;
        }
    });
    
    updateGameUI();
    showRoundResult();
}

function showRoundResult() {
    const winners = gameState.players.filter(p => p.status === 'GANHOU!').map(p => p.name);
    const ties = gameState.players.filter(p => p.status === 'EMPATE').map(p => p.name);
    let message = '';
    
    if (winners.length > 0) {
        if (winners.length === 1) {
            message = `${winners[0]} venceu esta rodada!`;
        } else {
            message = `${winners.join(' e ')} venceram esta rodada!`;
        }
    } else if (ties.length > 0) {
        if (ties.length === 1) {
            message = `${ties[0]} empatou com a banca!`;
        } else {
            message = `${ties.join(' e ')} empataram com a banca!`;
        }
    } else {
        message = 'A banca venceu esta rodada!';
    }
    
    roundResultMessage.textContent = message;
    roundResultModal.style.display = 'flex';
}

function startNextRound() {
    roundResultModal.style.display = 'none';
    
    if (gameState.round < gameState.totalRounds) {
        gameState.round++;
        currentRoundDisplay.textContent = gameState.round;
        startRound();
    } else {
        endGame();
    }
}

function endGame() {
    const roundsWon = {};
    gameState.players.forEach(player => {
        roundsWon[player.name] = Math.floor(gameState.scores[player.name] / 10);
    });

    let gameOverMsg = '<h3>Resultado Final</h3><br>';
    gameOverMsg += '<div class="final-results">';
    gameState.players.forEach(player => {
        const avatarHTML = player.avatar 
    ? `<img src="${player.avatar}" class="player-avatar" alt="${player.name}" style="vertical-align: middle; margin-right: 5px;" onerror="this.style.display='none';">` 
    : '';
        gameOverMsg += `<p>${avatarHTML}<strong>${player.name}:</strong> ${roundsWon[player.name]} vitória(s)</p>`;
    });
    
    gameOverMsg += '</div>';
    gameOverMessage.innerHTML = gameOverMsg;
    gameOverModal.style.display = 'flex';
}

function updateGameUI() {
    dealerCards.innerHTML = '';
    gameState.dealer.cards.forEach((card, index) => {
        if (index === 1 && gameState.currentPlayerIndex < gameState.players.length) {
            dealerCards.innerHTML += createCardElement({ suit: 'hidden', value: '' }, true);
        } else {
            dealerCards.innerHTML += createCardElement(card);
        }
    });
    
    dealerPoints.textContent = gameState.dealer.points;
    dealerStatus.textContent = gameState.dealer.status;
    
    playersArea.innerHTML = '';
    gameState.players.forEach((player, index) => {
        const playerElement = document.createElement('div');
        playerElement.className = 'player-area';
        playerElement.dataset.playerIndex = index;
        
        if (index === gameState.currentPlayerIndex && gameState.currentPlayerIndex < gameState.players.length) {
            playerElement.classList.add('current-player');
        }
        
        let statusClass = '';
        if (player.isBust) statusClass = 'player-bust';
        else if (player.hasBlackjack) statusClass = 'player-blackjack';
        
        const avatarHTML = player.avatar 
    ? `<img src="${player.avatar}" class="player-avatar" alt="${player.name}" onerror="this.style.display='none';">`
    : '';

        playerElement.innerHTML = `
            <div class="player-name">${avatarHTML}${player.name}</div>
            <div class="player-cards">${player.cards.map(card => createCardElement(card)).join('')}</div>
            <div class="player-info">
                <span class="player-points">Pontos: ${player.points}</span>
                <span class="player-status ${statusClass}">${player.status}</span>
            </div>
        `;
        
        if (index === gameState.currentPlayerIndex && gameState.currentPlayerIndex < gameState.players.length && !player.isStanding && !player.isBust && !player.hasBlackjack) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'player-actions';
            actionsDiv.innerHTML = `
                <button class="action-btn hit-btn" data-action="hit">Pedir Carta</button>
                <button class="action-btn stand-btn" data-action="stand">Parar</button>
            `;
            playerElement.appendChild(actionsDiv);
            
            actionsDiv.querySelector('[data-action="hit"]').addEventListener('click', hit);
            actionsDiv.querySelector('[data-action="stand"]').addEventListener('click', stand);
        }
        
        playersArea.appendChild(playerElement);
    });
    
    document.querySelectorAll('.card').forEach((card, index) => {
        animateCardDeal(card, index * 100);
    });
}
function animateCardDeal(cardElement, delay) {
    setTimeout(() => {
        cardElement.classList.add('flip');
        setTimeout(() => cardElement.classList.remove('flip'), 600);
    }, delay);
}

function createCardElement(card, isHidden = false) {
    if (isHidden) {
        return `<div class="card" style="background: repeating-linear-gradient(45deg, #333, #333 5px, #444 5px, #444 10px);" data-value=""></div>`;
    }
    
    if (card.suit === 'hidden') {
        return `<div class="card" style="background: repeating-linear-gradient(45deg, #333, #333 5px, #444 5px, #444 10px);" data-value=""></div>`;
    }
    
    let symbol;
    switch (card.suit) {
        case 'hearts': symbol = '♥'; break;
        case 'diamonds': symbol = '♦'; break;
        case 'clubs': symbol = '♣'; break;
        case 'spades': symbol = '♠'; break;
    }
    
    return `
        <div class="card" data-value="${card.value}${symbol}">
            <div class="card-top">
                <span>${card.value}</span>
                <span class="card-suit ${card.suit}">${symbol}</span>
            </div>
            <div class="card-value">${card.value}</div>
            <div class="card-bottom">
                <span>${card.value}</span>
                <span class="card-suit ${card.suit}">${symbol}</span>
            </div>
        </div>
    `;
}

function hit() {
    clearTimeout(gameState.timer);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const card = drawCard();
    currentPlayer.cards.push(card);
    currentPlayer.points = calculatePoints(currentPlayer.cards);
    
    if (currentPlayer.points > 21) {
        currentPlayer.isBust = true;
        currentPlayer.status = 'ESTOROU!';
        nextPlayerTurn();
    } else {
        startPlayerTurn();
    }
}

function stand() {
    clearTimeout(gameState.timer);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.isStanding = true;
    currentPlayer.status = 'PAROU';
    nextPlayerTurn();
}