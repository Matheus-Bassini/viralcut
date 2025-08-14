emai#!/bin/bash

echo "🚀 Deploy ViralCut Pro - matheusbassini.com.br"
echo "================================================"
echo "🎯 Domínio: matheusbassini.com.br"
echo "🗄️ Banco: MySQL Hostinger (u206326127_viralcut)"
echo "👨‍💻 Desenvolvedor: Matheus Bassini"
echo ""

# Verificar se os diretórios existem
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Erro: Diretórios frontend ou backend não encontrados!"
    echo "Execute este script na raiz do projeto ViralCut Pro"
    exit 1
fi

# Criar diretório de deploy
echo "📁 Criando estrutura de deploy..."
rm -rf matheusbassini-deploy
mkdir -p matheusbassini-deploy/public_html/api
mkdir -p matheusbassini-deploy/logs

# Build do Frontend
echo "📦 Buildando Frontend React..."
cd frontend
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado no frontend!"
    exit 1
fi

echo "   📥 Instalando dependências do frontend..."
npm ci --silent

echo "   🔨 Buildando para produção..."
VITE_API_URL=https://matheusbassini.com.br/api npm run build

if [ ! -d "dist" ]; then
    echo "❌ Erro: Build do frontend falhou!"
    exit 1
fi

cd ..

echo "✅ Frontend buildado com sucesso!"

# Copiar arquivos do Frontend
echo "📁 Copiando arquivos do Frontend..."
cp -r frontend/dist/* matheusbassini-deploy/public_html/
echo "   ✅ Arquivos React copiados"

# Copiar .htaccess customizado
echo "🔧 Configurando Apache (.htaccess)..."
cat > matheusbassini-deploy/public_html/.htaccess << 'EOF'
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
EOF

echo "   ✅ .htaccess configurado"

# Preparar Backend
echo "📦 Preparando Backend Node.js..."
cp -r backend/* matheusbassini-deploy/public_html/api/

# Copiar configuração específica do domínio com credenciais de email
cp backend/.env.matheusbassini.final matheusbassini-deploy/public_html/api/.env
echo "   ✅ Configuração do domínio com email Hostinger aplicada"

# Remover arquivos desnecessários do backend
rm -f matheusbassini-deploy/public_html/api/.env.example
rm -f matheusbassini-deploy/public_html/api/.env.hostinger
rm -rf matheusbassini-deploy/public_html/api/node_modules
rm -rf matheusbassini-deploy/public_html/api/logs

echo "   ✅ Backend preparado"

# Criar script de instalação no servidor
echo "📋 Criando instruções de instalação..."
cat > matheusbassini-deploy/INSTALL_SERVER.sh << 'EOF'
#!/bin/bash
echo "🚀 Instalando ViralCut Pro no servidor..."

# Instalar dependências
cd public_html/api
npm install --production --silent

# Criar diretório de logs
mkdir -p logs

# Definir permissões
chmod 755 server.js
chmod 600 .env

echo "✅ Instalação concluída!"
echo "🌐 Acesse: https://matheusbassini.com.br"
echo "🔧 API: https://matheusbassini.com.br/api/health"
EOF

chmod +x matheusbassini-deploy/INSTALL_SERVER.sh

# Criar guia de instalação
cat > matheusbassini-deploy/README_INSTALL.md << 'EOF'
# 🚀 Instalação ViralCut Pro - matheusbassini.com.br

## 📁 Passo 1: Upload dos Arquivos
1. Faça upload de todo o conteúdo da pasta `public_html/` para o diretório raiz do seu domínio matheusbassini.com.br na Hostinger

## 🔧 Passo 2: Configurar Node.js no Painel Hostinger
1. Acesse: Painel Hostinger → Advanced → Node.js
2. Clique em "Create Application"
3. Configure:
   - **Versão**: Node.js 18.x
   - **Diretório da aplicação**: `public_html/api`
   - **Arquivo de inicialização**: `server.js`
   - **Modo**: `Production`

## 🌍 Passo 3: Variáveis de Ambiente
No painel Node.js, adicione estas variáveis:
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
JWT_SECRET=MatheusBassini2024ViralCutProSuperSecret!@#$%^&*()
JWT_REFRESH_SECRET=MatheusBassiniRefreshToken2024!@#$%^&*()_+
```

## 📦 Passo 4: Instalar Dependências
Via SSH ou terminal do painel:
```bash
cd public_html/api
chmod +x ../INSTALL_SERVER.sh
../INSTALL_SERVER.sh
```

## 🔒 Passo 5: Configurar SSL
1. Painel Hostinger → SSL
2. Ativar SSL gratuito para matheusbassini.com.br
3. Habilitar "Force HTTPS"

## ✅ Passo 6: Testar
- **Frontend**: https://matheusbassini.com.br
- **API Health**: https://matheusbassini.com.br/api/health
- **Registro**: https://matheusbassini.com.br/register

## 📞 Suporte
- **Email**: suporte@matheusbassini.com.br
- **WhatsApp**: +55 12 99225-7085
- **Discord**: matheusbassini
EOF

# Criar arquivo de configuração do package.json para produção
cat > matheusbassini-deploy/public_html/api/package.json << 'EOF'
{
  "name": "viralcut-pro-api",
  "version": "1.0.0",
  "description": "ViralCut Pro API - matheusbassini.com.br",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "sequelize": "^6.35.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "speakeasy": "^2.0.0",
    "qrcode": "^1.5.3",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "winston": "^3.11.0",
    "node-cache": "^5.1.2"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "author": "Matheus Bassini <suporte@matheusbassini.com.br>",
  "license": "MIT"
}
EOF

# Estatísticas do deploy
echo ""
echo "📊 Estatísticas do Deploy:"
echo "=========================="
frontend_files=$(find matheusbassini-deploy/public_html -name "*.html" -o -name "*.js" -o -name "*.css" | wc -l)
backend_files=$(find matheusbassini-deploy/public_html/api -name "*.js" | wc -l)
total_size=$(du -sh matheusbassini-deploy | cut -f1)

echo "📁 Arquivos Frontend: $frontend_files"
echo "📁 Arquivos Backend: $backend_files"
echo "💾 Tamanho Total: $total_size"
echo ""

echo "✅ Deploy preparado com sucesso!"
echo "================================================"
echo "📁 Arquivos prontos em: matheusbassini-deploy/"
echo "🌐 Domínio: https://matheusbassini.com.br"
echo "🔧 API: https://matheusbassini.com.br/api"
echo "📧 Suporte: suporte@matheusbassini.com.br"
echo ""
echo "📋 Próximos passos:"
echo "1. Faça upload da pasta 'public_html/' para seu domínio"
echo "2. Configure Node.js no painel Hostinger"
echo "3. Execute o script INSTALL_SERVER.sh no servidor"
echo "4. Ative o SSL no painel"
echo "5. Teste: https://matheusbassini.com.br"
echo ""
echo "🎉 ViralCut Pro estará funcionando em matheusbassini.com.br!"
