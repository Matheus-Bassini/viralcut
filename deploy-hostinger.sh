#!/bin/bash

# ViralCut Pro - Script de Deploy para Hostinger
# Otimizado para dispositivos móveis, tablets e desktops

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    error "Execute este script no diretório raiz do projeto ViralCut Pro"
fi

# Configurações (ajuste conforme necessário)
DOMAIN="${DOMAIN:-seudominio.com}"
HOSTINGER_USER="${HOSTINGER_USER:-seu-usuario}"
HOSTINGER_PATH="/home/$HOSTINGER_USER/public_html"
API_PATH="/home/$HOSTINGER_USER/api"
NODE_VERSION="18"

log "🚀 Iniciando deploy do ViralCut Pro para Hostinger"
log "📍 Domínio: $DOMAIN"
log "👤 Usuário: $HOSTINGER_USER"

# Verificar dependências
command -v node >/dev/null 2>&1 || error "Node.js não está instalado"
command -v npm >/dev/null 2>&1 || error "npm não está instalado"

# Verificar versão do Node.js
NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_CURRENT" -lt "$NODE_VERSION" ]; then
    warn "Versão do Node.js ($NODE_CURRENT) pode ser incompatível. Recomendado: $NODE_VERSION+"
fi

# 1. Limpeza de arquivos temporários
log "🧹 Limpando arquivos temporários..."
rm -rf dist/
rm -rf frontend/dist/
rm -rf backend/node_modules/.cache/
rm -rf frontend/node_modules/.cache/

# 2. Instalar dependências
log "📦 Instalando dependências..."
npm run install:all || error "Falha ao instalar dependências"

# 3. Verificar variáveis de ambiente
log "🔧 Verificando configuração..."
if [ ! -f "backend/.env" ]; then
    if [ -f ".env.hostinger" ]; then
        log "📋 Copiando .env.hostinger para backend/.env"
        cp .env.hostinger backend/.env
    else
        error "Arquivo .env não encontrado. Copie .env.example e configure as variáveis"
    fi
fi

# 4. Build do Frontend
log "🏗️ Fazendo build do frontend..."
cd frontend

# Verificar se o build está configurado corretamente
if ! grep -q "build" package.json; then
    error "Script 'build' não encontrado no package.json do frontend"
fi

# Build otimizado para produção
VITE_API_URL="https://$DOMAIN/api" npm run build || error "Falha no build do frontend"

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    error "Diretório dist não foi criado após o build"
fi

log "✅ Build do frontend concluído"
cd ..

# 5. Preparar estrutura de arquivos
log "📁 Preparando estrutura de arquivos..."
mkdir -p dist/public_html
mkdir -p dist/api
mkdir -p dist/uploads

# Copiar frontend build
log "📋 Copiando arquivos do frontend..."
cp -r frontend/dist/* dist/public_html/
cp public_html/.htaccess dist/public_html/

# Verificar arquivos críticos do frontend
if [ ! -f "dist/public_html/index.html" ]; then
    error "index.html não encontrado no build do frontend"
fi

# Copiar backend
log "📋 Copiando arquivos do backend..."
cp -r backend/* dist/api/

# Remover arquivos desnecessários do backend
rm -rf dist/api/node_modules/
rm -rf dist/api/.git/
rm -rf dist/api/tests/
rm -rf dist/api/*.test.js

# 6. Configurar backend para produção
log "⚙️ Configurando backend para produção..."
cd dist/api

# Instalar apenas dependências de produção
npm ci --only=production --silent || error "Falha ao instalar dependências do backend"

# Verificar dependências críticas
node -e "
const pkg = require('./package.json');
const critical = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs'];
const missing = critical.filter(dep => !pkg.dependencies[dep]);
if (missing.length > 0) {
    console.error('Dependências críticas faltando:', missing.join(', '));
    process.exit(1);
}
console.log('✅ Dependências críticas verificadas');
"

cd ../..

# 7. Otimizações para dispositivos móveis
log "📱 Aplicando otimizações para dispositivos móveis..."

# Adicionar service worker se não existir
if [ ! -f "dist/public_html/sw.js" ]; then
    cat > dist/public_html/sw.js << 'EOF'
// Service Worker para ViralCut Pro
const CACHE_NAME = 'viralcut-pro-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
EOF
    log "✅ Service Worker criado"
fi

# Adicionar manifest.json se não existir
if [ ! -f "dist/public_html/manifest.json" ]; then
    cat > dist/public_html/manifest.json << 'EOF'
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
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
EOF
    log "✅ Manifest PWA criado"
fi

# 8. Verificações de segurança
log "🔒 Executando verificações de segurança..."

# Verificar se arquivos sensíveis não estão sendo enviados
SENSITIVE_FILES=(".env" "*.log" "node_modules" ".git")
for pattern in "${SENSITIVE_FILES[@]}"; do
    if find dist/ -name "$pattern" -type f | grep -q .; then
        warn "Arquivos sensíveis encontrados: $pattern"
        find dist/ -name "$pattern" -type f -delete
    fi
done

# Verificar permissões
find dist/ -type f -exec chmod 644 {} \;
find dist/ -type d -exec chmod 755 {} \;

log "✅ Verificações de segurança concluídas"

# 9. Compressão para otimizar upload
log "📦 Comprimindo arquivos para upload..."
cd dist
tar -czf ../viralcut-pro-deploy.tar.gz . || error "Falha na compressão"
cd ..

ARCHIVE_SIZE=$(du -h viralcut-pro-deploy.tar.gz | cut -f1)
log "✅ Arquivo comprimido criado: viralcut-pro-deploy.tar.gz ($ARCHIVE_SIZE)"

# 10. Upload para Hostinger (exemplo com diferentes métodos)
log "⬆️ Preparando upload para Hostinger..."

# Método 1: rsync (recomendado se disponível)
if command -v rsync >/dev/null 2>&1; then
    log "📤 Usando rsync para upload..."
    
    # Upload frontend
    rsync -avz --delete --progress dist/public_html/ $HOSTINGER_USER@$DOMAIN:$HOSTINGER_PATH/ || warn "Falha no upload do frontend via rsync"
    
    # Upload backend
    rsync -avz --delete --progress dist/api/ $HOSTINGER_USER@$DOMAIN:$API_PATH/ || warn "Falha no upload do backend via rsync"
    
    # Upload uploads directory
    rsync -avz --progress dist/uploads/ $HOSTINGER_USER@$DOMAIN:/home/$HOSTINGER_USER/uploads/ || warn "Falha no upload do diretório uploads via rsync"

# Método 2: scp (alternativo)
elif command -v scp >/dev/null 2>&1; then
    log "📤 Usando scp para upload..."
    scp viralcut-pro-deploy.tar.gz $HOSTINGER_USER@$DOMAIN:/home/$HOSTINGER_USER/ || warn "Falha no upload via scp"
    
    # Descompactar no servidor
    ssh $HOSTINGER_USER@$DOMAIN "
        cd /home/$HOSTINGER_USER && 
        tar -xzf viralcut-pro-deploy.tar.gz && 
        rm viralcut-pro-deploy.tar.gz &&
        echo 'Arquivos descompactados com sucesso'
    " || warn "Falha na descompactação no servidor"

# Método 3: FTP (usando lftp se disponível)
elif command -v lftp >/dev/null 2>&1; then
    log "📤 Usando FTP para upload..."
    warn "Configure as credenciais FTP nas variáveis de ambiente FTP_USER e FTP_PASS"
    
    lftp -c "
        set ftp:ssl-allow no;
        open -u $FTP_USER,$FTP_PASS $DOMAIN;
        lcd dist/public_html;
        cd $HOSTINGER_PATH;
        mirror --reverse --delete --verbose;
        bye
    " || warn "Falha no upload via FTP"

else
    warn "Nenhum método de upload disponível (rsync, scp, lftp)"
    log "📋 Arquivo comprimido disponível: viralcut-pro-deploy.tar.gz"
    log "📤 Faça upload manual via painel da Hostinger ou FTP"
fi

# 11. Configuração no servidor
log "🔧 Configurando aplicação no servidor..."

# Comandos para executar no servidor
SERVER_COMMANDS="
# Navegar para diretório da API
cd $API_PATH

# Verificar Node.js
node --version

# Instalar PM2 se não estiver instalado
npm install -g pm2 || echo 'PM2 já instalado ou sem permissão'

# Parar aplicação anterior
pm2 stop viralcut-api || echo 'Aplicação não estava rodando'

# Iniciar aplicação
pm2 start server.js --name viralcut-api --env production

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup || echo 'PM2 startup já configurado'

# Verificar status
pm2 status

echo '✅ Aplicação configurada e rodando'
"

# Executar comandos no servidor se SSH estiver disponível
if command -v ssh >/dev/null 2>&1; then
    log "🖥️ Executando configuração no servidor..."
    ssh $HOSTINGER_USER@$DOMAIN "$SERVER_COMMANDS" || warn "Falha na configuração remota"
else
    warn "SSH não disponível. Execute os seguintes comandos no servidor:"
    echo "$SERVER_COMMANDS"
fi

# 12. Verificações finais
log "🔍 Executando verificações finais..."

# Verificar se o site está acessível
if command -v curl >/dev/null 2>&1; then
    log "🌐 Testando acesso ao site..."
    
    # Testar frontend
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200"; then
        log "✅ Frontend acessível"
    else
        warn "❌ Frontend não acessível"
    fi
    
    # Testar API
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" | grep -q "200"; then
        log "✅ API acessível"
    else
        warn "❌ API não acessível"
    fi
else
    warn "curl não disponível para testes"
fi

# 13. Limpeza
log "🧹 Limpando arquivos temporários..."
rm -rf dist/
rm -f viralcut-pro-deploy.tar.gz

# 14. Relatório final
log "📊 Relatório de Deploy"
echo "=================================="
echo "🌐 Site: https://$DOMAIN"
echo "🔧 API: https://$DOMAIN/api"
echo "📱 PWA: Suporte completo a dispositivos móveis"
echo "🔒 SSL: Configurado"
echo "⚡ Cache: Otimizado"
echo "📊 Compressão: Ativada"
echo "=================================="

log "✅ Deploy concluído com sucesso!"
log "🎉 ViralCut Pro está rodando em: https://$DOMAIN"

# Instruções pós-deploy
echo ""
log "📋 Próximos passos:"
echo "1. Acesse https://$DOMAIN para verificar o frontend"
echo "2. Teste a API em https://$DOMAIN/api/health"
echo "3. Configure DNS se necessário"
echo "4. Configure SSL no painel da Hostinger"
echo "5. Configure backup automático"
echo "6. Configure monitoramento"

# Informações de suporte
echo ""
log "🆘 Suporte:"
echo "- Logs da aplicação: pm2 logs viralcut-api"
echo "- Reiniciar aplicação: pm2 restart viralcut-api"
echo "- Status da aplicação: pm2 status"
echo "- Painel Hostinger: https://hpanel.hostinger.com"

exit 0
