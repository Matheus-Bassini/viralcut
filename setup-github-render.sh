#!/bin/bash

# ViralCut Pro - Setup GitHub + Render Deploy
# Este script configura o repositório GitHub e prepara para deploy no Render

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 ViralCut Pro - Setup GitHub + Render${NC}"
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não está instalado${NC}"
    exit 1
fi

# Passo 1: Configurar Git (se necessário)
echo -e "${YELLOW}🔧 Configurando Git...${NC}"

# Verificar se já tem configuração global
if ! git config --global user.name &> /dev/null; then
    echo -e "${YELLOW}📝 Configure seu nome de usuário Git:${NC}"
    read -p "Nome: " git_name
    git config --global user.name "$git_name"
fi

if ! git config --global user.email &> /dev/null; then
    echo -e "${YELLOW}📧 Configure seu email Git:${NC}"
    read -p "Email: " git_email
    git config --global user.email "$git_email"
fi

# Passo 2: Inicializar repositório Git
echo -e "${YELLOW}📁 Inicializando repositório Git...${NC}"

if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Repositório Git inicializado${NC}"
else
    echo -e "${GREEN}✅ Repositório Git já existe${NC}"
fi

# Passo 3: Criar README principal
echo -e "${YELLOW}📄 Criando README.md...${NC}"
cp README-GITHUB.md README.md

# Passo 4: Adicionar arquivos ao Git
echo -e "${YELLOW}📦 Adicionando arquivos ao Git...${NC}"
git add .

# Passo 5: Fazer commit inicial
echo -e "${YELLOW}💾 Fazendo commit inicial...${NC}"
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️ Nenhuma mudança para commit${NC}"
else
    git commit -m "🎬 Initial commit: ViralCut Pro - AI Video Editor

✨ Features:
- 🤖 AI-powered video cutting
- 📱 Multi-platform optimization (TikTok, Instagram, YouTube)
- 🔐 Complete authentication system with 2FA
- 💳 Payment integration (Stripe/PayPal)
- 🌍 Multi-language support (PT-BR, EN, ES)
- 📱 Fully responsive design
- ☁️ Ready for Render deployment

🛠️ Tech Stack:
- Backend: Node.js + Express + MySQL + Sequelize
- Frontend: React 18 + Redux Toolkit + Material-UI
- Database: MySQL (Hostinger)
- Deploy: Render (free tier)

🚀 Ready to deploy!"
    echo -e "${GREEN}✅ Commit realizado com sucesso${NC}"
fi

# Passo 6: Configurar repositório remoto
echo -e "${YELLOW}🌐 Configurando repositório remoto...${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo ""
echo "1. 🌐 Crie um repositório no GitHub:"
echo "   - Acesse: https://github.com/new"
echo "   - Nome: viralcut-pro"
echo "   - Descrição: AI-powered video editor for viral content"
echo "   - Público ou Privado (sua escolha)"
echo "   - NÃO inicialize com README, .gitignore ou license"
echo ""
echo "2. 🔗 Conecte este repositório local com o GitHub:"
echo "   Copie e execute os comandos que o GitHub mostrar, ou:"
echo ""
echo -e "${GREEN}   git remote add origin https://github.com/SEU-USUARIO/viralcut-pro.git${NC}"
echo -e "${GREEN}   git branch -M main${NC}"
echo -e "${GREEN}   git push -u origin main${NC}"
echo ""
echo "3. 🚀 Deploy no Render:"
echo "   - Acesse: https://render.com"
echo "   - Clique em 'New +' > 'Blueprint'"
echo "   - Conecte seu repositório GitHub"
echo "   - O Render detectará automaticamente o render.yaml"
echo "   - Clique em 'Apply' para fazer deploy"
echo ""

# Passo 7: Criar arquivo de instruções específicas
cat > DEPLOY_RENDER_INSTRUCTIONS.md << 'EOF'
# 🚀 Deploy ViralCut Pro no Render

## ✅ Pré-requisitos Concluídos
- ✅ Código commitado no Git
- ✅ Configuração render.yaml criada
- ✅ Variáveis de ambiente configuradas
- ✅ Banco MySQL da Hostinger configurado

## 📋 Passos para Deploy

### 1. 🌐 Criar Repositório GitHub
1. Acesse [GitHub](https://github.com/new)
2. Nome: `viralcut-pro`
3. Descrição: `AI-powered video editor for viral content`
4. **NÃO** inicialize com README
5. Clique em "Create repository"

### 2. 🔗 Conectar Repositório Local
```bash
# Substitua SEU-USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU-USUARIO/viralcut-pro.git
git branch -M main
git push -u origin main
```

### 3. 🚀 Deploy no Render
1. Acesse [Render](https://render.com)
2. Faça login com GitHub
3. Clique em **"New +"** > **"Blueprint"**
4. Selecione seu repositório `viralcut-pro`
5. O Render detectará automaticamente o `render.yaml`
6. Clique em **"Apply"** para iniciar o deploy

### 4. ⚙️ Configurar Variáveis de Ambiente
O Render configurará automaticamente a maioria das variáveis, mas você pode precisar ajustar:

**No painel do Render > viralcut-api > Environment:**
- `EMAIL_USER`: seu-email@gmail.com
- `EMAIL_PASS`: sua-senha-de-app-gmail

### 5. 🧪 Testar Deploy
Após o deploy (5-10 minutos):
- **Frontend**: https://viralcut-frontend.onrender.com
- **API**: https://viralcut-api.onrender.com/api/health

## 🔧 Comandos Úteis

### Atualizar Código
```bash
git add .
git commit -m "Update: descrição da mudança"
git push
```

### Ver Logs no Render
1. Acesse o dashboard do Render
2. Clique no serviço (viralcut-api ou viralcut-frontend)
3. Vá na aba "Logs"

### Redeploy Manual
1. No dashboard do Render
2. Clique no serviço
3. Clique em "Manual Deploy" > "Deploy latest commit"

## 🎯 URLs Finais
Após o deploy bem-sucedido:
- 🌐 **App**: https://viralcut-frontend.onrender.com
- 🔧 **API**: https://viralcut-api.onrender.com
- ❤️ **Health**: https://viralcut-api.onrender.com/api/health

## 🚨 Troubleshooting

### Deploy Falhou
1. Verifique os logs no Render
2. Certifique-se que o banco MySQL está acessível
3. Verifique se todas as variáveis estão configuradas

### Erro de Conexão com Banco
1. Verifique se o IP do Render está liberado no MySQL
2. Teste a conexão manualmente
3. Verifique credenciais do banco

### Frontend não carrega
1. Verifique se o build foi bem-sucedido
2. Verifique se a variável VITE_API_URL está correta
3. Verifique os logs do frontend

## 💡 Dicas
- O Render faz deploy automático a cada push no GitHub
- Use branches para testar mudanças
- O plano gratuito tem algumas limitações de recursos
- Monitore os logs regularmente

## 🎉 Sucesso!
Se tudo funcionou, você terá:
- ✅ App rodando no Render
- ✅ Deploy automático configurado
- ✅ Banco MySQL conectado
- ✅ SSL automático
- ✅ Monitoramento integrado
EOF

echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo -e "${BLUE}📄 Arquivo criado: DEPLOY_RENDER_INSTRUCTIONS.md${NC}"
echo -e "${BLUE}📖 Leia as instruções detalhadas neste arquivo${NC}"
echo ""
echo -e "${YELLOW}🎯 Próximo passo: Criar repositório no GitHub e fazer push${NC}"
echo ""
echo -e "${GREEN}🎉 Seu ViralCut Pro está pronto para deploy no Render!${NC}"
