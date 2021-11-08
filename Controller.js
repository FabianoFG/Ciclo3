const express = require('express');
const cors = require('cors');

const { Sequelize } = require('./models');

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemProduto;

app.get('/', function (req, res) {
    res.send('Olá, mundo!');
});

//CLIENTE
app.post('/clientes/inserir', async (req, res) => {//INSERIR
    await cliente.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Cliente cadastrado com sucesso!"
        })
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        })
    });
});

app.get('/numeroclientes', async (req, res) => {//CONTA O NÚMERO DE CLIENTES POR ID NO CÓDIGO
    await cliente.count('id')
        .then(function (clientes) {
            res.json({ clientes })
        });
});

app.get('/cliente/:id', async (req, res) => {//LISTAR / ID NA ROTA
    await cliente.findByPk(req.params.id)
        .then(cli => {
            return res.json({
                error: false,
                cli
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar!"
            })
        });
});

app.get('/listaclientes', async (req, res) => {//LISTAR / TODOS
    await cliente.findAll({
        raw: true
    }).then(function (clientes) {
        res.json({ clientes })
    });
});

app.get('/clientes/:id/', async (req, res) => {//LISTAR / UM / ID NA ROTA

    await cliente.findByPk(req.params.id)
        .then(cli => {
            return res.json({ cli });
        });
});

app.put('/clientes/:id/editar', async (req, res) => {//EDITAR / ID NA ROTA
    await cliente.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(function (erro) {
            return res.json({
                erro: false,
                message: "O cliente foi alterado com sucesso!"
            });
        })
        .catch(function (erro) {
            return res.status(400).json({
                erro: true,
                message: "Não foi possível alterar!"
            });
        });
});

app.delete('/excluircliente/:id', async (req, res) => {//EXCLUIR
    cliente.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Cliente excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente!"
        });
    });
});

app.get('/listaclientes', async (rea, res) => {//LISTAR / DATA DE CRIAÇÃO
    await cliente.findAll({
        order: [['createdAt', 'ASC']]
    }).then(function (clientes) {
        res.json({ clientes })
    });
});

app.get('/cliente/:id/pedidos', async (req, res) => {//FRONTEND
    await pedido.findAll({
        where: { ClienteId: req.params.id }
    })
        .then(ped => {
            return res.json({
                error: false,
                ped
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar!"
            })
        });
});

app.get('/cliente/:id', async (req, res) => {//OBTER CLIENTE FRONT END
    await cliente.findByPk(req.params.id)
        .then(cli => {
            return res.json({
                error: false,
                cli
            });
        })
        .catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar-se a API!(controller)"
            });
        });
});

app.put('/cliente/:id', async (req, res) => {//EDITAR CLIENTE FRONTEND
    const cli = {
        id: req.params.id,
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        clienteDesde: req.body.clienteDesde
    };

    if(!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe!'
        });
    };
    await cliente.update(cli, {
        where: {id: req.params.id}
    }).then(clie => {
        return res.json({
            error: false,
            message: "Cliente alterado com sucesso!",
            clie
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        });     
    });
});

app.put('/cliente/:id/pedido', async (req, res) => {//FRONTEND
    const ped = {
        data: req.body.data,
        ClienteId: req.params.id
    }

    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe!'
        });
    };

    await pedido.update(ped, {
        where: Sequelize.and({ ClienteId: req.params.id },
            { id: req.body.id })
    })
        .then(pedidos => {
            return res.json({
                error: false,
                message: 'Pedido alterado com sucesso!',
                pedidos
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar!"
            })
        });
});

//SERVIÇO
app.post('/servicos/inserir', async (req, res) => {//este bloco cria novo serviço no model // async exige resposta
    await servico.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        })
    });
});

app.get('/listaservicos', async (rea, res) => {//LISTAR / ORDEM CRESCENTE DE ID
    await servico.findAll({
        // raw: true
        order: [['id', 'ASC']]
    }).then(function (servicos) {
        res.json({ servicos })
    });
});

app.get('/ofertaservicos', async (req, res) => {//CONTAR
    await servico.count('id')
        .then(function (servicos) {
            res.json({ servicos })
        });
});

app.get('/servico/', async (req, res) => {//LISTAR
    await servico.findByPk(req.params.id)//req -> :id passado na rota
        .then(serv => {
            return res.json({
                error: false,
                serv
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar!"
            })
        });
});

app.get('/servico/:id/pedidos', async (req, res) => {//FRONTEND
    await itempedido.findAll({
        where: { ServicoId: req.params.id }
    })
        .then(item => {
            return res.json({
                error: false,
                item
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar!"
            })
        });
});

app.put('/atualizaservico', async (req, res) => {//EDITAR
    await servico.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço!"
        });
    });
});

app.delete('/excluirservico/:id', async (req, res) => {//excluir
    await servico.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Serviço excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o serviço!"
        });
    });
});

app.get('/listaservicos', async (req, res) => {//LISTAR / TODOS FRONTEND
    await servico.findAll({
        raw: true
    }).then(function (servicos) {
        res.json({ servicos })
    });
});

app.get('/servico/:id', async (req, res) => {//OBTER FRONT END
    await servico.findByPk(req.params.id)
        .then(serv => {
            return res.json({
                error: false,
                serv
            });
        })
        .catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar-se a API!(controller)"
            });
        });
});

app.put('/servico/:id', async (req, res) => {//EDITAR FRONTEND
    const serv = {
        id: req.params.id,
        nome: req.body.nome,
        descricao: req.body.descricao
    };

    if(!await servico.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Serviço não existe!'
        });
    };
    await servico.update(serv, {
        where: {id: req.params.id}
    }).then(serv => {
        return res.json({
            error: false,
            message: "Serviço alterado com sucesso!",
            serv
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        });     
    });
});
//PEDIDO
app.post('/pedidos/inserir', async (req, res) => {//INSERIR
    await pedido.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Pedido realizado com sucesso!"
        })
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        })
    });
});

app.get('/pedido/listar', async (rea, res) => {//LISTAR / ORDEM DE CRIAÇÃO
    await pedido.findAll({
        order: [['createdAt', 'ASC']]
    }).then(function (pedidos) {
        res.json({ pedidos })
    });
});

app.get('/listapedidos', async (req, res) => {//LISTAR / TODOS FRONTEND
    await pedido.findAll({
        raw: true
    }).then(function (pedidos) {
        res.json({ pedidos })
    });
});

app.get('/numeropedidos', async (req, res) => {//CONTAR
    await pedido.count('id')
        .then(function (pedidos) {
            res.json({ pedidos })
        });
});

app.get('/pedidos/:id', async (req, res) => {//OBTER PEDIDO
    await pedido.findByPk(req.params.id)
        .then(pedido => {
            return res.json({
                error: false,
                pedido
            });
        })
        .catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar-se a API!(controller)"
            });
        });
});

app.get('/pedidos/:id', async (req, res) => {//LISTAR / ID NA ROTA
    await pedido.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(function () {
            return res.json({
                error: false,
                message: "Pedido alterado com sucesso!"
            })
        })
        .catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Não foi possível alterar!"
            })
        });
});

app.put('/pedidos/:id', async (req, res) => {//EDITAR
    const ped = {
        id: req.params.id,
        ClienteId: req.body.ClienteId,
        data: req.body.data
    };

    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe!'
        });
    };
    await pedido.update(ped, {
        where: Sequelize.and({ClienteId: req.body.ClienteId},
            {id: req.params.id})
    }).then(ped => {
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!",
            ped
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        });     
    });
});

app.delete('/excluirpedido/:id', async (req, res) => {//EXCLUIR FRONTEND
    pedido.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Pedido excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o pedido!"
        });
    });
});

app.get('/pedido/:id', async (req, res) => {//OBTER FRONT END
    await pedido.findByPk(req.params.id)
        .then(ped => {
            return res.json({
                error: false,
                ped
            });
        })
        .catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar-se a API!(controller)"
            });
        });
});

app.put('/pedido/:id', async (req, res) => {//EDITAR FRONTEND
    const ped = {
        id: req.params.id,
        data: req.body.data,
        ClienteId: req.body.ClienteId
    };

    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'O pedido não existe!'
        });
    };
    await pedido.update(ped, {
        where: {id: req.params.id}
    }).then(ped => {
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!",
            ped
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        });     
    });
});
//ITEMPEDIDO
app.post('/itempedidos', async (req, res) => {//INSERIR
    await itempedido.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Item inserido com sucesso!"
        })
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        })
    });
});

app.put('/pedidos/:id/editaritem', async (req, res) => {//EDITAR
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: 'O pedido não foi encontrado!'
        });
    };

    if (!await servico.findByPk(req.body.ServicoId)) {
        return res.status(400).json({
            error: true,
            message: 'O serviço não foi encontrado!'
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ ServicoId: req.body.ServicoId }, { PedidoId: req.params.id })
    }).then(function (itens) {
        return res.json({
            error: false,
            message: "O pedido foi alterado com sucesso!",
            itens
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        });
    });
});

//COMPRA
app.post('/compras/inserir', async (req, res) => {//inserir
    await compra.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Compra realizada com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        });
    });
});

app.get('/compras/listar', async (req, res) => {//listar
    await compra.findAll({
        order: [['createdAt', 'ASC']]
    }).then(function (compras) {
        return res.json({ compras });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        });
    });
});

app.put('/compras/:id/editar', async (req, res) => {//editar
    await compra.update(req.body, {
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Compra alterada com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração da compra!"
        });
    });
});

app.put('/compras/:id/editaritem', async (req, res) => {//editar
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.quantidade
    };

    if (!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Compra não encontrada!"
        });
    };

    if (!await produto.findByPk(req.body.Produtoid)) {
        return res.status(400).json({
            error: true,
            message: "Produto não encontrado!"
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and(
            { ProdutoId: req.body.ProdutoId },
            { CompraId: req.params.id }
        )
    }).then(function (itens) {
        return res.json({
            error: false,
            message: "A compra foi alterada com sucesso!",
            itens
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar a compra!"
        });
    });
});

app.get('/compras/:id/excluir', async (req, res) => {//excluir
    await compra.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Compra excluída com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir a compra!"
        });
    });
});

app.delete('/excluircompra/:id', async (req, res) => {//excluir FRONTEND
    await compra.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Compra excluída com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o compra!"
        });
    });
});

app.get('/listacompras', async (req, res) => {//LISTAR / TODOS FRONTEND
    await compra.findAll({
        raw: true
    }).then(function (compras) {
        res.json({ compras })
    });
});

app.get('/compra/:id', async (req, res) => {//OBTER FRONT END
    await compra.findByPk(req.params.id)
        .then(comp => {
            return res.json({
                error: false,
                comp
            });
        })
        .catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar-se a API!(controller)"
            });
        });
});

app.put('/compra/:id', async (req, res) => {//EDITAR FRONTEND
    const comp = {
        id: req.params.id,
        data: req.body.data,
        ClienteId: req.body.ClienteId
    };

    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'A compra não existe!'
        });
    };
    await compra.update(comp, {
        where: {id: req.params.id}
    }).then(comp => {
        return res.json({
            error: false,
            message: "Compra alterada com sucesso!",
            comp
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        });     
    });
});
//PRODUTO
app.post('/produtos/inserir', async (req, res) => {//inserir
    await produto.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Produto cadastrado com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        });
    });
});

app.get('/produtos/listar', async (req, res) => {//listar
    await produto.findAll({
        order: [['createdAt', 'ASC']]
    }).then(function (produtos) {
        return res.json({ produtos });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        });
    });
});

app.put('/produtos/:id/editar', async (req, res) => {//editar
    await Produto.update(req.body, {
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Produto alterado com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do produto!"
        });
    });
});

app.delete('/excluirproduto/:id', async (req, res) => {//excluir
    await produto.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Produto excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o produto!"
        });
    });
});

app.get('/listaprodutos', async (req, res) => {//LISTAR / TODOS FRONTEND
    await produto.findAll({
        raw: true
    }).then(function (produtos) {
        res.json({ produtos })
    });
});

app.get('/produto/:id', async (req, res) => {//OBTER FRONT END
    await produto.findByPk(req.params.id)
        .then(prod => {
            return res.json({
                error: false,
                prod
            });
        })
        .catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possível conectar-se a API!(controller)"
            });
        });
});

app.put('/produto/:id', async (req, res) => {//EDITAR CLIENTE FRONTEND
    const prod = {
        id: req.params.id,
        nome: req.body.nome,
        descricao: req.body.descricao
    };

    if(!await produto.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Produto não existe!'
        });
    };
    await produto.update(prod, {
        where: {id: req.params.id}
    }).then(pro => {
        return res.json({
            error: false,
            message: "Produto alterado com sucesso!",
            pro
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar!"
        });     
    });
});
//ITEMCOMPRA
app.post('/itemcompras/inserir', async (req, res) => {//inserir
    await itemcompra.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Item inserido com sucesso com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        });
    });
});

app.get('/itemcompras/listar', async (req, res) => {//listar
    await itemcompra.findAll({
        order: [['createdAt', 'ASC']]
    }).then(function (itemcompras) {
        return res.json({ itemcompras });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar!"
        });
    });
});

app.get('/itemcompras/:clienteid/:produtoid/excluir', async (req, res) => {//excluir

    if (!await compra.findByPk(req.params.compraid)) {
        return res.status(400).json({
            error: true,
            message: "Compra não encontrada!"
        });
    };

    if (!await produto.findByPk(req.params.produtoid)) {
        return res.status(400).json({
            error: true,
            message: "Produto não encontrado!"
        });
    };

    await itemcompra.destroy({
        where: Sequelize.and(
            { CompraId: req.params.compraid },
            { ProdutoId: req.params.produtoid }
        )
    }).then(function () {
        return res.json({
            error: false,
            message: "Item excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o item!"
        });
    });
});
//AJUDA

app.get('/clientes', function (req, res) {
    res.send('Seja bem-vindo(a) a ServicesTI');
});

app.get('/servicos', function (req, res) {
    res.send('Estes são os nossos serviços');
});

app.get('/pedidos', function (req, res) {
    res.send('Faça seus pedidos por aqui');
});

app.get('/itempedidos', function (req, res) {
    res.send('Novo serviço solicidado');
});

app.get('/compras', function (req, res) {
    res.send('Faça sua compra por aqui');
});

app.get('/produtos', function (req, res) {
    res.send('Estes são os nossos prdodutos');
});

app.get('/itemcompras', function (req, res) {
    res.send('Novo produto solicitado');
});

let port = process.env.PORT || 3001;//3001 - backend / 3000 - frontend

app.listen(port, (req, res) => {
    console.log('Servidor ativo: http://localhost:3001');
});