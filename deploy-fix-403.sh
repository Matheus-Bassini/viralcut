#!/bin/bash

echo "🔧 Deploy Corrigido para Erro 403 - matheusbassini.com.br"
echo "========================================================="
echo "🎯 Corrigindo problema de 403 Forbidden"
echo ""

# Verificar se os diretórios existem
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Erro: Diretórios frontend ou backend não encontrados!"
    echo "Execute este script na raiz do projeto ViralCut Pro"
    exit 1
fi

# Limpar deploy anterior
echo "🧹 Limpando deploy anterior..."
rm -rf matheusbassini-deploy-403-fix
mkdir -p matheusbassini-deploy-403-fix/public_html/api

# Build do Frontend com verificações
echo "📦 Buildando Frontend React..."
cd frontend

if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado no frontend!"
    exit 1
fi

echo "   📥 Instalando dependências..."
npm ci --silent

echo "   🔨 Buildando para produção..."
VITE_API_URL=https://matheusbassini.com.br/api npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    echo "❌ Erro: Build do frontend falhou!"
    echo "Verifique os logs acima para erros"
    exit 1
fi

# Verificar se index.html foi gerado
if [ ! -f "dist/index.html" ]; then
    echo "❌ Erro: index.html não foi gerado no build!"
    echo "Isso causa o erro 403 Forbidden"
    exit 1
fi

cd ..

echo "✅ Frontend buildado com sucesso!"
echo "   📄 index.html: $(ls -la frontend/dist/index.html)"

# Copiar arquivos do Frontend
echo "📁 Copiando arquivos do Frontend..."
cp -r frontend/dist/* matheusbassini-deploy-403-fix/public_html/

# Verificar se a cópia foi bem-sucedida
if [ ! -f "matheusbassini-deploy-403-fix/public_html/index.html" ]; then
    echo "❌ Erro: index.html não foi copiado corretamente!"
    echo "Isso causará erro 403 Forbidden"
    exit 1
fi

echo "   ✅ index.html copiado: $(ls -la matheusbassini-deploy-403-fix/public_html/index.html)"

# Criar .htaccess simplificado (sem erros)
echo "🔧 Criando .htaccess simplificado..."
cat > matheusbassini-deploy-403-fix/public_html/.htaccess << 'EOF'
# ViralCut Pro - matheusbassini.com.br
# .htaccess Simplificado para evitar erro 403

RewriteEngine On

# Força HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Headers básicos de segurança
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
</IfModule>

# Compressão básica
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# SPA Routing para React
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Bloquear arquivos sensíveis
<FilesMatch "\.(env|log)$">
    Order allow,deny
    Deny from all
</FilesMatch>
EOF

echo "   ✅ .htaccess criado"

# Preparar Backend
echo "📦 Preparando Backend Node.js..."
cp -r backend/* matheusbassini-deploy-403-fix/public_html/api/

# Usar configuração de email correta
if [ -f "backend/.env.matheusbassini.final" ]; then
    cp backend/.env.matheusbassini.final matheusbassini-deploy-403-fix/public_html/api/.env
    echo "   ✅ Configuração de email Hostinger aplicada"
else
    echo "   ⚠️  Arquivo .env.matheusbassini.final não encontrado"
fi

# Limpar arquivos desnecessários
rm -f matheusbassini-deploy-403-fix/public_html/api/.env.example
rm -f matheusbassini-deploy-403-fix/public_html/api/.env.hostinger
rm -rf matheusbassini-deploy-403-fix/public_html/api/node_modules
rm -rf matheusbassini-deploy-403-fix/public_html/api/logs

echo "   ✅ Backend preparado"

# Criar arquivo de teste simples
echo "🧪 Criando arquivo de teste..."
cat > matheusbassini-deploy-403-fix/public_html/test.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste - matheusbassini.com.br</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #007bff; }
        .success { color: green; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🎬 ViralCut Pro - Teste</h1>
    <p class="success">✅ Site funcionando corretamente!</p>
    <p><strong>Domínio:</strong> matheusbassini.com.br</p>
    <p><strong>Desenvolvedor:</strong> Matheus Bassini</p>
    <p><strong>Email:</strong> suporte@matheusbassini.com.br</p>
    <hr>
    <p>Se você vê esta página, o erro 403 foi corrigido!</p>
    <p><a href="/">← Voltar para o ViralCut Pro</a></p>
</body>
</html>
EOF

# Criar instruções de instalação específicas para erro 403
cat > matheusbassini-deploy-403-fix/INSTRUCOES_403.md << 'EOF'
# 🔧 Instruções para Corrigir Erro 403

## 📁 1. Upload dos Arquivos
1. Acesse o Painel Hostinger
2. Vá em "Gerenciador de Arquivos"
3. Navegue até a pasta do domínio matheusbassini.com.br
4. **IMPORTANTE**: Faça upload de TODO o conteúdo da pasta `public_html/` para a raiz do domínio

## ✅ 2. Verificar Arquivos Essenciais
Certifique-se que estes arquivos estão na raiz:
- ✅ index.html (OBRIGATÓRIO)
- ✅ .htaccess
- ✅ test.html (para teste)
- ✅ pasta assets/ (com CSS e JS)
- ✅ pasta api/ (backend)

## 🔧 3. Corrigir Permissões
1. Clique direito em "index.html" → Permissões → 644
2. Clique direito na pasta raiz → Permissões → 755
3. Clique direito em ".htaccess" → Permissões → 644

## 🧪 4. Testar
1. Acesse: https://matheusbassini.com.br/test.html
2. Se funcionar, acesse: https://matheusbassini.com.br
3. Se ainda der erro 403, contate: suporte@matheusbassini.com.br

## 🆘 5. Se Ainda Não Funcionar
- Verifique se o SSL está ativo
- Verifique se o domínio está apontando corretamente
- Contate o suporte da Hostinger
- Entre em contato: suporte@matheusbassini.com.br
EOF

# Criar script de instalação no servidor
cat > matheusbassini-deploy-403-fix/install-no-servidor.sh << 'EOF'
#!/bin/bash
echo "🔧 Instalando ViralCut Pro no servidor..."

# Ir para o diretório da API
cd public_html/api

# Instalar dependências
echo "📦 Instalando dependências Node.js..."
npm install --production --silent

# Criar diretório de logs
mkdir -p logs

# Definir permissões corretas
chmod 755 server.js
chmod 600 .env
chmod 755 ../index.html
chmod 644 ../.htaccess

echo "✅ Instalação concluída!"
echo "🌐 Teste: https://matheusbassini.com.br/test.html"
echo "🎬 Site: https://matheusbassini.com.br"
EOF

chmod +x matheusbassini-deploy-403-fix/install-no-servidor.sh

# Verificações finais
echo ""
echo "🔍 Verificações finais..."
echo "========================"

# Verificar arquivos essenciais
files_ok=true

if [ ! -f "matheusbassini-deploy-403-fix/public_html/index.html" ]; then
    echo "❌ ERRO: index.html não encontrado!"
    files_ok=false
else
    echo "✅ index.html: OK"
fi

if [ ! -f "matheusbassini-deploy-403-fix/public_html/.htaccess" ]; then
    echo "❌ ERRO: .htaccess não encontrado!"
    files_ok=false
else
    echo "✅ .htaccess: OK"
fi

if [ ! -f "matheusbassini-deploy-403-fix/public_html/test.html" ]; then
    echo "❌ ERRO: test.html não encontrado!"
    files_ok=false
else
    echo "✅ test.html: OK"
fi

if [ ! -d "matheusbassini-deploy-403-fix/public_html/assets" ]; then
    echo "⚠️  AVISO: pasta assets não encontrada"
else
    echo "✅ assets/: OK"
fi

if [ ! -f "matheusbassini-deploy-403-fix/public_html/api/server.js" ]; then
    echo "❌ ERRO: server.js não encontrado!"
    files_ok=false
else
    echo "✅ server.js: OK"
fi

# Estatísticas
echo ""
echo "📊 Estatísticas do Deploy:"
echo "=========================="
frontend_files=$(find matheusbassini-deploy-403-fix/public_html -maxdepth 1 -name "*.html" -o -name "*.js" -o -name "*.css" | wc -l)
backend_files=$(find matheusbassini-deploy-403-fix/public_html/api -name "*.js" | wc -l)
total_size=$(du -sh matheusbassini-deploy-403-fix | cut -f1)

echo "📁 Arquivos Frontend: $frontend_files"
echo "📁 Arquivos Backend: $backend_files"
echo "💾 Tamanho Total: $total_size"

if [ "$files_ok" = true ]; then
    echo ""
    echo "✅ DEPLOY CORRIGIDO COM SUCESSO!"
    echo "================================"
    echo "📁 Arquivos prontos em: matheusbassini-deploy-403-fix/"
    echo "🌐 Domínio: https://matheusbassini.com.br"
    echo "🧪 Teste: https://matheusbassini.com.br/test.html"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Faça upload da pasta 'public_html/' para o domínio"
    echo "2. Configure permissões: 644 para arquivos, 755 para pastas"
    echo "3. Configure Node.js no painel Hostinger"
    echo "4. Ative SSL no domínio"
    echo "5. Teste: https://matheusbassini.com.br/test.html"
    echo ""
    echo "🎉 Isso deve corrigir o erro 403 Forbidden!"
else
    echo ""
    echo "❌ ERRO NO DEPLOY!"
    echo "=================="
    echo "Alguns arquivos essenciais não foram gerados."
    echo "Verifique os erros acima e tente novamente."
    echo ""
    echo "📞 Suporte: suporte@matheusbassini.com.br"
fi
