class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == null || this[i] == "") {
                return false;
            }
        } return true;
    }
}
class Bd {
    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }
    getProximoId() {
        let proximoid = localStorage.getItem('id');
        return parseInt(proximoid) + 1;
    }
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {

        let despesas = [];

        let id = localStorage.getItem('id');

        //recuperar Despesas Cadastradas
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }
            
            despesas.push(despesa);
        }
        return despesas;
    }
}

let bd = new Bd();

function cadastrarDespesa() {
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    if (despesa.validarDados()) {
        bd.gravar(despesa);

        document.getElementById('modal_titulo').innerHTML = 'Registro Inserido com Sucesso'
        document.getElementById('modal_div').className = 'modal-header text-success'
        document.getElementById('modal_contente').innerHTML = 'Dispesa cadastrada'
        $('#modalInformacoes').modal('show')
        setInterval(function () {
            location.reload();
        }, 1500);

    } else {
        //informar erro

        document.getElementById('modal_titulo').innerHTML = 'Erro ao inserir Dados'
        document.getElementById('modal_div').className = 'modal-header text-danger'
        document.getElementById('modal_contente').innerHTML = 'Existem campos a serem preenchidos'
        $('#modalInformacoes').modal('show')
    }

}


function carregaListaDespesa() {
    let despesas = Array();
    despesas = bd.recuperarTodosRegistros();

    //selecionando o Tbody 
    let listaDispesas = document.getElementById('listaDispesas')

    /*     <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
    */

    despesas.forEach(function(d) {
       //criando as linhas 
       let linha =  listaDispesas.insertRow();

       //criando as colunas e inserido dados

       switch(d.tipo) {
            case '1':
                d.tipo = 'Alimentação';
                break;
            case '2':
                d.tipo = 'Educação';
                break;
            case '3':  
                d.tipo = 'Lazer';
                break;
            case '4':
                d.tipo = 'Saúde';
                break;
            case '5':
                d.tipo = 'Transporte';
                break;
            case '6': 
                d.tipo = 'Outros'
                break;
       }

       linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
       
       linha.insertCell(1).innerHTML = `${d.tipo}`

       linha.insertCell(2).innerHTML = `${d.descricao}`
       linha.insertCell(3).innerHTML = `${d.valor}`

    });
    
}



