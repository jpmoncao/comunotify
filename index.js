import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { uuid } from 'uuidv4';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Views
app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/chat', (req, res) => res.sendFile('../chat.html'));

// Endpoints
app.post('/login', (req, res) => {
    let { name, group } = req.body;

    switch (group) {
        case 1:
            group = 'telao';
            break;
        case 2:
            group = 'salinha';
            break;
        case 3:
            group = 'estacionamento';
            break;

        default:
            group = null;
            break;
    }

    if (group)
        return res.status(201).json({
            message: 'Login efetuado com sucesso!',
            data: { name, group }
        });

    return res.status(500).json({
        message: 'Erro ao efetuar login!',
        data: null
    });
})

io.on('connection', (socket) => {
    io.emit('count', io.engine.clientsCount);
    io.engine.generateId(req => uuid.v4());

    socket.on('message', (message) => {
        io.send({ message, id: socket.id });
    })

    socket.on('disconnect', () => {
        io.emit('count', io.engine.clientsCount);
    })
});

server.listen(5000, () => console.log('Server is running!'));
