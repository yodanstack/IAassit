import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//vista
app.use("/", express.static("public"));

//middelware para procesar json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//api de openIA
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


let userThreads = {};

app.post("/api/chat-boot", async(req, resp)=> {

    //recibir preguntas del usario
    const {userId, message} = req.body;

    if(!message) return resp.status(404).json({error: 'Has mandado un mensaje vacio'});

    //genera autmaticamente un id usario 
    if( !userThreads[userId] ) {
        const thread = await openai.beta.threads.create();
        userThreads[userId] = thread.id;
    }                
    //Añadir el mensaje al hilo de mi asistente 
    const threadId = userThreads[userId];
    await openai.beta.threads.messages.create(threadId, {
        role: "user", content: message
    });


    
        //ejectuar peticion al asistente
        const runAssistan = openai.beta.threads.runs.create(threadId, {
            assistant_id: "asst_5v2rIRwzXt6bZQ4chxMzDedb"
        }); 

    
    let runSatus = runAssistan;
    let attemps = 0;
    const maxAttemps = 30;

    while(runSatus.status !== "completed" && attemps < maxAttemps){
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        runSatus = await openai.beta.threads.runs.retrieve(threadId, runAssistan.id);

        attemps++;

        console.log(`intento ${attemps} - status ${runSatus.status}`);

        //fliltrar los mjs de la IA
        const assistantMesssages = messages.data.filter(mjs => mjs.role === "assistant");
        
        //devolver respuesta de IA
        const assistantReply = assistantMesssages.sort((a, b) => b.created_at - a.created_at)[0].
        content[0].text.value;

        return resp.status(200).json({assistantReply});
    }

    if(runSatus.status !== "completed"){
        throw new Error(`la ejecucion del asistente no se ha coompletado. Estado ${runSatus.status}`);
    }

    //mostrar mjs
    const messages = await openai.beta.threads.messages.list(threadId);

    console.log(`Total de mensajes:`, messages.data.length);

});

app.listen(port, ()=> {
    console.log(`Servidor conectado correctamente al puerto ${port}`);
});