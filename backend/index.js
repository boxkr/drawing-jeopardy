const express = require('express');
const cors = require('cors')
const http = require('http')
const {Server} = require("socket.io")




const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
});


app.get('/', (req,res)=>{
    res.send("hit home page");
})

let users = []
let rooms = []
let playercount = users.length;
let roomcount = rooms.length;

io.on("connection", (socket) =>{

    //on connection, define functionalities we can use with connected socket


    //we need functions for:
        //player joining a room
        //player leaving a room
        //room starting completely
        //room ending completely
        //round starting
        //round ending
    

    socket.on("join_room", (player,room)=>{

        //on a player joining a room, we want to
            //if room doesn't exist, add it to rooms
            //if player doesn't exist, add it to players
            //add that player to the room
            //tell that player the lobby data


    })

    socket.on("disconnect", ()=>{
        //on a disconnection we want to minus that player from that room
        //decrease roomcount etc
    })

    socket.on("game_start",()=>{

        //on a game start we want to
            //set gametime to MAX_TIME
            //say game is started
    })

    socket.on("game_end", ()=>{

        //on game end we want to:
            //say game is over
            //decalre winner
            //kick people / restart?
    })

    socket.on("round_end", ()=>{


        //on a round end we want to add points to winning player, have them pick a new question
    })

    socket.on("question_selected",()=>{
        //on a question select we want to set that question to active, and start a new round
    })

    socket.on("round_start", ()=>{

        //similar to start game but scores arent 0

    })

});

const go = app.listen(3000, ()=>{
    
    console.log("listening on port 3000")
})