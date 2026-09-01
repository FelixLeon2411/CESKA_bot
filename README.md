# Ceska University Bot

Bot de universidad desplegado en Render con comandos para estudiantes.

## 🚀 Características

- Comandos interactivos para estudiantes
- Información de cursos, horarios y noticias
- Webhook ready para integración con Telegram, Discord, etc.
- Despliegue sencillo en Render
- Servidor Express con Node.js

## 📋 Requisitos previos

- Node.js 20+
- Cuenta de Render (gratis)
- Cuenta de GitHub

## 🔧 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ceska-university-bot.git
cd ceska-university-bot

# Instalar dependencias
npm install

# Ejecutar localmente
npm start
```

El bot estará disponible en `http://localhost:3000`

## 📤 Despliegue en Render

### Paso 1: Crear repositorio en GitHub

```bash
# Inicializar git
git init
git add .
git commit -m "Initial commit"

# Agregar remote (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/ceska-university-bot.git

# Push a GitHub
git branch -M main
git push -u origin main
```

### Paso 2: Crear Web Service en Render

1. Ve a [render.com](https://render.com) e inicia sesión
2. Crea un nuevo Web Service
3. Conecta tu repositorio de GitHub
4. Configura los siguientes parámetros:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node src/server.js
```

### Paso 3: Configurar variables de entorno

En Render, agrega las siguientes variables de entorno:

- `BOT_TOKEN`: Token de tu bot (ejemplo para Telegram)
- `NODE_ENV`: `production`
- `PORT`: `3000` (Render asigna automáticamente)

### Paso 4: Despliegue automático

Render desplegará automáticamente cada vez que hagas push a GitHub.

## 🤖 Comandos del Bot

- `/start` - Iniciar el bot
- `/help` - Mostrar ayuda
- `/cursos` - Ver cursos disponibles
- `/horario` - Consultar horario de clases
- `/info [curso]` - Información específica de un curso
- `/contacto` - Información de contacto
- `/noticias` - Últimas noticias de la universidad

## 🔌 Integración con Telegram (Opcional)

Para conectar con Telegram:

1. Crea un bot con [@BotFather](https://t.me/botfather) en Telegram
2. Copia el token del bot
3. Agrega `BOT_TOKEN` como variable de entorno en Render
4. Configura el webhook:
```bash
curl -F "url=https://tu-app.onrender.com/" https://api.telegram.org/bot<TU_TOKEN>/setWebhook
```
5. Descomenta la sección de API de Telegram en `src/index.js`

## 📁 Estructura del proyecto

```
.
├── src/
│   ├── index.js           # Lógica principal del bot
│   └── server.js          # Servidor Express
├── .gitignore             # Archivos ignorados
├── .env.example           # Plantilla de variables
├── package.json           # Dependencias
└── README.md              # Este archivo
```

## 🛠️ Comandos disponibles

```bash
npm install  # Instalar dependencias
npm start    # Iniciar servidor
npm run dev  # Desarrollo local
```

## 📝 Personalización

Edita `src/index.js` para:
- Agregar nuevos comandos
- Modificar respuestas existentes
- Integrar con APIs externas
- Agregar lógica de negocio específica

## 🔒 Seguridad

- Nunca commits secrets en el código
- Usa variables de entorno de Render para datos sensibles
- El archivo `.env` está en `.gitignore`

## 📚 Recursos

- [Render Docs](https://render.com/docs)
- [Express Docs](https://expressjs.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 📄 Licencia

MIT
