import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { uuid } from 'uuidv4';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile('index.html'))

io.on('connection', (socket) => {
    console.log(socket.id + ' connected');
    io.emit('count', io.engine.clientsCount);
    io.engine.generateId(req => uuid.v4());

    socket.on('message', (message) => {
        io.send(message);
    })

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
        io.emit('count', io.engine.clientsCount);
    })
});

server.listen(5000);
