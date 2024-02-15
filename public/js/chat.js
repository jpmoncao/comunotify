if (!localStorage.getItem('user'))
    location.href = '/';

// Servidor web socket
const socket = io("ws://localhost:5000");

// Variáveis
let userId;
let user;

// Elementos
const messageContainer = document.getElementById('messages');
const form = document.querySelector('form');
const input = document.getElementById('m');
const countPerson = document.getElementById('count');

// Pega o ID do client
socket.on('connect', () => {
    user = JSON.parse(localStorage.getItem('user'));

    if (!localStorage.getItem('id'))
        socket.emit('enter', user);
    else
        userId = crypto.randomUUID();

    socket.emit('register', userId);

    localStorage.setItem('id', userId);
})

socket.on('hasEnter', ({ user, id }) => {
    const alerta = document.querySelector('#alerta');
    if (userId != id) {
        alerta.textContent = `${user.name}(${user.group}) entrou no chat!`;
        alerta.classList.remove('d-none');

        setTimeout(() => {
            alerta.classList.add('d-none')
        }, 5000);
    }
})

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

function exit() {
    localStorage.clear();
    location.href = '/';
}
