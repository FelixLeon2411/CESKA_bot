import { Router } from 'itty-router';

const router = Router();

// Almacenamiento en memoria (para desarrollo)
let botData = {
  users: new Map(),
  courses: new Map(),
  messages: []
};

// Ruta principal - Webhook del bot
router.post('/', async (request, env) => {
  try {
    const body = await request.json();
    
    // Verificar si es un webhook de Telegram u otra plataforma
    if (body.message) {
      return await handleMessage(body.message, env);
    }
    
    // Respuesta para otros tipos de webhooks
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error', { status: 500 });
  }
});

// Ruta de health check
router.get('/health', () => {
  return new Response(JSON.stringify({ status: 'healthy', timestamp: Date.now() }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Ruta de información del bot
router.get('/', () => {
  return new Response(JSON.stringify({
    name: 'Ceska University Bot',
    version: '1.0.0',
    status: 'running'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Manejador de mensajes
async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = message.text || '';
  const username = message.from.username || 'usuario';
  
  // Comandos del bot
  if (text.startsWith('/')) {
    return await handleCommand(text, chatId, username, env);
  }
  
  // Respuesta a mensajes regulares
  return await sendResponse(chatId, `Hola ${username}! Soy el bot de la universidad. Usa /help para ver los comandos disponibles.`, env);
}

// Manejador de comandos
async function handleCommand(command, chatId, username, env) {
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
        `/contacto - Información de contacto`, env);
    
    case '/help':
      return await sendResponse(chatId,
        `📚 Comandos del Bot:\n\n` +
        `/start - Iniciar el bot\n` +
        `/help - Mostrar esta ayuda\n` +
        `/cursos - Lista de cursos disponibles\n` +
        `/horario - Ver horario de clases\n` +
        `/info [nombre] - Info específica de un curso\n` +
        `/contacto - Información de contacto\n` +
        `/noticias - Últimas noticias de la universidad`, env);
    
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
        `Usa /info [nombre] para más información.`, env);
    
    case '/horario':
      return await sendResponse(chatId,
        `🕐 Horario de Clases:\n\n` +
        `Lunes: 9:00 - 14:00\n` +
        `Martes: 10:00 - 15:00\n` +
        `Miércoles: 9:00 - 13:00\n` +
        `Jueves: 11:00 - 16:00\n` +
        `Viernes: 9:00 - 12:00\n\n` +
        `Para más detalles, consulta el portal del estudiante.`, env);
    
    case '/info':
      if (!args) {
        return await sendResponse(chatId, '❌ Por favor especifica el nombre del curso. Ejemplo: /info Programación Web', env);
      }
      return await sendResponse(chatId,
        `📖 Información de: ${args}\n\n` +
        `Profesor: Dr. Juan Pérez\n` +
        `Créditos: 4\n` +
        `Horario: Lunes y Miércoles 10:00 - 12:00\n` +
        `Salón: Aula 205\n` +
        `Descripción: Curso introductorio sobre ${args.toLowerCase()}.`, env);
    
    case '/contacto':
      return await sendResponse(chatId,
        `📞 Información de Contacto:\n\n` +
        `🏫 Universidad Ceska\n` +
        `📍 Calle Principal #123\n` +
        `📧 info@ceska.edu\n` +
        `📱 +1 234 567 890\n\n` +
        `Horario de atención: Lunes a Viernes 8:00 - 18:00`, env);
    
    case '/noticias':
      return await sendResponse(chatId,
        `📰 Últimas Noticias:\n\n` +
        `• Inscripciones abiertas para el próximo semestre\n` +
        `• Nuevo laboratorio de computación disponible\n` +
        `• Conferencia sobre IA el 15 de septiembre\n` +
        `• Becas disponibles para estudiantes destacados`, env);
    
    default:
      return await sendResponse(chatId, '❌ Comando no reconocido. Usa /help para ver los comandos disponibles.', env);
  }
}

// Función para enviar respuestas (simulada para Cloudflare Workers)
async function sendResponse(chatId, text, env) {
  // En un entorno real, aquí harías la llamada a la API del bot (Telegram, Discord, etc.)
  // Ejemplo para Telegram:
  /*
  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });
  */
  
  console.log(`Message to ${chatId}: ${text}`);
  
  return new Response(JSON.stringify({ 
    success: true, 
    chatId, 
    message: text 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Manejador 404
router.all('*', () => new Response('Not Found', { status: 404 }));

// Exportar para Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  }
};
