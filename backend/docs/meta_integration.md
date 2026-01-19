# Integração Meta (Facebook e Instagram)

Esta documentação descreve como a integração com Facebook Messenger e Instagram Direct está configurada e como operar.

## Endpoints de Webhook

- `GET /webhook`: endpoint de verificação. Usa `VERIFY_TOKEN` para confirmar a assinatura do webhook no Facebook.
- `POST /webhook`: recebe eventos de mensagens. Suporta `body.object = "page"` (Facebook) e `body.object = "instagram"` (Instagram). Os eventos são processados via `facebookMessageListener.handleMessage`.

## Verificação de Assinatura

- O cabeçalho `X-Hub-Signature-256` é verificado quando `FACEBOOK_APP_SECRET` está configurado.
- A verificação usa HMAC SHA256 do corpo bruto da requisição comparado com o cabeçalho.

## Fluxo de Mensagens

Entrada:
- Meta envia evento ao `POST /webhook`.
- O backend identifica o canal via `body.object` e localiza o `Whatsapp` correspondente pelo `facebookPageUserId`.
- Facebook: o evento `entry.messaging[]` é repassado para `handleMessage`.
- Instagram: o evento vem via `entry.changes[]` com `field="messages"`; o backend normaliza para o mesmo formato e repassa para `handleMessage`.
  
`handleMessage`:
  - Garante/atualiza `Contact` e `Ticket`.
  - Registra a mensagem (`Message`) e aciona filas/fluxos (Chatbot/FlowBuilder) quando aplicável.

Saída:
- Operadores enviam mensagens pelo controller `MessageController.store`:
  - Facebook/Instagram texto: `sendFacebookMessage` (usa `graphAPI.sendText`).
  - Facebook/Instagram mídia: `sendFacebookMessageMedia` (usa `graphAPI.sendAttachmentFromUrl`).
- Políticas: para Facebook, fora da janela de 24h é aplicado tag `ACCOUNT_UPDATE` quando possível; Instagram não suporta tags.

## Variáveis de Ambiente

- `VERIFY_TOKEN`: token de verificação do webhook (GET /webhook).
- `FACEBOOK_APP_ID`: App ID da aplicação Meta.
- `FACEBOOK_APP_SECRET`: App Secret para verificação de assinatura.
- `BACKEND_URL`: base pública para servir mídias (ex.: `https://sua-api.com`).

## Assinatura de Eventos

- A assinatura é realizada em `WhatsAppController.storeFacebook` via `subscribeApp(pageId, accessTokenDaPágina)`.
- Quando o Instagram Business está conectado, a assinatura da página cobre os eventos de mensagens Instagram associados.

## Rotas e Montagem

- O router é montado em `/webhook` via `routes/index.ts`.
- Montagem duplicada na raiz foi removida para evitar conflito.

## Boas Práticas e Validações

- Verificação de assinatura habilitada por padrão se o `FACEBOOK_APP_SECRET` estiver presente.
- Validação de payload para existência de `entry.messaging` (arrays vazios são ignorados).
- Para envios fora de 24h no Facebook, utilizar templates/tags conforme políticas Meta.

## Testes e Observações

- Certifique-se que os Tokens das páginas (`facebookUserToken`) estão válidos e sincronizados.
- Em `storeFacebook`, o sistema cria/atualiza conexões para páginas e Instagram quando habilitado (`addInstagram`).
- O envio de mídia usa URLs públicas servidas por `BACKEND_URL`.
