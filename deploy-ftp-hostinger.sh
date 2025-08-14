#!/bin/bash

echo "🚀 DEPLOY DIRETO VIA FTP - HOSTINGER"
echo "===================================="
echo "🎯 Deploy imediato para matheusbassini.com.br"
echo ""

# Verificar se o build existe
if [ ! -d "frontend/dist" ]; then
    echo "❌ Erro: Build do frontend não encontrado!"
    echo "Execute: cd frontend && npm run build"
    exit 1
fi

# Criar diretório de deploy
echo "📁 Preparando arquivos para FTP..."
rm -rf deploy-ftp-hostinger
mkdir -p deploy-ftp-hostinger/public_html

# Copiar frontend buildado
echo "📦 Copiando frontend..."
cp -r frontend/dist/* deploy-ftp-hostinger/public_html/

# Verificar se index.html existe
if [ ! -f "deploy-ftp-hostinger/public_html/index.html" ]; then
    echo "❌ Erro: index.html não encontrado no build!"
    exit 1
fi

# Criar .htaccess otimizado para Hostinger
echo "🔧 Criando .htaccess para Hostinger..."
cat > deploy-ftp-hostinger/public_html/.htaccess << 'EOF'
# ViralCut Pro - Hostinger Configuration
# Desenvolvido por Matheus Bassini

# Força HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Headers de Segurança
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compressão GZIP
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

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

# SPA Routing - React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Bloquear arquivos sensíveis
<FilesMatch "\.(env|log|sql)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Página de erro personalizada
ErrorDocument 404 /index.html
EOF

# Preparar backend (opcional para Node.js)
echo "📦 Preparando backend..."
mkdir -p deploy-ftp-hostinger/public_html/api
cp -r backend/* deploy-ftp-hostinger/public_html/api/

# Usar configuração específica do domínio
if [ -f "backend/.env.matheusbassini.final" ]; then
    cp backend/.env.matheusbassini.final deploy-ftp-hostinger/public_html/api/.env
    echo "   ✅ Configuração de email Hostinger aplicada"
fi

# Limpar arquivos desnecessários
rm -f deploy-ftp-hostinger/public_html/api/.env.example
rm -f deploy-ftp-hostinger/public_html/api/.env.hostinger
rm -rf deploy-ftp-hostinger/public_html/api/node_modules

# Criar arquivo de informações FTP
cat > deploy-ftp-hostinger/INSTRUCOES_FTP.md << 'EOF'
# 📁 INSTRUÇÕES FTP - HOSTINGER

## 🔗 Dados de Conexão FTP

### Configuração FTP
- **Host**: matheusbassini.com.br ou ftp.matheusbassini.com.br
- **Usuário**: Seu usuário FTP da Hostinger
- **Senha**: Sua senha FTP da Hostinger
- **Porta**: 21 (FTP) ou 22 (SFTP)
- **Diretório**: /public_html/

## 📂 Como Fazer Upload

### Opção 1: FileZilla (Recomendado)
1. Baixar: https://filezilla-project.org/
2. Conectar com os dados FTP acima
3. Navegar até /public_html/
4. Fazer upload de TODOS os arquivos desta pasta

### Opção 2: Painel Hostinger
1. Login: https://hpanel.hostinger.com/
2. Gerenciador de Arquivos
3. Navegar até public_html/
4. Upload de todos os arquivos

### Opção 3: WinSCP (Windows)
1. Baixar: https://winscp.net/
2. Conectar via SFTP
3. Upload dos arquivos

## ✅ Arquivos a Fazer Upload
- index.html (OBRIGATÓRIO)
- assets/ (pasta com CSS/JS)
- .htaccess (configuração Apache)
- api/ (backend Node.js - opcional)

## 🧪 Testar Após Upload
1. https://matheusbassini.com.br
2. Deve carregar o ViralCut Pro
3. Se não funcionar, verificar permissões

## 🔧 Permissões
- Arquivos: 644
- Pastas: 755
- index.html: 644
- .htaccess: 644

## 📞 Suporte
- Email: suporte@matheusbassini.com.br
- WhatsApp: +55 12 99225-7085
EOF

# Criar script de configuração Node.js
cat > deploy-ftp-hostinger/CONFIGURAR_NODEJS.md << 'EOF'
# ⚙️ CONFIGURAR NODE.JS NA HOSTINGER

## 🚀 Ativar Node.js

### 1. Painel Hostinger
1. Login: https://hpanel.hostinger.com/
2. Advanced → Node.js
3. Criar Nova Aplicação

### 2. Configurações
- **Versão Node.js**: 18.x ou superior
- **Diretório da Aplicação**: public_html/api
- **Arquivo de Inicialização**: server.js
- **Variáveis de Ambiente**: Configurar conforme .env

### 3. Variáveis de Ambiente
```
NODE_ENV=production
DB_HOST=srv1883.hstgr.io
DB_PORT=3306
DB_NAME=u206326127_viralcut
DB_USER=u206326127_host
DB_PASS=@Host1603
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=suporte@matheusbassini.com.br
EMAIL_PASS=@Suporte1603
JWT_SECRET=viralcut-pro-jwt-secret-2024
```

### 4. Instalar Dependências
No terminal da aplicação Node.js:
```bash
npm install --production
```

### 5. Iniciar Aplicação
A aplicação deve iniciar automaticamente.
API estará disponível em: https://matheusbassini.com.br/api

## 🧪 Testar API
- Health Check: https://matheusbassini.com.br/api/health
- Deve retornar: {"status": "OK"}
EOF

# Estatísticas
echo ""
echo "📊 Estatísticas do Deploy:"
echo "=========================="
frontend_files=$(find deploy-ftp-hostinger/public_html -maxdepth 2 -name "*.html" -o -name "*.js" -o -name "*.css" | wc -l)
total_size=$(du -sh deploy-ftp-hostinger | cut -f1)

echo "📁 Arquivos Frontend: $frontend_files"
echo "💾 Tamanho Total: $total_size"
echo "🌐 Domínio: matheusbassini.com.br"

# Verificações finais
echo ""
echo "🔍 Verificações finais..."
echo "========================"

if [ -f "deploy-ftp-hostinger/public_html/index.html" ]; then
    echo "✅ index.html: OK"
else
    echo "❌ index.html: ERRO"
    exit 1
fi

if [ -f "deploy-ftp-hostinger/public_html/.htaccess" ]; then
    echo "✅ .htaccess: OK"
else
    echo "❌ .htaccess: ERRO"
fi

if [ -d "deploy-ftp-hostinger/public_html/assets" ]; then
    echo "✅ assets/: OK"
else
    echo "⚠️  assets/: Não encontrado"
fi

if [ -f "deploy-ftp-hostinger/public_html/api/server.js" ]; then
    echo "✅ API backend: OK"
else
    echo "⚠️  API backend: Não encontrado"
fi

echo ""
echo "✅ DEPLOY FTP PREPARADO COM SUCESSO!"
echo "===================================="
echo "📁 Arquivos prontos em: deploy-ftp-hostinger/"
echo "🌐 Destino: matheusbassini.com.br"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Abrir FileZilla ou painel Hostinger"
echo "2. Conectar via FTP ao matheusbassini.com.br"
echo "3. Navegar até /public_html/"
echo "4. Fazer upload de TODOS os arquivos da pasta deploy-ftp-hostinger/public_html/"
echo "5. Definir permissões: 644 para arquivos, 755 para pastas"
echo "6. Testar: https://matheusbassini.com.br"
echo ""
echo "📖 DOCUMENTAÇÃO:"
echo "- INSTRUCOES_FTP.md - Como fazer upload via FTP"
echo "- CONFIGURAR_NODEJS.md - Como ativar Node.js (opcional)"
echo ""
echo "🎯 RESULTADO ESPERADO:"
echo "Site funcionando em: https://matheusbassini.com.br"
echo ""
echo "📞 SUPORTE:"
echo "- Email: suporte@matheusbassini.com.br"
echo "- WhatsApp: +55 12 99225-7085"
echo ""
echo "🎉 PRONTO PARA UPLOAD VIA FTP!"
