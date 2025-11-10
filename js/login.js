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

// Adicionar event listeners quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
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

    // Validação do formulário de login
    document.getElementById('formLogin').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Resetar mensagens de erro
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.style.display = 'none';
        });
        
        let isValid = true;
        
        // Validação do email
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'Por favor, insira um e-mail válido';
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
        }
        
        // Validação da senha
        const senha = document.getElementById('senha').value;
        if (senha.length === 0) {
            document.getElementById('senha-error').style.display = 'block';
            isValid = false;
        }
        
        // Se tudo estiver válido, mostrar mensagem de sucesso
        if (isValid) {
            document.getElementById('success-message').textContent = 'Login realizado com sucesso!';
            document.getElementById('success-message').style.display = 'block';
            
            // Simular redirecionamento após 2 segundos
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'none';
                // Aqui você pode redirecionar para a página principal
                // window.location.href = 'dashboard.html';
            }, 2000);
        }
    });

    // Event listeners para login social
    document.querySelector('.social-btn.facebook').addEventListener('click', function() {
        alert('Login com Facebook selecionado');
        // Implementar lógica de login com Facebook
    });

    document.querySelector('.social-btn.google').addEventListener('click', function() {
        alert('Login com Google selecionado');
        // Implementar lógica de login com Google
    });

    document.querySelector('.social-btn.apple').addEventListener('click', function() {
        alert('Login com Apple selecionado');
        // Implementar lógica de login com Apple
    });

    // Link "Esqueci a senha"
    document.querySelector('.esqueci-senha').addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        if (email && email.includes('@')) {
            alert(`Enviando recuperação para: ${email}`);
        } else {
            alert('Por favor, insira seu e-mail para recuperação de senha');
        }
        // Implementar lógica de recuperação de senha
    });
});