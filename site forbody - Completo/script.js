document.addEventListener('DOMContentLoaded', function() {

    // ----------------------------------------------
    // 1. FUNCIONALIDADE DO MENU HAMBÚRGUER (MOBILE)
    // ----------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Troca o ícone se desejar (opcional)
            if (mainNav.classList.contains('active')) {
                menuToggle.innerHTML = '✕'; // X para fechar
            } else {
                menuToggle.innerHTML = '☰'; // Hambúrguer
            }
        });
    }

    // Fechar o menu ao clicar em um link (Melhoria de UX)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '☰';
            }
        });
    });

    // ----------------------------------------------
    // 2. FUNÇÕES DE VALIDAÇÃO E ENVIO DE FORMULÁRIO (OTIMIZADO)
    // ----------------------------------------------
    
    function validateName(name) {
        // A validação agora exige apenas que o nome não seja vazio e tenha mais de 1 caractere
        return name.trim().length > 1;
    }
    
    function validateEmail(email) {
        // Expressão Regular simples para validação de e-mail
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function displayMessage(messageEl, text, type) {
        messageEl.textContent = text;
        messageEl.classList.remove('hidden', 'success', 'error');
        messageEl.classList.add(type);
        
        // Remove a mensagem após um tempo
        setTimeout(() => {
            messageEl.classList.add('hidden');
            messageEl.classList.remove(type);
        }, 7000);
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formMessage = form.querySelector('#form-message');
        
        // 1. Coletar e validar campos críticos (exemplo: Nome e Email)
        const nameInput = form.querySelector('input[name="Nome"]');
        const emailInput = form.querySelector('input[name="Email"]');
        
        if (nameInput && !validateName(nameInput.value)) {
            displayMessage(formMessage, 'Por favor, insira um nome válido.', 'error');
            return;
        }

        if (emailInput && !validateEmail(emailInput.value)) {
            displayMessage(formMessage, 'Por favor, insira um e-mail válido.', 'error');
            return;
        }

        // 2. Envio via Fetch (Formspree)
        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                displayMessage(formMessage, 'Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.', 'success');
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        displayMessage(formMessage, data["errors"].map(error => error["message"]).join(", "), 'error');
                    } else {
                        displayMessage(formMessage, 'Ocorreu um erro no envio. Tente novamente mais tarde.', 'error');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro de rede:', error);
            displayMessage(formMessage, 'Ocorreu um erro de conexão. Verifique sua rede.', 'error');
        });
    }

    // 3. Adicionar Listeners aos Formulários
    const contactForm = document.getElementById('contact-form');
    const franchiseForm = document.getElementById('franchise-form');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    if (franchiseForm) {
        franchiseForm.addEventListener('submit', handleFormSubmit);
    }
    
    // ----------------------------------------------
    // 4. FUNCIONALIDADE DO ACORDEÃO (FAQ)
    // ----------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            // Fecha outros abertos
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('open');
                }
            });

            // Toggle atual
            header.classList.toggle('active');
            content.classList.toggle('open');
        });
    });

    // ----------------------------------------------
    // 5. FUNCIONALIDADE DO HEADER (STICKY/SCROLLED)
    // ----------------------------------------------
    const siteHeader = document.querySelector('.site-header');

    if (siteHeader) {
        window.addEventListener('scroll', () => {
            // A classe 'scrolled' agora ativa o padding reduzido e a sombra mais forte
            if (window.scrollY > 50) { // Adiciona a classe após rolar 50px
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        });
    }
});