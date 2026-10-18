
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json())
const quotesPath = path.join(__dirname, 'data', 'quotes.json');
let quotes = [];

try {
  const data = fs.readFileSync(quotesPath, 'utf8');
  quotes = JSON.parse(data);
} catch (err) {
  console.error('Erro ao ler quotes.json:', err);
}

app.get('/', (req, res) => {
  res.send('API de lista-mercado em funcionamento!');
});

app.get('/quote', (req, res) => {
  // if (!Array.isArray(quotes) || quotes.length === 0) {
  //   return res.status(500).json({ error: 'Nenhuma citação disponível.' });
  // }  
  res.json(quotes);
});

app.post('/quote', (req, res) =>{
  const novoProduto = req.body
  quotes.push(novoProduto)
  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8')
  res.json(novoProduto)
})

app.delete('/quote/:id', (req, res) =>{
  const idProdutoDeletado = Number(req.params.id)
  quotes = quotes.filter(prod => prod.id !== idProdutoDeletado)
  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8')
})

//No Express, a ordem das rotas importa porque ele executa a primeira que corresponde de cima para baixo, exigindo que rotas específicas fiquem sempre acima das genéricas.
app.patch('/quote/verificar/:id', (req, res)=>{
  const idProdutoVerificado = Number(req.params.id)
  const prodVeri = req.body
  quotes = quotes.map(produto => produto.id === idProdutoVerificado ? {...produto, ...prodVeri} : produto)
  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8')
  res.json(prodVeri)
})

app.patch('/quote/:id', (req, res) =>{
  const idProdutoEditado = Number(req.params.id)
  const prodEdit = req.body
  quotes = quotes.map(produto => produto.id === idProdutoEditado ? {...produto, ...prodEdit} : produto)
  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8')
  res.json(prodEdit)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
