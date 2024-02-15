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
const countPerson = document.getElementById('count');

// Pega o ID do client
socket.on('connect', () => {
    user = JSON.parse(localStorage.getItem('user'));

    showFormGroup(user.group);

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
socket.on('message', ({ title, message, id }) => {
    let messageItem = document.createElement('li');
    let messageTitle = document.createElement('h6');
    let messageText = document.createElement('p');

    if (id == userId)
        messageItem.classList.add('my-message');

    messageTitle.textContent = title;
    messageItem.appendChild(messageTitle);
    messageText.textContent = message;
    messageItem.appendChild(messageText);

    messageContainer.appendChild(messageItem);
    window.scrollTo(0, document.body.scrollHeight);
});

// Quando enviar mensagem
form.addEventListener('submit', function (e) {
    e.preventDefault();

    let data = {};

    switch (user.group) {
        case 'telao':
            data['mensagem'] = document.querySelector('#m').value;
            break;
        case 'salinha':
            data['numeropulseira'] = document.querySelector('#numero-pulseira').value;
            data['corpulseira'] = document.querySelector('#cor-pulseira').value;
            data['turmapulseira'] = document.querySelector('#turma-pulseira').value;
            break;
        case 'estacionamento':
            data['placaveiculo'] = document.querySelector('#placa-veiculo').value;
            data['corveiculo'] = document.querySelector('#cor-veiculo').value;
            data['modeloveiculo'] = document.querySelector('#modelo-veiculo').value;
            data['marcaveiculo'] = document.querySelector('#marca-veiculo').value;
            break;
    }

    socket.emit('message', { name: user.name, info: data, group: user.group });
    form.reset();
});

function exit() {
    localStorage.clear();
    location.href = '/';
}

function showFormGroup(userGroup) {
    switch (userGroup) {
        case 'telao':
            document.querySelector(`#${userGroup}`).classList.remove('d-none');
            break;
        case 'salinha':
            document.querySelector(`#${userGroup}`).classList.remove('d-none');
            break;
        case 'estacionamento':
            document.querySelector(`#${userGroup}`).classList.remove('d-none');
            break;
    }

    document.querySelector('#submit').classList.remove('d-none');
}