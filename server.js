const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

// --- Mock Data ---
const politicians = [
    {
        id: 1,
        name: 'João da Silva',
        photo: 'https://via.placeholder.com/150',
        office: 'Deputado Federal',
        city: 'Brasília',
        promises_completed_percent: 65,
        spending: 1250000.50,
        processes: [
            {
                title: 'Processo de Improbidade Administrativa',
                link: '#'
            }
        ],
        news: [
            {
                title: 'Deputado vota a favor da reforma da educação',
                source: 'Fonte Jornalística Verificada'
            }
        ]
    },
    {
        id: 2,
        name: 'Maria Oliveira',
        photo: 'https://via.placeholder.com/150',
        office: 'Vereadora',
        city: 'São Paulo',
        promises_completed_percent: 80,
        spending: 350000.75,
        processes: [],
        news: [
            {
                title: 'Vereadora propõe novo parque na zona leste',
                source: 'Fonte Oficial'
            }
        ]
    },
    {
        id: 3,
        name: 'Carlos Santos',
        photo: 'https://via.placeholder.com/150',
        office: 'Prefeito',
        city: 'Rio de Janeiro',
        promises_completed_percent: 45,
        spending: 5400000.00,
        processes: [
            {
                title: 'Investigação sobre contratos de obras públicas',
                link: '#'
            }
        ],
        news: []
    }
];

// --- API Endpoints ---
app.get('/api/politicians', (req, res) => {
    const { q } = req.query;
    if (q) {
        const query = q.toLowerCase();
        const results = politicians.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.office.toLowerCase().includes(query) ||
            p.city.toLowerCase().includes(query)
        );
        res.json(results);
    } else {
        res.json(politicians);
    }
});

// --- Static Files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Server ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
