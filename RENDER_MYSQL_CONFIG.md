# 🔗 Configuração MySQL Hostinger para Render

## 📋 IPs Outbound do Render Fornecidos

```
44.229.227.142
54.188.71.94
52.13.128.108
```

---

## 🛠️ Configuração no Painel Hostinger

### 1. Acessar Configurações MySQL
1. **Login**: https://hpanel.hostinger.com/
2. **Databases** → **MySQL Databases**
3. **Encontrar**: `u206326127_viralcut`
4. **Clique em**: **Manage** ou **Remote MySQL**

### 2. Adicionar IPs Remotos
**Adicionar cada IP individualmente:**

#### IP 1: 44.229.227.142
- **Host**: `44.229.227.142`
- **Comment**: `Render Outbound IP 1`
- **Clique**: **Add**

#### IP 2: 54.188.71.94
- **Host**: `54.188.71.94`
- **Comment**: `Render Outbound IP 2`
- **Clique**: **Add**

#### IP 3: 52.13.128.108
- **Host**: `52.13.128.108`
- **Comment**: `Render Outbound IP 3`
- **Clique**: **Add**

### 3. Verificar Configuração
Após adicionar, você deve ver:
```
✅ 44.229.227.142 - Render Outbound IP 1
✅ 54.188.71.94 - Render Outbound IP 2
✅ 52.13.128.108 - Render Outbound IP 3
```

---

## 🔧 Configuração do Backend para Render

### Environment Variables no Render
```env
# Database Configuration - Hostinger MySQL
MONGODB_URI=mysql://u206326127_host:@Host1603@srv1883.hstgr.io:3306/u206326127_viralcut
DB_HOST=srv1883.hstgr.io
DB_PORT=3306
DB_NAME=u206326127_viralcut
DB_USER=u206326127_host
DB_PASS=@Host1603

# Email Configuration - Hostinger SMTP
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=suporte@matheusbassini.com.br
EMAIL_PASS=@Suporte1603
EMAIL_FROM=suporte@matheusbassini.com.br

# JWT Configuration
JWT_SECRET=viralcut-pro-jwt-secret-2024-matheusbassini
JWT_REFRESH_SECRET=viralcut-pro-refresh-secret-2024

# Application Configuration
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://viralcut-frontend.onrender.com

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=viralcut-session-secret-2024
```

---

## 🧪 Teste de Conexão MySQL

### 1. Teste via Node.js
```javascript
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'srv1883.hstgr.io',
      port: 3306,
      user: 'u206326127_host',
      password: '@Host1603',
      database: 'u206326127_viralcut'
    });
    
    console.log('✅ MySQL Connected!');
    await connection.end();
  } catch (error) {
    console.error('❌ MySQL Error:', error.message);
  }
}

testConnection();
```

### 2. Teste via Render Service
Adicione este endpoint no seu backend:
```javascript
// Test endpoint for MySQL connection
app.get('/api/test-mysql', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT 1 as test');
    res.json({
      success: true,
      message: 'MySQL connection successful',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MySQL connection failed',
      error: error.message
    });
  }
});
```

---

## 🚀 Deploy no Render

### 1. Configurar Environment Variables
No painel do Render, adicione todas as variáveis acima.

### 2. Verificar Build
```bash
# Build command
npm install && npm run build

# Start command  
npm start
```

### 3. Testar Conexão
Após deploy, teste:
```bash
curl https://seu-backend.onrender.com/api/test-mysql
```

---

## 🔍 Troubleshooting

### ❌ Erro: "Host not allowed"
**Causa**: IP não adicionado na Hostinger
**Solução**: Verificar se os 3 IPs foram adicionados corretamente

### ❌ Erro: "Access denied"
**Causa**: Credenciais incorretas
**Solução**: Verificar usuário/senha no Render

### ❌ Erro: "Connection timeout"
**Causa**: Firewall ou porta bloqueada
**Solução**: Verificar porta 3306 na Hostinger

### ❌ Erro: "Database not found"
**Causa**: Nome do banco incorreto
**Solução**: Verificar `u206326127_viralcut`

---

## 📋 Checklist de Configuração

### ✅ Hostinger MySQL
- [ ] ✅ Adicionar IP: 44.229.227.142
- [ ] ✅ Adicionar IP: 54.188.71.94
- [ ] ✅ Adicionar IP: 52.13.128.108
- [ ] ✅ Verificar usuário: u206326127_host
- [ ] ✅ Verificar senha: @Host1603
- [ ] ✅ Verificar banco: u206326127_viralcut

### ✅ Render Configuration
- [ ] ✅ Environment variables configuradas
- [ ] ✅ Build command: npm install && npm run build
- [ ] ✅ Start command: npm start
- [ ] ✅ Port: 10000
- [ ] ✅ Node version: 18.x

### ✅ Testes
- [ ] ✅ Teste de conexão MySQL
- [ ] ✅ Endpoint /api/health funcionando
- [ ] ✅ Endpoint /api/test-mysql funcionando
- [ ] ✅ Frontend conectando com backend

---

## 🎯 URLs Finais

### 🌐 Render URLs
- **Backend**: https://viralcut-backend.onrender.com
- **Frontend**: https://viralcut-frontend.onrender.com
- **Health Check**: https://viralcut-backend.onrender.com/api/health
- **MySQL Test**: https://viralcut-backend.onrender.com/api/test-mysql

### 🏠 Hostinger URLs
- **Site**: https://matheusbassini.com.br
- **API**: https://matheusbassini.com.br/api
- **Email**: suporte@matheusbassini.com.br

---

## 📞 Suporte

### 👨‍💻 Matheus Bassini
- **📧 Email**: suporte@matheusbassini.com.br
- **📱 WhatsApp**: +55 12 99225-7085
- **💬 Discord**: matheusbassini

### 🆘 Se Não Funcionar
1. **Verificar IPs** na Hostinger
2. **Verificar credenciais** no Render
3. **Testar conexão** local primeiro
4. **Contatar suporte** Hostinger se necessário

---

## 🏆 Resultado Esperado

Após configurar os IPs:
- ✅ **Render conecta** com MySQL Hostinger
- ✅ **Backend funciona** completamente
- ✅ **API endpoints** respondem corretamente
- ✅ **Emails são enviados** via Hostinger SMTP
- ✅ **ViralCut Pro** funciona 100%

**🎯 Configure os IPs agora e teste a conexão!**
