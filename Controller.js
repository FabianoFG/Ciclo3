const express = require('express');
const cors = require('cors');

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

// app.post('/pedidos', async(req, res) => {
//     await pedido.create(req.body[0]);
//     await itempedido.create(req.body[1]);
//     await itempedido.create(req.body[2]);
//     then(function(){
//         return res.json({
//             error: false,
//             message: "Pedido realizado com sucesso!"
//         })
//     }).catch(function(erro){
//         return res.status(400).json({
//             error: true,
//             message: "Não foi possível conectar!"
//         })
//     });
// });