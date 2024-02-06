// Servidor web socket
const socket = io("ws://localhost:5000");

// Variáveis
let userId;

// Elementos
const messageContainer = document.getElementById('messages');
const form = document.querySelector('form');
const input = document.getElementById('m');
const countPerson = document.getElementById('count');

// Pega o ID do client
socket.on('connect', () => userId = socket.id)

// Verifica quantas pessoas estão online
socket.on('count', (count) => {
    countPerson.textContent = count + ' pessoa(s) ativa(s)'
})

// Quando receber mensage,
socket.on('message', ({ message, id }) => {
    let messageItem = document.createElement('li');

    if (id == userId)
        messageItem.classList.add('my-message');

    messageItem.textContent = message;
    messageContainer.appendChild(messageItem);
    window.scrollTo(0, document.body.scrollHeight);
});

// Quando enviar mensagem
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('message', input.value);
        input.value = '';
    }
});
