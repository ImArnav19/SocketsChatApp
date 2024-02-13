const socket = io()

const clientTotal = document.getElementById('client-total')
const msgContainer = document.getElementById('cont')
const nameInput = document.getElementById('name-input')
const msgForm = document.getElementById('send_f')
const msgInput = document.getElementById('msg_input')

const tone = new Audio('/ding-126626.mp3')



msgForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendMessage()

})

//sendMessage
function sendMessage(){
    
    if(msgInput.value==='') return
    const data ={
        name:nameInput.value,
        msg : msgInput.value,
        date : new Date()

    }

    

    socket.emit('message',data)
    urMessageUI(true,data)
    msgInput.value=''
    
}


socket.on('clients-total',(data)=>{
    clientTotal.innerText = `Total Clients : ${data}`
})

socket.on('chat-msg',(data)=>{
    
    urMessageUI(false,data)

})

function urMessageUI(isOwn,data){
    clearFeed()
    
    tone.play()
    const element = `
    <div class="msg ${(isOwn)?'right':'left'}">
    <p>
        ${data.msg}
        <span>${data.name} ⚫ ${moment(data.date).fromNow()}</span>
    </p>
    </div>
`

msgContainer.innerHTML += element;
scrolltoBot()


}

function scrolltoBot(){
    msgContainer.scrollTo(0,msgContainer.scrollHeight)
}

msgInput.addEventListener('focus',(e)=>{
    console.log(nameInput.value)
    socket.emit('feedback',{
        
        feedback:`✍🏻 ${nameInput.value} is typing a message`
    })
})

msgInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`✍🏻 ${nameInput.value} is typing a message`
    })
})

msgInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:''
    })
})

socket.on('feedback1',(data)=>{
    clearFeed()
    
    const element = `
    <div class="feedback-msg">
    <p class="feedback" id="feedback">${data.feedback}</p>
    </div>
    `

    msgContainer.innerHTML += element;

})

function clearFeed(){
    
    let l = document.querySelectorAll("div.feedback-msg").length;
    let arr = document.querySelectorAll("div.feedback-msg")
    for(let i=0;i<l-1;i++){
        arr[i].parentNode.removeChild(arr[i])
    }

    // document.querySelectorAll("div.feedback-msg").forEach(element=>{
    //     console.log(element)
    //     element.parentNode.removeChild(element)

        
    // })
}