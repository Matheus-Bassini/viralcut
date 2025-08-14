#!/bin/bash

# ViralCut Pro - Script de Deploy Simplificado para Hostinger
# Execute: chmod +x deploy-to-hostinger.sh && ./deploy-to-hostinger.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 ViralCut Pro - Deploy para Hostinger${NC}"
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

# Passo 1: Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm run install:all

# Passo 2: Build do frontend
echo -e "${YELLOW}🏗️ Fazendo build do frontend...${NC}"
cd frontend
npm run build
cd ..

# Passo 3: Preparar estrutura para Hostinger
echo -e "${YELLOW}📁 Preparando arquivos para Hostinger...${NC}"
rm -rf hostinger-deploy/
mkdir -p hostinger-deploy/public_html
mkdir -p hostinger-deploy/api

# Copiar frontend build para public_html
cp -r frontend/dist/* hostinger-deploy/public_html/
cp public_html/.htaccess hostinger-deploy/public_html/

# Copiar backend para api
cp -r backend/* hostinger-deploy/api/
cp backend/.env.hostinger hostinger-deploy/api/.env

# Remover arquivos desnecessários
rm -rf hostinger-deploy/api/node_modules/
rm -rf hostinger-deploy/api/.git/
rm -rf hostinger-deploy/api/tests/

# Passo 4: Criar arquivo de configuração PM2 para Hostinger
cat > hostinger-deploy/api/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'viralcut-api',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Passo 5: Criar script de instalação para o servidor
cat > hostinger-deploy/install-on-server.sh << 'EOF'
#!/bin/bash
echo "🔧 Configurando ViralCut Pro no servidor..."

# Criar diretórios necessários
mkdir -p logs
mkdir -p uploads

# Instalar dependências de produção
npm ci --only=production

# Instalar PM2 globalmente (se não estiver instalado)
npm install -g pm2 || echo "PM2 já instalado"

# Parar aplicação anterior
pm2 stop viralcut-api || echo "Nenhuma aplicação rodando"

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup || echo "PM2 startup já configurado"

echo "✅ ViralCut Pro configurado com sucesso!"
echo "🌐 Teste: curl http://localhost:3000/api/health"
EOF

chmod +x hostinger-deploy/install-on-server.sh

# Passo 6: Criar arquivo README para o deploy
cat > hostinger-deploy/README-DEPLOY.md << 'EOF'
# Deploy ViralCut Pro na Hostinger

## 📋 Passos para Deploy

### 1. Upload dos Arquivos
- Faça upload de `public_html/*` para `/public_html/` na Hostinger
- Faça upload de `api/*` para `/public_html/api/` na Hostinger

### 2. Configurar Node.js no Painel Hostinger
1. Acesse o painel da Hostinger
2. Vá em "Node.js"
3. Criar nova aplicação:
   - **Versão:** 18.x
   - **Diretório:** `public_html/api`
   - **Arquivo de inicialização:** `server.js`

### 3. Configurar Variáveis de Ambiente
No painel Node.js, adicione as variáveis do arquivo `.env`

### 4. Instalar no Servidor
Via SSH ou terminal do painel:
```bash
cd public_html/api
chmod +x install-on-server.sh
./install-on-server.sh
```

### 5. Testar
- Frontend: https://seudominio.com
- API: https://seudominio.com/api/health

## 🔧 Comandos Úteis

```bash
# Ver logs
pm2 logs viralcut-api

# Reiniciar aplicação
pm2 restart viralcut-api

# Status da aplicação
pm2 status

# Parar aplicação
pm2 stop viralcut-api
```

## 📞 Suporte
- Logs da aplicação: `/public_html/api/logs/`
- Configuração: `/public_html/api/.env`
- PM2 Config: `/public_html/api/ecosystem.config.js`
EOF

# Passo 7: Compactar para facilitar upload
echo -e "${YELLOW}📦 Compactando arquivos...${NC}"
cd hostinger-deploy
tar -czf ../viralcut-pro-hostinger.tar.gz .
cd ..

# Passo 8: Criar instruções finais
echo -e "${GREEN}✅ Deploy preparado com sucesso!${NC}"
echo ""
echo -e "${BLUE}📁 Arquivos preparados em:${NC}"
echo "   - hostinger-deploy/ (pasta com todos os arquivos)"
echo "   - viralcut-pro-hostinger.tar.gz (arquivo compactado)"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "1. Faça upload dos arquivos para a Hostinger:"
echo "   - hostinger-deploy/public_html/* → /public_html/"
echo "   - hostinger-deploy/api/* → /public_html/api/"
echo ""
echo "2. Configure Node.js no painel da Hostinger:"
echo "   - Versão: 18.x"
echo "   - Diretório: public_html/api"
echo "   - Arquivo: server.js"
echo ""
echo "3. Adicione as variáveis de ambiente do arquivo .env"
echo ""
echo "4. Execute no servidor:"
echo "   cd public_html/api && chmod +x install-on-server.sh && ./install-on-server.sh"
echo ""
echo -e "${GREEN}🎉 Seu ViralCut Pro estará rodando em: https://seudominio.com${NC}"

# Mostrar tamanho dos arquivos
echo ""
echo -e "${BLUE}📊 Informações dos arquivos:${NC}"
du -sh hostinger-deploy/
du -sh viralcut-pro-hostinger.tar.gz

echo ""
echo -e "${YELLOW}💡 Dica: Leia o arquivo DEPLOY_GUIDE.md para instruções detalhadas${NC}"
