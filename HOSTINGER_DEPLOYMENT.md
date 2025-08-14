# Guia de Hospedagem na Hostinger - ViralCut Pro

## 📋 Pré-requisitos na Hostinger

### Plano Recomendado
- **Business Hosting** ou **Cloud Hosting** (para suporte a Node.js)
- **VPS** (recomendado para melhor performance)
- Certificado SSL incluído
- Suporte a Node.js 18+
- MongoDB Atlas (banco de dados na nuvem)

## 🚀 Configuração para Hostinger

### 1. Estrutura de Arquivos para Hostinger

```
public_html/
├── index.html              # Frontend build
├── static/                 # Assets estáticos
├── api/                    # Backend Node.js
└── .htaccess              # Configurações Apache
```

### 2. Configuração do Backend para Hostinger

#### Arquivo: `hostinger.config.js`
```javascript
const path = require('path');

module.exports = {
  // Configurações específicas da Hostinger
  port: process.env.PORT || 3000,
  host: '0.0.0.0',
  
  // Caminhos para Hostinger
  publicPath: path.join(__dirname, '../public_html'),
  uploadsPath: path.join(__dirname, '../uploads'),
  
  // Database (MongoDB Atlas)
  mongodb: {
    uri: process.env.MONGODB_ATLAS_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // Email (usando SMTP da Hostinger)
  email: {
    host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }
};
```

### 3. Variáveis de Ambiente para Hostinger

#### Arquivo: `.env.hostinger`
```env
# Ambiente
NODE_ENV=production
PORT=3000

# Database (MongoDB Atlas)
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/viralcut-pro

# JWT
JWT_SECRET=sua-chave-super-secreta-jwt-hostinger-2024
JWT_REFRESH_SECRET=sua-chave-refresh-token-hostinger-2024
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email (SMTP Hostinger)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=noreply@seudominio.com
EMAIL_PASS=sua-senha-email
EMAIL_FROM=noreply@seudominio.com

# URLs
FRONTEND_URL=https://seudominio.com
API_URL=https://seudominio.com/api

# Stripe (Produção)
STRIPE_SECRET_KEY=sk_live_sua-chave-stripe
STRIPE_PUBLISHABLE_KEY=pk_live_sua-chave-stripe
STRIPE_WEBHOOK_SECRET=whsec_sua-webhook-secret

# Segurança
BCRYPT_ROUNDS=12
SESSION_SECRET=sua-session-secret-hostinger-2024

# Limites
MAX_FILE_SIZE=500MB
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Storage (pode usar Hostinger ou AWS S3)
STORAGE_TYPE=local
UPLOAD_PATH=/home/usuario/public_html/uploads
```

### 4. Configuração Apache (.htaccess)

#### Arquivo: `public_html/.htaccess`
```apache
# Habilitar compressão
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache para arquivos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/x-javascript "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresDefault "access plus 2 days"
</IfModule>

# Redirecionar API para Node.js
RewriteEngine On

# Redirecionar /api para o backend Node.js
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# SPA - Redirecionar todas as rotas para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Segurança
<Files ".env*">
    Order allow,deny
    Deny from all
</Files>

<Files "*.config.js">
    Order allow,deny
    Deny from all
</Files>

# Headers de segurança
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self' blob: https:; connect-src 'self' https:;"
</IfModule>
```

### 5. Script de Deploy para Hostinger

#### Arquivo: `deploy-hostinger.sh`
```bash
#!/bin/bash

echo "🚀 Iniciando deploy para Hostinger..."

# Variáveis
DOMAIN="seudominio.com"
HOSTINGER_USER="seu-usuario"
HOSTINGER_PATH="/home/$HOSTINGER_USER/public_html"

# 1. Build do Frontend
echo "📦 Fazendo build do frontend..."
cd frontend
npm run build
cd ..

# 2. Preparar arquivos para upload
echo "📁 Preparando arquivos..."
mkdir -p dist/public_html
mkdir -p dist/api

# Copiar frontend build
cp -r frontend/dist/* dist/public_html/
cp public_html/.htaccess dist/public_html/

# Copiar backend
cp -r backend/* dist/api/
cp .env.hostinger dist/api/.env

# 3. Instalar dependências do backend (apenas produção)
echo "📦 Instalando dependências do backend..."
cd dist/api
npm ci --only=production
cd ../..

# 4. Upload via FTP/SFTP (exemplo com rsync)
echo "⬆️ Fazendo upload para Hostinger..."
rsync -avz --delete dist/public_html/ $HOSTINGER_USER@$DOMAIN:$HOSTINGER_PATH/
rsync -avz --delete dist/api/ $HOSTINGER_USER@$DOMAIN:/home/$HOSTINGER_USER/api/

# 5. Reiniciar aplicação Node.js
echo "🔄 Reiniciando aplicação..."
ssh $HOSTINGER_USER@$DOMAIN "pm2 restart viralcut-api || pm2 start /home/$HOSTINGER_USER/api/server.js --name viralcut-api"

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://$DOMAIN"
```

### 6. Configuração Responsiva Aprimorada

#### Arquivo: `frontend/src/styles/responsive.css`
```css
/* Configurações responsivas para todos os dispositivos */

/* Mobile First - Base styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Container responsivo */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Grid responsivo */
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

/* Mobile (320px - 768px) */
@media (max-width: 767px) {
  .container {
    padding: 0 12px;
  }
  
  .grid {
    gap: 12px;
  }
  
  /* Navegação mobile */
  .mobile-nav {
    display: block;
  }
  
  .desktop-nav {
    display: none;
  }
  
  /* Botões mobile */
  .btn {
    min-height: 44px;
    font-size: 16px;
  }
  
  /* Upload area mobile */
  .upload-area {
    min-height: 200px;
    padding: 20px;
  }
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 24px;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 0 32px;
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .mobile-nav {
    display: none;
  }
  
  .desktop-nav {
    display: block;
  }
}

/* Touch devices */
@media (hover: none) and (pointer: coarse) {
  .btn:hover {
    transform: none;
  }
  
  .card:hover {
    transform: none;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo {
    background-image: url('/logo@2x.png');
    background-size: contain;
  }
}

/* Landscape orientation */
@media (orientation: landscape) and (max-height: 500px) {
  .header {
    height: 50px;
  }
  
  .main-content {
    padding-top: 60px;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}
```

## 📱 Configuração PWA (Progressive Web App)

### Arquivo: `frontend/public/manifest.json`
```json
{
  "name": "ViralCut Pro",
  "short_name": "ViralCut",
  "description": "Editor de vídeos virais com IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "orientation": "any",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["productivity", "multimedia"],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "375x812",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

## 🔧 Passos para Deploy na Hostinger

### 1. Preparação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/viralcut-pro.git
cd viralcut-pro

# Configure as variáveis de ambiente
cp .env.hostinger backend/.env
```

### 2. MongoDB Atlas Setup
1. Crie uma conta no MongoDB Atlas
2. Crie um cluster gratuito
3. Configure o usuário e senha
4. Adicione o IP da Hostinger na whitelist
5. Copie a string de conexão

### 3. Configuração na Hostinger
1. Acesse o painel da Hostinger
2. Ative o Node.js no seu plano
3. Configure as variáveis de ambiente
4. Instale o PM2 para gerenciar o processo

### 4. Deploy
```bash
# Torne o script executável
chmod +x deploy-hostinger.sh

# Execute o deploy
./deploy-hostinger.sh
```

### 5. Configuração SSL
1. Ative o SSL gratuito na Hostinger
2. Configure redirecionamento HTTPS
3. Teste todas as funcionalidades

## 📊 Monitoramento

### Logs na Hostinger
```bash
# Ver logs do Node.js
pm2 logs viralcut-api

# Monitorar performance
pm2 monit

# Reiniciar aplicação
pm2 restart viralcut-api
```

## 🔒 Segurança na Hostinger

1. **Firewall**: Configure regras no painel
2. **Backup**: Configure backup automático
3. **SSL**: Sempre use HTTPS
4. **Variáveis**: Nunca exponha credenciais
5. **Updates**: Mantenha dependências atualizadas

## 📞 Suporte

- **Hostinger**: Suporte 24/7 via chat
- **MongoDB Atlas**: Documentação completa
- **Stripe**: Suporte para pagamentos

---

**Configuração otimizada para Hostinger com suporte completo a dispositivos móveis, tablets e desktops!**
