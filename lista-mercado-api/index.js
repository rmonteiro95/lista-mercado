
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json())
//DEFINE O CAMINHO PARA A BASE DE DADOS NO ARQUIVO JSON
const listaPath = path.join(__dirname, 'data', 'quotes.json');
let produtos = [];
// TENTA LER O ARQUIVO JSON DE FORMA SINCRONA E CONVERTE O CONTEUDO PARA A O OBJETO
try {
  const data = fs.readFileSync(listaPath, 'utf8');
  produtos = JSON.parse(data);
} catch (err) {
  console.error('Erro ao ler quotes.json:', err);
}

app.get('/', (req, res) => {
  res.send('API de lista-mercado em funcionamento!');
});

//METODO PARA RETORNAR DO SERVIDOR A LISTA QUE ESTÁ NO ARQUIVO JSON
app.get('/produto', (req, res) => {
  res.json(produtos);
});

app.post('/produto', (req, res) =>{
  const novoProduto = req.body
  produtos.push(novoProduto)
  fs.writeFileSync(listaPath, JSON.stringify(produtos, null, 2), 'utf8')
  res.json(novoProduto)
})

app.delete('/produto/:id', (req, res) =>{
  const idProdutoDeletado = Number(req.params.id)
  produtos = produtos.filter(prod => prod.id !== idProdutoDeletado)
  fs.writeFileSync(listaPath, JSON.stringify(produtos, null, 2), 'utf8')
  //RETORNA SUCESSO (204 NO CONTENT) E ENCERRA A RESPOTA SEM ENVIAR DADOS
  res.status(204).end()
})

//NO EXPRESS ROTAS ESPECIFICAS DEVEM FICAR ACIMA DAS GENERICAS
app.patch('/produto/verificar/:id', (req, res)=>{
  const idProdutoVerificado = Number(req.params.id)
  const prodVeri = req.body
  produtos = produtos.map(produto => produto.id === idProdutoVerificado ? {...produto, ...prodVeri} : produto)
  fs.writeFileSync(listaPath, JSON.stringify(produtos, null, 2), 'utf8')
  res.json(prodVeri)
})

app.patch('/produto/:id', (req, res) =>{
  const idProdutoEditado = Number(req.params.id)
  const prodEdit = req.body
  produtos = produtos.map(produto => produto.id === idProdutoEditado ? {...produto, ...prodEdit} : produto)
  fs.writeFileSync(listaPath, JSON.stringify(produtos, null, 2), 'utf8')
  res.json(prodEdit)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
