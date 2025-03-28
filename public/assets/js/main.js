const sendBtn = document.querySelector('#sendBtn');
const inpuText = document.querySelector('#inputText');
const myMssage = inpuText.value.trim();
const messageContainer = document.querySelector('.chat__messages');
const userId = Date.now() + Math.floor(777 + Math.random() * 7000);

const sendMessage = async()=> {



    if(!inpuText) return false;


    messageContainer.innerHTML += `<div class="chat__message  chat__message--user">${myMssage}`;
    
    inpuText.value = "";

    setTimeout(() => {
        messageContainer.innerHTML += `<div class="chat__message  chat__message--boot  chat__message--typing">Escribiendo... </div>`;
        
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }, 500);   

    
    try {
        const response = await fetch('/api/chat-boot', {
            method: "POST",
            headers: {"content-Type": "application/json"},
            body: JSON.stringify({
                userID,
                meesage: myMssage
            })
        });

        const data = await response.json();

        document.querySelector('.chat__message--typing').remove();

        messageContainer.innerHTML += `<div class="chat__message  chat__message--boot">${data.reply}`;

    } catch (error) {
        console.log("error:", error);
    }
}

sendBtn.addEventListener('click', sendMessage);
inpuText.addEventListener("keypress", (event)=>{
    if(event.key === "Enter"){
        event.preventDefault();
        sendMessage();
    }

} );