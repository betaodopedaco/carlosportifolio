const http = require('http');
const fs = require('fs');
const path = require('path');

// --- Dados ---
const newton_facts = [
    "Isaac Newton was born prematurely on Christmas Day, 1642.",
    "He developed the three laws of motion, which form the basis of classical mechanics.",
    "Newton discovered the law of universal gravitation, reportedly after seeing an apple fall from a tree.",
    "He was a Member of Parliament for Cambridge University.",
    "Newton invented the reflecting telescope, which uses mirrors instead of lenses to form an image.",
    "He was a warden of the Royal Mint and took his duties very seriously, prosecuting counterfeiters.",
    "His work 'Philosophiæ Naturalis Principia Mathematica' is one of the most important single works in the history of science.",
    "Newton also made significant contributions to the field of optics, discovering that white light is composed of a spectrum of colors."
];

// --- Funções Auxiliares ---
function getRandomFact() {
    const randomIndex = Math.floor(Math.random() * newton_facts.length);
    return newton_facts[randomIndex];
}

function getMimeType(filePath) {
    const ext = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

function serveStaticFile(filePath, res) {
    // Security: prevent path traversal attacks
    const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(__dirname, 'public', safePath);

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found: ' + filePath);
        } else {
            res.writeHead(200, { 'Content-Type': getMimeType(fullPath) });
            res.end(data);
        }
    });
}

// --- Lógica do Servidor ---
const server = http.createServer((req, res) => {
    const { method, url } = req;
    console.log(`Request: ${method} ${url}`);

    // Rota da API para fatos
    if (url === '/api/facts' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ fact: getRandomFact() }));

    // Rota da API para gravidade
    } else if (url === '/api/gravity' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { m1, m2, distance } = JSON.parse(body);

                if (typeof m1 !== 'number' || typeof m2 !== 'number' || typeof distance !== 'number') {
                     res.writeHead(400, { 'Content-Type': 'application/json' });
                     return res.end(JSON.stringify({ error: 'All inputs must be numbers.' }));
                }
                if (distance <= 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Distance must be a positive value.' }));
                }

                const G = 6.67430e-11; // Constante gravitacional
                const force = G * (m1 * m2) / (distance * distance);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ force }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON or missing parameters.' }));
            }
        });

    // Servir arquivos estáticos
    } else if (method === 'GET') {
        const filePath = url === '/' ? 'index.html' : url;
        serveStaticFile(filePath, res);

    // Rota não encontrada
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const port = 8080;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log('Serving files from the "public" directory.');
    console.log('Available API endpoints: GET /api/facts, POST /api/gravity');
});
