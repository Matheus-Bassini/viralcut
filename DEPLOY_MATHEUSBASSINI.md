# 🚀 Deploy ViralCut Pro - matheusbassini.com.br

## 📋 Configuração Completa para Hostinger

### 🎯 Domínio: matheusbassini.com.br
### 🗄️ Banco: MySQL Hostinger (u206326127_viralcut)

---

## 📁 Estrutura de Arquivos no Servidor

```
matheusbassini.com.br/
├── public_html/                    # Raiz do domínio
│   ├── index.html                  # Frontend React (build)
│   ├── static/                     # Assets do React
│   │   ├── css/
│   │   ├── js/
│   │   └── media/
│   ├── .htaccess                   # Configuração Apache
│   └── api/                        # Backend Node.js
│       ├── server.js               # Servidor principal
│       ├── package.json            # Dependências
│       ├── .env                    # Variáveis de ambiente
│       └── src/                    # Código fonte
│           ├── controllers/
│           ├── models/
│           ├── routes/
│           ├── middleware/
│           └── utils/
```

---

## 🔧 Passo 1: Configurar Variáveis de Ambiente

### Arquivo: `public_html/api/.env`
```env
# Produção - matheusbassini.com.br
NODE_ENV=production
PORT=3000

# Database Hostinger
DB_HOST=srv1883.hstgr.io
DB_PORT=3306
DB_NAME=u206326127_viralcut
DB_USER=u206326127_host
DB_PASS=@Host1603

# URLs do Domínio
FRONTEND_URL=https://matheusbassini.com.br
API_URL=https://matheusbassini.com.br/api

# JWT Secrets (GERAR NOVOS!)
JWT_SECRET=MatheusBassini2024ViralCutProSuperSecret!@#$
JWT_REFRESH_SECRET=MatheusBassiniRefreshToken2024!@#$%^&*
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Segurança
BCRYPT_ROUNDS=12
SESSION_SECRET=MatheusBassiniSessionSecret2024!@#

# Email (configurar com seu email)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=suporte@matheusbassini.com.br
EMAIL_PASS=sua-senha-de-app-gmail
EMAIL_FROM=suporte@matheusbassini.com.br

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Upload
MAX_FILE_SIZE=500MB
ALLOWED_FILE_TYPES=video/mp4,video/avi,video/mov,video/mkv,video/webm

# 2FA
TWO_FACTOR_SERVICE_NAME=ViralCut Pro - Matheus Bassini

# Logs
LOG_LEVEL=info
```

---

## 🌐 Passo 2: Configurar Apache (.htaccess)

### Arquivo: `public_html/.htaccess`
```apache
# ViralCut Pro - matheusbassini.com.br
# Configuração Apache para SPA + API

RewriteEngine On

# Força HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Headers de Segurança
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# CORS para API
Header always set Access-Control-Allow-Origin "https://matheusbassini.com.br"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

# Compressão Gzip
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
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Cache para Assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Roteamento da API para Node.js
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ /api/server.js [L,QSA]

# SPA Routing - Todas as outras rotas vão para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Bloquear acesso a arquivos sensíveis
<FilesMatch "\.(env|log|sql|md)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Bloquear acesso ao diretório node_modules
RedirectMatch 403 /node_modules/.*$
```

---

## 🚀 Passo 3: Script de Deploy Automatizado

### Arquivo: `deploy-matheusbassini.sh`
```bash
#!/bin/bash

echo "🚀 Deploy ViralCut Pro - matheusbassini.com.br"
echo "================================================"

# Criar diretório de deploy
mkdir -p matheusbassini-deploy/public_html/api

echo "📦 Buildando Frontend..."
cd frontend
npm ci
npm run build
cd ..

echo "📁 Copiando arquivos do Frontend..."
cp -r frontend/dist/* matheusbassini-deploy/public_html/
cp public_html/.htaccess matheusbassini-deploy/public_html/

echo "📦 Preparando Backend..."
cp -r backend/* matheusbassini-deploy/public_html/api/
cp backend/.env.hostinger matheusbassini-deploy/public_html/api/.env

echo "🔧 Configurando para matheusbassini.com.br..."
# Atualizar URLs no .env
sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=https://matheusbassini.com.br|g' matheusbassini-deploy/public_html/api/.env
sed -i 's|API_URL=.*|API_URL=https://matheusbassini.com.br/api|g' matheusbassini-deploy/public_html/api/.env

echo "📋 Criando instruções de instalação..."
cat > matheusbassini-deploy/INSTALL.md << 'EOF'
# Instalação no Servidor Hostinger

## 1. Upload dos Arquivos
- Faça upload de todo o conteúdo de `public_html/` para o diretório raiz do domínio matheusbassini.com.br

## 2. Configurar Node.js no Painel Hostinger
- Versão: Node.js 18.x
- Diretório da aplicação: public_html/api
- Arquivo de inicialização: server.js
- Variáveis de ambiente: Copiar do arquivo .env

## 3. Instalar Dependências
Via SSH ou terminal do painel:
```bash
cd public_html/api
npm install --production
```

## 4. Testar
- Frontend: https://matheusbassini.com.br
- API: https://matheusbassini.com.br/api/health
EOF

echo "✅ Deploy preparado em: matheusbassini-deploy/"
echo "📁 Faça upload do conteúdo de 'public_html/' para seu domínio"
echo "🌐 Acesse: https://matheusbassini.com.br"
```

---

## 📊 Passo 4: Configuração no Painel Hostinger

### 🔧 Node.js App Setup
1. **Acesse**: Painel Hostinger → Advanced → Node.js
2. **Configurações**:
   - **Versão**: 18.x
   - **Diretório**: `public_html/api`
   - **Arquivo**: `server.js`
   - **Modo**: `Production`

### 🌍 Variáveis de Ambiente
Adicione no painel Node.js:
```
NODE_ENV=production
PORT=3000
DB_HOST=srv1883.hstgr.io
DB_PORT=3306
DB_NAME=u206326127_viralcut
DB_USER=u206326127_host
DB_PASS=@Host1603
FRONTEND_URL=https://matheusbassini.com.br
API_URL=https://matheusbassini.com.br/api
JWT_SECRET=MatheusBassini2024ViralCutProSuperSecret!@#$
JWT_REFRESH_SECRET=MatheusBassiniRefreshToken2024!@#$%^&*
```

### 🔒 SSL Certificate
1. **Acesse**: Painel → SSL
2. **Ative**: SSL gratuito para matheusbassini.com.br
3. **Force HTTPS**: Habilitado

---

## 🧪 Passo 5: Testes Pós-Deploy

### ✅ Checklist de Verificação
```bash
# 1. Testar Frontend
curl -I https://matheusbassini.com.br
# Deve retornar: 200 OK

# 2. Testar API Health
curl https://matheusbassini.com.br/api/health
# Deve retornar: {"status":"OK","message":"ViralCut Pro API is running"}

# 3. Testar Banco de Dados
curl https://matheusbassini.com.br/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@matheusbassini.com.br","password":"Teste123!","firstName":"Teste","lastName":"User"}'

# 4. Testar HTTPS Redirect
curl -I http://matheusbassini.com.br
# Deve retornar: 301 redirect para HTTPS
```

---

## 🎯 URLs Finais

### 🌐 Produção
- **Frontend**: https://matheusbassini.com.br
- **API**: https://matheusbassini.com.br/api
- **Health Check**: https://matheusbassini.com.br/api/health
- **Admin**: https://matheusbassini.com.br/dashboard

### 📧 Email de Suporte
- **Email**: suporte@matheusbassini.com.br
- **Configurar**: Gmail App Password ou SMTP personalizado

---

## 🔐 Segurança Implementada

### ✅ Features de Segurança
- **HTTPS Forçado** - Redirect automático
- **Headers de Segurança** - XSS, CSRF, Clickjacking
- **CORS Configurado** - Apenas domínio autorizado
- **Rate Limiting** - Proteção contra spam
- **JWT Tokens** - Autenticação segura
- **2FA** - Autenticação de dois fatores
- **Validação de Dados** - Sanitização de inputs
- **Arquivos Protegidos** - .env, logs bloqueados

### 🛡️ Monitoramento
- **Logs de Acesso** - Apache logs
- **Logs da Aplicação** - Winston logger
- **Uptime Monitoring** - Configurar external service
- **SSL Monitoring** - Renovação automática

---

## 🚀 Comandos de Deploy

```bash
# 1. Preparar deploy
chmod +x deploy-matheusbassini.sh
./deploy-matheusbassini.sh

# 2. Upload via FTP/SFTP
# Fazer upload de matheusbassini-deploy/public_html/* 
# para o diretório raiz do domínio

# 3. Configurar Node.js no painel
# Seguir instruções do Passo 4

# 4. Testar
curl https://matheusbassini.com.br/api/health
```

---

## 📞 Suporte Pós-Deploy

### 🛠️ Matheus Bassini
- **Email**: suporte@matheusbassini.com.br
- **WhatsApp**: +55 12 99225-7085
- **Discord**: matheusbassini

### 📋 Checklist Final
- [ ] ✅ Frontend carregando em https://matheusbassini.com.br
- [ ] ✅ API respondendo em https://matheusbassini.com.br/api/health
- [ ] ✅ Banco MySQL conectado
- [ ] ✅ SSL ativo e funcionando
- [ ] ✅ Registro de usuário funcionando
- [ ] ✅ Login funcionando
- [ ] ✅ Upload de vídeo funcionando

**🎉 ViralCut Pro estará 100% operacional em matheusbassini.com.br!**
