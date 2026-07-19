// Webhook do Make para formulário
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/b5ck9i6tyhotxj05758lwbmkrr82op87';

// Tema Escuro / Claro
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('themeIcon');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Inicializar tema salvo
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeIcon').classList.replace('fa-moon', 'fa-sun');
}

// Widget do Chatbot
function toggleChat() {
    const win = document.getElementById('chatWindow');
    win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
}

// Lógica de simulação do Chatbot IA
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatMessages = document.getElementById('chatMessages');

function sendMsg() {
    const text = chatInput.value.trim();
    if(!text) return;

    // Msg Usuário
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Resposta IA
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'msg bot';
        
        const lowerText = text.toLowerCase();
        let response = '';

        if (lowerText.includes('sad') || lowerText.includes('sabor') || lowerText.includes('projeto')) {
            response = '<strong>SAD Sabor de Casa:</strong> Foi meu projeto de destaque! Usei métodos mistos para diagnosticar o gargalo da lanchonete e criei uma aplicação web que simula o ROI. Orquestrei as IAs (Gemini Pro) para desenvolver toda a lógica matemática da plataforma.';
        } else if (lowerText.includes('c2o') || lowerText.includes('analytics')) {
            response = '<strong>C2O Analytics:</strong> Atuei como Arquiteto de Produto. Utilizei o Gemini para criar um dashboard em JS e Firebase. Ele recebe planilhas, higieniza e gera gráficos instantâneos com Chart.js!';
        } else if (lowerText.includes('b2r') || lowerText.includes('estágio') || lowerText.includes('experiência')) {
            response = '<strong>Experiência:</strong> Estagiei na B2R Serviços Administrativos (atuando na elaboração de projetos e prestação de contas) e atuei como Assistente Voluntário na Assoc. Quilombola Bete II por mais de 6 anos.';
        } else if (lowerText.includes('contato') || lowerText.includes('email') || lowerText.includes('telefone')) {
            response = 'Preencha o formulário abaixo! A mensagem vai direto para a minha automação. Meu WhatsApp é (75) 99824-2840.';
        } else if (lowerText.includes('n8n') || lowerText.includes('ia') || lowerText.includes('gemini') || lowerText.includes('make')) {
            response = 'Tenho forte foco em orquestrar agentes (Gemini, DeepSeek, Claude) para resolver problemas corporativos e automatizar fluxos complexos usando ferramentas como n8n e Make.';
        } else {
            response = 'Legal! Ainda estou rodando como simulação local. Pergunte-me sobre o <strong>SAD Sabor de Casa</strong>, o <strong>C2O Analytics</strong> ou como entrar em <strong>contato</strong>!';
        }

        aiMsg.innerHTML = response;
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
}

if(sendChatBtn) sendChatBtn.addEventListener('click', sendMsg);
if(chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMsg();
    });
}

// Observer para Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Lógica de Envio do Formulário via n8n
const form = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loader = submitBtn.querySelector('.loader');
const feedbackMsg = document.getElementById('formFeedback');

if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const honeypot = document.getElementById('honeypot').value;
        if(honeypot) return; // Bloqueia bots

        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            empresa: document.getElementById('empresa').value,
            telefone: document.getElementById('telefone').value,
            mensagem: document.getElementById('mensagem').value,
            origem: 'Portfólio Executivo (Novo Template)'
        };

        btnText.style.display = 'none';
        loader.style.display = 'block';
        submitBtn.disabled = true;
        feedbackMsg.textContent = '';

        try {
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if(response.ok) {
                feedbackMsg.textContent = 'Mensagem enviada com sucesso! Minha IA já está processando seu contato.';
                feedbackMsg.style.color = 'var(--accent)';
                form.reset();
            } else { throw new Error('Falha no envio'); }
        } catch (error) {
            feedbackMsg.textContent = 'Erro ao enviar. Por favor, tente pelo WhatsApp.';
            feedbackMsg.style.color = '#ef4444';
        } finally {
            btnText.style.display = 'block';
            loader.style.display = 'none';
            submitBtn.disabled = false;
            
            setTimeout(() => { feedbackMsg.textContent = ''; }, 5000);
        }
    });
}

// Modal for Certificates
function openModal(imageSrc) {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('modalImg');
    modalImg.src = imageSrc;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById('certModal').style.display = "none";
}
