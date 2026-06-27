# Tutorial Backend - Requisitos Funcionais

Este material explica como implementar cada requisito funcional do backend do projeto de e-commerce em Node.js com Express.

## Visao Geral

Arquivos-base do backend:

- [backend/src/app.js](../../backend/src/app.js)
- [backend/src/server.js](../../backend/src/server.js)

Fluxo geral:

1. Subir servidor Express.
2. Configurar middlewares globais.
3. Registrar rotas por dominio.
4. Aplicar autenticacao e autorizacao nas rotas sensiveis.
5. Validar entrada antes de executar regra de negocio.

## Tutoriais por Requisito

1. [01-roteamento-modularizado.md](./01-roteamento-modularizado.md)
2. [02-metodos-http-crud.md](./02-metodos-http-crud.md)
3. [03-parametros-rota-e-query.md](./03-parametros-rota-e-query.md)
4. [04-validacao-e-sanitizacao.md](./04-validacao-e-sanitizacao.md)
5. [05-middlewares-customizados.md](./05-middlewares-customizados.md)
6. [06-passport-sessoes-cookies.md](./06-passport-sessoes-cookies.md)

## Como usar este tutorial

- Leia na sequencia para montar do zero.
- Ou abra direto o arquivo do requisito que voce quer revisar.
- Cada secao mostra:
  - objetivo do requisito
  - passos de implementacao
  - exemplos de codigo
  - onde isso aparece no projeto atual
