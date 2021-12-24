// ./src/chat-serveur.js
// =====================
// SERVEUR

const xss = require('xss');
const seedColor = require('seed-color');

module.exports = function(io) {

    const connectedUsers = [];

    io.on('connection', (socket) => {
        console.log(`Socket #${socket.id} connected!`);

        // socket.emit -->
        /* envoi des données aux clients*/
        // socket.on <--
        /* recoit des données aux clients */

        // Dès qu'on a reçu un pseudo, on met la liste à jour
        socket.on('user:pseudo', (pseudo) => {
            console.log(`L'utilisateur ${pseudo} vient d'arriver sur le chat`);
            connectedUsers.push({
                id: socket.id,
                pseudo,
                color: seedColor(pseudo).toHex()
            });

            console.log('Utilisateurs connectés :', connectedUsers);

            // Envoyer la liste à jour des utilisateurs connectés à TOUS LES CLIENTS CONNECTES
            io.emit('users:list', connectedUsers);
        });

        // Dès qu'on reçoit un message d'un user, on le transmet aux autres users
        socket.on('user:message', message => {
            // Vérification qu'on a pas reçu un message vide !
            if (message.message.trim() === '') return;

            // Nettoyer le HTML des messages (pour prévenir les attaques de type XSS)
            message.message = xss(message.message, {
                whiteList: {}
            });

            // Ajout de la couleur
            message.color = seedColor(message.pseudo).toHex();

            // Transférer le message à tout le monde (y compris l'émetteur)
            io.emit('user:message', message);
        });

        // Si un utilisateur se déconnecte, on met le tableau "connectedUsers" à jour
        socket.on('disconnect', reason => {
            let disconnectedUser = connectedUsers.findIndex(
                user => user.id === socket.id
            );
            if (disconnectedUser > -1) {
                connectedUsers.splice(disconnectedUser, 1); // Supprime l'utilisateur déconnecté du TBL
                io.emit('users:list', connectedUsers);
            }
        });
    });
};