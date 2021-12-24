const express = require('express')
//permet d'afficher des consoles log;
const morgan = require('morgan')
// rajoute de la sécurité à express
const helmet = require('helmet');
const http = require("http");
const pug = require('pug');
const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server)

//déclarer un numero de port utilisé pour la creation du serveur

const port = process.env.PORT || 1337;
//app.use permet de gerer la route du serveur selon des parametre, il ses de fonction intermerdiaire de l'appli 
//express, next() permet de faire passe à la suite des route si les conditions sont accepter
app.use(helmet());
app.use(morgan('tiny'))
app.use(express.static('./src/static'));


app.use(function(req,res,next){
    console.log('ok');
    next();
})
   
app.set('view engine','pug');
app.set('views', './src/views');
app.locals.pretty = true;

require('./static/js/chat-serveur.js')(io);
// le / symbolise la page d'accueil
// lorsque que le serveur sera sur la page d'accueil il repondra au client avec le text hello express
// avec la methode send file, on peut importer une page html 
// res.sendfile(path.resolve('lien html')))
app.get('/', function (request,response){
    response.render('index');

})

// app.use permet de creer son middlewar

//Route qui va écouter sur http://localhost:1337/chat
app.get('/chat', function (req,res){
// un parametre pseudo est obligatoire pour acceder  à cette route
 if(!req.query.pseudo){
     return res.redirect('/'); // redirige à la page de login
 }
    res.render('chat')
})

server.listen(port, function(){
    console.log("serveur => http://localhost:"+port)
})