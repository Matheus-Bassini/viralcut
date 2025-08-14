# 🚀 Deploy ViralCut Pro no Render - Instruções Completas

## ✅ Status Atual
- ✅ Repositório Git inicializado
- ✅ Código commitado (54 arquivos)
- ✅ Configuração render.yaml criada
- ✅ Variáveis de ambiente configuradas
- ✅ Banco MySQL da Hostinger pronto

## 📋 Próximos Passos (5 minutos)

### 1. 🌐 Criar Repositório no GitHub

1. **Acesse:** https://github.com/new
2. **Preencha:**
   - **Repository name:** `viralcut-pro`
   - **Description:** `🎬 AI-powered video editor for viral content - TikTok, Instagram, YouTube optimization`
   - **Visibility:** Public (recomendado) ou Private
   - **⚠️ NÃO marque:** "Add a README file", "Add .gitignore", "Choose a license"
3. **Clique:** "Create repository"

### 2. 🔗 Conectar e Fazer Push

Copie e execute estes comandos no terminal (substitua `SEU-USUARIO`):

```bash
# Conectar com o repositório GitHub
git remote add origin https://github.com/SEU-USUARIO/viralcut-pro.git

# Renomear branch para main
git branch -M main

# Fazer push inicial
git push -u origin main
```

### 3. 🚀 Deploy Automático no Render

1. **Acesse:** https://render.com
2. **Faça login** com sua conta GitHub
3. **Clique:** "New +" → "Blueprint"
4. **Selecione:** seu repositório `viralcut-pro`
5. **O Render detectará automaticamente** o arquivo `render.yaml`
6. **Clique:** "Apply" para iniciar o deploy

### 4. ⚙️ Configurar Variáveis de Ambiente (Opcional)

A maioria das variáveis será configurada automaticamente, mas você pode ajustar:

**No painel Render → viralcut-api → Environment:**
- `EMAIL_USER`: seu-email@gmail.com
- `EMAIL_PASS`: sua-senha-de-app-gmail
- `STRIPE_SECRET_KEY`: sua-chave-stripe (quando tiver)

## 🎯 URLs Finais (após deploy)

- 🌐 **Frontend:** https://viralcut-frontend.onrender.com
- 🔧 **API:** https://viralcut-api.onrender.com
- ❤️ **Health Check:** https://viralcut-api.onrender.com/api/health

## ⏱️ Tempo de Deploy

- **Primeira vez:** 5-10 minutos
- **Atualizações:** 2-5 minutos
- **Deploy automático:** A cada push no GitHub

## 🧪 Como Testar

### 1. Testar API
```bash
# Health check
curl https://viralcut-api.onrender.com/api/health

# Deve retornar:
{
  "status": "OK",
  "message": "ViralCut Pro API is running",
  "timestamp": "2024-01-XX..."
}
```

### 2. Testar Frontend
- Acesse: https://viralcut-frontend.onrender.com
- Deve carregar a página inicial do ViralCut Pro
- Teste responsividade no mobile

### 3. Testar Registro de Usuário
```bash
curl -X POST https://viralcut-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "MinhaSenh@123",
    "firstName": "Teste",
    "lastName": "Usuario"
  }'
```

## 🔄 Atualizações Futuras

Para atualizar o código:

```bash
# Fazer mudanças no código
git add .
git commit -m "Update: descrição da mudança"
git push

# O Render fará deploy automático!
```

## 🚨 Troubleshooting

### Deploy Falhou?
1. **Verifique logs:** Render Dashboard → Serviço → Logs
2. **Problemas comuns:**
   - Erro de sintaxe no código
   - Dependências faltando
   - Variáveis de ambiente incorretas

### Erro de Conexão com Banco?
1. **Teste conexão:** No log do backend, procure por "MySQL connected"
2. **Verifique:** Se o IP do Render está liberado no MySQL
3. **Credenciais:** Confirme se estão corretas no render.yaml

### Frontend não carrega?
1. **Build falhou:** Verifique logs do frontend
2. **API não conecta:** Verifique se VITE_API_URL está correto
3. **Cache:** Limpe cache do navegador

## 💡 Dicas Importantes

### Plano Gratuito Render
- ✅ **Incluído:** SSL automático, deploy automático, monitoramento
- ⚠️ **Limitações:** 
  - Apps "dormem" após 15min inatividade
  - 750 horas/mês de uso
  - Bandwidth limitado

### Monitoramento
- **Logs em tempo real:** Dashboard → Serviço → Logs
- **Métricas:** Dashboard → Serviço → Metrics
- **Alertas:** Configure no painel

### Performance
- **Primeira requisição:** Pode demorar 30s (cold start)
- **Após aquecimento:** < 1s de resposta
- **Uptime:** 99.9% garantido

## 🎉 Sucesso!

Se tudo funcionou, você terá:

- ✅ **App funcionando** no Render
- ✅ **Deploy automático** configurado
- ✅ **SSL** ativo automaticamente
- ✅ **Banco MySQL** conectado
- ✅ **Monitoramento** integrado
- ✅ **Logs** em tempo real

## 📞 Suporte

### Documentação
- 📖 [Render Docs](https://render.com/docs)
- 📖 [GitHub Docs](https://docs.github.com)

### Problemas?
1. **Verifique logs** no Render
2. **Teste localmente** primeiro
3. **Consulte** DEPLOY_GUIDE.md para outras opções

---

## 🚀 Comandos Resumidos

```bash
# 1. Conectar GitHub (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/viralcut-pro.git
git branch -M main
git push -u origin main

# 2. Acessar Render
# https://render.com → New + → Blueprint → Selecionar repo → Apply

# 3. Testar
# https://viralcut-frontend.onrender.com
# https://viralcut-api.onrender.com/api/health
```

**🎬 Seu ViralCut Pro estará online em poucos minutos!**
