// Almacenamiento en memoria (para desarrollo)
let botData = {
  users: new Map(),
  courses: new Map(),
  messages: []
};

// Handler principal del bot para Express
export async function botHandler(req) {
  try {
    const body = req.body;
    
    // Verificar si es un webhook de Telegram u otra plataforma
    if (body.message) {
      return await handleMessage(body.message);
    }
    
    // Respuesta para otros tipos de webhooks
    return { status: 200, data: { success: true } };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
}

// Manejador de mensajes
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text || '';
  const username = message.from.username || 'usuario';
  
  // Comandos del bot
  if (text.startsWith('/')) {
    return await handleCommand(text, chatId, username);
  }
  
  // Respuesta a mensajes regulares
  return await sendResponse(chatId, `Hola ${username}! Soy el bot de la universidad. Usa /help para ver los comandos disponibles.`);
}

// Manejador de comandos
async function handleCommand(command, chatId, username) {
  const parts = command.split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');
  
  switch (cmd) {
    case '/start':
      return await sendResponse(chatId, 
        `¡Bienvenido al Bot de la Universidad Ceska! 🎓\n\n` +
        `Comandos disponibles:\n` +
        `/help - Mostrar ayuda\n` +
        `/cursos - Ver cursos disponibles\n` +
        `/horario - Consultar horario\n` +
        `/info [curso] - Información de un curso\n` +
        `/contacto - Información de contacto`);
    
    case '/help':
      return await sendResponse(chatId,
        `📚 Comandos del Bot:\n\n` +
        `/start - Iniciar el bot\n` +
        `/help - Mostrar esta ayuda\n` +
        `/cursos - Lista de cursos disponibles\n` +
        `/horario - Ver horario de clases\n` +
        `/info [nombre] - Info específica de un curso\n` +
        `/contacto - Información de contacto\n` +
        `/noticias - Últimas noticias de la universidad`);
    
    case '/cursos':
      const courses = [
        '📐 Matemáticas Avanzadas',
        '💻 Programación Web',
        '🔬 Física General',
        '📝 Literatura Universal',
        '🌍 Historia Contemporánea',
        '📊 Estadística Aplicada'
      ];
      return await sendResponse(chatId, 
        `📚 Cursos Disponibles:\n\n${courses.join('\n')}\n\n` +
        `Usa /info [nombre] para más información.`);
    
    case '/horario':
      return await sendResponse(chatId,
        `🕐 Horario de Clases:\n\n` +
        `Lunes: 9:00 - 14:00\n` +
        `Martes: 10:00 - 15:00\n` +
        `Miércoles: 9:00 - 13:00\n` +
        `Jueves: 11:00 - 16:00\n` +
        `Viernes: 9:00 - 12:00\n\n` +
        `Para más detalles, consulta el portal del estudiante.`);
    
    case '/info':
      if (!args) {
        return await sendResponse(chatId, '❌ Por favor especifica el nombre del curso. Ejemplo: /info Programación Web');
      }
      return await sendResponse(chatId,
        `📖 Información de: ${args}\n\n` +
        `Profesor: Dr. Juan Pérez\n` +
        `Créditos: 4\n` +
        `Horario: Lunes y Miércoles 10:00 - 12:00\n` +
        `Salón: Aula 205\n` +
        `Descripción: Curso introductorio sobre ${args.toLowerCase()}.`);
    
    case '/contacto':
      return await sendResponse(chatId,
        `📞 Información de Contacto:\n\n` +
        `🏫 Universidad Ceska\n` +
        `📍 Calle Principal #123\n` +
        `📧 info@ceska.edu\n` +
        `📱 +1 234 567 890\n\n` +
        `Horario de atención: Lunes a Viernes 8:00 - 18:00`);
    
    case '/noticias':
      return await sendResponse(chatId,
        `📰 Últimas Noticias:\n\n` +
        `• Inscripciones abiertas para el próximo semestre\n` +
        `• Nuevo laboratorio de computación disponible\n` +
        `• Conferencia sobre IA el 15 de septiembre\n` +
        `• Becas disponibles para estudiantes destacados`);
    
    default:
      return await sendResponse(chatId, '❌ Comando no reconocido. Usa /help para ver los comandos disponibles.');
  }
}

// Función para enviar respuestas
async function sendResponse(chatId, text) {
  const botToken = process.env.BOT_TOKEN;
  
  if (!botToken) {
    console.error('BOT_TOKEN no configurado en variables de entorno');
    return { status: 500, data: { error: 'BOT_TOKEN not configured' } };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Error sending message to Telegram:', result);
      return { status: 500, data: { error: result.description } };
    }

    console.log(`Message sent to ${chatId}: ${text}`);
    
    return { 
      status: 200, 
      data: { 
        success: true, 
        chatId, 
        message: text 
      } 
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { status: 500, data: { error: error.message } };
  }
}
