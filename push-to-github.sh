#!/bin/bash

# ViralCut Pro - Push para GitHub
# Execute: chmod +x push-to-github.sh && ./push-to-github.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 ViralCut Pro - Push para GitHub${NC}"
echo "============================================"

# Verificar se Git está configurado
if ! git config user.name &> /dev/null; then
    echo -e "${YELLOW}⚙️ Configurando Git...${NC}"
    echo -e "${BLUE}Digite seu nome para o Git:${NC}"
    read -p "Nome: " git_name
    git config --global user.name "$git_name"
fi

if ! git config user.email &> /dev/null; then
    echo -e "${BLUE}Digite seu email para o Git:${NC}"
    read -p "Email: " git_email
    git config --global user.email "$git_email"
fi

# Solicitar informações do repositório
echo -e "${YELLOW}📝 Configuração do Repositório GitHub${NC}"
echo -e "${BLUE}Digite seu username do GitHub:${NC}"
read -p "Username: " github_username

echo -e "${BLUE}Digite o nome do repositório (padrão: viralcut-pro):${NC}"
read -p "Repositório: " repo_name
repo_name=${repo_name:-viralcut-pro}

# Configurar remote
echo -e "${YELLOW}🔗 Configurando repositório remoto...${NC}"
git_url="https://github.com/${github_username}/${repo_name}.git"

# Remover remote existente se houver
git remote remove origin 2>/dev/null || true

# Adicionar novo remote
git remote add origin "$git_url"

# Renomear branch para main
git branch -M main

# Fazer push
echo -e "${YELLOW}📤 Fazendo push para GitHub...${NC}"
echo -e "${BLUE}URL: ${git_url}${NC}"

if git push -u origin main; then
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
    echo ""
    echo -e "${BLUE}🎯 Próximos passos:${NC}"
    echo "1. 🌐 Acesse: https://github.com/${github_username}/${repo_name}"
    echo "2. 🚀 Vá para: https://render.com"
    echo "3. 📋 Siga as instruções em: DEPLOY_RENDER_INSTRUCTIONS.md"
    echo ""
    echo -e "${GREEN}🎉 Seu código está no GitHub e pronto para deploy!${NC}"
else
    echo -e "${RED}❌ Erro no push. Verifique se:${NC}"
    echo "- O repositório existe no GitHub"
    echo "- Você tem permissão de escrita"
    echo "- Suas credenciais estão corretas"
    echo ""
    echo -e "${YELLOW}💡 Crie o repositório manualmente em:${NC}"
    echo "https://github.com/new"
    echo "Nome: ${repo_name}"
    echo "Descrição: AI-powered video editor for viral content"
fi
