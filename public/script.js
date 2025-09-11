document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');
    const shortcutBtns = document.querySelectorAll('.shortcut-btn');

    const modal = document.getElementById('cobrar-modal');
    const modalPoliticianName = document.getElementById('modal-politician-name');
    const messageTextarea = document.getElementById('message-textarea');
    const templateBtns = document.querySelectorAll('.template-btn');
    const closeBtn = document.querySelector('.close-btn');
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    const sendEmailBtn = document.getElementById('send-email-btn');

    let currentPolitician = null;

    // --- Funções da API ---
    const searchPoliticians = async (query) => {
        try {
            const response = await fetch(`/api/politicians?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Falha ao buscar dados.');
            }
            const data = await response.json();
            renderResults(data);
        } catch (error) {
            resultsContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    };

    // --- Funções de Renderização ---
    const renderResults = (politicians) => {
        resultsContainer.innerHTML = '';
        if (politicians.length === 0) {
            resultsContainer.innerHTML = '<p>Nenhum político encontrado.</p>';
            return;
        }

        politicians.forEach(p => {
            const card = document.createElement('div');
            card.className = 'politician-card';
            card.innerHTML = `
                <img src="${p.photo}" alt="Foto de ${p.name}">
                <div class="politician-info">
                    <h3>${p.name}</h3>
                    <p><strong>Cargo:</strong> ${p.office} - ${p.city}</p>
                    <p><strong>Promessas Cumpridas:</strong> ${p.promises_completed_percent}%</p>
                    <p><strong>Gastos Públicos:</strong> ${p.spending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <button class="cobrar-btn" data-id="${p.id}">Cobrar</button>
            `;
            resultsContainer.appendChild(card);
        });

        // Adiciona event listener para os novos botões "Cobrar"
        document.querySelectorAll('.cobrar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const politicianId = parseInt(btn.dataset.id, 10);
                currentPolitician = politicians.find(p => p.id === politicianId);
                openModal();
            });
        });
    };

    // --- Funções do Modal ---
    const openModal = () => {
        if (!currentPolitician) return;
        modalPoliticianName.textContent = currentPolitician.name;
        messageTextarea.value = '';
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        currentPolitician = null;
    };

    const getMessageTemplate = (tone) => {
        const name = currentPolitician.name;
        switch (tone) {
            case 'brando':
                return `Olá, ${name}. Sou seu eleitor e gostaria de chamar sua atenção para um assunto importante. Agradeço a consideração.`;
            case 'firme':
                return `Prezado(a) ${name}, o rumo de certas decisões afeta diretamente minha vida e de minha família. Espero uma posição responsável e transparente de sua parte.`;
            case 'urgente':
                return `Sr(a). ${name}, a situação atual exige uma ação imediata. Como cidadão, não aceito mais o descaso com as obrigações do seu cargo. Aguardo uma solução.`;
            default:
                return '';
        }
    };

    // --- Event Listeners ---
    searchBtn.addEventListener('click', () => {
        searchPoliticians(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPoliticians(searchInput.value);
        }
    });

    shortcutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            searchInput.value = query;
            searchPoliticians(query);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tone = btn.dataset.tone;
            messageTextarea.value = getMessageTemplate(tone);
        });
    });

    sendWhatsappBtn.addEventListener('click', () => {
        if (!currentPolitician) return;
        const message = encodeURIComponent(messageTextarea.value);
        // O número de telefone deve ser um dado do político no futuro
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
    });

    sendEmailBtn.addEventListener('click', () => {
        if (!currentPolitician) return;
        const subject = encodeURIComponent(`Mensagem para ${currentPolitician.name}`);
        const body = encodeURIComponent(messageTextarea.value);
        // O e-mail deve ser um dado do político no futuro
        const emailUrl = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = emailUrl;
    });

    // --- Inicialização ---
    searchPoliticians(''); // Carrega todos os políticos inicialmente
});
