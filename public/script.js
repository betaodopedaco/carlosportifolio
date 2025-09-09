document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const factBtn = document.getElementById('fact-btn');
    const factDisplay = document.getElementById('fact-display');

    const gravityBtn = document.getElementById('gravity-btn');
    const mass1Input = document.getElementById('mass1');
    const mass2Input = document.getElementById('mass2');
    const distanceInput = document.getElementById('distance');
    const gravityDisplay = document.getElementById('gravity-display');

    // --- Funções Auxiliares ---
    const showGravityError = (message) => {
        gravityDisplay.textContent = `Erro: ${message}`;
        gravityDisplay.style.color = '#c0392b';
    };

    const showFactError = (message) => {
        factDisplay.textContent = `Erro: ${message}`;
        factDisplay.style.color = '#c0392b';
    };

    const resetStyles = (element) => {
        element.style.color = '#333';
    }

    // --- Event Listeners ---

    // Buscar um fato aleatório
    factBtn.addEventListener('click', async () => {
        resetStyles(factDisplay);
        factDisplay.textContent = 'Buscando...';
        try {
            const response = await fetch('/api/facts');
            if (!response.ok) {
                throw new Error(`Falha na comunicação com o servidor (status: ${response.status})`);
            }
            const data = await response.json();
            factDisplay.textContent = data.fact;
        } catch (error) {
            showFactError(error.message);
        }
    });

    // Calcular a força da gravidade
    gravityBtn.addEventListener('click', async () => {
        resetStyles(gravityDisplay);
        const m1 = parseFloat(mass1Input.value);
        const m2 = parseFloat(mass2Input.value);
        const distance = parseFloat(distanceInput.value);

        if (isNaN(m1) || isNaN(m2) || isNaN(distance)) {
            showGravityError('Por favor, insira números válidos em todos os campos.');
            return;
        }
        if (distance <= 0) {
            showGravityError('A distância deve ser um número positivo.');
            return;
        }
        if (m1 < 0 || m2 < 0) {
            showGravityError('As massas não podem ser negativas.');
            return;
        }

        gravityDisplay.textContent = 'Calculando...';

        try {
            const response = await fetch('/api/gravity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ m1, m2, distance }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Usa a mensagem de erro vinda da API
                throw new Error(data.error || `Erro desconhecido do servidor (status: ${response.status})`);
            }

            // Exibe o resultado em notação científica para clareza
            gravityDisplay.textContent = `Força Calculada: ${data.force.toExponential(4)} Newtons`;

        } catch (error) {
            showGravityError(error.message);
        }
    });
});
