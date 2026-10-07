# Agenda da Barbearia

Agenda online simples: o cliente escolhe o barbeiro, o dia e o horário, deixa
nome e telefone, e no final manda a confirmação pelo WhatsApp do barbeiro com
um clique — sem precisar de API paga.

## Estrutura

```
supabase/migrations/0001_init.sql   -> tabelas (barbers, appointments) + barbeiros de exemplo
src/pages/BookingPage.tsx           -> tela pública (/) onde o cliente agenda
src/pages/AgendaPage.tsx            -> painel interno (/agenda) para ver os agendamentos do dia
```

## Como funciona

1. Cliente acessa o link público, escolhe o profissional, o dia e um horário
   livre (os horários já ocupados somem da lista automaticamente).
2. Preenche nome e WhatsApp e confirma — o agendamento é salvo no banco.
3. Aparece um botão **"Confirmar pelo WhatsApp"** que abre uma conversa já
   com o número do barbeiro e a mensagem pronta (dia, hora e nome do
   cliente). O cliente só aperta enviar.
4. O barbeiro (ou dono da barbearia) acompanha tudo em `/agenda`: filtra por
   profissional e por dia, e pode marcar como **confirmado** ou
   **cancelado**.

## Como subir no Lovable

1. Suba esta pasta para um repositório no GitHub e, no Lovable, escolha
   **"Import from GitHub"**.
2. Ative o **Lovable Cloud** (Supabase) no projeto.
3. Rode `supabase/migrations/0001_init.sql` no banco (Database > SQL
   Editor no Lovable Cloud).
4. Edite os 3 barbeiros de exemplo que a migration já insere — principalmente
   o campo `whatsapp_number` (formato `55` + DDD + número, só dígitos, sem
   espaço ou `+`), pelo número real de cada um. Pode fazer isso direto pela
   tabela no Supabase Studio.
5. Confirme que as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
   estão preenchidas (o Lovable Cloud normalmente já preenche sozinho).

## Compartilhando com os clientes

- Link de agendamento: a raiz do site (ex: `suabarbearia.lovable.app`).
- Link do painel interno: `/agenda` — esse não precisa (e não deve) ser
  divulgado para os clientes.

## Limitações desse MVP (de propósito, para manter simples)

- **Sem login**: o painel `/agenda` não tem senha ainda. Enquanto o link não
  for divulgado publicamente já reduz bastante o risco, mas antes de
  divulgar o app para muita gente vale adicionar autenticação (Supabase
  Auth) para os barbeiros.
- **Confirmação manual**: como não usa a API paga do WhatsApp, quem envia a
  mensagem de confirmação é o próprio cliente (com um clique) — não é 100%
  automático. Se no futuro quiser automatizar de verdade (a barbearia
  confirmando automaticamente sem o cliente precisar enviar nada), dá para
  evoluir para a API oficial do WhatsApp, do mesmo jeito que fizemos no
  projeto de atendimento.
- **Sem cadastro de serviços/preços**: por enquanto é só profissional + data
  + hora. Dá pra adicionar uma tabela de serviços depois, se fizer falta.
