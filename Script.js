let sessaoAtual = "S1";
let assentoSelecionado = null;

let banco = JSON.parse(localStorage.getItem("mapaEspetaculo")) || {
    S1: {},
    S2: {}
};


const central = document.getElementById("central");
const esquerda = document.getElementById("esquerda");
const direita = document.getElementById("direita");

const modal = document.getElementById("modal");

const tituloModal = document.getElementById("tituloModal");

const nome = document.getElementById("nomeComprador");
const telefone = document.getElementById("telefoneComprador");
const status = document.getElementById("statusAssento");




function salvarBanco(){

    localStorage.setItem(
        "mapaEspetaculo",
        JSON.stringify(banco)
    );

}





function criarMapa(){

    central.innerHTML = "";
    esquerda.innerHTML = "";
    direita.innerHTML = "";


    let fileiras = "ABCDEFGHIJKLMN";

let numero = 1;


for(let letra of fileiras){

    for(let i=1;i<=14;i++){

        let id = letra + numero;

        criarAssento(id, central);

        numero++;

    }

}

    for(let i=1;i<=25;i++){

        criarAssento(
            "LE"+String(i).padStart(2,"0"),
            esquerda
        );

    }



    for(let i=1;i<=25;i++){

        criarAssento(
            "LD"+String(i).padStart(2,"0"),
            direita
        );

    }

}





function criarAssento(id,local){

    let cadeira = document.createElement("div");

    cadeira.className = "assento";

    cadeira.dataset.id = id;

    cadeira.innerHTML = id;


    atualizarCor(cadeira);


    cadeira.onclick = function(){

        abrirModal(id);

    };


    local.appendChild(cadeira);

}






function atualizarCor(cadeira){

    cadeira.classList.remove(
        "reservado",
        "vendido"
    );


    let id = cadeira.dataset.id;


    let dados = banco[sessaoAtual][id];


    if(dados){

        if(dados.status === "reservado"){

            cadeira.classList.add("reservado");

        }


        if(dados.status === "vendido"){

            cadeira.classList.add("vendido");

        }

    }

}





function atualizarMapa(){

    document
    .querySelectorAll(".assento")
    .forEach(function(cadeira){

        atualizarCor(cadeira);

    });

}





function abrirModal(id){

    assentoSelecionado = id;


    tituloModal.innerHTML =
    "Assento "+id;


    let dados = banco[sessaoAtual][id];


    if(dados){

        nome.value = dados.nome;
        telefone.value = dados.telefone;
        status.value = dados.status;

    }else{

        nome.value="";
        telefone.value="";
        status.value="disponivel";

    }


    modal.classList.add("ativo");

}




// Fechar modal

document.getElementById("fecharModal").onclick = function(){

    modal.classList.remove("ativo");

};




// Salvar assento

document.getElementById("salvarAssento").onclick = function(){


    banco[sessaoAtual][assentoSelecionado] = {

        nome: nome.value,

        telefone: telefone.value,

        status: status.value

    };


    salvarBanco();

    atualizarMapa();

    atualizarContadores();


    modal.classList.remove("ativo");


};







// Liberar assento

document.getElementById("liberarAssento").onclick = function(){


    delete banco[sessaoAtual][assentoSelecionado];


    salvarBanco();

    atualizarMapa();

    atualizarContadores();


    modal.classList.remove("ativo");


};







// Contadores

function atualizarContadores(){


    let disponiveis = 246;

    let reservados = 0;

    let vendidos = 0;



    Object.values(
        banco[sessaoAtual]
    )
    .forEach(function(assento){


        if(assento.status === "reservado"){

            reservados++;

            disponiveis--;

        }


        if(assento.status === "vendido"){

            vendidos++;

            disponiveis--;

        }


    });



    document.getElementById("disponiveis").innerHTML = disponiveis;

    document.getElementById("reservados").innerHTML = reservados;

    document.getElementById("vendidos").innerHTML = vendidos;


}








// Trocar sessão

document.querySelectorAll(".sessao")
.forEach(function(botao){


    botao.onclick = function(){


        document
        .querySelectorAll(".sessao")
        .forEach(function(b){

            b.classList.remove("ativa");

        });



        botao.classList.add("ativa");



        sessaoAtual = botao.dataset.sessao;



        atualizarMapa();

        atualizarContadores();


    };


});









// Pesquisa comprador


document.getElementById("pesquisa").oninput = function(){


    let texto = this.value.toLowerCase();


    let resultado =
    document.getElementById("resultadoPesquisa");


    resultado.innerHTML = "";



    if(texto === ""){

        return;

    }



    Object.entries(
        banco[sessaoAtual]
    )
    .forEach(function(item){


        let id = item[0];

        let dados = item[1];



        if(
            dados.nome.toLowerCase()
            .includes(texto)
        ){


            resultado.innerHTML +=

            "<p>"+
            id+
            " - "+
            dados.nome+
            " - "+
            dados.telefone+
            " ("+
            dados.status+
            ")</p>";


        }


    });


};









// Exportar CSV


document.getElementById("exportar").onclick = function(){


    let linhas = [

        [
            "Assento",
            "Nome",
            "Telefone",
            "Status",
            "Sessao"
        ]

    ];



    Object.entries(
        banco[sessaoAtual]
    )
    .forEach(function(item){


        let id = item[0];

        let dados = item[1];



        linhas.push([

            id,

            dados.nome,

            dados.telefone,

            dados.status,

            sessaoAtual

        ]);


    });



    let csv = linhas
    .map(function(linha){

        return linha.join(";");

    })
    .join("\n");



    let arquivo = new Blob(
        [csv],
        {
            type:"text/csv"
        }
    );



    let link = document.createElement("a");


    link.href =
    URL.createObjectURL(arquivo);



    link.download =
    "lista-"+sessaoAtual+".csv";



    link.click();


};






// Iniciar

criarMapa();

atualizarContadores();
