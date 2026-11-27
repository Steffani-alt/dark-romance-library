
const parametros = new URLSearchParams(window.location.search);

const identificador = parametros.get("livro");
let capituloAtual = Number(parametros.get("capitulo")) || 0;

const livroSalvo = localStorage.getItem("noirLivroAtual");

const livro = livroSalvo ? JSON.parse(livroSalvo) : null;

const elementos = {
    nomeTopo: document.getElementById("nome-livro-topo"),
    nomeHeader: document.getElementById("nome-livro-header"),
    numero: document.getElementById("numero-capitulo"),
    titulo: document.getElementById("titulo-capitulo"),
    texto: document.getElementById("texto-leitura"),
    pagina: document.getElementById("numero-pagina"),
    progressoTexto: document.getElementById("progresso-texto"),
    progresso: document.getElementById("progresso-preenchido"),
    percentual: document.getElementById("progresso-percentual"),
    anterior: document.getElementById("capitulo-anterior"),
    proximo: document.getElementById("proximo-capitulo"),
    voltar: document.getElementById("voltar-livro")
};

if (!livro || !livro.capitulos || identificador === null) {
    document.querySelector(".leitor-container").innerHTML = `
        <div class="erro-leitura">
            <h1>Não foi possível abrir este livro.</h1>
            <p>Volte à biblioteca e escolha uma história.</p>
            <a href="index.html">Voltar à biblioteca</a>
        </div>
    `;
} else {

    const capitulos = livro.capitulos;

    const chaveProgresso = `noirProgresso_${identificador}`;

    elementos.nomeTopo.textContent = livro.titulo;
    elementos.nomeHeader.textContent = livro.titulo;

    elementos.voltar.href = `livro.html?livro=${identificador}`;

    function carregarCapitulo() {

        const capitulo = capitulos[capituloAtual];

        if (!capitulo) return;

        elementos.numero.textContent =
            `CAPÍTULO ${String(capituloAtual + 1).padStart(2, "0")}`;

        elementos.titulo.textContent = capitulo.titulo;

        elementos.pagina.textContent =
            String(capituloAtual + 1).padStart(2, "0");

        elementos.progressoTexto.textContent =
            `Capítulo ${String(capituloAtual + 1).padStart(2, "0")} de ${String(capitulos.length).padStart(2, "0")}`;

        elementos.texto.innerHTML = "";

        const paragrafos = capitulo.texto
            .split(/\n+/)
            .filter(paragrafo => paragrafo.trim() !== "");

        paragrafos.forEach(paragrafo => {
            const p = document.createElement("p");
            p.textContent = paragrafo;
            elementos.texto.appendChild(p);
        });

        const percentual = Math.round(
            ((capituloAtual + 1) / capitulos.length) * 100
        );

        elementos.progresso.style.width = `${percentual}%`;
        elementos.percentual.textContent = `${percentual}% concluído`;

        elementos.anterior.disabled = capituloAtual === 0;

        elementos.proximo.disabled =
            capituloAtual === capitulos.length - 1;

        localStorage.setItem(chaveProgresso, capituloAtual);
        
        history.replaceState(
            null,
            "",
            `leitura.html?livro=${identificador}&capitulo=${capituloAtual}`
        );
    }

    elementos.anterior.addEventListener("click", () => {
        if (capituloAtual > 0) {
            capituloAtual--;
            carregarCapitulo();
            window.scrollTo(0, 0);
        }
    });

    elementos.proximo.addEventListener("click", () => {
        if (capituloAtual < capitulos.length - 1) {
            capituloAtual++;
            carregarCapitulo();
            window.scrollTo(0, 0);
        }
    });

    // Recupera o último capítulo lido
    const progressoSalvo = localStorage.getItem(chaveProgresso);

    if (progressoSalvo !== null && !parametros.has("capitulo")) {
        capituloAtual = Number(progressoSalvo);
    }

    if (capituloAtual < 0 || capituloAtual >= capitulos.length) {
        capituloAtual = 0;
    }

    carregarCapitulo();
}