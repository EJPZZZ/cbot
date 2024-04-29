import {MemoryDB, addKeyword, createBot, createFlow, createProvider} from '@bot-whatsapp/bot'

import { BaileysProvider } from '@bot-whatsapp/provider-baileys'

const flowBienvenida = addKeyword('Hola'). addAnswer ('Buenas, prueba de chatbot')




const main = async () => {

    const provider = createProvider(BaileysProvider)

    provider.initHttpServer(3002)

    // provider.http?.server.post('/send-message', (req, res) =>{
        
    // })

    await createBot({
        flow : createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    })
    
}

main()