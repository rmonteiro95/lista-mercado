// Importa o framework Express para criar o servidor web
const express = require('express');

// Importa o módulo fs (file system) para operações com arquivos (para carregar os arquivos)
const fs = require('fs');

// Importa o módulo path para trabalhar com caminhos de arquivos (para identificar as pastas)
const path = require('path');

// Importa o módulo cors para permitir requisições de diferentes origens (aceitar requisições diferentes além do localhost)
const cors = require('cors');

// Cria uma instância da aplicação Express
const app = express();

// Define a porta onde o servidor irá rodar
const PORT = 3000;

// Habilita o CORS para todas as rotas da aplicação
// Vais estar sendo executado a cada requisição que for realizada
app.use(cors());

// Constrói o caminho completo para o arquivo quotes.json na pasta 'data'
const quotesPath = path.join(__dirname, 'data', 'quotes.json');

// Declara um array vazio que irá armazenar as citações
let quotes = [];

// Inicia um bloco try-catch para tratamento de erros
// é feito uma tentativa de ler esse arqiuvo
try {
  // Lê o arquivo quotes.json de forma síncrona e armazena o conteúdo como string
  const data = fs.readFileSync(quotesPath, 'utf8');
  //a resposta da leitura do arquivo é atribuido a lista quotes 
  // Converte a string JSON em um objeto JavaScript e armazena no array quotes
  quotes = JSON.parse(data);
} catch (err) {
  // Se houver erro na leitura ou parsing do arquivo, exibe a mensagem de erro
  console.error('Erro ao ler quotes.json:', err);
}

//ao acessar o localhost na pasta raiz, vai aparecer esta mensagem
// Define uma rota GET para a raiz ('/') que retorna uma mensagem simples
app.get('/', (req, res) => {
  // Envia uma resposta em texto informando que a API está funcionando
  res.send('API de lista-mercado em funcionamento!');
});

//ao acessar o localhost/quotes vai pegar uma citação aleatoria
// Define uma rota GET para '/quote' que retorna uma citação aleatória
//Na primeira vez que o app acessa o url, é feita uma requisição para aparecer uma citação aleatoria,
// depois é feito no a função onclick no botão para o usuario ver outra citação
app.get('/quote', (req, res) => {
  // Verifica se quotes é um array válido e se contém elementos
  if (!Array.isArray(quotes) || quotes.length === 0) {
    // Se não houver citações, retorna erro 500 com mensagem
    return res.status(500).json({ error: 'Nenhuma citação disponível.' });
  }
  
  // Retorna a citação selecionada em formato JSON
  res.json(quotes);
});

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  // Exibe mensagem no console confirmando que o servidor está rodando
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
