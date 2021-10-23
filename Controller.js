const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/', function(req, res){
    res.send('Olá, mundo!');
});
//CRIA NOVO SERVIÇO
app.post('/servicos', async(req, res) => {//este bloco cria novo serviço no model // async exige resposta
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        })
    });
});
//CRIA NOVO CLIENTE
app.post('/clientes', async(req, res) => {
        await cliente.create(
            req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Cliente cadastrado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        })
    });
});
//CRIA NOVO PEDIDO
app.post('/pedidos', async(req, res) => {
    await pedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Pedido realizado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        })
    });
});
//CRIA NOVOS ITENS DE PEDIDO
app.post('/itempedidos', async(req, res) => {
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item inserido com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        })
    });
});
//LISTA SERVIÇOS EM ORDEM ALFABÉTICA
app.get('/listaservicos', async(rea,res) => {
    await servico.findAll({
        // raw: true
        order: [['nome','ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});
//CONTA SERVIÇOS
app.get('/ofertaservicos', async(req,res) => {
    await servico.count('id')
    .then(function(servicos){
        res.json({servicos})
    });
});
//COLSULTA SERVIÇO POR SEU ID NA ROTA
app.get('/servico/:id', async(req,res) => {
    await servico.findByPk(req.params.id)//req -> :id passado na rota
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar!"
        })
    });
});
//LISTA CLIENTES POR DATA DE CRIAÇÃO
// app.get('/listaclientes', async(rea,res) => {
//     await cliente.findAll({
//         order: [['createdAt','ASC']]
//     }).then(function(clientes){
//         res.json({clientes})
//     });
// });
//CONTA O NÚMERO DE CLIENTES POR ID NO CÓDIGO
app.get('/numeroclientes', async(req,res) => {
    await cliente.count('id')
    .then(function(clientes){
        res.json({clientes})
    });
});
//CONSULTA CLIENTE PELO ID NA ROTA
app.get('/cliente/:id', async(req,res) => {
    await cliente.findByPk(req.params.id)
    .then(cli =>{
        return res.json({
            error: false,
            cli
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar!"
        })
    });
});
//LISTA OS PEDIDOS
app.get('/listapedidos', async(rea,res) => {
    await pedido.findAll({
        order: [['createdAt','ASC']]
    }).then(function(pedidos){
        res.json({pedidos})
    });
});
//LISTA OS CLIENTES
app.get('/listaclientes', async(req,res) => {
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});
//CONTA O NÚMERO DE PEDIDOS
app.get('/numeropedidos', async(req,res) => {
    await pedido.count('id')
    .then(function(pedidos){
        res.json({pedidos})
    });
});
//ATUALIZA SERVIÇO PELO ID NO CORPO
app.put('/atualizaservico', async(req,res) => {
    await servico.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço!"
        });
    });
});
//COLSULTA PEDIDO, CLIENTE E ITEMS ASSOCIADOS PELO SEU ID NA ROTA
app.get('/pedidos/:id', async(req,res) => {
    await pedido.findByPk(req.params.id, {include: [{all: true}]})
    .then(ped => {
        return res.json({ped});
    });
});
//EDITA PEDIDOS POR SEU ID NA ROTA
app.put('/pedidos/:id/editarpedido', async(req,res) => {
    await pedido.update(req.body, {where: {
        id: req.params.id
    }})
    .then(function(){
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!" 
        })
    })
    .catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        })
    });
});
//EDITA ITENS PELO SEU ID DO PEDIDO NA ROTA
app.put('/pedidos/:id/editaritem', async(req,res) => {
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'O pedido não foi encontrado!'
        });
    };

    if(!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: 'O serviço não foi encontrado!'
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId}, {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "O pedido foi alterado com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        });
    });
});
//LISTAR PEDIDOS DO CLIENTE PELO ID NA ROTA
app.get('/clientes/:id/consultarpedido', async(req,res) => {
    await cliente.findByPk(req.params.id, {include: [{all: true}]})
    .then(cli => {
        return res.json({cli});
    });
});
//EDITAR PEDIDOS DO CLIENTE PELO ID NA ROTA

//CONSULTAR CLIENTE PELO ID NA ROTA
app.get('/clientes/:id/', async(req,res) => {
    await cliente.findByPk(req.params.id)
    .then(cli => {
        return res.json({cli});
    });
});
//EDITAR CLIENTE PELO ID NA ROTA
app.put('/clientes/:id/editarcliente', async(req,res) => {
    await cliente.update(req.body, {where: {
        id: req.params.id
    }})
    .then(function(erro){
        return res.json({
            erro: false,
            message: "O cliente foi alterado com sucesso!"
        });
    })
    .catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Não foi possível alterar!"
        });
    });
});
//EXCLUIR CLIENTE
app.get('/excluircliente/:id', async(req,res) => {
    cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente!"
        });
    });
});

app.get('/clientes', function(req, res){
    res.send('Seja bem-vindo(a) a ServicesTI');
});

app.get('/servicos', function(req, res){
    res.send('Estes são os nossos serviços');
});

app.get('/pedidos', function(req, res){
    res.send('Faça seus pedidos por aqui');
});

app.get('/itempedidos', function(req, res){
    res.send('Novo serviço solicidado');
});

let port = process.env.PORT || 3001;//3001 - backend / 3000 - frontend

app.listen(port, (req,res) => {
    console.log('Servidor ativo: http://localhost:3001');
});