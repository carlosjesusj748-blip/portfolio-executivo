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

async function sendMsg() {
    const text = chatInput.value.trim();
    if(!text) return;

    // Msg Usuário
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Indicador de digitação
    const aiMsg = document.createElement('div');
    aiMsg.className = 'msg bot';
    aiMsg.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Pensando...';
    chatMessages.appendChild(aiMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: 'Chat',
                mensagem: text,
                origem: 'Portfólio Executivo (Novo Template)'
            })
        });

        if (response.ok) {
            // Esperamos que o módulo 'Webhook Response' do Make devolva um texto simples
            const responseText = await response.text();
            aiMsg.innerHTML = responseText || 'Desculpe, não consegui formular uma resposta agora.';
        } else {
            aiMsg.innerHTML = 'Houve um erro ao processar sua mensagem. Tente novamente.';
        }
    } catch (error) {
        aiMsg.innerHTML = 'Erro de comunicação com o servidor. Tente mais tarde.';
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
            origem: 'Portfólio Executivo (Novo Template)',
            tipo: 'Contato Comercial'
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

// Lógica de Envio de Sugestão Anônima
const suggestionForm = document.getElementById('suggestionForm');
const submitSuggestionBtn = document.getElementById('submitSuggestionBtn');
const suggestionBtnText = submitSuggestionBtn ? submitSuggestionBtn.querySelector('.btn-text') : null;
const suggestionLoader = submitSuggestionBtn ? submitSuggestionBtn.querySelector('.loader') : null;
const suggestionFeedbackMsg = document.getElementById('suggestionFeedback');

if(suggestionForm) {
    suggestionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            tipo: 'Sugestão Anônima',
            mensagem: document.getElementById('sugestaoMsg').value,
            origem: 'Portfólio Executivo (Novo Template)'
        };

        suggestionBtnText.style.display = 'none';
        suggestionLoader.style.display = 'block';
        submitSuggestionBtn.disabled = true;
        suggestionFeedbackMsg.textContent = '';

        try {
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if(response.ok) {
                suggestionFeedbackMsg.textContent = 'Sua mensagem foi enviada de forma anônima com sucesso! Muito obrigado.';
                suggestionFeedbackMsg.style.color = 'var(--accent)';
                suggestionForm.reset();
            } else { throw new Error('Falha no envio'); }
        } catch (error) {
            suggestionFeedbackMsg.textContent = 'Erro ao enviar sugestão. Tente novamente mais tarde.';
            suggestionFeedbackMsg.style.color = '#ef4444';
        } finally {
            suggestionBtnText.style.display = 'block';
            suggestionLoader.style.display = 'none';
            submitSuggestionBtn.disabled = false;
            
            setTimeout(() => { suggestionFeedbackMsg.textContent = ''; }, 5000);
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
