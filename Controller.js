const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', function(req, res){
    res.send('Olá, mundo!');
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

app.get('/produtos', function(req, res){
    res.send('Estes são os nossos produtos:');
});

let port = process.env.PORT || 3001;//3001 - backend / 3000 - frontend

app.listen(port, (req,res) => {
    console.log('Servidor ativo: http://localhost:3001');
});