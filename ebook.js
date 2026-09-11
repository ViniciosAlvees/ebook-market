/* =========================================================
   EBOOKS — ebook.js
   Funciona diretamente com o ebook.html atual
   ========================================================= */

const livros = [
    {
        id: 1,
        nome: "Educação Alimentar — Guia Educativo",
        preco: 20.99,
        descricao:
            "Um guia completo e educativo para transformar sua relação com a alimentação. Aprenda os fundamentos da educação alimentar, entenda calorias e macronutrientes, descubra estratégias para perder gordura ou ganhar massa muscular, organize sua rotina e acompanhe seu progresso.",
        imagem: "assets/capa1.jpeg",
        genero: "Educação",
        linkVenda: ""
    }

    /*
    =========================================================
    PARA ADICIONAR OUTRO EBOOK, COPIE O BLOCO ABAIXO:

    ,{
        id: 2,
        nome: "Aprendendo a Programar — Guia Completo",
        preco: 29.90,
        descricao: "Descrição do novo ebook.",
        imagem: "assets/capa2.jpg",
        genero: "Tecnologia",
        linkVenda: "https://seu-link.com"
    }

    Gêneros disponíveis:
    Saúde | Educação | Terror | Ação | Drama | Romance | Tecnologia
    =========================================================
    */
];

let carrinho = [];
let generoAtual = "Todos";
let formaPagamento = "pix";

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    renderizarLivros(livros);
    atualizarContador();
    atualizarCarrinho();
    atualizarPagamento();
});

/* =========================================================
   CATÁLOGO
   ========================================================= */

function renderizarLivros(lista) {
    const container = document.getElementById("listaLivros");
    const quantidade = document.getElementById("quantidadeLivros");

    if (!container) return;

    if (!lista || lista.length === 0) {
        container.innerHTML = `
            <div class="no-books">
                <h3>Nenhum ebook encontrado</h3>
                <p>Não existem ebooks cadastrados neste gênero.</p>
            </div>
        `;

        if (quantidade) {
            quantidade.textContent = "0 ebooks disponíveis";
        }

        return;
    }

    if (quantidade) {
        quantidade.textContent =
            lista.length === 1
                ? "1 ebook disponível"
                : `${lista.length} ebooks disponíveis`;
    }

    container.innerHTML = lista.map((livro, index) => `
        <article class="book-card" style="animation-delay:${index * 0.08}s">

            <img
                src="${escaparHTML(livro.imagem)}"
                alt="${escaparHTML(livro.nome)}"
                onerror="imagemFallback(this)"
            >

            <div class="book-card-content">

                <span class="book-genre">
                    ${escaparHTML(livro.genero)}
                </span>

                <h3>
                    ${escaparHTML(livro.nome)}
                </h3>

                <p>
                    ${escaparHTML(livro.descricao)}
                </p>

                <div class="book-footer">

                    <strong class="price">
                        ${Number(livro.preco).toFixed(2).replace(".", ",")}
                    </strong>

                    <div class="book-actions">

                        <button
                            class="view-button"
                            onclick="verLivro(${livro.id})">
                            Ver
                        </button>

                        <button
                            class="add-cart"
                            onclick="adicionarCarrinho(${livro.id})">
                            🛒 Comprar
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `).join("");
}

/* =========================================================
   BOTÃO "VER EBOOKS"
   ========================================================= */

function mostrarLivros() {
    const livrosSection = document.getElementById("livros");

    if (livrosSection) {
        livrosSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

/* =========================================================
   GÊNEROS
   ========================================================= */

function mostrarGeneros() {
    const generos = document.getElementById("generos");

    if (generos) {
        generos.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

function filtrarGenero(genero, botao) {
    generoAtual = genero;

    document.querySelectorAll(".genres button").forEach(button => {
        button.classList.remove("active");
    });

    if (botao) {
        botao.classList.add("active");
    }

    const lista =
        genero === "Todos"
            ? livros
            : livros.filter(livro => livro.genero === genero);

    renderizarLivros(lista);

    const livrosSection = document.getElementById("livros");

    if (livrosSection) {
        setTimeout(() => {
            livrosSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 80);
    }
}

/* =========================================================
   VISUALIZAÇÃO DO EBOOK
   ========================================================= */

function verLivro(id) {
    const livro = livros.find(item => item.id === id);

    if (!livro) return;

    if (livro.linkVenda && livro.linkVenda.trim() !== "") {
        window.open(livro.linkVenda, "_blank", "noopener,noreferrer");
        return;
    }

    alert(
        `${livro.nome}\n\n` +
        `${livro.descricao}\n\n` +
        `Preço: R$ ${Number(livro.preco).toFixed(2).replace(".", ",")}\n\n` +
        `Adicione o link de venda no campo "linkVenda" do ebook.js.`
    );
}

/* =========================================================
   CARRINHO
   ========================================================= */

function adicionarCarrinho(id) {
    const livro = livros.find(item => item.id === id);

    if (!livro) return;

    const existente = carrinho.find(item => item.id === id);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            ...livro,
            quantidade: 1
        });
    }

    atualizarContador();
    atualizarCarrinho();

    const botao = document.querySelector(
        `.add-cart[onclick="adicionarCarrinho(${id})"]`
    );

    if (botao) {
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = "✓ Adicionado";

        setTimeout(() => {
            botao.innerHTML = textoOriginal;
        }, 1000);
    }
}

function removerCarrinho(id) {
    const item = carrinho.find(produto => produto.id === id);

    if (!item) return;

    if (item.quantidade > 1) {
        item.quantidade--;
    } else {
        carrinho = carrinho.filter(produto => produto.id !== id);
    }

    atualizarContador();
    atualizarCarrinho();
}

function atualizarContador() {
    const contador = document.getElementById("contadorCarrinho");

    if (!contador) return;

    const totalItens = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    contador.textContent = totalItens;
}

function calcularTotal() {
    return carrinho.reduce(
        (total, item) => total + Number(item.preco) * item.quantidade,
        0
    );
}

function formatarPreco(valor) {
    return `R$ ${Number(valor)
        .toFixed(2)
        .replace(".", ",")}`;
}

function atualizarCarrinho() {
    const container = document.getElementById("itensCarrinho");
    const total = document.getElementById("totalCarrinho");

    if (!container) return;

    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:45px;margin-bottom:10px;">🛒</div>
                <p>Seu carrinho está vazio.</p>
                <small>Adicione um ebook para continuar.</small>
            </div>
        `;
    } else {
        container.innerHTML = carrinho.map(item => `
            <div class="cart-item">

                <div>
                    <h4>${escaparHTML(item.nome)}</h4>
                    <small>
                        ${item.quantidade}x · ${formatarPreco(item.preco)}
                    </small>
                </div>

                <div>
                    <strong>
                        ${formatarPreco(item.preco * item.quantidade)}
                    </strong>

                    <button
                        onclick="removerCarrinho(${item.id})"
                        title="Remover">
                        −
                    </button>
                </div>

            </div>
        `).join("");
    }

    if (total) {
        total.textContent = formatarPreco(calcularTotal());
    }

    atualizarResumoPedido();
}

/* =========================================================
   MODAL
   ========================================================= */

function abrirCarrinho() {
    const modal = document.getElementById("modalCarrinho");

    if (!modal) return;

    atualizarCarrinho();

    modal.classList.add("show");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function fecharCarrinho() {
    const modal = document.getElementById("modalCarrinho");

    if (!modal) return;

    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.style.overflow = "";
}

document.addEventListener("click", event => {
    const modal = document.getElementById("modalCarrinho");

    if (modal && event.target === modal) {
        fecharCarrinho();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharCarrinho();
    }
});

/* =========================================================
   PAGAMENTO
   ========================================================= */

function irParaPagamento() {
    if (carrinho.length === 0) {
        alert("Adicione pelo menos um ebook ao carrinho.");
        return;
    }

    const main = document.querySelector("main");
    const pagamento = document.getElementById("pagamento");

    fecharCarrinho();

    if (main) {
        main.style.display = "none";
    }

    if (pagamento) {
        pagamento.classList.add("active");
        pagamento.style.display = "block";
    }

    atualizarResumoPedido();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function voltarCatalogo() {
    const main = document.querySelector("main");
    const pagamento = document.getElementById("pagamento");

    if (pagamento) {
        pagamento.classList.remove("active");
        pagamento.style.display = "none";
    }

    if (main) {
        main.style.display = "";
    }

    setTimeout(() => {
        const livrosSection = document.getElementById("livros");

        if (livrosSection) {
            livrosSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    }, 50);
}

function atualizarResumoPedido() {
    const resumo = document.getElementById("resumoPedido");
    const total = document.getElementById("totalPagamento");

    if (!resumo) return;

    if (carrinho.length === 0) {
        resumo.innerHTML = `<p class="empty-cart">Nenhum ebook selecionado.</p>`;
    } else {
        resumo.innerHTML = carrinho.map(item => `
            <div class="cart-item">
                <div>
                    <h4>${escaparHTML(item.nome)}</h4>
                    <small>Quantidade: ${item.quantidade}</small>
                </div>

                <strong>
                    ${formatarPreco(item.preco * item.quantidade)}
                </strong>
            </div>
        `).join("");
    }

    if (total) {
        total.textContent = formatarPreco(calcularTotal());
    }
}

/* =========================================================
   FORMA DE PAGAMENTO
   ========================================================= */

function selecionarPagamento(tipo) {
    formaPagamento = tipo;

    const pixOption = document.getElementById("pixOption");
    const cardOption = document.getElementById("cardOption");
    const pixArea = document.getElementById("pixArea");
    const cardArea = document.getElementById("cardArea");

    if (pixOption) {
        pixOption.classList.toggle("active", tipo === "pix");
    }

    if (cardOption) {
        cardOption.classList.toggle("active", tipo === "card");
    }

    if (pixArea) {
        pixArea.style.display = tipo === "pix" ? "block" : "none";
    }

    if (cardArea) {
        cardArea.style.display = tipo === "card" ? "block" : "none";
    }
}

function atualizarPagamento() {
    selecionarPagamento("pix");
}

/* =========================================================
   COPIAR PIX
   ========================================================= */

function copiarPix() {
    const campo = document.getElementById("pixCode");

    if (!campo) return;

    const codigo = campo.value || campo.textContent;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codigo)
            .then(() => mostrarMensagem("Código PIX copiado!"))
            .catch(() => copiarPixFallback(campo));
    } else {
        copiarPixFallback(campo);
    }
}

function copiarPixFallback(campo) {
    campo.focus();
    campo.select();

    try {
        document.execCommand("copy");
        mostrarMensagem("Código PIX copiado!");
    } catch (erro) {
        alert("Não foi possível copiar automaticamente. Selecione o código e copie.");
    }
}

/* =========================================================
   CARTÃO
   ========================================================= */

function iniciarPagamentoCartao() {
    alert(
        "O pagamento com cartão precisa ser conectado a um gateway " +
        "como Mercado Pago, Stripe, Asaas ou Pagar.me."
    );
}

/* =========================================================
   FINALIZAR PEDIDO
   ========================================================= */

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    const nome = document.getElementById("nomeCliente")?.value.trim();
    const email = document.getElementById("emailCliente")?.value.trim();
    const cpf = document.getElementById("cpfCliente")?.value.trim();

    if (!nome || !email || !cpf) {
        alert("Preencha nome, e-mail e CPF antes de confirmar o pedido.");
        return;
    }

    if (!email.includes("@")) {
        alert("Digite um e-mail válido.");
        return;
    }

    const pedido = {
        cliente: {
            nome,
            email,
            cpf
        },
        livros: carrinho.map(item => ({
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade
        })),
        total: calcularTotal(),
        pagamento: formaPagamento,
        data: new Date().toISOString()
    };

    localStorage.setItem(
        "ultimoPedidoEbooks",
        JSON.stringify(pedido)
    );

    alert(
        "Pedido registrado com sucesso!\n\n" +
        `Cliente: ${nome}\n` +
        `Total: ${formatarPreco(pedido.total)}\n\n` +
        "A confirmação automática do pagamento e o envio por e-mail " +
        "precisam de um backend/gateway de pagamento."
    );
}

/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function mostrarMensagem(texto) {
    const mensagem = document.createElement("div");

    mensagem.textContent = texto;

    Object.assign(mensagem.style, {
        position: "fixed",
        left: "50%",
        bottom: "30px",
        transform: "translateX(-50%)",
        zIndex: "99999",
        padding: "13px 20px",
        borderRadius: "10px",
        color: "#fff",
        background: "rgba(0, 140, 255, .95)",
        boxShadow: "0 0 30px rgba(0, 140, 255, .35)",
        fontWeight: "700"
    });

    document.body.appendChild(mensagem);

    setTimeout(() => {
        mensagem.remove();
    }, 2200);
}

function imagemFallback(img) {
    if (img.dataset.fallback === "1") {
        img.style.display = "none";
        return;
    }

    img.dataset.fallback = "1";

    img.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="600"
                 height="800"
                 viewBox="0 0 600 800">
                <rect width="600" height="800" fill="#07101c"/>
                <text x="300" y="360"
                      text-anchor="middle"
                      fill="#22b7ff"
                      font-size="42"
                      font-family="Arial">
                    EBOOK
                </text>
                <text x="300" y="420"
                      text-anchor="middle"
                      fill="#8293a8"
                      font-size="24"
                      font-family="Arial">
                    Capa não encontrada
                </text>
            </svg>
        `);
}

function escaparHTML(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
