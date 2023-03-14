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

const go = app.listen(3000, ()=>{
    
    console.log("listening on port 3000")
})