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
            
            // Troca o ícone
            if (mainNav.classList.contains('active')) {
                menuToggle.innerHTML = '✕'; // X para fechar
            } else {
                menuToggle.innerHTML = '☰'; // Hambúrguer
            }
        });
    }

    // Fechar o menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '☰';
            }
        });
    });

    // ----------------------------------------------
    // FUNÇÕES DE VALIDAÇÃO
    // ----------------------------------------------
    
    function validateName(name) {
        // Verifica se há pelo menos dois nomes/palavras
        return /\s+/.test(name.trim()) && name.trim().split(/\s+/).length >= 2;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        // Limpa o input de caracteres não numéricos
        const cleaned = ('' + phone).replace(/\D/g, '');
        // Verifica se tem 10 (DDD + 8 ou 9 dígitos) ou 11 dígitos
        return cleaned.length >= 10 && cleaned.length <= 11;
    }
    
    function validateInvestment(value) {
        return value !== "" && value !== null;
    }

    // Função auxiliar para gerenciar a mensagem de feedback
    function showFormMessage(type, message, hideDelay = 7000) {
        formMessage.classList.remove('success', 'error', 'hidden');
        formMessage.classList.add(type);
        formMessage.innerHTML = message;
        
        setTimeout(() => {
            formMessage.classList.add('hidden');
            formMessage.innerHTML = '';
        }, hideDelay);
    }

    // ----------------------------------------------
    // 2. FUNCIONALIDADE DE ENVIO (RESEND)
    // ----------------------------------------------
    const form = document.getElementById('franquia-form');
    const formMessage = document.getElementById('form-message');
    
    // Inputs
    const nomeInput = document.getElementById('nome'); 
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const cidadeInput = document.getElementById('cidade');
    const investimentoSelect = document.getElementById('capital-investimento');
    const mensagemInput = document.getElementById('mensagem');

    if (form) {
        // Remove o action antigo do Formspree para impedir fallback acidental.
        form.removeAttribute('action');
        form.setAttribute('method', 'POST');

        form.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            let errors = [];
            
            if (!validateName(nomeInput.value)) {
                errors.push("Insira seu Nome e Sobrenome.");
            }

            if (!validateEmail(emailInput.value)) {
                errors.push("Email inválido.");
            }
            
            if (!validatePhone(telefoneInput.value)) {
                // Mensagem de erro simplificada, pois a validação lida com DDD/limpeza
                errors.push("Telefone inválido.");
            }

            if (!investimentoSelect || !validateInvestment(investimentoSelect.value)) {
                errors.push("Selecione o Capital para Investimento.");
            }

            if (errors.length > 0) {
                showFormMessage('error', '<strong>Atenção:</strong> ' + errors.join(' '));
                return;
            }

            // Preparação para envio via endpoint protegido.
            const nome = nomeInput.value.trim();
            const payload = {
                nome,
                email: emailInput.value.trim(),
                telefone: telefoneInput.value.trim(),
                cidade: cidadeInput.value.trim(),
                capital: investimentoSelect.value,
                mensagem: mensagemInput.value.trim(),
                origem: 'FORBODY-FRANQUIA / index.html'
            };

            formMessage.classList.remove('success', 'error', 'hidden');
            formMessage.innerHTML = 'Enviando...'; 

            try {
                const response = await fetch('/api/send-lead', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok && data.success) {
                    showFormMessage('success', `Obrigado, ${nome}! Proposta enviada com sucesso.`);
                    form.reset();
                } else {
                    showFormMessage('error', data.message || 'Erro ao enviar. Verifique os dados e tente novamente.');
                }
            } catch (error) {
                showFormMessage('error', `Erro de conexão. Tente novamente.`);
                console.error(error);
            }
        });
    }
    
    // ----------------------------------------------
    // 3. FUNCIONALIDADE DO ACORDEÃO (FAQ)
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
});
