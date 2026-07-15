// Configuração do Webhook do n8n
// Altere para a URL de produção do seu workflow do n8n
const N8N_WEBHOOK_URL = 'https://carlosn8n1.app.n8n.cloud/webhook/portfolio-lead';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('portfolioForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const feedbackMsg = document.getElementById('formFeedback');

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Proteção contra bots (Honeypot)
            const honeypot = document.getElementById('honeypot').value;
            if(honeypot) return; // Se preenchido, é bot. Ignorar silenciosamente.

            // Coletar dados
            const formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                empresa: document.getElementById('empresa').value,
                telefone: document.getElementById('telefone').value,
                mensagem: document.getElementById('mensagem').value,
                origem: 'Portfólio Executivo'
            };

            // Estado de carregamento
            btnText.style.display = 'none';
            loader.style.display = 'inline-block';
            submitBtn.disabled = true;
            feedbackMsg.textContent = '';
            feedbackMsg.className = 'feedback-msg';

            try {
                // Enviar para o n8n
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if(response.ok) {
                    // Sucesso
                    feedbackMsg.textContent = 'Mensagem enviada com sucesso! A minha IA do n8n já está analisando o seu contato.';
                    feedbackMsg.classList.add('success');
                    feedbackMsg.style.color = 'var(--accent-color)';
                    form.reset();
                } else {
                    // Erro do servidor
                    throw new Error('Falha no envio');
                }
            } catch (error) {
                // Erro de rede ou CORS
                feedbackMsg.textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, tente pelo WhatsApp.';
                feedbackMsg.classList.add('error');
                feedbackMsg.style.color = 'firebrick';
                console.error('Erro de envio (n8n):', error);
            } finally {
                // Restaurar botão
                btnText.style.display = 'inline-block';
                loader.style.display = 'none';
                submitBtn.disabled = false;
                
                // Limpar mensagem após 5 segundos
                setTimeout(() => {
                    feedbackMsg.textContent = '';
                }, 5000);
            }
        });
    }

    // Lógica do Chatbot IA (Simulação local)
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    if(sendChatBtn && chatInput) {
        const sendMsg = () => {
            const text = chatInput.value.trim();
            if(!text) return;

            // Adicionar mensagem do usuário
            const userMsg = document.createElement('div');
            userMsg.className = 'msg user';
            userMsg.textContent = text;
            chatMessages.appendChild(userMsg);
            
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simular resposta da IA com base em palavras-chave
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'msg ai';
                
                const lowerText = text.toLowerCase();
                let response = '';

                if (lowerText.includes('sad') || lowerText.includes('sabor de casa') || lowerText.includes('tcc')) {
                    response = '<strong>Sobre o SAD Sabor de Casa:</strong> Foi meu projeto de destaque! Usei métodos mistos (quali-quanti) para diagnosticar o problema da lanchonete e criei uma aplicação web que simula o ROI de decisões operacionais. Eu orquestrei as IAs (Gemini Pro) para desenvolver toda a lógica matemática.';
                } else if (lowerText.includes('c2o') || lowerText.includes('analytics')) {
                    response = '<strong>Sobre o C2O Analytics:</strong> Eu atuei como Arquiteto de Produto. Utilizei o Agente Gemini e outras IAs para criar um dashboard em React e Firebase. Ele recebe planilhas, trata os dados automaticamente e gera gráficos instantâneos, ideal para pequenos negócios.';
                } else if (lowerText.includes('b2r') || lowerText.includes('estágio') || lowerText.includes('experiência')) {
                    response = '<strong>Minha Experiência:</strong> Fui Estagiário Administrativo na B2R Serviços Administrativos (onde atuei na elaboração de projetos e prestação de contas) e também atuei como Assistente Voluntário na Associação Quilombola Bete II por mais de 6 anos.';
                } else if (lowerText.includes('contato') || lowerText.includes('email') || lowerText.includes('telefone') || lowerText.includes('contratar')) {
                    response = 'Você pode falar diretamente comigo preenchendo o formulário de contato acima! A mensagem irá direto para minha automação no n8n. Se preferir, meu WhatsApp é (75) 99824-2840.';
                } else if (lowerText.includes('n8n') || lowerText.includes('groq') || lowerText.includes('ia')) {
                    response = 'Eu sou apaixonado por IA e automação! Orquestro agentes como Gemini Pro, DeepSeek e ChatGPT para resolver problemas de negócios, e estou iniciando na criação de fluxos no n8n.';
                } else {
                    response = 'Sou a IA assistente do Carlos! Ainda estou rodando em modo demonstração local. Pergunte-me sobre o <strong>SAD Sabor de Casa</strong>, o <strong>C2O Analytics</strong>, a <strong>B2R</strong> ou como entrar em <strong>contato</strong>!';
                }

                aiMsg.innerHTML = response;
                chatMessages.appendChild(aiMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        };

        sendChatBtn.addEventListener('click', sendMsg);
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendMsg();
        });
    }
});
