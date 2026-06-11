document.addEventListener('DOMContentLoaded', () => {

    // --- ACESSIBILIDADE: COMPONENTES E CONTROLADORES ---
    const btnAccToggle = document.getElementById('btn-acc-toggle');
    const menuAcessibilidade = document.getElementById('menu-acessibilidade');
    const btnAumentarFonte = document.getElementById('btn-aumentar-fonte');
    const btnDiminuirFonte = document.getElementById('btn-diminuir-fonte');
    const btnAlternarTema = document.getElementById('btn-alternar-tema');
    const btnIniciarVoz = document.getElementById('btn-iniciar-voz');
    const btnPararVoz = document.getElementById('btn-parar-voz');
    
    let escalaFonte = 1.0;
    let leituraUtterance = null;

    // Vincula textos alternativos para renderização no container flexível customizado
    document.querySelectorAll('.imagem').forEach(box => {
        const img = box.querySelector('img');
        if (img) box.setAttribute('img-alt', img.getAttribute('alt'));
    });

    // Toggle menu flutuante
    btnAccToggle.addEventListener('click', () => {
        const ativo = menuAcessibilidade.classList.toggle('ativo');
        btnAccToggle.setAttribute('aria-expanded', ativo);
        menuAcessibilidade.setAttribute('aria-hidden', !ativo);
    });

    // Fechar menu com a tecla ESC (Acessibilidade Teclado)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuAcessibilidade.classList.contains('ativo')) {
            menuAcessibilidade.classList.remove('ativo');
            btnAccToggle.setAttribute('aria-expanded', false);
            menuAcessibilidade.setAttribute('aria-hidden', true);
            btnAccToggle.focus();
        }
    });

    // Redimensionamento de fontes via Variáveis CSS relativas
    btnAumentarFonte.addEventListener('click', () => {
        if (escalaFonte < 1.4) {
            escalaFonte += 0.1;
            document.documentElement.style.setProperty('--font-size-multiplier', escalaFonte);
        }
    });

    btnDiminuirFonte.addEventListener('click', () => {
        if (escalaFonte > 0.8) {
            escalaFonte -= 0.1;
            document.documentElement.style.setProperty('--font-size-multiplier', escalaFonte);
        }
    });

    // Alternar Tema (Modo Escuro / Modo Claro baseado na paleta ativa)
    btnAlternarTema.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });

    // SpeechSynthesis API - Conversão nativa de texto em voz do conteúdo principal
    btnIniciarVoz.addEventListener('click', () => {
        window.speechSynthesis.cancel(); // Para execuções anteriores

        const conteudoPrincipal = document.getElementById('conteudo-principal');
        const textoParaLer = conteudoPrincipal.innerText;

        leituraUtterance = new SpeechSynthesisUtterance(textoParaLer);
        leituraUtterance.lang = 'pt-BR';
        leituraUtterance.rate = 1.0;

        leituraUtterance.onstart = () => {
            btnIniciarVoz.textContent = "Lendo... 🔊";
            btnIniciarVoz.style.backgroundColor = "var(--clr-pink-primary)";
        };

        leituraUtterance.onend = () => {
            btnIniciarVoz.textContent = "Ouvir Texto 🔊";
            btnIniciarVoz.style.backgroundColor = "";
        };

        window.speechSynthesis.speak(leituraUtterance);
    });

    btnPararVoz.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        btnIniciarVoz.textContent = "Ouvir Texto 🔊";
        btnIniciarVoz.style.backgroundColor = "";
    });


    // --- VALIDAÇÃO PREMIUM DO FORMULÁRIO ---
    const formInscricao = document.getElementById('form-inscricao');
    const alertSucesso = document.getElementById('sucesso-inscricao');

    const inputs = {
        nome: document.getElementById('txt-nome'),
        email: document.getElementById('txt-email'),
        cidade: document.getElementById('txt-cidade'),
        estado: document.getElementById('txt-estado'),
        pais: document.getElementById('txt-pais')
    };

    const erros = {
        nome: document.getElementById('erro-nome'),
        email: document.getElementById('erro-email'),
        cidade: document.getElementById('erro-cidade'),
        estado: document.getElementById('erro-estado'),
        pais: document.getElementById('erro-pais')
    };

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

    const validarCampo = (key) => {
        const input = inputs[key];
        const erroBox = erros[key];
        
        if (!input.value.trim()) {
            erroBox.textContent = `O campo é obrigatório.`;
            input.setAttribute('aria-invalid', 'true');
            return false;
        }
        
        if (key === 'email' && !validarEmail(input.value)) {
            erroBox.textContent = "Insira um e-mail válido.";
            input.setAttribute('aria-invalid', 'true');
            return false;
        }

        erroBox.textContent = "";
        input.removeAttribute('aria-invalid');
        return true;
    };

    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('blur', () => validarCampo(key));
        inputs[key].addEventListener('input', () => {
            if (erros[key].textContent) validarCampo(key);
        });
    });

    formInscricao.addEventListener('submit', (e) => {
        e.preventDefault();
        let valido = true;
        
        Object.keys(inputs).forEach(key => {
            if (!validarCampo(key)) valido = false;
        });

        if (valido) {
            formInscricao.style.display = 'none';
            alertSucesso.style.display = 'block';
            alertSucesso.focus();
        }
    });


    // --- SESSÃO DE INTERAÇÃO: COMENTÁRIOS VIA EVENT LISTENER ---
    const formComentario = document.getElementById('form-comentario');
    const txtComentario = document.getElementById('txt-comentario');
    const listaComentarios = document.getElementById('lista-comentarios');

    formComentario.addEventListener('submit', (e) => {
        e.preventDefault();
        const texto = txtComentario.value.trim();
        if (!texto) return;

        const novoComentario = document.createElement('div');
        novoComentario.className = 'comentario-item';
        novoComentario.innerHTML = `
            <div class="comentario-meta">
                <span class="comentario-autor">Leitor AgroTech</span>
                <span class="comentario-data">Agora mesmo</span>
            </div>
            <p class="comentario-texto"></p>
        `;

        novoComentario.querySelector('.comentario-texto').textContent = texto; // Proteção XSS
        listaComentarios.insertBefore(novoComentario, listaComentarios.firstChild);
        txtComentario.value = "";
    });
});