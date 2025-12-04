const gameBoard = document.querySelector('.memory-game');
const cardData = [
    { name: "html", emoji: "🌐" },
    { name: "css", emoji: "🎨" },
    { name: "js", emoji: "💡" },
    { name: "react", emoji: "⚛️" },
    { name: "git", emoji: "🌳" },
    { name: "node", emoji: "🟢" }
];

// Duplica o array para criar os pares (6 tipos * 2 = 12 cartas)
let cards = [...cardData, ...cardData];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

/**
 * Embaralha o array de cartas usando o algoritmo Fisher-Yates (simples).
 */
function shuffle() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]]; // Troca elementos
    }
}

/**
 * Cria o elemento HTML de uma carta.
 * @param {string} name - O nome do par (framework).
 * @param {string} emoji - O emoji que representa a carta.
 */
function createCardElement(name, emoji) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.framework = name; // Usado para checar a correspondência
    card.addEventListener('click', flipCard);

    card.innerHTML = `
        <div class="front-face">${emoji}</div>
        <div class="back-face">❓</div>
    `;
    return card;
}

/**
 * Cria o tabuleiro do jogo, adicionando as cartas embaralhadas.
 */
function createBoard() {
    shuffle(); // Embaralha antes de criar
    cards.forEach(item => {
        const cardElement = createCardElement(item.name, item.emoji);
        gameBoard.appendChild(cardElement);
    });
}

/**
 * Função principal para virar uma carta.
 */
function flipCard() {
    if (lockBoard) return; // Se o tabuleiro estiver travado, ignora o clique
    if (this === firstCard) return; // Evita clicar na mesma carta duas vezes

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Primeiro clique
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segundo clique
    secondCard = this;
    checkForMatch();
}

/**
 * Verifica se as duas cartas viradas são um par.
 */
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

/**
 * As cartas são um par. Mantém-nas viradas e remove os event listeners.
 */
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('match'); // Adiciona classe visual de 'match'
    secondCard.classList.add('match');

    resetBoard();
}

/**
 * As cartas não são um par. Vira-as de volta após um pequeno atraso.
 */
function unflipCards() {
    lockBoard = true; // Trava o tabuleiro para que o jogador não clique em mais cartas

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000); // Espera 1 segundo
}

/**
 * Reseta as variáveis de controle para a próxima jogada.
 */
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Inicia o jogo
createBoard();