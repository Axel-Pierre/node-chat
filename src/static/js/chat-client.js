// ./src/static/js/chat-client.js
// ==============================
// const socket = io('http://localhost:1337/');
// CLIENT
const socket = io('/');

// Récupérer le pseudo dans l'URL
const URLQuery = Object.fromEntries(
    new URLSearchParams(window.location.search)
)
const pseudo = URLQuery.pseudo;

// socket.emit -->
        /* envoi des données aux clients*/
        // socket.on <--
        /* recoit des données aux clients */
        
// Envoi du pseudo au serveur
socket.emit('user:pseudo', pseudo);

// Ecouter les mises à jour de liste de la part du serveur
socket.on('users:list', connectedUsers => {
    addUsersToList(connectedUsers);
});

const form = document.querySelector('.chatbox-form');
form.addEventListener('submit', event => {
    event.preventDefault();

    // Récupération du input text
    const messageEl = form.querySelector('[name=message]');

    // Vérification si le message n'est pas vide
    if (messageEl.value.trim() === '') {
        return;
    }

    // Création de l'objet 'message'
    const message = createMessage(messageEl.value);
    // Envoi de l'objet 'message' au serveur
    socket.emit('user:message', message);

    // Afficher le message dans la zone de tchat
    // showMessage(message);

    // Vide la zone de texte
    messageEl.value = "";
});

// Dès qu'on reçoit un message du serveur de la part d'un autre user
socket.on('user:message', message => {
    // Afficher le message dans la zone de tchat
    showMessage(message);
});

function addUsersToList(connectedUsers) {
    const ul = document.querySelector('.chat-users ul');

    ul.innerHTML = connectedUsers
        .map(({ pseudo, id, color }) => {
            let frontColor = calcLuminance(color) > 40 ? '#000000' : '#ffffff';
            return `<li><span style="background-color: ${color}; color: ${frontColor}">${pseudo}</span></li>`
        })
        .join('');
}

function createMessage(message) {
    return {
        date: Date.now(),
        pseudo,
        message
    }
}

function showMessage({ date, pseudo, message, color }) {
    let frontColor = calcLuminance(color) > 40 ? '#000000' : '#ffffff';

    let messageHtml = `<div class="message">
        <span class="msg-date">${new Date(date).toLocaleString()}</span>
        <span class="msg-user" style="background-color: ${color}; color: ${frontColor}">${pseudo}</span>
        <span class="msg-message">${message}</span>
    </div>`;

    const chatboxMessages = document.querySelector('.chatbox-messages');
    chatboxMessages.innerHTML += messageHtml;
}

function calcLuminance(color) {
    const c = color.substring(1);   // strip #
    const rgb = parseInt(c, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return luma;
}