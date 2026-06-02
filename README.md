# Arbitralis Lexi PoC

## Objetivo

Demonstrar um fluxo não bloqueante para processamento de mensagens recebidas via WhatsApp.

---

## Fluxo

WhatsApp
↓
POST /webhook
↓
Fila em memória
↓
Worker
↓
LLM
↓
Outbound Call

---

## Payload

POST /webhook

{
  "messageId": "msg-123",
  "userId": "user-456",
  "message": "Quero negociar minha dívida"
}

# ADR

## Decisão

Utilizar fila em memória.

## Motivo

Manter a PoC simples.

## Limitação

A fila é perdida em reinícios.

## Produção

Redis + BullMQ.

Motivos:

- Persistência
- Retry nativo
- DLQ
- Escalabilidade horizontal

## Retry

3 tentativas.

Backoff exponencial.

## DLQ

Após 3 falhas a mensagem é movida para a Dead Letter Queue.

## Segurança

Para evitar exposição de dados sensíveis:

- Não logamos mensagens completas.
- Não logamos informações pessoais.
- Logs utilizam apenas IDs técnicos.