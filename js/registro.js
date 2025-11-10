// registro.js - Integrado com Backend
const API_BASE = 'http://localhost:5432/api';

// Função para fazer cadastro no backend
async function fazerCadastroBackend(dadosUsuario) {
    try {
        console.log('📤 Enviando dados para o backend:', dadosUsuario);
        
        const response = await fetch(`${API_BASE}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario)
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.erro };
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        return { success: false, error: 'Erro de conexão com o servidor.' };
    }
}

// Função para testar conexão com a API
async function testarConexaoAPI() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API conectada com sucesso!', data);
            return true;
        } else {
            console.warn('⚠️ API retornou status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Não foi possível conectar com a API:', error);
        console.log('💡 Dica: Verifique se o backend está rodando na porta 8080');
        return false;
    }
}

// Função para alternar a visibilidade da senha
function toggleSenha(inputId) {
    const input = document.getElementById(inputId);
    const toggle = document.querySelector(`[data-target="${inputId}"]`);
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Mostrar mensagem de erro
function mostrarErro(campoId, mensagem) {
    const erroElement = document.getElementById(campoId);
    erroElement.textContent = mensagem;
    erroElement.style.display = 'block';
}

// Esconder mensagem de erro
function esconderErro(campoId) {
    const erroElement = document.getElementById(campoId);
    erroElement.style.display = 'none';
}

// Mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
    const successElement = document.getElementById('success-message');
    successElement.textContent = mensagem;
    successElement.style.display = 'block';
}

// Esconder mensagem de sucesso
function esconderSucesso() {
    const successElement = document.getElementById('success-message');
    successElement.style.display = 'none';
}

// Mostrar loading no botão
function mostrarLoading() {
    const btn = document.getElementById('btnCadastrar');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
}

// Esconder loading no botão
function esconderLoading() {
    const btn = document.getElementById('btnCadastrar');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    
    btn.disabled = false;
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
}

// Validar email
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar telefone
function validarTelefone(telefone) {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
}

// Validar senha
function validarSenha(senha) {
    return senha.length >= 8;
}

// Validar data de nascimento
function validarDataNascimento(data) {
    if (!data) return false;
    
    const dataNascimento = new Date(data);
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
    
    // Ajuste para o mês/dia exato
    const mesHoje = hoje.getMonth();
    const diaHoje = hoje.getDate();
    const mesNasc = dataNascimento.getMonth();
    const diaNasc = dataNascimento.getDate();
    
    const idadeAjustada = (mesHoje < mesNasc) || (mesHoje === mesNasc && diaHoje < diaNasc) 
        ? idade - 1 
        : idade;
    
    return idadeAjustada >= 18;
}

// Formatar telefone
function formatarTelefone(value) {
    let numbers = value.replace(/\D/g, '');
    
    if (numbers.length > 11) {
        numbers = numbers.substring(0, 11);
    }
    
    if (numbers.length === 11) {
        return numbers.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
        return numbers.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length > 6) {
        return numbers.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (numbers.length > 2) {
        return numbers.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (numbers.length > 0) {
        return numbers.replace(/^(\d{0,2})/, '($1');
    }
    
    return numbers;
}

// Adicionar event listeners quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de cadastro carregada');
    
    // Testar conexão com API
    testarConexaoAPI().then(conectado => {
        if (!conectado) {
            console.log('🔧 Iniciando backend automaticamente...');
            // Você pode adicionar aqui uma tentativa de iniciar o backend
        }
    });

    // Elementos do formulário
    const form = document.getElementById('formRegistro');
    const btnCadastrar = document.getElementById('btnCadastrar');
    
    // Event listeners para os toggles de senha
    const toggles = document.querySelectorAll('.toggleSenha');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('data-target');
            toggleSenha(targetId);
        });
    });

    // Formatação do telefone em tempo real
    document.getElementById('telefone').addEventListener('input', function(e) {
        this.value = formatarTelefone(this.value);
        
        // Validação em tempo real
        if (this.value && !validarTelefone(this.value)) {
            mostrarErro('telefone-error', 'Telefone inválido');
        } else {
            esconderErro('telefone-error');
        }
    });

    // Validação em tempo real do email
    document.getElementById('email').addEventListener('blur', function(e) {
        if (this.value && !validarEmail(this.value)) {
            mostrarErro('email-error', 'Por favor, insira um e-mail válido');
        } else {
            esconderErro('email-error');
        }
    });

    // Validação em tempo real da senha
    document.getElementById('senha').addEventListener('input', function(e) {
        if (this.value && !validarSenha(this.value)) {
            mostrarErro('senha-error', 'A senha deve ter pelo menos 8 caracteres');
        } else {
            esconderErro('senha-error');
        }
        
        // Verificar se as senhas coincidem
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        if (confirmarSenha && this.value !== confirmarSenha) {
            mostrarErro('confirmarSenha-error', 'As senhas não coincidem');
        } else if (confirmarSenha) {
            esconderErro('confirmarSenha-error');
        }
    });

    // Validação em tempo real da confirmação de senha
    document.getElementById('confirmarSenha').addEventListener('input', function(e) {
        const senha = document.getElementById('senha').value;
        if (this.value && senha !== this.value) {
            mostrarErro('confirmarSenha-error', 'As senhas não coincidem');
        } else {
            esconderErro('confirmarSenha-error');
        }
    });

    // Validação em tempo real da data de nascimento
    document.getElementById('data-nascimento').addEventListener('change', function(e) {
        if (this.value && !validarDataNascimento(this.value)) {
            mostrarErro('data-nascimento-error', 'Você deve ter pelo menos 18 anos');
        } else {
            esconderErro('data-nascimento-error');
        }
    });

    // Validação em tempo real dos termos
    document.getElementById('termos').addEventListener('change', function(e) {
        if (!this.checked) {
            mostrarErro('termos-error', 'Você deve aceitar os termos e condições');
        } else {
            esconderErro('termos-error');
        }
    });

    // Validação em tempo real do nome
    document.getElementById('nome').addEventListener('blur', function(e) {
        if (this.value && this.value.length < 3) {
            mostrarErro('nome-error', 'Nome deve ter pelo menos 3 caracteres');
        } else {
            esconderErro('nome-error');
        }
    });

    // Submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('📝 Iniciando processo de cadastro...');
        
        // Resetar mensagens
        esconderSucesso();
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.style.display = 'none';
        });
        
        // Coletar dados do formulário
        const dados = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
            data_nascimento: document.getElementById('data-nascimento').value,
            senha: document.getElementById('senha').value
        };
        
        console.log('📋 Dados coletados:', dados);
        
        // Validações locais
        let isValid = true;
        
        if (!dados.nome || dados.nome.length < 3) {
            mostrarErro('nome-error', 'Por favor, insira seu nome completo (mínimo 3 caracteres)');
            isValid = false;
        }
        
        if (!dados.email || !validarEmail(dados.email)) {
            mostrarErro('email-error', 'Por favor, insira um e-mail válido');
            isValid = false;
        }
        
        if (!dados.telefone || !validarTelefone(dados.telefone)) {
            mostrarErro('telefone-error', 'Por favor, insira um telefone válido');
            isValid = false;
        }
        
        if (!dados.data_nascimento || !validarDataNascimento(dados.data_nascimento)) {
            mostrarErro('data-nascimento-error', 'Você deve ter pelo menos 18 anos');
            isValid = false;
        }
        
        if (!dados.senha || !validarSenha(dados.senha)) {
            mostrarErro('senha-error', 'A senha deve ter pelo menos 8 caracteres');
            isValid = false;
        }
        
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        if (dados.senha !== confirmarSenha) {
            mostrarErro('confirmarSenha-error', 'As senhas não coincidem');
            isValid = false;
        }
        
        if (!document.getElementById('termos').checked) {
            mostrarErro('termos-error', 'Você deve aceitar os termos e condições');
            isValid = false;
        }
        
        if (!isValid) {
            console.log('❌ Validação local falhou');
            return;
        }
        
        // Mostrar loading
        mostrarLoading();
        console.log('🔄 Enviando dados para o backend...');
        
        try {
            // Fazer requisição para o backend
            const resultado = await fazerCadastroBackend(dados);
            
            if (resultado.success) {
                console.log('✅ Cadastro realizado com sucesso:', resultado.data);
                mostrarSucesso('Cadastro realizado com sucesso! Redirecionando...');
                
                // Limpar formulário
                form.reset();
                
                // Resetar ícones das senhas
                const toggles = document.querySelectorAll('.toggleSenha');
                toggles.forEach(toggle => {
                    toggle.textContent = '👁️';
                });
                
                // Redirecionar para login após 2 segundos
                setTimeout(() => {
                    window.location.href = '../html/telaLogin.html';
                }, 2000);
                
            } else {
                console.log('❌ Erro no backend:', resultado.error);
                // Mostrar erro do backend
                let mensagemErro = resultado.error || 'Erro ao realizar cadastro';
                
                // Mapear erros específicos
                if (mensagemErro.includes('Email já cadastrado')) {
                    mostrarErro('email-error', 'Este email já está cadastrado');
                } else if (mensagemErro.includes('18 anos')) {
                    mostrarErro('data-nascimento-error', 'Você deve ter pelo menos 18 anos');
                } else if (mensagemErro.includes('senha') || mensagemErro.includes('8')) {
                    mostrarErro('senha-error', 'A senha deve ter pelo menos 8 caracteres');
                } else {
                    // Erro genérico - mostrar alerta
                    alert('Erro no cadastro: ' + mensagemErro);
                }
            }
            
        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            alert('Erro de conexão. Verifique se o servidor backend está rodando na porta 8080.\n\nExecute: python main.py');
        } finally {
            // Esconder loading
            esconderLoading();
        }
    });

    // Links dos termos
    document.querySelectorAll('.termos-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Termos de Serviço e Política de Privacidade serão exibidos aqui.');
        });
    });
});

// Adicione este CSS para melhor visualização no console
const style = document.createElement('style');
style.textContent = `
    .console-info {
        background: #3b82f6;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        margin: 2px 0;
    }
    .console-success {
        background: #10b981;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        margin: 2px 0;
    }
    .console-error {
        background: #ef4444;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        margin: 2px 0;
    }
`;
document.head.appendChild(style);