# 🎬 ViralCut Pro - Editor de Vídeos Virais com IA

[![Deploy Status](https://img.shields.io/badge/deploy-ready-brightgreen)](https://github.com/seu-usuario/viralcut-pro)
[![Node.js](https://img.shields.io/badge/node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/mysql-8+-orange)](https://mysql.com/)

> **Aplicação web completa para criação de vídeos virais otimizados para redes sociais com inteligência artificial**

## 🚀 Deploy Rápido na Hostinger

### ⚡ Deploy em 5 minutos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/viralcut-pro.git
cd viralcut-pro

# 2. Execute o script de deploy
chmod +x deploy-to-hostinger.sh
./deploy-to-hostinger.sh

# 3. Faça upload dos arquivos gerados para a Hostinger
# Arquivos estarão em: hostinger-deploy/
```

### 📋 Checklist de Deploy

- [ ] ✅ Conta Hostinger com plano Business/VPS
- [ ] ✅ Banco MySQL configurado (já feito: u206326127_viralcut)
- [ ] ✅ Node.js 18+ habilitado no painel
- [ ] ✅ SSL ativo no domínio
- [ ] ✅ Arquivos enviados via FTP/painel

## 🎯 Funcionalidades

### 🔥 Principais Features
- **🤖 IA para Corte Automático** - Detecta melhores momentos
- **📱 Otimização Multi-Plataforma** - TikTok, Instagram, YouTube
- **🎨 Editor Visual** - Interface drag & drop
- **☁️ Upload Múltiplo** - Vídeos, links, Zoom
- **💳 Sistema de Pagamento** - Stripe/PayPal integrado
- **🌍 Multi-idioma** - PT-BR, EN, ES
- **🔐 Autenticação 2FA** - Segurança avançada

### 📊 Planos de Assinatura
- **Free** - 5 vídeos/mês
- **Pro** - 50 vídeos/mês  
- **Business** - 200 vídeos/mês
- **Sacred** - Ilimitado

## 🛠️ Tecnologias

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL + Sequelize** - Banco de dados
- **JWT + 2FA** - Autenticação segura
- **Stripe/PayPal** - Pagamentos
- **FFmpeg** - Processamento de vídeo

### Frontend  
- **React 18** - Interface moderna
- **Redux Toolkit** - Gerenciamento de estado
- **Material-UI** - Componentes visuais
- **Vite** - Build tool rápido
- **PWA** - App progressivo

### DevOps
- **Docker** - Containerização
- **PM2** - Gerenciamento de processos
- **Apache/Nginx** - Servidor web
- **SSL/TLS** - Segurança

## 📱 Responsividade Total

### Dispositivos Suportados
- 📱 **Mobile** (320px+) - Interface touch otimizada
- 📟 **Tablet** (768px+) - Layout híbrido
- 💻 **Desktop** (1024px+) - Interface completa
- 🖥️ **Large** (1440px+) - Tela expandida

### PWA Features
- ✅ Instalável no dispositivo
- ✅ Funciona offline
- ✅ Push notifications
- ✅ Cache inteligente

## 🏠 Deploy na Hostinger

### Pré-requisitos
```bash
# Verificar se você tem:
- Conta Hostinger (Business/VPS)
- Banco MySQL: u206326127_viralcut
- Node.js habilitado
- SSL configurado
```

### Passo a Passo

#### 1. Preparar Arquivos
```bash
# Clone e prepare
git clone https://github.com/seu-usuario/viralcut-pro.git
cd viralcut-pro
chmod +x deploy-to-hostinger.sh
./deploy-to-hostinger.sh
```

#### 2. Upload para Hostinger
```bash
# Estrutura de arquivos:
hostinger-deploy/
├── public_html/          # Frontend (React build)
│   ├── index.html
│   ├── assets/
│   └── .htaccess
└── api/                  # Backend (Node.js)
    ├── server.js
    ├── src/
    ├── package.json
    └── .env
```

#### 3. Configurar Node.js
No painel da Hostinger:
- **Versão:** 18.x
- **Diretório:** `public_html/api`
- **Arquivo:** `server.js`
- **Variáveis:** Copiar do `.env.hostinger`

#### 4. Instalar no Servidor
```bash
# Via SSH ou terminal do painel:
cd public_html/api
chmod +x install-on-server.sh
./install-on-server.sh
```

#### 5. Testar
- 🌐 **Frontend:** https://seudominio.com
- 🔧 **API:** https://seudominio.com/api/health
- 📊 **Status:** https://seudominio.com/api

## ☁️ Alternativas de Deploy

### Render (Gratuito)
```bash
# 1. Conecte seu GitHub ao Render
# 2. Crie Web Service apontando para /backend
# 3. Crie Static Site apontando para /frontend
# 4. Configure variáveis de ambiente
```

### Vercel + PlanetScale
```bash
# 1. Deploy backend no Vercel
vercel --cwd backend

# 2. Deploy frontend no Vercel  
vercel --cwd frontend

# 3. Configure PlanetScale MySQL
pscale database create viralcut-pro
```

## 🔧 Configuração Local

### Desenvolvimento
```bash
# 1. Instalar dependências
npm run install:all

# 2. Configurar banco local
cp backend/.env.example backend/.env
# Editar credenciais do MySQL

# 3. Iniciar desenvolvimento
npm run dev
```

### URLs Locais
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api

## 📊 Estrutura do Projeto

```
viralcut-pro/
├── 📁 frontend/              # React App
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── store/           # Redux Store
│   │   ├── services/        # API Services
│   │   ├── utils/           # Utilitários
│   │   └── i18n/            # Traduções
│   ├── public/
│   └── package.json
├── 📁 backend/               # Node.js API
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Middlewares
│   │   ├── services/        # Serviços
│   │   └── utils/           # Utilitários
│   ├── server.js
│   └── package.json
├── 📁 public_html/          # Arquivos Apache
├── 📄 deploy-to-hostinger.sh # Script de deploy
├── 📄 DEPLOY_GUIDE.md       # Guia completo
└── 📄 README.md             # Este arquivo
```

## 🔐 Segurança

### Features de Segurança
- ✅ **JWT + Refresh Tokens** - Autenticação segura
- ✅ **2FA com TOTP** - Autenticação de dois fatores
- ✅ **Rate Limiting** - Proteção contra spam
- ✅ **CORS configurado** - Proteção cross-origin
- ✅ **Helmet.js** - Headers de segurança
- ✅ **Validação de dados** - Express Validator
- ✅ **SSL/TLS** - Criptografia de dados

### Variáveis de Ambiente
```env
# Database
DB_HOST=srv1883.hstgr.io
DB_NAME=u206326127_viralcut
DB_USER=u206326127_host
DB_PASS=@Host1603

# JWT
JWT_SECRET=sua-chave-super-secreta
JWT_REFRESH_SECRET=sua-chave-refresh

# URLs
FRONTEND_URL=https://seudominio.com
API_URL=https://seudominio.com/api
```

## 🧪 Testes

### Executar Testes
```bash
# Backend
cd backend && npm test

# Frontend  
cd frontend && npm test

# E2E
npm run test:e2e
```

### Testar API
```bash
# Health check
curl https://seudominio.com/api/health

# Registro
curl -X POST https://seudominio.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"Test123!","firstName":"Test","lastName":"User"}'
```

## 📈 Performance

### Otimizações
- ✅ **Compressão Gzip** - Reduz tamanho dos arquivos
- ✅ **Cache HTTP** - Melhora velocidade
- ✅ **Lazy Loading** - Carregamento sob demanda
- ✅ **Code Splitting** - Divisão de código
- ✅ **CDN Ready** - Pronto para CDN
- ✅ **PWA** - Cache offline

### Métricas
- ⚡ **First Paint:** < 1.5s
- ⚡ **Time to Interactive:** < 3s
- ⚡ **API Response:** < 200ms
- 📱 **Mobile Score:** 95+

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código
- **ESLint** - Linting JavaScript
- **Prettier** - Formatação de código
- **Conventional Commits** - Padrão de commits
- **Husky** - Git hooks

## 📞 Suporte

### Documentação
- 📖 [Guia de Deploy](DEPLOY_GUIDE.md)
- 📖 [Documentação da API](docs/api.md)
- 📖 [Guia do Desenvolvedor](docs/developer.md)

### Contato
- 📧 **Email:** suporte@viralcutpro.com
- 💬 **Discord:** [Servidor da Comunidade](https://discord.gg/viralcut)
- 🐛 **Issues:** [GitHub Issues](https://github.com/seu-usuario/viralcut-pro/issues)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎉 Agradecimentos

- **React Team** - Framework incrível
- **Node.js Community** - Ecossistema robusto
- **Hostinger** - Hospedagem confiável
- **Comunidade Open Source** - Inspiração constante

---

<div align="center">

**🚀 Pronto para criar vídeos virais? Deploy agora mesmo!**

[🌐 Demo](https://viralcutpro.com) • [📖 Docs](docs/) • [🐛 Issues](issues/) • [💬 Discord](https://discord.gg/viralcut)

</div>
