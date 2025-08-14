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
