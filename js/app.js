       const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbztN028k65cUeiFn6jtwVWi8uXrYU4pXOXEWG5_wvJhzeWFJn6pBxkc1OdyrG37-iTE/exec";

        let votosAmigoMes = [];
        let mesSelecionadoAmigoMes = "";


// GERAR CARDS VOTAÇÃO AMIGOS

function gerarCardsParticipantes() {

    const container = document.getElementById("listaParticipantes");

    container.innerHTML = "";

    const nomeUsuario = localStorage.getItem("nomeUsuario");

    participantes.forEach(participante => {

        const bloqueado = nomeUsuario.trim().toLowerCase() === participante.nome.trim().toLowerCase();

        
const card = `
    <div class="card-participante ${bloqueado ? "card-bloqueado" : ""}">

        <label class="opcao-participante">

            <input
                type="radio"
                name="votoAmigo"
                value="${participante.nome}"
                ${bloqueado ? "disabled" : ""}
            >

            <img src="${participante.foto}" alt="${participante.nome}">

            <h3>${participante.nome}</h3>

            <span class="seletor-voto">Selecionar</span>

        </label>

    </div>
`;


        container.innerHTML += card;

    });

}


function telaVotacao() {

    const nomeUsuario = localStorage.getItem("nomeUsuario");

if (!nomeUsuario || nomeUsuario.trim().toLowerCase() === "arregão(ona)") {
    alert("Você precisa se identificar para votar no Amigo do Mês!");
    telaIdentificacao();
    return;
}

    document.getElementById("tela").innerHTML = `

        <div class="container-votacao">

            <h1>Vote em quem fez o grupo feliz neste mês!</h1>

            <p>Escolha quem merece ser o Amigo do Mês.</p>

            <div id="listaParticipantes" class="lista-participantes">

            </div>

            <div class="acoes-votacao">

    <button onclick="votarAmigo()">
        Enviar voto!
    </button>

    <button
        class="btn-voltar"
        onclick="telaInicial()"
    >
        Voltar
    </button>

</div>

        </div>

    `;

    gerarCardsParticipantes();

}

        // MAPA DE SONS DOS BOTÕES
        const sonsDosBotoes = {
            "Preciso de ajuda! 🧡": "mp3/ajuda.mp3",
            "Enviar carinho 🤍": "mp3/carinho.mp3",
            "Fazer reclamação 😡": "mp3/reclamacao.mp3"
        };

        // TOCAR O SOM DO BOTÃO CLICADO
        function tocarSom(textoDoBotao) {
            const arquivo = sonsDosBotoes[textoDoBotao];

            if (!arquivo) {
                return;
            }

            const som = new Audio(arquivo);
            som.play();
        }

        // MOSTRAR UMA TELA COM PERGUNTA E OPÇÕES
        // Vamos manter esta função para reutilizá-la nas próximas etapas.
        function mostrarPergunta(texto, opcoes) {
            const tela = document.getElementById("tela");

            tela.innerHTML = `
                <h1>${texto}</h1>
                <div class="botoes">
                    ${opcoes.map(opcao => `
                        <button onclick="${opcao.acao}">
                            ${opcao.texto}
                        </button>
                    `).join("")}
                </div>
            `;
        } 

        // TELA DE RECLAMAÇÕES E SUGESTÕES
        function telaReclamacao() {
            const tela = document.getElementById("tela");

            tela.innerHTML = `
                <h1>Central de Reclamações</h1>

                <form class="formulario-reclamacao"
                      onsubmit="enviarReclamacao(event)">

                    <label for="intensidade">
                        Intensidade da reclamação (1 a 5)
                    </label>

                    <select id="intensidade" required>
                        <option value="">Selecione</option>
                        <option value="1">1 - Leve</option>
                        <option value="2">2 - Moderada</option>
                        <option value="3">3 - Séria</option>
                        <option value="4">4 - Muito séria</option>
                        <option value="5">5 - ABSURDA</option>
                    </select>

                    <label for="reclamacao">Sua reclamação</label>

                    <textarea
                        id="reclamacao"
                        placeholder="Escreva sua reclamação..."
                        required
                    ></textarea>

                    <button type="submit">Enviar Reclamação</button>

                    <button type="button" class="btn-voltar" onclick="telaInicial()">
                        Voltar
                    </button>
                </form>
            `;
        }

        // ENVIAR RECLAMAÇÃO PARA O GOOGLE SHEETS
        
async function enviarReclamacao(event) {
    event.preventDefault();

    const nome = localStorage.getItem("nomeUsuario");
    const reclamacao = document.getElementById("reclamacao").value.trim();
    const intensidade = document.getElementById("intensidade").value;

    if (!nome || !reclamacao || !intensidade) {
        alert("Preencha todos os campos antes de enviar!");
        return;
    }

    const botao = event.submitter;
    botao.disabled = true;
    botao.textContent = "Enviando...";

    try {
        await fetch(URL_SCRIPT, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                tipo: "reclamacao",
                nome: nome,
                reclamacao: reclamacao,
                intensidade: intensidade
            })
        });

        alert("Reclamação enviada! Senta lá e godrink.");

        event.target.reset();

        document.getElementById("reclamacao").value = "";
        document.getElementById("intensidade").value = "";

    } catch (erro) {
        alert("Não foi possível enviar. Tente novamente.");
        console.error(erro);

    } finally {
        botao.disabled = false;
        botao.textContent = "Enviar Reclamação";
    }
}

function telaProximosRoles(roles) {
    const tela = document.getElementById("tela");

    const imagensCategorias = {
        "Rolê Caseiro": "rolecaseiro.jpg",
        "Jogatina Caseira": "jogatinacaseira.jpg",
        "Bar & Restaurante": "barerestaurante.jpg",
        "Esporte & Diversão": "esporteediversao.jpg",
        "Viagem": "viagem.jpg",
        "Churrasco": "churrasco.jpg",
        "Cinema": "cinema.jpg",
        "Karaokê": "karaoke.jpg",
        "Rock & Roll": "rockeroll.jpg"
    };

    let cards = "";

    roles.forEach(role => {

        const imagem = imagensCategorias[role.categoria];

        const respostaUsuario = role.respostaUsuario;

        const dataFormatada = role.data.split("-").reverse().join("/");

        const participante = participantes.find(p =>
            p.nome.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase() ===
            role.organizador.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase()
        );

        const fotoOrganizador = participante
            ? participante.foto
            : "imagens/aleatorio.jpg";

        cards += `
            <div class="card-role">

                <img src="imagens/categorias/${imagem}" alt="${role.categoria}">

                <h2>${role.categoria}</h2>

                <div class="linha-organizador-data">

                    <div class="organizador-role">
                        <img src="${fotoOrganizador}" alt="${role.organizador}">
                        <div>
                            <span>Organizado por</span>
                            <strong>${role.organizador}</strong>
                        </div>
                    </div>

                    <p class="data-role">📅 ${dataFormatada}</p>

                </div>

                <div class="descricao-role">
                    <p class="titulo-descricao">Sobre o rolê</p>
                    <p>${role.descricao}</p>
                </div>

                <div class="contadores-role">
                    <span>🙋 ${role.dentro}</span>
                    <span>🙅 ${role.fora}</span>
                </div>

                <div class="botoes-role">

                    <button
    class="${respostaUsuario === 'Tô nessa' ? 'voto-selecionado nessa' : ''}"
    onclick="responderRole(event, '${role.id}', 'Tô nessa')">
    Tô nessa!
</button>

                   <button
    class="${respostaUsuario === 'Tô fora' ? 'voto-selecionado fora' : ''}"
    onclick="responderRole(event, '${role.id}', 'Tô fora')">
    Tô fora!
</button>

                </div>

            </div>
        `;
    });

    tela.innerHTML = `
        <h1>Próximos Rolês 🎉</h1>

        <p>Aqui vamos encontrar os próximos rolês da galera!</p>

        <div id="listaRoles">
            ${cards}
        </div>

        <button class="btn-voltar" onclick="telaInicial()">
            Voltar
        </button>
    `;
}


async function responderRole(event, idRole, resposta) {

    const nome = localStorage.getItem("nomeUsuario");

    const botaoClicado = event.currentTarget;

    if (!nome || nome === "Arregão(ona)") {
    alert("Anônimos não podem participar dos rolês! Identifique-se primeiro.");
    return;
    }

    const textoOriginal = botaoClicado.innerHTML;

botaoClicado.disabled = true;

botaoClicado.innerHTML = `
    <svg class="ampulheta-carregando" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2h12M6 22h12M7 2c0 5 5 5 5 10s-5 5-5 10"/>
        <path d="M17 2c0 5-5 5-5 10s5 5 5 10"/>
    </svg>
`;
    
    const dados = {
    tipo: "votoRole",
    nome: nome,
    idRole: idRole,
    resposta: resposta
};

try {
    await fetch(URL_SCRIPT, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(dados)
    });

    buscarRoles(false);

} catch (erro) {
    botaoClicado.innerHTML = textoOriginal;
    botaoClicado.disabled = false;

    alert("Erro ao enviar sua resposta. Tente novamente.");
    console.error(erro);
}

}


function buscarRoles(mostrarCarregamento = true, atualizarTelaRoles = true) {

    const tela = document.getElementById("tela");

    if (mostrarCarregamento) {
        tela.innerHTML = `
            <h1>Próximos Rolês 🎉</h1>
            <p>Aqui vamos encontrar os próximos rolês da galera!</p>

            <div class="carregando-roles">
                <div class="icone-carregando">⟳</div>
                <h2>Carregando rolês...</h2>
                <p>Estamos buscando os próximos encontros da galera!</p>
            </div>
        `;
    }

    const nome = localStorage.getItem("nomeUsuario") || "";
    const url = `${URL_SCRIPT}?nome=${encodeURIComponent(nome)}`;

    fetch(url)
        .then(resposta => resposta.json())
        .then(dados => {
            if (dados.sucesso) {
                if (atualizarTelaRoles) {
    telaProximosRoles(dados.roles);
    return;
}
                votosAmigoMes = dados.amigos || [];

                console.log("Votos recebidos:", votosAmigoMes);
console.log("Meses encontrados:", buscarMesesDisponiveis(votosAmigoMes));

                const hoje = new Date();

                const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0");
                const anoAtual = hoje.getFullYear();

                mesSelecionadoAmigoMes = `${mesAtual}/${anoAtual}`;

                preencherSeletorMes();

                const ranking = calcularRankingAmigos(votosAmigoMes, mesSelecionadoAmigoMes);
                montarPodioAmigoMes(ranking);
            }
        })
        .catch(erro => {
    console.error("Erro ao buscar os rolês:", erro);

    if (atualizarTelaRoles) {
        tela.innerHTML = `
            <h1>Ops! 😕</h1>
            <p>Não conseguimos carregar os rolês.</p>
            <p>Verifique sua conexão e tente novamente.</p>

            <button onclick="buscarRoles()">
                Tentar novamente
            </button>

            <button class="btn-voltar" onclick="telaInicial()">
                Voltar ao menu
            </button>
        `;
    }
});

}

function calcularRankingAmigos(votos, mesSelecionado) {
    const ranking = {};

votos.forEach(voto => {
    const indicado = voto[2];

    const dataVoto = voto[0];

    const [dia, mes, resto] = dataVoto.split("/");
    const [ano] = resto.split(" ");

    const mesAnoVoto = `${mes}/${ano}`;

    if (mesAnoVoto !== mesSelecionado) {
    return;
}

    if (!ranking[indicado]) {
    ranking[indicado] = {
        votos: 0,
        ultimoVoto: ""
    };
}

ranking[indicado].votos++;
ranking[indicado].ultimoVoto = voto[0];

});

const listaRanking = Object.entries(ranking);

listaRanking.sort((a, b) => {
    if (b[1].votos !== a[1].votos) {
        return b[1].votos - a[1].votos;
    }

    const converterData = data => {
        const [dia, mes, resto] = data.split("/");
        const [ano, horario] = resto.split(" ");
        const [hora, minuto, segundo] = horario.split(":").map(Number);

        return Date.UTC(
            Number(ano),
            Number(mes) - 1,
            Number(dia),
            hora,
            minuto,
            segundo
        );
    };

    return converterData(b[1].ultimoVoto) - converterData(a[1].ultimoVoto);
});

const topTres = listaRanking.slice(0, 3);
return topTres;

}

function montarPodioAmigoMes(ranking) {

    const container = document.getElementById("podio-amigo-mes");

    if (ranking.length === 0) {
    container.innerHTML = "<p>Nenhum voto registrado neste mês.</p>";
    return;
}

const participantesRanking = ranking.map(([nome, dados]) => {
    
    const participante = participantes.find(p => p.nome === nome);

    return {
        nome: nome,
        votos: dados.votos,
        foto: participante ? participante.foto : "imagens/aleatorio.jpg"
    };

});

const primeiro = participantesRanking[0];
const segundo = participantesRanking[1] || null;
const terceiro = participantesRanking[2] || null;

container.innerHTML = `
    <div class="podio-primeiro">
        <img src="${primeiro.foto}" alt="${primeiro.nome}">
        <h3>🥇 ${primeiro.nome}</h3>
        <p class="quantidade-votos">${primeiro.votos} ${primeiro.votos === 1 ? "voto" : "votos"}</p>
    </div>
    ${segundo ? `
    <div class="podio-segundo">
        <img src="${segundo.foto}" alt="${segundo.nome}">
        <h3>🥈 ${segundo.nome}</h3>
        <p class="quantidade-votos">${segundo.votos} ${segundo.votos === 1 ? "voto" : "votos"}</p>
    </div>
` : ""}

${terceiro ? `
    <div class="podio-terceiro">
        <img src="${terceiro.foto}" alt="${terceiro.nome}">
        <h3>🥉 ${terceiro.nome}</h3>
        <p class="quantidade-votos">${terceiro.votos} ${terceiro.votos === 1 ? "voto" : "votos"}</p>
    </div>
` : ""}
`;

}

function buscarMesesDisponiveis(votos) {

    const meses = [];

    votos.forEach(voto => {

        const dataVoto = voto[0];

const [dia, mes, resto] = dataVoto.split("/");
const [ano] = resto.split(" ");

const mesAno = `${mes}/${ano}`;

if (!meses.includes(mesAno)) {
    meses.push(mesAno);
}

});

meses.sort((a, b) => {
    const [mesA, anoA] = a.split("/").map(Number);
    const [mesB, anoB] = b.split("/").map(Number);

    return (anoB * 100 + mesB) - (anoA * 100 + mesA);
});

return meses;

}

function preencherSeletorMes() {

    const seletor = document.getElementById("seletor-mes-amigo");

    if (!seletor) {
    return;
}

    console.log("Função preencherSeletorMes executada!");
console.log("Elemento encontrado:", seletor);

    const meses = buscarMesesDisponiveis(votosAmigoMes);

    if (meses.length === 0) {
    seletor.innerHTML = `<option value="">Nenhum mês com votos</option>`;
    return;
}

    seletor.innerHTML = meses.map(mes => {
    const [numeroMes, ano] = mes.split("/");

    const nomeMes = new Date(
        Number(ano),
        Number(numeroMes) - 1
    ).toLocaleDateString("pt-BR", {
        month: "long"
    });

    const mesFormatado = `${nomeMes} ${ano}`;

    return `<option value="${mes}">${mesFormatado}</option>`;
}).join("");

seletor.value = mesSelecionadoAmigoMes;

console.log("HTML do seletor:", seletor.innerHTML);
console.log("Mês desejado:", mesSelecionadoAmigoMes);
console.log("Valor selecionado:", seletor.value);

}

function alterarMesAmigo(mes) {

    mesSelecionadoAmigoMes = mes;

    const ranking = calcularRankingAmigos(
    votosAmigoMes,
    mesSelecionadoAmigoMes
);

console.log(ranking);

montarPodioAmigoMes(ranking);

}


function telaSolicitarRole() {

    const tela = document.getElementById("tela");

    tela.innerHTML = `

        <h1>
            Sim, vamo marcar!
        </h1>

        <form class="formulario-role" onsubmit="enviarRole(event)">

            <label for="dataRole">Quando será o rolê?</label>

            <input
                type="date"
                id="dataRole"
                required
            >

            <label for="categoriaRole">Qual será o tipo de rolê?</label>

            <select id="categoriaRole" required>
                <option value="">Selecione uma categoria</option>
                <option value="Rolê Caseiro">Rolê Caseiro</option>
                <option value="Jogatina Caseira">Jogatina Caseira</option>
                <option value="Bar & Restaurante">Bar & Restaurante</option>
                <option value="Esporte & Diversão">Esporte & Diversão</option>
                <option value="Viagem">Viagem</option>
                <option value="Churrasco">Churrasco</option>
                <option value="Cinema">Cinema</option>
                <option value="Karaokê">Karaokê</option>
                <option value="Rock & Roll">Rock & Roll</option>
            </select>

            <label>Qual o seu nível de animação?</label>

            <div class="opcoes-interesse">

                <input
                    type="radio"
                    id="interesse1"
                    name="nivelInteresse"
                    value="1"
                    required
                >
                <label for="interesse1">1 - Podíamos sair</label>

                <input
                    type="radio"
                    id="interesse2"
                    name="nivelInteresse"
                    value="2"
                >
                <label for="interesse2">2 - Tô animando</label>

                <input
                    type="radio"
                    id="interesse3"
                    name="nivelInteresse"
                    value="3"
                >
                <label for="interesse3">3 - A gente vai vendo</label>

                <input
                    type="radio"
                    id="interesse4"
                    name="nivelInteresse"
                    value="4"
                >
                <label for="interesse4">4 - Vamos marcar logo!</label>

                <input
                    type="radio"
                    id="interesse5"
                    name="nivelInteresse"
                    value="5"
                >
                <label for="interesse5">5 - PRECISAMOS URGENTE!</label>

            </div>

            <label for="descricaoRole">Qual será o rolê?</label>

            <textarea
                id="descricaoRole"
                placeholder="Ex: Vamos marcar uma sinuca no Sabão..."
                required
            ></textarea>

            <div class="botoes">

    <button type="submit">
        Enviar solicitação
    </button>

    <button type="button" class="btn-voltar" onclick="telaInicial()">
        Voltar
    </button>

        </div>

        </form>
    `;
}


async function enviarRole(event) {
    event.preventDefault();

    const nome = localStorage.getItem("nomeUsuario");
    const data = document.getElementById("dataRole").value;
    const categoria = document.getElementById("categoriaRole").value;

    const interesseSelecionado = document.querySelector('input[name="nivelInteresse"]:checked');
    const interesse = interesseSelecionado ? interesseSelecionado.value : "";

    const descricao = document.getElementById("descricaoRole").value.trim();

    if (!nome || !data || !categoria || !interesse || !descricao) {
        alert("Preencha todos os campos antes de enviar!");
        return;
    }

    const botao = event.submitter;

    botao.disabled = true;
    botao.textContent = "Enviando...";

    // TOCAR ÁUDIO AO ENVIAR ROLÊ
const somRole = new Audio("mp3/cassinao.mp3");
somRole.volume = 0.3;

somRole.play().catch(erro => {
    console.log("Não foi possível reproduzir o áudio:", erro);
});

    try {
        await fetch(URL_SCRIPT, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                tipo: "role",
                nome: nome,
                data: data,
                categoria: categoria,
                interesse: interesse,
                descricao: descricao
            })
        });

        alert("Solicitação enviada! Agora é esperar a galera animar! 🎉");

        event.target.reset();

    } catch (erro) {
        alert("Não foi possível enviar sua solicitação. Tente novamente.");
        console.error(erro);

    } finally {
        botao.disabled = false;
        botao.textContent = "Enviar solicitação";
    }
}


async function votarAmigo() {

    const nomeUsuario = localStorage.getItem("nomeUsuario");

    if (!nomeUsuario || nomeUsuario.trim().toLowerCase() === "arregão(ona)") {
    alert("Anônimos não podem votar no Amigo do Mês! Identifique-se primeiro.");
    telaIdentificacao();
    return;
}

    const selecionado = document.querySelector(
        'input[name="votoAmigo"]:checked'
    );

    if (!selecionado) {
        alert("Escolha alguém para votar!");
        return;
    }

    const indicado = selecionado.value;

    const botao = document.querySelector(
        '.container-votacao button[onclick="votarAmigo()"]'
    );

    botao.disabled = true;
    botao.textContent = "Enviando voto...";

    try {

        await fetch(URL_SCRIPT, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                tipo: "amigoMes",
                nome: nomeUsuario,
                indicado: indicado
            })
        });

        alert("Voto enviado! Obrigado por participar! 🤍");

    } catch (erro) {

        alert("Não foi possível enviar seu voto. Tente novamente.");
        console.error(erro);

    } finally {

        botao.disabled = false;
        botao.textContent = "Votar";

    }
}

        function trocarUsuario() {
            localStorage.removeItem("nomeUsuario");
            telaIdentificacao();
        }

        // MENU PRINCIPAL ATUAL
        function telaInicial() {
            const tela = document.getElementById("tela");
            const nomeSalvo = localStorage.getItem("nomeUsuario");
            const participante = participantes.find(p => p.nome === nomeSalvo);

            const fotoUsuario = participante
                ? participante.foto
                : "imagens/aleatorio.jpg";

            tela.innerHTML = `
                <div class="cabecalho-glpc">

    <img
        src="imagens/logoGLPC.png"
        alt="Central de amizade GLPC"
        class="logo-glpc"
    >

</div>

<div class="boas-vindas">

    <img
        src="${fotoUsuario}"
        alt="Foto do usuário"
        class="foto-usuario"
    >

    <div class="texto-boas-vindas">
        <h2>Bem-vindo(a), ${nomeSalvo}!</h2>
    </div>

</div>    
            <div class="card-menu">

                <div class="botoes">
                    <button
    class="btn-imagem-menu"
    onclick="tocarSom('Preciso de ajuda! 🧡'); telaSolicitarRole()"
>
    <img
        src="imagens/buttons/btn-solicitarrole-novo.png"
        alt="Solicitar rolê"
    >
</button>

                    <button
    class="btn-imagem-menu"
    onclick="tocarSom('Enviar carinho 🤍'); telaVotacao()"
>
    <img
        src="imagens/buttons/btn-amigosdomes-novo.png"
        alt="Amigos do mês"
    >
</button>

                    <button
    class="btn-imagem-menu"
    onclick="
        const som = new Audio('mp3/cassinao.mp3');
        som.volume = 0.5;
        som.play();
        buscarRoles();
    "
>
    <img
        src="imagens/buttons/btn-proximosroles-novo.png"
        alt="Próximos rolês"
    >
</button>


<button
    class="btn-imagem-menu"
    onclick="window.location.href='jogos.html'"
>
    <img
        src="imagens/buttons/btn-omaisprovavel.png"
        alt="O Mais Provável"
    >
</button>


                </div>

            </div>    

            <div id="card-amigo-mes" class="card-amigo-mes">

<div class="cabecalho-amigo-mes">
    <h2>🏆 Amigo do Mês</h2>
</div>

<select
    id="seletor-mes-amigo"
    onchange="alterarMesAmigo(this.value)"
></select>

<div id="podio-amigo-mes"></div>

</div>

                <img
                    src="imagens/btnreclamacao.png"
                    onmouseover="this.src='imagens/btnreclamacao-hover.png'"
                    onmouseout="this.src='imagens/btnreclamacao.png'"
                    alt="Fazer reclamação"
                    class="btn-reclamacao-flutuante"
                    onclick="tocarSom('Fazer reclamação 😡'); telaReclamacao()"
                >

                <button class="btn-trocar-usuario" onclick="trocarUsuario()">
    Trocar usuário
</button>

            `;

            buscarRoles(false, false);

        }

        function telaIdentificacao () {
            const tela = document.getElementById("tela");

            tela.innerHTML = `
<div class="cabecalho-glpc">

    <img
        src="imagens/logoGLPC.png"
        alt="Central de amizade GLPC"
        class="logo-glpc"
    >

    <img
        src="imagens/imagemgrupo.jpg"
        alt="Foto do grupo GLPC"
        class="foto-grupo"
    >

</div> 

                 <h1> Bem-vindo(a), zé ruela! Quem é ocê mermo? </h1>

                 <div class="insert">
                    
                <input type="text" id="nomeUsuario" placeholder="Digite seu nome">

                <button onclick= "entrarNoSite()">
                    Entrar
                </button>

                <button onclick="entrarAnonimamente()">
                    Entrar anônimo 👀
                </button>    
                 
                </div>
                
                <div class="imagem-identificacao">
    <div class="faixa-identificacao">
        <img src="imagens/imgidentificacao.png" alt="">
        <img src="imagens/imgidentificacao.png" alt="">
    </div>
</div>
                
            `      

        }

        function entrarNoSite (){
            const nome = document.getElementById("nomeUsuario").value.trim();

            if (nome === "") {
    alert("Digite seu nome!");
        } else {
    localStorage.setItem("nomeUsuario", nome);
    telaInicial()
        }

        }

        function entrarAnonimamente() {
            localStorage.setItem("nomeUsuario", "Arregão(ona)");
            telaInicial();
    
        }

        // INICIA O SITE
        const nomeSalvo = localStorage.getItem("nomeUsuario");

if (nomeSalvo === null) {
    telaIdentificacao();
} else {
    telaInicial();
}