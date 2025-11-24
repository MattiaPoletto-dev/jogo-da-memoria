document.addEventListener('DOMContentLoaded', () => {
    const colorButtons = document.querySelectorAll('.color-button');
    const startButton = document.getElementById('start-button');
    const scoreDisplay = document.getElementById('current-score');
    const messageDisplay = document.getElementById('message');

    let sequence = [];
    let playerSequence = [];
    let score = 0;
    let gameStarted = false;
    let level = 0;
    let canClick = false;

    const colors = ['red', 'green', 'blue', 'yellow'];

    // Função para brilhar um botão de cor
    function highlightColor(color) {
        const button = document.querySelector(`.color-button.${color}`);
        button.classList.add('active');
        // Tocar som da cor aqui
        setTimeout(() => {
            button.classList.remove('active');
        }, 300); // Duração do brilho
    }

    // Gerar a próxima cor na sequência
    function nextSequence() {
        canClick = false;
        playerSequence = [];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);
        level++;
        scoreDisplay.textContent = score;
        messageDisplay.textContent = 'Observe a sequência!';

        let i = 0;
        const intervalId = setInterval(() => {
            highlightColor(sequence[i]);
            i++;
            if (i >= sequence.length) {
                clearInterval(intervalId);
                setTimeout(() => {
                    canClick = true;
                    messageDisplay.textContent = 'Agora é a sua vez!';
                }, 500); // Pequeno atraso antes do jogador poder clicar
            }
        }, 600); // Intervalo entre os flashes de cor
    }

    function checkPlayerInput(colorClicked) {
        if (!canClick) return;

        playerSequence.push(colorClicked);
        highlightColor(colorClicked); // Feedback visual ao clicar

        const currentIndex = playerSequence.length - 1;

        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            // Jogo acabou
            gameOver();
            return;
        }

        if (playerSequence.length === sequence.length) {
            // Sequência correta, passar para o próximo nível
            score++;
            scoreDisplay.textContent = score;
            canClick = false; // Impede cliques enquanto gera próxima sequência
            messageDisplay.textContent = 'Correto! Próximo nível...';
            setTimeout(nextSequence, 1000);
        }
    }

    // Fim de jogo
    function gameOver() {
        gameStarted = false;
        canClick = false;
        messageDisplay.textContent = `Fim de Jogo! Sua pontuação final foi: ${score}`;
        startButton.textContent = 'Reiniciar Jogo';
        startButton.style.backgroundColor = 'var(--red)';
        startButton.style.display = 'block'; // Garante que o botão esteja visível
    }

    // Iniciar ou Reiniciar Jogo
    function startGame() {
        sequence = [];
        playerSequence = [];
        score = 0;
        level = 0;
        scoreDisplay.textContent = score;
        messageDisplay.textContent = '';
        startButton.textContent = 'Aguarde...';
        startButton.style.backgroundColor = 'var(--button-bg)';
        startButton.disabled = true; // Desabilita o botão enquanto o jogo está rolando
        gameStarted = true;

        setTimeout(() => {
            startButton.style.display = 'none'; // Esconde o botão após iniciar
            nextSequence();
        }, 500); // Pequeno atraso antes de começar a sequência
    }

    // Event Listeners
    startButton.addEventListener('click', startGame);

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (gameStarted && canClick) {
                checkPlayerInput(button.dataset.color);
            }
        });
    });

    // Estado inicial do jogo
    startButton.textContent = 'Iniciar Jogo';
    startButton.style.backgroundColor = 'var(--green)';
    messageDisplay.textContent = 'Pressione Iniciar para começar!';
});