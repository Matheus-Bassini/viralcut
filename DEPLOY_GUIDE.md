# ViralCut Pro - Guia Completo de Deploy

## 🎯 Opções de Hospedagem

### 1. 🏠 Hostinger (Recomendado para você)
**Vantagens:**
- Você já tem o banco MySQL configurado
- Suporte a Node.js
- SSL gratuito
- Painel de controle fácil

### 2. ☁️ Render (Alternativa gratuita)
**Vantagens:**
- Deploy automático via GitHub
- SSL gratuito
- Fácil configuração
- Boa para testes

### 3. 🚀 Vercel + PlanetScale
**Vantagens:**
- Deploy super rápido
- Integração com GitHub
- Banco MySQL serverless

---

## 🏠 DEPLOY NA HOSTINGER

### Pré-requisitos
- ✅ Conta Hostinger com plano Business/VPS
- ✅ Banco MySQL já configurado
- ✅ Acesso SSH ou painel de arquivos

### Passo 1: Preparar arquivos localmente

```bash
# 1. Instalar dependências
npm run install:all

# 2. Fazer build do frontend
cd frontend && npm run build

# 3. Preparar arquivos para upload
chmod +x deploy-hostinger.sh
./deploy-hostinger.sh
```

### Passo 2: Upload via painel Hostinger

1. **Acesse o painel da Hostinger**
2. **Vá em "Gerenciador de Arquivos"**
3. **Navegue até public_html**
4. **Faça upload dos arquivos:**
   - `frontend/dist/*` → `public_html/`
   - `backend/*` → `public_html/api/`
   - `.htaccess` → `public_html/`

### Passo 3: Configurar Node.js na Hostinger

1. **No painel, vá em "Node.js"**
2. **Criar nova aplicação:**
   - **Versão:** 18.x
   - **Diretório:** `public_html/api`
   - **Arquivo de inicialização:** `server.js`
   - **Variáveis de ambiente:** Copie do `.env.hostinger`

### Passo 4: Instalar dependências no servidor

```bash
# Via SSH (se disponível)
ssh usuario@seudominio.com
cd public_html/api
npm install --production

# Ou via painel Node.js da Hostinger
# Clique em "Install Dependencies"
```

### Passo 5: Configurar variáveis de ambiente

No painel Node.js da Hostinger, adicione:

```env
NODE_ENV=production
PORT=3000
DB_HOST=srv1883.hstgr.io
DB_NAME=u206326127_viralcut
DB_USER=u206326127_host
DB_PASS=@Host1603
JWT_SECRET=sua-chave-jwt-super-secreta
FRONTEND_URL=https://seudominio.com
```

### Passo 6: Iniciar aplicação

1. **No painel Node.js, clique em "Start Application"**
2. **Verificar logs para erros**
3. **Testar:** `https://seudominio.com/api/health`

---

## ☁️ DEPLOY NO RENDER (Alternativa)

### Passo 1: Preparar repositório GitHub

```bash
# 1. Criar repositório no GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/viralcut-pro.git
git push -u origin main
```

### Passo 2: Configurar banco de dados

**Opção A: PlanetScale (MySQL gratuito)**
1. Criar conta em planetscale.com
2. Criar database "viralcut-pro"
3. Copiar string de conexão

**Opção B: Railway MySQL**
1. Criar conta em railway.app
2. Adicionar MySQL service
3. Copiar credenciais

### Passo 3: Deploy no Render

1. **Acesse render.com**
2. **Conecte seu GitHub**
3. **Criar Web Service:**
   - **Repository:** seu-repo/viralcut-pro
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Adicionar variáveis de ambiente:**
```env
NODE_ENV=production
DB_HOST=seu-host-planetscale
DB_NAME=viralcut-pro
DB_USER=seu-usuario
DB_PASS=sua-senha
JWT_SECRET=sua-chave-jwt
FRONTEND_URL=https://seu-app.onrender.com
```

### Passo 4: Deploy do Frontend

1. **Criar Static Site no Render:**
   - **Repository:** mesmo repositório
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

---

## 🚀 DEPLOY NO VERCEL + PLANETSCALE

### Passo 1: Configurar PlanetScale

```bash
# 1. Instalar CLI
npm install -g @planetscale/cli

# 2. Login e criar database
pscale auth login
pscale database create viralcut-pro

# 3. Criar branch de produção
pscale branch create viralcut-pro main
```

### Passo 2: Deploy Backend no Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy do backend
cd backend
vercel

# 3. Configurar variáveis de ambiente no dashboard
```

### Passo 3: Deploy Frontend no Vercel

```bash
cd frontend
vercel

# Configurar variáveis:
# VITE_API_URL=https://seu-backend.vercel.app
```

---

## 🔧 CONFIGURAÇÕES ESPECÍFICAS

### Para Hostinger

**Arquivo: `backend/hostinger.config.js`**
```javascript
module.exports = {
  apps: [{
    name: 'viralcut-api',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### Para Render

**Arquivo: `render.yaml`**
```yaml
services:
  - type: web
    name: viralcut-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### Para Vercel

**Arquivo: `vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

---

## 🧪 TESTES PÓS-DEPLOY

### 1. Testar API
```bash
# Health check
curl https://seudominio.com/api/health

# Registro de usuário
curl -X POST https://seudominio.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "MinhaSenh@123",
    "firstName": "Teste",
    "lastName": "Usuario"
  }'
```

### 2. Testar Frontend
- ✅ Página carrega corretamente
- ✅ Formulários funcionam
- ✅ Responsividade em mobile/tablet
- ✅ PWA funciona offline

### 3. Testar Banco de Dados
- ✅ Conexão estabelecida
- ✅ Tabelas criadas automaticamente
- ✅ Dados sendo salvos

---

## 🚨 TROUBLESHOOTING

### Erro de Conexão MySQL
```bash
# Verificar se IP está na whitelist
# Verificar credenciais no .env
# Testar conexão direta:
mysql -h srv1883.hstgr.io -u u206326127_host -p u206326127_viralcut
```

### Erro 500 na API
```bash
# Verificar logs
pm2 logs viralcut-api

# Verificar variáveis de ambiente
pm2 env viralcut-api
```

### Frontend não carrega
- Verificar se build foi feito corretamente
- Verificar se .htaccess está configurado
- Verificar se API_URL está correto

---

## 📊 MONITORAMENTO

### Logs na Hostinger
```bash
# Via SSH
tail -f /home/usuario/logs/error.log
tail -f /home/usuario/logs/access.log

# Via painel Node.js
# Seção "Logs" no painel
```

### Métricas importantes
- ✅ Tempo de resposta da API
- ✅ Uso de CPU e memória
- ✅ Conexões simultâneas
- ✅ Erros 4xx/5xx

---

## 🔒 SEGURANÇA EM PRODUÇÃO

### SSL/HTTPS
- ✅ Certificado SSL ativo
- ✅ Redirecionamento HTTP → HTTPS
- ✅ Headers de segurança configurados

### Backup
```bash
# Backup automático do banco (cron job)
0 2 * * * mysqldump -h srv1883.hstgr.io -u u206326127_host -p@Host1603 u206326127_viralcut > backup_$(date +%Y%m%d).sql
```

### Monitoramento
- ✅ Uptime monitoring
- ✅ Error tracking (Sentry)
- ✅ Performance monitoring

---

## 🎉 PRÓXIMOS PASSOS

1. **Escolher plataforma de deploy**
2. **Configurar domínio personalizado**
3. **Configurar SSL**
4. **Implementar CI/CD**
5. **Configurar monitoramento**
6. **Fazer backup inicial**

**Recomendação:** Comece com a Hostinger já que você tem o MySQL configurado, e depois pode migrar para outras plataformas se necessário.
