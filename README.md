# Ceska University Bot

Bot de universidad desplegado en Cloudflare Workers con comandos para estudiantes.

## 🚀 Características

- Comandos interactivos para estudiantes
- Información de cursos, horarios y noticias
- Webhook ready para integración con Telegram, Discord, etc.
- Despliegue automático con GitHub Actions
- Almacenamiento en Cloudflare KV/D1 (opcional)

## 📋 Requisitos previos

- Node.js 20+
- Cuenta de Cloudflare (gratis)
- Cuenta de GitHub
- Wrangler CLI

## 🔧 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ceska-university-bot.git
cd ceska-university-bot

# Instalar dependencias
npm install
```

## ⚙️ Configuración de Cloudflare

### 1. Instalar Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Autenticarse en Cloudflare

```bash
wrangler login
```

Esto abrirá tu navegador para autenticarte con Cloudflare.

### 3. Configurar secrets

```bash
# Configurar el token del bot (ejemplo para Telegram)
wrangler secret put BOT_TOKEN

# Configurar el webhook secret (opcional)
wrangler secret put WEBHOOK_SECRET
```

### 4. Probar localmente

```bash
npm run dev
```

El bot estará disponible en `http://localhost:8787`

## 📤 Despliegue a Cloudflare Workers

### Despliegue manual

```bash
npm run deploy
```

### Despliegue automático con GitHub Actions

#### Paso 1: Crear repositorio en GitHub

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

#### Paso 2: Configurar secrets en GitHub

Ve a tu repositorio en GitHub:
1. Settings → Secrets and variables → Actions
2. Agrega los siguientes secrets:

- **CLOUDFLARE_API_TOKEN**: 
  - Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
  - My Profile → API Tokens → Create Token
  - Selecciona "Edit Cloudflare Workers" template
  - Copia el token generado

- **CLOUDFLARE_ACCOUNT_ID**:
  - Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
  - Workers & Pages → Overview
  - Copia el Account ID (derecha de la pantalla)

#### Paso 3: Activar GitHub Actions

El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente cuando hagas push a la rama `main`.

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
3. Configura el secret en Cloudflare:
```bash
wrangler secret put BOT_TOKEN
```
4. Configura el webhook:
```bash
curl -F "url=https://tu-worker.workers.dev" https://api.telegram.org/bot<TU_TOKEN>/setWebhook
```

5. Descomenta la sección de API de Telegram en `src/index.js`

## 📁 Estructura del proyecto

```
.
├── src/
│   └── index.js           # Lógica principal del bot
├── .github/
│   └── workflows/
│       └── deploy.yml     # Workflow de CI/CD
├── .gitignore             # Archivos ignorados
├── .env.example           # Plantilla de variables
├── package.json           # Dependencias
├── wrangler.toml          # Configuración Cloudflare
└── README.md              # Este archivo
```

## 🛠️ Comandos disponibles

```bash
npm run dev      # Desarrollo local
npm run deploy   # Despliegue a Cloudflare
npm run format   # Formatear código
```

## 📝 Personalización

Edita `src/index.js` para:
- Agregar nuevos comandos
- Modificar respuestas existentes
- Integrar con APIs externas
- Agregar lógica de negocio específica

## 🔒 Seguridad

- Nunca commits secrets en el código
- Usa Cloudflare Secrets para datos sensibles
- Usa GitHub Secrets para tokens de CI/CD
- El archivo `.dev.vars` está en `.gitignore`

## 📚 Recursos

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [itty-router Docs](https://itty-router.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 📄 Licencia

MIT
