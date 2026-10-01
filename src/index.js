let botData = {
    users: new Map(),
    coursers: new Map(),
    messages: []
};

//handler principal del bot para express
export async function botHandler (req){
    try {
        const body = req.body;

        //verificar si es un webhook de telegram
        if (body.message) {
            return await handlerMessage(body.message);
        }

        //respuesta para otros tipos de webhooks
        return {status: 200, data: { success:true } };
    }catch(error){
        console.error('Error processing webhook:', error);
        return { status: 500, data: {error: 'Internal server error'}};
    }
}

//Manejadir de mensajes
async function handlerMessage (message) {
         const chatId = message.chat.id;
         const text = message.text || '';
         const username = message.from.username || 'usuarios';

         //comandos del bot
         if (text.startsWith('/')) {
            return await handleCommand(text, chatId, username);
        }

         //respuesta a mensajes regulares
         return await sendResponse(chatId,'Hola ${username}! Soy el bot de la universidad. Usa. /help para ver los comandos disponibles.');
}
//Manejador de comandos
async function handleCommand(command, chatId, username){
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join (' ');

    const degrees = [
                {id: 'sistemas', name: 'Ingeniera en Sistemas Computacionales'},
                {id: 'Civil', name: 'Ingenieria Civil'},
                {id: 'pedagogia', name: 'Lic. en Pedagogia'},
                {id: 'social', name: 'Lic. en Trabajo Social'},
                {id: 'psicologia', name: 'Lic. en Psicologia'},
                {id: 'contaduria', name: 'Lic. en Contaduria'},
                {id: 'administracion', name: 'Lic. en Administración'},
                {id: 'arquitectura', name:'Lic. en Arquitectura'},
                {id: 'marketing', name: 'Lic. en Marketing Digital'},
                {id: 'ingles', name: 'Lic. en Enseñanza de ingles'}
            ];

    switch (cmd){
        case '/start':
            return await sendResponse (chatId,
                'Bienvenido, te saluda el chatbot de CESKA Universidad \n\n' +
                'Opciones disponibles \n' +
                '/help - Mostrar ayuda \n' +
                '/Licenciaturas \n' +
                '/noticias \n' +
                '/avisos - Avisos importantes \n' +
                '/contacto \n');

        case '/help':
        return await sendResponse (chatId,
            'Comandos del bot: \n\n' +
            '/start - iniciar el bot \n' +
            '/help - Mostrar esta ayuda \n' +
            '/licenciaturas - Muestra las licenciaturas ofertadas\n'+
            '/noticias - Muestra eventos o informes de interes\n' +
            '/avisos - Avisos importantes\n' +
            '/contacto - informacion de contacto \n');
        


        case '/licenciaturas':
            const degreeList = degrees.map(d => {
                const duration = d.id === 'psicologia' ? '4 años' : '3 años';
                return `${d.name} (${d.id}) - Duración: ${duration}`;
            }).join('\n');
                return await sendResponse (chatId, 'Licenciaturas Disponibles :\n\n'+degreeList);

       case '/noticias':
            return await sendResponse (chatId,
            'Ultinas noticias\n\n');

        case '/avisos':
            return await sendResponse (chatId,
            'Avisos Importantes\n\n' +
            '• 30 de octubre: Plática de protección civil para estudiantes\n' +
            '• 31 de octubre: Suspensión de clases\n' +
            '• 7 de noviembre: Plática de protección civil para estudiantes\n');
        case '/contacto':
            return await sendResponse  (chatId,
            'Informacion de contacto\n\n' +
            'Dirección:\n' +
            'Carretera Puerto Angel Km. 13.5\n' +
            'San Bartolo Coyotepec\n\n' +
            'Teléfono: 951269047\n\n' +
            'Horario de atención:\n' +
            'Lunes a Viernes 9:00 - 18:00');
        
        
        default:
            return await sendResponse (chatId,'Comando no reconocido, Usa /help para ver los comandos disponibles');      

    }
}
//function para enviar respuestas
async function sendResponse(chatId,text){
    const botToken = process.env.BOT_TOKEN;
    
    if (!botToken){
        console.error ('BOT_TOKEN no configurado en variables de entorno');
        return{ status: 500,data: { error:'BOT_TOKEN not configured'}};
        
    }
    
    try{
        console.log(`Sending to telegram API - Chat ID:${chatId}, Token: ${botToken.substring(0, 10)}...`);
        
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`,{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });
    
        const result = await response.json();
        console.log('Telegram API response:', JSON.stringify(result));

        if (!response.ok) {
            console.error('Error sending message to Telegram:',result);
            return  {status: 500, data:{ error: result.description } };
        }
        
        console.log(`Mensaje se envio exitosamente to ${chatId}`);

        return{
            status: 200,
            data: {
                success: true,
                chatId,
                message: text
            }
        };
    } catch(error){
      console.error('Error enviando mensaje:', error);
      return  {status: 500, data:{error: error.message} };
    }
}        
 