#!/bin/bash

echo "🚨 DEPLOY DE EMERGÊNCIA - matheusbassini.com.br"
echo "================================================"
echo "🎯 Criando solução mínima para testar o domínio"
echo ""

# Criar diretório de emergência
rm -rf emergencia-matheusbassini
mkdir -p emergencia-matheusbassini/public_html

echo "📄 Criando index.html básico..."

# Criar index.html super simples
cat > emergencia-matheusbassini/public_html/index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ViralCut Pro - matheusbassini.com.br</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #fff;
            font-size: 3em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .success {
            color: #4CAF50;
            font-weight: bold;
            font-size: 1.5em;
            margin: 20px 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .info {
            background: rgba(255, 255, 255, 0.2);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .contact {
            margin-top: 30px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .status {
            background: rgba(76, 175, 80, 0.2);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px solid #4CAF50;
        }
        a {
            color: #FFD700;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
        .emoji {
            font-size: 2em;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🎬</div>
        <h1>ViralCut Pro</h1>
        
        <div class="success">✅ SITE FUNCIONANDO!</div>
        
        <div class="status">
            <h3>🌐 Status do Servidor</h3>
            <p><strong>Domínio:</strong> matheusbassini.com.br</p>
            <p><strong>Status:</strong> <span style="color: #4CAF50;">ONLINE</span></p>
            <p><strong>Servidor:</strong> Hostinger</p>
            <p><strong>Data/Hora:</strong> <span id="datetime"></span></p>
        </div>

        <div class="info">
            <h3>📋 Informações do Projeto</h3>
            <p><strong>Aplicação:</strong> ViralCut Pro - Editor de Vídeos Virais</p>
            <p><strong>Tecnologia:</strong> React + Node.js + MySQL</p>
            <p><strong>Desenvolvedor:</strong> Matheus Bassini</p>
            <p><strong>Versão:</strong> 1.0.0</p>
        </div>

        <div class="contact">
            <h3>📞 Contato do Desenvolvedor</h3>
            <p><strong>📧 Email:</strong> suporte@matheusbassini.com.br</p>
            <p><strong>📱 WhatsApp:</strong> +55 12 99225-7085</p>
            <p><strong>💬 Discord:</strong> matheusbassini</p>
            <p><strong>🌐 GitHub:</strong> <a href="https://github.com/Matheus-Bassini/viralcut" target="_blank">github.com/Matheus-Bassini/viralcut</a></p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px;">
            <h3>🚀 Próximos Passos</h3>
            <p>✅ Domínio funcionando corretamente</p>
            <p>⏳ Instalando aplicação completa...</p>
            <p>🎬 ViralCut Pro será carregado em breve!</p>
        </div>

        <div style="margin-top: 20px; font-size: 0.9em; opacity: 0.8;">
            <p>Se você está vendo esta página, o servidor está funcionando perfeitamente!</p>
            <p>Todos os problemas de DNS, SSL e configuração foram resolvidos.</p>
        </div>
    </div>

    <script>
        // Mostrar data/hora atual
        function updateDateTime() {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Sao_Paulo'
            };
            document.getElementById('datetime').textContent = now.toLocaleString('pt-BR', options);
        }
        
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        // Logs para debug
        console.log('✅ JavaScript funcionando!');
        console.log('🌐 Domínio: matheusbassini.com.br');
        console.log('👨‍💻 Desenvolvedor: Matheus Bassini');
        console.log('📧 Contato: suporte@matheusbassini.com.br');
        console.log('🎬 ViralCut Pro - Editor de Vídeos Virais');
        
        // Teste de conectividade
        fetch('/test-api', { method: 'GET' })
            .then(response => {
                if (response.ok) {
                    console.log('✅ API funcionando!');
                } else {
                    console.log('⚠️ API não encontrada (normal para teste básico)');
                }
            })
            .catch(error => {
                console.log('ℹ️ API será configurada posteriormente');
            });
    </script>
</body>
</html>
EOF

echo "   ✅ index.html criado"

# Criar .htaccess super básico
cat > emergencia-matheusbassini/public_html/.htaccess << 'EOF'
# ViralCut Pro - Configuração Básica
RewriteEngine On

# Força HTTPS (se SSL estiver ativo)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Página de erro personalizada
ErrorDocument 404 /index.html
EOF

echo "   ✅ .htaccess básico criado"

# Criar arquivo de teste adicional
cat > emergencia-matheusbassini/public_html/teste.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Teste - matheusbassini.com.br</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        h1 { color: #007bff; }
    </style>
</head>
<body>
    <h1>🧪 Teste Básico</h1>
    <p>✅ Arquivo teste.html funcionando!</p>
    <p>🌐 matheusbassini.com.br</p>
    <p>👨‍💻 Matheus Bassini</p>
    <p><a href="/">← Voltar</a></p>
</body>
</html>
EOF

echo "   ✅ teste.html criado"

# Criar instruções de upload
cat > emergencia-matheusbassini/INSTRUCOES_UPLOAD.md << 'EOF'
# 📁 INSTRUÇÕES DE UPLOAD - EMERGÊNCIA

## 🚨 Upload Imediato

### 1. Acessar Painel Hostinger
- Login: https://hpanel.hostinger.com/
- Ir em: **Gerenciador de Arquivos**

### 2. Navegar para o Domínio
- Encontrar: **matheusbassini.com.br**
- Entrar na pasta: **public_html/**

### 3. Limpar Arquivos Antigos (se houver)
- Selecionar todos os arquivos
- Deletar tudo (backup se necessário)

### 4. Upload dos Novos Arquivos
- Upload: **index.html** (OBRIGATÓRIO)
- Upload: **.htaccess** (opcional)
- Upload: **teste.html** (para teste)

### 5. Definir Permissões
- **index.html**: 644
- **.htaccess**: 644
- **teste.html**: 644
- **public_html/**: 755

### 6. Testar
- **Site principal**: https://matheusbassini.com.br
- **Página de teste**: https://matheusbassini.com.br/teste.html

## ✅ Resultado Esperado
- Site deve carregar normalmente
- Página bonita com informações do projeto
- JavaScript funcionando
- Sem erros 403, 404 ou 500

## 📞 Se Não Funcionar
- **Email**: suporte@matheusbassini.com.br
- **WhatsApp**: +55 12 99225-7085
- **Verificar**: DNS, SSL, permissões
EOF

# Verificações
echo ""
echo "🔍 Verificando arquivos criados..."

if [ -f "emergencia-matheusbassini/public_html/index.html" ]; then
    size=$(wc -c < emergencia-matheusbassini/public_html/index.html)
    echo "✅ index.html: $size bytes"
else
    echo "❌ ERRO: index.html não foi criado!"
    exit 1
fi

if [ -f "emergencia-matheusbassini/public_html/.htaccess" ]; then
    echo "✅ .htaccess: OK"
else
    echo "⚠️ .htaccess não criado"
fi

if [ -f "emergencia-matheusbassini/public_html/teste.html" ]; then
    echo "✅ teste.html: OK"
else
    echo "⚠️ teste.html não criado"
fi

echo ""
echo "📊 Estatísticas:"
echo "================"
total_files=$(find emergencia-matheusbassini -type f | wc -l)
total_size=$(du -sh emergencia-matheusbassini | cut -f1)
echo "📁 Total de arquivos: $total_files"
echo "💾 Tamanho total: $total_size"

echo ""
echo "✅ DEPLOY DE EMERGÊNCIA CONCLUÍDO!"
echo "=================================="
echo "📁 Arquivos prontos em: emergencia-matheusbassini/public_html/"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Acesse o Painel Hostinger"
echo "2. Vá em Gerenciador de Arquivos"
echo "3. Entre na pasta public_html/ do domínio"
echo "4. Faça upload de TODOS os arquivos da pasta public_html/"
echo "5. Defina permissões: 644 para arquivos, 755 para pastas"
echo "6. Teste: https://matheusbassini.com.br"
echo ""
echo "🧪 TESTES DISPONÍVEIS:"
echo "- Site principal: https://matheusbassini.com.br"
echo "- Página de teste: https://matheusbassini.com.br/teste.html"
echo ""
echo "📞 SUPORTE:"
echo "- Email: suporte@matheusbassini.com.br"
echo "- WhatsApp: +55 12 99225-7085"
echo ""
echo "🎯 Este deploy básico deve funcionar em qualquer servidor!"
echo "Se não funcionar, o problema é no domínio/DNS/SSL, não nos arquivos."
