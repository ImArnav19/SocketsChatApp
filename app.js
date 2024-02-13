const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 4000
const server = app.listen(port,()=> {
    console.log(`Server running on ${port}`)
})
const io = require('socket.io')(server)

let socketsConnected = new Set()



io.on('connection',onconnect)

function onconnect(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

    //sending an event of named clients-total from server to client
    io.emit('clients-total',socketsConnected.size)


    //getting client message now bradcasting it
    socket.on('message',(data) => {
        socket.broadcast.emit('chat-msg',data);
    })
    
    //handle the total clinets logic 
    socket.on('disconnect',()=>{
        console.log(`Socket disconnnected`,socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })


    //handle whoIsTyping
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback1',data)
    })
}


app.use(express.static(path.join(__dirname,'public')))

