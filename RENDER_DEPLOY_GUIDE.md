# 🚀 ViralCut Pro - Deploy no Render com Blueprint

## 📋 Passo a Passo Completo

### 1. 🌐 Acesse o Render Dashboard
- Vá para: https://dashboard.render.com
- Faça login ou crie uma conta gratuita

### 2. 🔗 Conecte seu Repositório GitHub
1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Blueprint"**
3. Conecte sua conta do GitHub se ainda não conectou
4. Selecione o repositório: **`Matheus-Bassini/viralcut`**
5. Clique em **"Connect"**

### 3. 🤖 Deploy Automático com Blueprint
O Render vai detectar automaticamente o arquivo `render.yaml` e configurar:

#### ✅ Serviços que serão criados:
- **viralcut-api** (Backend Node.js)
- **viralcut-frontend** (Frontend React)

#### ✅ Configurações automáticas:
- **Backend**: Node.js na porta 10000
- **Frontend**: Site estático com build automático
- **Banco**: MySQL da Hostinger já configurado
- **Variáveis**: JWT secrets gerados automaticamente

### 4. ⚙️ Configuração das Variáveis (Opcional)
As principais variáveis já estão configuradas no `render.yaml`, mas você pode ajustar:

#### Variáveis do Backend:
```
NODE_ENV=production
DB_HOST=srv1883.hstgr.io
DB_NAME=u206326127_viralcut
DB_USER=u206326127_host
DB_PASS=@Host1603
JWT_SECRET=(gerado automaticamente)
```

#### Variáveis do Frontend:
```
VITE_API_URL=(conectado automaticamente ao backend)
```

### 5. 🎯 Processo de Deploy

#### Tempo estimado: 5-10 minutos

1. **Render detecta o Blueprint** ✅
2. **Cria os serviços automaticamente** ✅
3. **Backend**: Instala dependências e inicia servidor ⏳
4. **Frontend**: Build do React e deploy estático ⏳
5. **Conecta frontend ao backend automaticamente** ⏳

### 6. 📱 URLs Finais
Após o deploy, você receberá:

- **Frontend**: `https://viralcut-frontend.onrender.com`
- **Backend API**: `https://viralcut-api.onrender.com`

### 7. ✅ Verificação do Deploy

#### Teste o Backend:
```bash
curl https://viralcut-api.onrender.com/api/health
```
**Resposta esperada:**
```json
{
  "status": "OK",
  "message": "ViralCut Pro API is running",
  "timestamp": "2024-01-XX..."
}
```

#### Teste o Frontend:
- Acesse: `https://viralcut-frontend.onrender.com`
- Deve carregar a página inicial do ViralCut Pro

### 8. 🔧 Troubleshooting

#### Se o deploy falhar:
1. **Verifique os logs** no dashboard do Render
2. **Logs do Backend**: Clique em "viralcut-api" → "Logs"
3. **Logs do Frontend**: Clique em "viralcut-frontend" → "Logs"

#### Problemas comuns:
- **Build timeout**: Normal na primeira vez (pode levar até 15 min)
- **Database connection**: Verifique se o MySQL da Hostinger está ativo
- **Environment variables**: Confirme se estão corretas no dashboard

### 9. 🎬 Funcionalidades Disponíveis

Após o deploy, o ViralCut Pro terá:

#### ✅ Frontend Completo:
- Landing page responsiva
- Sistema de autenticação
- Dashboard do usuário
- Upload de vídeos
- Editor de vídeos
- Multi-idioma (PT-BR, EN, ES)

#### ✅ Backend Completo:
- API REST completa
- Autenticação JWT + 2FA
- Conexão MySQL
- Rate limiting
- Sistema de logs

### 10. 📊 Monitoramento

#### No Dashboard do Render:
- **Metrics**: CPU, memória, requests
- **Logs**: Logs em tempo real
- **Deployments**: Histórico de deploys
- **Settings**: Configurações e variáveis

### 11. 🔄 Atualizações Futuras

Para atualizar o app:
1. Faça push no GitHub
2. Render fará deploy automático
3. Zero downtime deployment

### 12. 💰 Custos

#### Plano Free (Atual):
- **Backend**: 750 horas/mês grátis
- **Frontend**: Ilimitado
- **Bandwidth**: 100GB/mês
- **Sleep após 15min inativo**

#### Para Produção (Upgrade):
- **Starter**: $7/mês (sem sleep)
- **Standard**: $25/mês (mais recursos)

## 🎯 Resumo dos Próximos Passos

1. ✅ **Código no GitHub**: Concluído
2. 🔄 **Acesse Render**: https://dashboard.render.com
3. 🔗 **Conecte repositório**: Matheus-Bassini/viralcut
4. 🤖 **Deploy automático**: Blueprint detectado
5. ⏳ **Aguarde 5-10 min**: Deploy em andamento
6. 🎉 **App online**: URLs disponíveis

## 📞 Suporte

Se precisar de ajuda:
- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status**: https://status.render.com

---

**🎬 Seu ViralCut Pro estará online em poucos minutos!**
