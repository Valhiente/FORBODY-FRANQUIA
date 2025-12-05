document.addEventListener('DOMContentLoaded', function() {

    // ----------------------------------------------
    // 1. FUNCIONALIDADE DO MENU HAMBÚRGUER (MOBILE)
    // ----------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });

    // Fechar o menu ao clicar em um link (útil para navegação interna)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });

    // ----------------------------------------------
    // FUNÇÕES DE VALIDAÇÃO
    // ----------------------------------------------
    
    // Valida se há pelo menos dois nomes (Nome e Sobrenome)
    function validateName(name) {
        // Checa se existem pelo menos duas palavras separadas por espaço
        return /\s+/.test(name.trim()) && name.trim().split(/\s+/).length >= 2;
    }

    // Validação de formato de e-mail básico
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validação de telefone brasileiro (10 ou 11 dígitos, apenas números)
    function validatePhone(phone) {
        // Remove tudo que não for dígito
        const cleaned = ('' + phone).replace(/\D/g, '');
        // Checa se tem 10 (DDD + 8 dígitos) ou 11 (DDD + 9 dígitos)
        return cleaned.length === 10 || cleaned.length === 11;
    }
    
    // Valida se o select não está no valor padrão (vazio)
    function validateInvestment(value) {
        return value !== "";
    }


    // ----------------------------------------------
    // 2. FUNCIONALIDADE DE ENVIO REAL DO FORMULÁRIO (FORMSSPREE)
    // ----------------------------------------------
    const form = document.getElementById('franquia-form');
    const formMessage = document.getElementById('form-message');
    const nomeInput = document.getElementById('nome'); 
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const investimentoSelect = document.getElementById('investimento');

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        
        // ----------------------------------------------
        // BLOCO DE VALIDAÇÃO CLIENT-SIDE
        // ----------------------------------------------
        let errors = [];
        
        if (!validateName(nomeInput.value)) {
            errors.push("Por favor, insira seu Nome e Sobrenome.");
        }

        if (!validateEmail(emailInput.value)) {
            errors.push("O endereço de Email fornecido é inválido.");
        }
        
        if (!validatePhone(telefoneInput.value)) {
            errors.push("O Telefone deve incluir o DDD e ter 10 ou 11 dígitos (apenas números).");
        }

        if (!validateInvestment(investimentoSelect.value)) {
            errors.push("Por favor, selecione sua faixa de Capital Disponível para Investimento.");
        }

        if (errors.length > 0) {
            formMessage.classList.remove('success');
            formMessage.classList.add('error');
            formMessage.classList.remove('hidden');
            formMessage.innerHTML = '<strong>Atenção:</strong> ' + errors.join(' ');
            
            // Interrompe o processo e exibe o erro
            setTimeout(() => {
                formMessage.classList.add('hidden');
                formMessage.innerHTML = '';
            }, 7000);
            
            return; // Impede o envio
        }
        // ----------------------------------------------
        // FIM DA VALIDAÇÃO
        // ----------------------------------------------

        const nome = nomeInput.value;
        const formAction = form.action; 
        const formData = new FormData(form);

        formMessage.classList.remove('success', 'error');
        formMessage.classList.remove('hidden');
        formMessage.innerHTML = 'Enviando...'; 

        try {
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Sucesso
                formMessage.classList.add('success');
                formMessage.innerHTML = `Obrigado, ${nome}! Sua proposta foi registrada. Entraremos em contato em breve.`;
                form.reset();
            } else {
                // Erro do Formspree
                const data = await response.json();
                if (data.errors) {
                    formMessage.classList.add('error');
                    formMessage.innerHTML = 'Erro: Verifique os campos e tente novamente. (Erro Formspree)';
                } else {
                    throw new Error('Erro de rede ou Formspree indisponível.');
                }
            }
        } catch (error) {
            // Erro de rede
            formMessage.classList.add('error');
            formMessage.innerHTML = `Desculpe, houve um erro ao enviar a proposta. Tente novamente mais tarde.`;
            console.error(error);
        }

        // Esconde a mensagem de sucesso/erro após 7 segundos
        setTimeout(() => {
            formMessage.classList.add('hidden');
            formMessage.innerHTML = '';
        }, 7000);

    });
    
    // ----------------------------------------------
    // 3. FUNCIONALIDADE DO ACORDEÃO (FAQ)
    // ----------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            // Fecha todos os outros que estão abertos
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('open');
                }
            });

            // Abre ou fecha o item clicado
            header.classList.toggle('active');
            content.classList.toggle('open');
        });
    });
});