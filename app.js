// Importando as dependências necessárias
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');
const cors = require('cors'); // Importando o CORS

// Configuração do app Express
const app = express();
const PORT = 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para analisar requisições JSON
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Certifique-se de que o index.html está em uma pasta chamada "public"

// Configuração do cliente PostgreSQL
const client = new Client({
    host: 'pg-278b8b8f-fl4sh-cbdb.h.aivencloud.com', // Altere para o seu host
    port: 27783, // Altere para a porta que você está usando
    database: 'defaultdb', // Nome do seu banco de dados
    user: 'avnadmin', // Nome de usuário
    password: 'AVNS_YTUHLeMD2QqdpF4fP-U', // Senha
    ssl: {
        rejectUnauthorized: false // Ignorar problemas de certificados SSL
    }
});

// Conectar ao banco de dados
client.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados PostgreSQL');
    }
});

// Função para obter o IP do cliente
const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
};

// Rota para gravar dados no banco de dados
app.post('/cadastrar', (req, res) => {
    const { nome, email, idade, numero, grupo, motivo } = req.body;
    const ip = getClientIp(req); // Obtém o IP do cliente
    console.log('IP do cliente:', ip); // Adicionando log para verificar o IP

    const query = `
        INSERT INTO usuarios (nome, email, idade, numero, ip, grupo, motivo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [nome, email, idade, numero, ip, grupo, motivo];

    client.query(query, values, (error, results) => {
        if (error) {
            console.error('Erro ao gravar dados:', error.message);
            return res.status(500).json({ error: 'Erro ao gravar dados' });
        }
        res.status(201).json({ message: 'Dados gravados com sucesso' });
    });
});

// Rota para buscar todos os usuários
app.get('/api/dados', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    
    client.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar dados:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar dados' });
        }
        res.status(200).json(results.rows);
    });
});

// Rota para atualizar o status do usuário
app.post('/api/update', (req, res) => {
    const { nome, status } = req.body;
    const ip = getClientIp(req); // Obtém o IP do cliente

    const query = 'UPDATE usuarios SET status = $1, ip = $2 WHERE nome = $3'; // Atualiza o IP junto com o status
    const values = [status, ip, nome];

    client.query(query, values, (error, results) => {
        if (error) {
            console.error('Erro ao atualizar o status:', error.message);
            return res.status(500).json({ error: 'Erro ao atualizar o status' });
        }
        res.status(200).json({ message: `Status de "${nome}" atualizado para "${status}"` });
    });
});

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Altere se o index.html estiver em outra pasta
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
