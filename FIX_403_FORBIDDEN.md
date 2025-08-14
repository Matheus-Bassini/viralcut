# 🔧 Corrigir Erro 403 Forbidden - matheusbassini.com.br

## ❌ Problema: 403 Forbidden Page

O erro 403 Forbidden na Hostinger geralmente acontece por:
1. **Permissões de arquivo incorretas**
2. **Arquivo index.html não encontrado**
3. **Configuração .htaccess problemática**
4. **Estrutura de diretórios incorreta**

---

## 🛠️ Soluções Passo a Passo

### ✅ Solução 1: Verificar Estrutura de Arquivos

#### 1.1 Estrutura Correta no Servidor
```
public_html/
├── index.html          ← DEVE EXISTIR na raiz
├── assets/
│   ├── css/
│   └── js/
├── .htaccess           ← Configuração Apache
└── api/
    ├── server.js
    ├── package.json
    └── src/
```

#### 1.2 Verificar se index.html existe
- Acesse **Painel Hostinger** → **Gerenciador de Arquivos**
- Vá para `public_html/`
- **DEVE ter um arquivo `index.html` na raiz**

---

### ✅ Solução 2: Corrigir Permissões

#### 2.1 Via Painel Hostinger
1. **Gerenciador de Arquivos** → `public_html/`
2. **Clique direito** no arquivo `index.html`
3. **Permissões** → Definir como **644**
4. **Clique direito** na pasta `public_html/`
5. **Permissões** → Definir como **755**

#### 2.2 Via SSH (se disponível)
```bash
# Conectar via SSH
ssh seu-usuario@matheusbassini.com.br

# Corrigir permissões
chmod 644 public_html/index.html
chmod 755 public_html/
chmod -R 644 public_html/*.html
chmod -R 755 public_html/assets/
```

---

### ✅ Solução 3: .htaccess Simplificado

#### 3.1 Criar .htaccess Básico
Se o .htaccess está causando problema, substitua por uma versão simples:

```apache
# .htaccess Simplificado para matheusbassini.com.br
RewriteEngine On

# Força HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA Routing - React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Headers básicos
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
</IfModule>
```

#### 3.2 Aplicar .htaccess Corrigido
1. **Painel Hostinger** → **Gerenciador de Arquivos**
2. Editar arquivo `.htaccess` em `public_html/`
3. Substituir conteúdo pelo código acima
4. **Salvar**

---

### ✅ Solução 4: Verificar Configuração do Domínio

#### 4.1 DNS e Apontamento
1. **Painel Hostinger** → **Domínios**
2. Verificar se `matheusbassini.com.br` está apontando corretamente
3. **DNS Zone** deve ter:
   - **A Record**: `@` → IP do servidor
   - **CNAME**: `www` → `matheusbassini.com.br`

#### 4.2 SSL Certificate
1. **Painel Hostinger** → **SSL**
2. Verificar se SSL está **ATIVO** para matheusbassini.com.br
3. Se não estiver, **ativar SSL gratuito**

---

### ✅ Solução 5: Recriar Deploy Limpo

#### 5.1 Script de Deploy Corrigido
```bash
#!/bin/bash
echo "🔧 Deploy Corrigido - matheusbassini.com.br"

# Limpar deploy anterior
rm -rf matheusbassini-deploy-fix
mkdir -p matheusbassini-deploy-fix/public_html

# Build frontend
cd frontend
npm ci
npm run build
cd ..

# Copiar arquivos do build
cp -r frontend/dist/* matheusbassini-deploy-fix/public_html/

# Verificar se index.html existe
if [ ! -f "matheusbassini-deploy-fix/public_html/index.html" ]; then
    echo "❌ ERRO: index.html não foi gerado!"
    exit 1
fi

# .htaccess simplificado
cat > matheusbassini-deploy-fix/public_html/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

echo "✅ Deploy corrigido em: matheusbassini-deploy-fix/"
echo "📁 Faça upload de public_html/ para o servidor"
```

#### 5.2 Executar Deploy Corrigido
```bash
# Salvar script acima como deploy-fix.sh
chmod +x deploy-fix.sh
./deploy-fix.sh
```

---

### ✅ Solução 6: Teste Manual

#### 6.1 Criar index.html Simples para Teste
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ViralCut Pro - Teste</title>
</head>
<body>
    <h1>🎬 ViralCut Pro</h1>
    <p>Site funcionando! matheusbassini.com.br</p>
    <p>Desenvolvido por Matheus Bassini</p>
</body>
</html>
```

#### 6.2 Upload Manual
1. **Painel Hostinger** → **Gerenciador de Arquivos**
2. Ir para `public_html/`
3. **Upload** do arquivo `index.html` acima
4. Testar: https://matheusbassini.com.br

---

### ✅ Solução 7: Verificar Logs de Erro

#### 7.1 Acessar Logs
1. **Painel Hostinger** → **Advanced** → **Error Logs**
2. Verificar logs recentes
3. Procurar por erros relacionados ao domínio

#### 7.2 Logs Comuns e Soluções
- **"File does not exist"** → Arquivo index.html ausente
- **"Permission denied"** → Permissões incorretas (usar 644/755)
- **"Invalid command"** → Problema no .htaccess

---

## 🚀 Checklist de Correção

### ✅ Verificações Obrigatórias
- [ ] ✅ Arquivo `index.html` existe em `public_html/`
- [ ] ✅ Permissões: `index.html` = 644, `public_html/` = 755
- [ ] ✅ .htaccess não tem erros de sintaxe
- [ ] ✅ SSL ativo no domínio
- [ ] ✅ DNS apontando corretamente
- [ ] ✅ Sem arquivos corrompidos

### 🧪 Testes
```bash
# 1. Teste básico
curl -I https://matheusbassini.com.br
# Deve retornar: 200 OK

# 2. Teste sem HTTPS
curl -I http://matheusbassini.com.br
# Deve retornar: 301 redirect

# 3. Teste arquivo específico
curl https://matheusbassini.com.br/index.html
# Deve retornar: conteúdo HTML
```

---

## 📞 Suporte Imediato

### 🛠️ Matheus Bassini
- **📧 Email**: suporte@matheusbassini.com.br
- **📱 WhatsApp**: +55 12 99225-7085
- **💬 Discord**: matheusbassini

### 🆘 Se Nada Funcionar
1. **Contate o suporte da Hostinger**
2. **Verifique se a conta não está suspensa**
3. **Tente acessar via IP direto**
4. **Considere recriar o domínio no painel**

---

## 🎯 Solução Mais Provável

**O problema mais comum é a ausência do arquivo `index.html` na raiz do `public_html/`.**

### ✅ Solução Rápida
1. Execute: `./deploy-matheusbassini.sh`
2. Verifique se foi gerado: `matheusbassini-deploy/public_html/index.html`
3. Faça upload de **TODO** o conteúdo de `public_html/` para o servidor
4. Defina permissões: 644 para arquivos, 755 para pastas
5. Teste: https://matheusbassini.com.br

**🎉 Isso deve resolver o erro 403 Forbidden!**
