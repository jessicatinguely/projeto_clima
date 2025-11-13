# 🔒 Auditoria de Segurança e Privacidade

## Avaliação de Riscos
- A aplicação **não coleta, armazena ou compartilha dados pessoais**.
- As requisições são feitas via **HTTPS** diretamente à API pública Open-Meteo.
- Nenhuma chave de API é armazenada no front-end.

## Boas Práticas Adotadas
- Comunicação segura (HTTPS).
- Nenhum dado sensível salvo em localStorage, cookies ou backend.
- Rodapé de transparência com alertas de privacidade.
- Testes e revisão de código para prevenir falhas de exposição.

## Recomendações para Produção
- Usar HTTPS sempre.
- Revisar dependências com `npm audit`.
- Remover console logs e mensagens de debug antes de publicar.
- Garantir que nenhuma chave de API (se houver) esteja exposta.
