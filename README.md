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

## Trade-offs

### Escolha atual

Fila em memória.

### Benefícios

- Simples
- Fácil de entender
- Fácil de executar

### Desvantagens

- Não persiste mensagens
- Não suporta múltiplas instâncias
- Não possui recuperação após falhas

### Evolução

Migrar para Redis/BullMQ ou AWS SQS.


## Perguntas:

## ADR - Fila, Retries e Dead Letter Queue

### Decisão

Para a PoC foi utilizada uma fila em memória (Array), pois o objetivo era demonstrar o desacoplamento entre o recebimento do webhook e o processamento da negociação pelo LLM sem adicionar dependências externas ou complexidade operacional.

### Por que não usar fila em memória em produção?

A fila em memória possui algumas limitações importantes:

* As mensagens são perdidas caso a aplicação reinicie.
* Não existe persistência dos dados.
* Não permite escalabilidade horizontal entre múltiplas instâncias da aplicação.
* Não oferece mecanismos nativos de observabilidade e monitoramento.

### Tecnologia escolhida para produção

Em um ambiente de produção, a escolha seria Redis com BullMQ.

Motivos:

* Persistência das mensagens.
* Controle nativo de retries.
* Suporte a Dead Letter Queue (DLQ).
* Processamento distribuído por múltiplos workers.
* Monitoramento de filas e jobs.
* Ampla adoção no ecossistema Node.js.

Alternativamente, em ambientes cloud, poderiam ser utilizados AWS SQS + DLQ, Google Pub/Sub ou RabbitMQ.

### Estratégia de Retries

Quando ocorrer uma falha temporária no processamento do LLM (timeout, rate limit ou indisponibilidade do provedor), a mensagem não deve ser perdida.

O sistema realiza novas tentativas automáticas de processamento.

Fluxo:

Webhook → Fila → Worker → LLM

Caso ocorra falha:

Tentativa 1 → Falha
Tentativa 2 → Falha
Tentativa 3 → Falha
Tentativa 4 → Falha

Após atingir o limite configurado de tentativas, o processamento é interrompido.

### Dead Letter Queue (DLQ)

Mensagens que excedem o número máximo de tentativas são movidas para uma Dead Letter Queue.

A DLQ tem como objetivo:

* Evitar perda de mensagens.
* Permitir análise posterior da causa da falha.
* Possibilitar reprocessamento manual.
* Aumentar a rastreabilidade do sistema.

Na PoC a DLQ foi implementada como uma coleção em memória.

Em produção, a DLQ seria implementada utilizando os recursos nativos da tecnologia escolhida (BullMQ ou AWS SQS DLQ).

### Trade-offs

Escolha atual (PoC):

* Simples de implementar.
* Fácil de executar localmente.
* Sem dependências externas.

Limitações:

* Sem persistência.
* Sem escalabilidade.
* Sem recuperação após reinicialização.

Evolução para produção:

* Redis + BullMQ.
* Persistência das filas.
* Retries automáticos configuráveis.
* DLQ persistente.
* Monitoramento e observabilidade.

