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
        }
        return true;
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
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {
        let despesas = [];
        let id = localStorage.getItem('id');

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));

            if (despesa === null) {
                continue;
            }

            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisarRegistro(despesa) {
        let despesasFiltradas = [];
        despesasFiltradas = this.recuperarTodosRegistros();

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;
    }

    removeRegistro(id) {
        localStorage.removeItem(id);
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
        document.getElementById('modal_contente').innerHTML = 'Despesa cadastrada'
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

function somarValoresDespesas(despesas) {
    let soma = 0;
    despesas.forEach(function (despesa) {
        soma += parseFloat(despesa.valor);
    });
    return soma;
}

function carregaListaDespesa(despesas = Array()) {
    if (despesas.length == 0) {
        despesas = bd.recuperarTodosRegistros();
    }

    let total = document.getElementById('total');
    let listaDispesas = document.getElementById('listaDispesas');
    listaDispesas.innerHTML = '';

    despesas.forEach(function (d) {
        //criando as linhas 
        let linha = listaDispesas.insertRow();

        //criando as colunas e inserindo dados

        switch (d.tipo) {
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
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `despesa_${d.id}`;
        btn.onclick = function () {
            let id = this.id.replace('despesa_', '');
            bd.removeRegistro(id)
            setInterval(function () {
                location.reload();
            }, 1000);
        };
        linha.insertCell(4).append(btn);
    });

    const totalDespesas = somarValoresDespesas(despesas);
    total.innerHTML = "Total das despesas: " + totalDespesas;
}

function pesquisarDispesas() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisarRegistro(despesa);

    carregaListaDispesa(despesas);
}
