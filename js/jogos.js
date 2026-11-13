
// =====================================
// SELEÇÃO DE PARTICIPANTES
// =====================================

// Guarda quem foi selecionado.
let participanteSelecionado = null;

// =====================================
// DADOS DO VOTO
// =====================================

// Guarda o nome do participante que receberá o voto.
let nomeParticipanteSelecionado = null;


// Localiza os elementos HTML.
const gradeParticipantes = document.getElementById("gradeParticipantes");
const btnConfirmarVoto = document.getElementById("btnConfirmarVoto");
const contadorVotos = document.querySelector(".contador-votos");

// Elementos do carregamento do voto.
const iconeCarregando = document.getElementById("iconeCarregando");
const textoBotaoVoto = document.getElementById("textoBotaoVoto");

// =====================================
// ELEMENTOS DO RESULTADO
// =====================================

const areaVotacao = document.querySelector(".area-votacao");
const resultadoVotacao = document.getElementById("resultadoVotacao");
const btnRepensarVoto = document.getElementById("btnRepensarVoto");

// =====================================
// DADOS DO PARTICIPANTE LÍDER
// =====================================

const fotoLider = document.getElementById("fotoLider");
const nomeLider = document.getElementById("nomeLider");
const porcentagemLider = document.getElementById("porcentagemLider");

// =====================================
// GERAR CARDS DOS PARTICIPANTES
// =====================================

function gerarCardsParticipantes() {

    // Limpa os cards que estavam escritos diretamente no HTML.
    gradeParticipantes.innerHTML = "";

    // Percorre a lista compartilhada de participantes.
    participantes.forEach(function(participante, indice) {

        // Cria um botão para cada participante.
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card-participante");

        // Guarda o índice para identificar o card selecionado.
        card.dataset.id = indice;

        // Insere a foto e o nome.
        card.innerHTML = `
            <img 
                class="foto-participante"
                src="${participante.foto}"
                alt="${participante.nome}"
            >

            <span class="nome-participante">
                ${participante.nome}
            </span>
        `;

        gradeParticipantes.appendChild(card);

    });

}

// Executa a criação dos cards.
gerarCardsParticipantes();


// Escuta os cliques nos participantes.
gradeParticipantes.addEventListener("click", function(event) {

    // Descobre se o clique aconteceu em um card.
    const card = event.target.closest(".card-participante");

    // Se não clicou em um card, encerra a função.
    if (!card) {
        return;
    }

    // Guarda o ID do participante selecionado.
    participanteSelecionado = card.dataset.id;

    // Localiza o participante correspondente ao card.
const participante = participantes[Number(participanteSelecionado)];

// Guarda o nome real para enviar ao Google Apps Script.
nomeParticipanteSelecionado = participante.nome;

    // Remove a seleção de todos os participantes.
    const todosOsCards = document.querySelectorAll(".card-participante");

    todosOsCards.forEach(function(item) {
        item.classList.remove("selecionado");
    });

    // Destaca o participante escolhido.
    card.classList.add("selecionado");

    // Atualiza o contador.
    contadorVotos.textContent = "1/1";

    // Habilita o botão de confirmação.
    btnConfirmarVoto.disabled = false;

});


// =====================================
// CONSULTAR RODADA NO GOOGLE APPS SCRIPT
// =====================================

const URL_SCRIPT_JOGO = "https://script.google.com/macros/s/AKfycbztN028k65cUeiFn6jtwVWi8uXrYU4pXOXEWG5_wvJhzeWFJn6pBxkc1OdyrG37-iTE/exec";


// =====================================
// CONTAGEM REGRESSIVA DA RODADA
// =====================================

let intervaloContagem = null;

function atualizarTempoRestante(encerramento) {

    const elementoTempo = document.getElementById("tempoRestante");

    // Converte a data de encerramento em milissegundos.
    const dataFinal = new Date(encerramento).getTime();

    function calcularTempo() {

        const agora = Date.now();

        // Diferença entre o encerramento e o momento atual.
        const diferenca = dataFinal - agora;

        if (diferenca <= 0) {
            elementoTempo.textContent = "Encerrada";

            clearInterval(intervaloContagem);
            return;
        }

        // Converte milissegundos em horas e minutos.
        const horas = Math.floor(diferenca / (1000 * 60 * 60));

        const minutos = Math.floor(
    (diferenca % (1000 * 60 * 60)) / (1000 * 60)
);

const segundos = Math.floor(
    (diferenca % (1000 * 60)) / 1000
);

elementoTempo.textContent =
    `${horas}h ${minutos}m ${segundos}s`;
    }

    // Evita criar vários contadores simultâneos.
    clearInterval(intervaloContagem);

    calcularTempo();

    // Atualiza a cada segundo.
    intervaloContagem = setInterval(calcularTempo, 1000);
}


function carregarRodada() {

    // Cria uma função que receberá a resposta do Google.
    window.receberEstadoMaisProvavel = function(dados) {

        console.log("Dados recebidos do jogo:", dados);

        // Verifica se a consulta foi bem-sucedida.
        if (!dados.sucesso || !dados.maisProvavel) {
            console.error("Não foi possível carregar a rodada.");
            return;
        }

        const jogo = dados.maisProvavel;

        // Verifica se existe uma pergunta ativa.
        if (!jogo.pergunta) {
            console.log("Nenhuma pergunta disponível.");
            return;
        }

        // Atualiza a pergunta na tela.
        document.getElementById("textoPergunta").textContent =
            jogo.pergunta.pergunta;

        // Atualiza o autor da pergunta.
        document.getElementById("autorPergunta").innerHTML =
            `Sugerida por <strong>${jogo.pergunta.sugeridaPor}</strong>`;

            // Inicia a contagem regressiva da rodada.
atualizarTempoRestante(jogo.encerramento);

// Verifica se o usuário já votou nesta rodada.
if (jogo.meuVoto) {

    console.log("Usuário já votou em:", jogo.meuVoto.nomeVotado);

    // Recupera o voto anterior.
    nomeParticipanteSelecionado = jogo.meuVoto.nomeVotado;

    const indiceVotado = participantes.findIndex(
        p => p.nome === jogo.meuVoto.nomeVotado
    );

    participanteSelecionado = indiceVotado >= 0
        ? String(indiceVotado)
        : null;

    // Atualiza o card com o resultado atual.
    atualizarCardResultado(jogo.resultado);

    // Mostra diretamente a tela de resultado.
    mostrarResultado();

} else {

    console.log("Usuário ainda não votou nesta rodada.");

    // Mantém a tela de votação disponível.
    areaVotacao.hidden = false;
    resultadoVotacao.hidden = true;
    gradeParticipantes.hidden = false;
    btnConfirmarVoto.hidden = false;
}

    };

    // Cria a URL com os parâmetros da consulta.
    const script = document.createElement("script");

    script.src =
        URL_SCRIPT_JOGO +
        "?jogo=maisProvavel" +
        "&nome=Lorran" +
        "&callback=receberEstadoMaisProvavel";

    // Adiciona o script à página para executar a consulta.
    document.body.appendChild(script);

}

// Executa a consulta.
carregarRodada();


// =====================================
// EXIBIR RESULTADO DA VOTAÇÃO
// =====================================

function mostrarResultado() {

    // Esconde a grade de participantes.
    gradeParticipantes.hidden = true;

    // Esconde o botão de confirmar voto.
    btnConfirmarVoto.hidden = true;

    // Mostra o card de resultado.
    resultadoVotacao.hidden = false;

}


// =====================================
// VOLTAR PARA A VOTAÇÃO
// =====================================

function repensarVoto() {

    // Esconde o card de resultado.
    resultadoVotacao.hidden = true;

    // Mostra novamente os participantes.
    gradeParticipantes.hidden = false;

    // Mostra novamente o botão de confirmação.
    btnConfirmarVoto.hidden = false;

}

// Escuta o clique no botão Repensar voto.
btnRepensarVoto.addEventListener("click", function() {

    repensarVoto();

});


// =====================================
// ENVIAR VOTO AO GOOGLE APPS SCRIPT
// =====================================


function enviarVoto() {

    // Verifica se existe alguém selecionado.
    if (nomeParticipanteSelecionado === null) {
        alert("Selecione alguém antes de votar.");
        return;
    }

    // Inicia a animação de carregamento.
mostrarCarregamentoVoto();

    // Monta os dados do voto.
    const dadosVoto = {
        tipo: "votoMaisProvavel",
        nome: "Lorran",
        nomeVotado: nomeParticipanteSelecionado
    };

    console.log("Enviando voto:", dadosVoto);

    // Envia o voto ao Google Apps Script.
    fetch(URL_SCRIPT_JOGO, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(dadosVoto)
    })
    .then(function() {

        console.log("Requisição enviada. Consultando resultado...");

        consultarResultadoAposVoto();

    })
    .catch(function(erro) {

        console.error("Erro ao enviar voto:", erro);
        alert("Não foi possível enviar o voto.");

    });

}


// =====================================
// CONSULTAR RESULTADO APÓS VOTAR
// =====================================

function consultarResultadoAposVoto() {

    window.receberResultadoVoto = function(dados) {

        console.log("Resultado atualizado:", dados);

        if (!dados.sucesso || !dados.maisProvavel) {
            console.error("Não foi possível consultar o resultado.");
            return;
        }

        // Atualiza o card com os votos reais.
        atualizarCardResultado(dados.maisProvavel.resultado);

        // Finaliza o carregamento.
        esconderCarregamentoVoto();

        // Exibe o card de resultado.
        mostrarResultado();

    };

    const script = document.createElement("script");

    script.src =
        URL_SCRIPT_JOGO +
        "?jogo=maisProvavel" +
        "&nome=Lorran" +
        "&callback=receberResultadoVoto";

    document.body.appendChild(script);

}


// =====================================
// EVENTO DO BOTÃO CONFIRMAR VOTO
// =====================================

btnConfirmarVoto.addEventListener("click", function() {

    enviarVoto();

});


// =====================================
// ATUALIZAR CARD DE RESULTADO
// =====================================

function atualizarCardResultado(resultado) {

    // Verifica se existem votos registrados.
    if (!resultado || resultado.length === 0) {

        fotoLider.src = "";
        nomeLider.textContent = "Aguardando votos...";
        porcentagemLider.textContent = "0%";

        return;
    }

    // O backend já organiza os participantes por quantidade de votos.
    const lider = resultado[0];

    // Soma todos os votos recebidos.
    const totalVotos = resultado.reduce(function(total, participante) {
        return total + participante.votos;
    }, 0);

    // Calcula a porcentagem do líder.
    const porcentagem = (lider.votos / totalVotos) * 100;

    // Procura a foto do participante pelo nome.
    const participante = participantes.find(function(item) {
        return item.nome === lider.nome;
    });

    // Atualiza a foto.
    fotoLider.src = participante ? participante.foto : "";
    fotoLider.alt = lider.nome;

    // Atualiza o nome.
    nomeLider.textContent = lider.nome;

    // Atualiza a porcentagem.
    porcentagemLider.textContent =
        porcentagem.toLocaleString("pt-BR", {
            maximumFractionDigits: 1
        }) + "%";

}

// =====================================
// CONTROLE DO CARREGAMENTO DO VOTO
// =====================================


// Controla o início da animação.
let inicioCarregamentoVoto = 0;


// =====================================
// MOSTRAR CARREGAMENTO
// =====================================

function mostrarCarregamentoVoto() {

    inicioCarregamentoVoto = Date.now();

    btnConfirmarVoto.disabled = true;

    iconeCarregando.hidden = false;
    iconeCarregando.style.display = "block";

    textoBotaoVoto.textContent = "Enviando voto...";

    btnConfirmarVoto.classList.add("carregando");

}


// =====================================
// ESCONDER CARREGAMENTO
// =====================================


function esconderCarregamentoVoto() {

    const tempoDecorrido = Date.now() - inicioCarregamentoVoto;

    const tempoRestante = Math.max(0, 800 - tempoDecorrido);

    setTimeout(function() {

        btnConfirmarVoto.disabled = false;

        iconeCarregando.hidden = true;
        iconeCarregando.style.display = "none";

        textoBotaoVoto.textContent = "Confirmar voto";

        btnConfirmarVoto.classList.remove("carregando");

    }, tempoRestante);

}

// =====================================
// VOLTAR PARA A CENTRAL GLPC
// =====================================

function voltarCentral() {
    window.location.href = "index.html";
}
