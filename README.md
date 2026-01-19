# 🚀 AtendeChat - Sistema de Atendimento Multicanal

## 📋 Descrição

O **AtendeChat** é uma plataforma completa de atendimento multicanal que integra WhatsApp (Baileys e API Oficial), Facebook, Instagram e outros canais em uma única interface. Ideal para empresas que desejam centralizar e automatizar seu atendimento ao cliente.

---

## ✨ Funcionalidades Principais

### 📱 Canais de Comunicação
- **WhatsApp** (via Baileys - conexão não oficial)
- **WhatsApp Business API** (API Oficial Meta)
- **Facebook Messenger**
- **Instagram Direct**
- **Chat Interno**

### 🎯 Recursos
- ✅ Múltiplas conexões simultâneas
- ✅ Filas de atendimento
- ✅ Chatbots e fluxos automatizados
- ✅ Campanhas de mensagens em massa
- ✅ Agendamento de mensagens
- ✅ Kanban para gestão de tickets
- ✅ Dashboard com métricas em tempo real
- ✅ Integração com OpenAI (ChatGPT)
- ✅ API Externa para integrações
- ✅ Multi-empresas (SaaS)
- ✅ Controle de permissões granular

---

## 🛠️ Stack Tecnológica

### Backend Principal
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Node.js | 20.x | Runtime JavaScript |
| TypeScript | 5.x | Linguagem tipada |
| Express.js | 4.x | Framework web |
| Sequelize | 6.x | ORM para PostgreSQL |
| Socket.IO | 4.x | Comunicação em tempo real |
| Bull | 4.x | Filas de processamento |
| bcryptjs | 2.x | Hash de senhas |

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React.js | 18.x | Biblioteca de UI |
| Material-UI | 5.x | Componentes visuais |
| Axios | 1.x | Cliente HTTP |
| Socket.IO Client | 4.x | WebSocket client |

### API Oficial WhatsApp
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| NestJS | 10.x | Framework Node.js |
| Prisma | 5.x | ORM moderno |
| TypeScript | 5.x | Linguagem tipada |

### Banco de Dados & Cache
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| PostgreSQL | 15+ | Banco relacional |
| Redis | 7.x | Cache e filas |

### Infraestrutura
| Tecnologia | Descrição |
|------------|-----------|
| Nginx | Proxy reverso e SSL |
| PM2 | Gerenciador de processos |
| Certbot | Certificados SSL (Let's Encrypt) |
| Ubuntu | 22.04/24.04 LTS |

---

## 📁 Estrutura do Projeto

```
/home/deploy/{instancia}/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── controllers/     # Controladores
│   │   ├── database/
│   │   │   ├── migrations/  # Migrations Sequelize
│   │   │   └── seeds/       # Seeds iniciais
│   │   ├── models/          # Modelos Sequelize
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── libs/            # Bibliotecas (Baileys, etc)
│   │   └── helpers/         # Utilitários
│   ├── dist/                # Build compilado
│   ├── public/              # Arquivos públicos
│   │   └── company{N}/      # Arquivos por empresa
│   ├── .env                 # Variáveis de ambiente
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── context/         # Context API
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # Serviços API
│   ├── build/               # Build de produção
│   └── package.json
│
└── api_oficial/             # API WhatsApp Oficial
    ├── src/
    │   ├── @core/           # Core do sistema
    │   │   ├── infra/       # Infraestrutura
    │   │   │   ├── database/
    │   │   │   ├── redis/
    │   │   │   └── meta/    # Integração Meta
    │   │   └── guard/       # Autenticação
    │   └── resources/
    │       └── v1/
    │           ├── webhook/          # Webhooks Meta
    │           ├── send-message/     # Envio de mensagens
    │           ├── templates/        # Templates WhatsApp
    │           └── companies/        # Empresas
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    └── package.json
```

---

## ⚙️ Requisitos de Sistema

### Mínimos
- **CPU:** 2 vCPUs
- **RAM:** 4 GB
- **Disco:** 100 GB SSD
- **OS:** Ubuntu 22.04

### Recomendados (Produção)
- **CPU:** 4+ vCPUs
- **RAM:** 8+ GB
- **Disco:** 200+ GB SSD
- **OS:** Ubuntu 22.04 LTS

### Portas Necessárias
| Porta | Serviço |
|-------|---------|
| 22 | SSH |
| 80 | HTTP (redirect) |
| 443 | HTTPS |
| 4000 | Backend API |
| 3000 | Frontend |
| 6000 | API Oficial |
| 5432 | PostgreSQL |
| 6379 | Redis |

---

## 🚀 Instalação

### Pré-requisitos
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
sudo apt install -y curl wget git
```

### Instalação Automática (Recomendado)

```bash
# 1. Baixar e extrair o instalador
unzip instalador_atendechat_v1.5.5.zip
cd instalador_atendechat

# 2. Dar permissão de execução
chmod +x install_primaria

# 3. Executar como root
sudo ./install_primaria
```

### Credenciais Padrão
| Campo | Valor |
|-------|-------|
| **Email** | atendechat123@gmail.com |
| **Senha** | chatbot123 |
| **Perfil** | Admin (acesso total) |

---

## 🔧 Configuração

### Variáveis de Ambiente (Backend)

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_instancia
DB_USER=nome_instancia
DB_PASS=senha_segura

# Redis
REDIS_URI=redis://127.0.0.1:6379
REDIS_OPT_LIMITER_MAX=1
REDIS_OPT_LIMITER_DURATION=3000

# JWT
JWT_SECRET=sua_chave_secreta
JWT_REFRESH_SECRET=sua_chave_refresh

# URLs
BACKEND_URL=https://api.seudominio.com
FRONTEND_URL=https://app.seudominio.com

# API Oficial (WhatsApp)
URL_API_OFICIAL=https://apioficial.seudominio.com
TOKEN_API_OFICIAL=seu_token
```

### Variáveis de Ambiente (Frontend)

```env
REACT_APP_BACKEND_URL=https://api.seudominio.com
REACT_APP_HOURS_CLOSE_TICKETS_AUTO=24
```

---

## 📊 Comandos Úteis

### PM2 (Gerenciamento de Processos)

```bash
# Ver status dos processos
pm2 list

# Ver logs em tempo real
pm2 logs

# Reiniciar todos os serviços
pm2 restart all

# Reiniciar serviço específico
pm2 restart nome-backend

# Salvar configuração do PM2
pm2 save
```

### Banco de Dados

```bash
# Acessar PostgreSQL
sudo -u postgres psql -d nome_banco

# Executar migrations
cd /home/deploy/instancia/backend
npx sequelize db:migrate

# Executar seeds
npx sequelize db:seed:all
```

### Nginx

```bash
# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Ver status
sudo systemctl status nginx
```

---

## 🔒 Segurança

### Recomendações
1. **Alterar senhas padrão** imediatamente após instalação
2. **Configurar firewall** (UFW) permitindo apenas portas necessárias
3. **Manter sistema atualizado** com patches de segurança
4. **Usar senhas fortes** para banco de dados e JWT
5. **Configurar backup automático** do banco de dados
6. **Monitorar logs** regularmente

### Firewall (UFW)
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🐛 Troubleshooting

### Problema: Não consigo fazer login
```bash
# Verificar usuário no banco
sudo -u postgres psql -d nome_banco -c "SELECT id, email, profile FROM \"Users\";"

# Resetar senha do usuário
sudo -u postgres psql -d nome_banco -c "UPDATE \"Users\" SET \"passwordHash\" = '\$2a\$10\$ppKfuD84NiEjRZDyXfk9xOMby.VMBA9nWKa9RUWMl.ttcQHqoS4sG' WHERE id = 1;"
```

### Problema: Tela branca em "Empresas"
```bash
# Verificar se empresa tem plano associado
sudo -u postgres psql -d nome_banco -c "SELECT id, \"planId\" FROM \"Companies\";"

# Associar plano à empresa
sudo -u postgres psql -d nome_banco -c "UPDATE \"Companies\" SET \"planId\" = 1 WHERE id = 1;"

# Verificar campo amount no plano
sudo -u postgres psql -d nome_banco -c "UPDATE \"Plans\" SET amount = 0 WHERE id = 1;"
```

### Problema: Migrations não executam
```bash
# Verificar .sequelizerc aponta para dist/
cat /home/deploy/instancia/backend/.sequelizerc

# Deve conter:
# 'migrations-path': path.resolve('dist', 'database', 'migrations')
```

### Problema: Node.js versão errada após instalação
```bash
# Limpar cache do bash
hash -r

# Verificar versão
node --version

# Se ainda errado, usar caminho completo
/usr/bin/node --version
```

---

## 📈 Monitoramento

### Logs do Sistema
```bash
# Backend
tail -f /home/deploy/.pm2/logs/nome-backend-out.log
tail -f /home/deploy/.pm2/logs/nome-backend-error.log

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PostgreSQL
tail -f /var/log/postgresql/postgresql-15-main.log
```

### Métricas PM2
```bash
pm2 monit
```

---

## 🔄 Atualizações

### Atualizar Backend
```bash
cd /home/deploy/instancia/backend
git pull origin main
npm install
npm run build
pm2 restart nome-backend
```

### Atualizar Frontend
```bash
cd /home/deploy/instancia/frontend
git pull origin main
npm install
npm run build
pm2 restart nome-frontend
```

---

## 📞 Suporte

### Documentação
- [Documentação Oficial](https://docs.atendechat.com)
- [API Reference](https://api.atendechat.com/docs)

### Comunidade
- [Discord](https://discord.gg/atendechat)
- [Telegram](https://t.me/atendechat)

---

## 📄 Licença

Este software é proprietário. Todos os direitos reservados.

© 2025 AtendeChat - Todos os direitos reservados.

---

## 🏷️ Versão

**Versão Atual:** 1.5.5  
**Data:** Janeiro/2026  

### Changelog v1.5.5
- ✅ Correção do erro `Cannot find module 'bcryptjs'`
- ✅ Função de usuário master usando SQL direto
- ✅ Associação automática plano-empresa corrigida
- ✅ Campo `amount` no plano incluído
- ✅ Criação automática de pastas `public/company`
- ✅ Correção do cache de Node.js com `hash -r`
