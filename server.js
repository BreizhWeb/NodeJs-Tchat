require("dotenv").config();
const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
const multirooms = require('./modules/multirooms');
const crypto = require('crypto');
const { encrypt, decrypt } = require('./modules/crypto');
const db = require('./db/db.js')
var cookieParser = require('cookie-parser');
const nodeCache= require('./modules/nodeCache');
const acc = require('./modules/permissions');



let usernames = [];

app.use(cookieParser());
app.use(express.urlencoded({ extended:false }));
/*
Les fonctionnalités de login/cookie/sécurité ont été implémentées sur PUBLIC2
*/
app.use(express.static('public')) // modifier ici pour passer de public à public 2

// Initialise le cache et le resynchronise avec la base de donnée toutes les 10 minutes
nodeCache.set();
setInterval(() => {
    nodeCache.set();
}, 600000);


const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`le serveur écoute sur le port ${PORT}`);
});

io.sockets.on("connection", async (socket) => {
    multirooms.listen(io, socket);
  })

//(fait par le groupe login/token/sécurité) Fonction qui inscrit l'utilisateur dans la base si son pseudo n'est pas déjà dans la base
app.post("/register",async (req,res)=>{
    const md5sum = crypto.createHash('md5');
    var existe = (await db.users.getIdByPseudo(req.body.username));
    if (existe != undefined) {
        res.json({error:"true"});
    } else {
        var passwordC = md5sum.update(req.body.password).digest('hex');
        db.users.create(req.body.username,passwordC);
        res.json({username:req.body.username,error:"false"});
    }
})

//(fait par le groupe login/token/sécurité) Fonction permettant de vérifier si l'utilisateur est bien inscrit et si son mot de passe est le bon, si oui le token est enrgistré dans les cookies pour 10mn
app.post("/login",async (req,res)=>{
    const md5sum = crypto.createHash('md5');
    if ((await db.users.getIdByPseudo(req.body.username)) == undefined) {
        res.json({error:"true"});
    } else {
        var id = (await db.users.getIdByPseudo(req.body.username));
        var password = (await db.users.getUserById(id)).password;
        var passwordC = md5sum.update(req.body.password).digest('hex');
        if (passwordC == password) {
            var token = req.body.username+"#####"+passwordC+"#####"+Date.now().toString()+"#####17cm";
            hToken = encrypt(token);
            res.cookie("tokenIv",hToken.iv,{maxAge: 600000});
            res.cookie("tokenContent",hToken.content,{maxAge: 600000});
            io.sockets.on("connection", async (socket) => {
              multirooms.listen(io, socket);
            })
            console.log(id);
            res.json({id:id,error:"false"});
        } else {
            res.json({error:"true"});
        }
    }
})

//(fait par le groupe login/token/sécurité) Fonction vérifiant que le token est valide, en séparant les informations pour les comparer à celles attendues
app.post("/verifToken",async (req,res)=>{
    if (req.body.tokenIv!=undefined && req.body.tokenContent!=undefined) {
        var hash = {iv:req.body.tokenIv,content:req.body.tokenContent};
        var tokenSplit = decrypt(hash).split("#####");
        var id = (await db.users.getIdByPseudo(tokenSplit[0]));
        var password = (await db.users.getUserById(id)).password;
        if (tokenSplit[1]==password && parseInt(tokenSplit[2])+600000>=Date.now() && tokenSplit[3]=="17cm") {
            io.sockets.on("connection", async (socket) => {
              multirooms.listen(io, socket);
            })
            console.log(id);
            res.json({id:id,error:"false"});
        } else {
            res.json({error:"true"});
        }
    } else {
        res.json({error:"true"});
    }
})
