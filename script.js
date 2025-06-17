// Navegação suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animação ao rolar (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible'); // Adiciona uma nova classe para controlar a visibilidade
        } else {
            // Opcional: remover a classe se sair da tela para reanimar ao voltar
            // entry.target.classList.remove('is-visible');
        }
    });
}, { threshold: 0.1 });

// Observa todos os elementos com a classe 'animate'
document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
});

// Filtros do portfólio (funcionalidade básica)
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove 'active' de todos os botões e adiciona ao clicado
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.textContent.trim(); // Pega o texto do botão para filtrar

        portfolioItems.forEach(item => {
            const category = item.querySelector('.portfolio-category').textContent.trim();

            if (filterValue === 'Todos' || category.includes(filterValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Formulário de contato
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true; // Desabilita o botão para evitar múltiplos envios
    
    // Simulação de envio (você pode substituir isso por uma chamada AJAX real)
    setTimeout(() => {
        submitBtn.textContent = 'Mensagem Enviada!';
        submitBtn.style.background = '#28a745'; // Cor de sucesso
        
        // Resetar formulário e reativar botão após um tempo
        setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.background = ''; // Reseta o background
            submitBtn.disabled = false;
        }, 2000); // 2 segundos
    }, 1500); // 1.5 segundos para simular o envio
});

// Alternar tema escuro
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Efeito de rolagem do cabeçalho
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.padding = '20px 0'; // Volta ao padding original
        header.style.boxShadow = 'var(--shadow)'; // Volta à sombra original
    }
});
