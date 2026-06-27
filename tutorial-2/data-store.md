Este código representa um **Banco de Dados em Memória (Mock Database)** com persistência volátil (os dados são perdidos se a aplicação for reiniciada). Ele é comumente utilizado em protótipos (MVPs), testes unitários/integração ou fases iniciais de desenvolvimento para simular o comportamento de um banco de dados real (como PostgreSQL ou MongoDB).

Abaixo, apresento uma análise detalhada e arquitetural do código, dividida por blocos de responsabilidade.

---

### 1. Criptografia e Segurança de Senhas
```javascript
const bcrypt = require("bcryptjs");

const initialPasswordHash = bcrypt.hashSync("admin123", 10);
```
* **O que faz:** Importa a biblioteca `bcryptjs` para geração de hashes criptográficos e gera um hash seguro para a senha padrão `"admin123"`.
* **Como funciona:** O método `hashSync` executa o algoritmo de forma síncrona. O segundo parâmetro (`10`) é o *Salt Rounds* (fator de custo), que define a complexidade computacional para gerar o hash, tornando ataques de força bruta extremamente difíceis.
* **Visão Arquitetural:** Salvar senhas em texto puro é uma falha grave de segurança. Este bloco garante que, mesmo em memória, a senha do administrador (`passwordHash`) esteja protegida.

---

### 2. O Estado da Aplicação (`store`)
O objeto `store` centraliza o estado do sistema. Ele simula três tabelas/coleções relacionais e um controle de chaves primárias.

```javascript
const store = {
  users: [ ... ],    // Entidade de Usuários (com 1 Admin semeado)
  products: [ ... ], // Catálogo de Produtos (com 3 itens semeados)
  orders: [],        // Histórico de Pedidos (inicia vazio)
  counters: { ... }  // Gerador de IDs sequenciais
};

const store = {
  users: [
    {
      id: 1,
      name: "Administrador",
      email: "admin@shop.com",
      passwordHash: initialPasswordHash,
      role: "admin"
    }
  ],
  products: [
    {
      id: 1,
      name: "Notebook Pro 14",
      description: "Notebook leve para produtividade e criacao.",
      category: "eletronicos",
      price: 6999.9,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      active: true
    },
    {
      id: 2,
      name: "Headset Studio X",
      description: "Audio imersivo para jogos e reunioes.",
      category: "acessorios",
      price: 899.5,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      active: true
    },
    {
      id: 3,
      name: "Cadeira Ergonomica Air",
      description: "Conforto para longas jornadas de trabalho.",
      category: "moveis",
      price: 1299,
      stock: 5,
      imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
      active: true
    }
  ],
  orders: [],
  counters: {
    users: 2,
    products: 4,
    orders: 1
  }
};

```

#### Detalhes das Entidades:
* **`users`**: Contém o usuário administrador inicial, mapeando seu e-mail, nível de permissão (`role: "admin"`) e a senha criptografada.
* **`products`**: Um array de objetos com a estrutura clássica de e-commerce (preço, estoque, imagem, status ativo).
* **`orders`**: Array pronto para receber as transações/compras efetuadas.
* **`counters`**: Controla o próximo ID autoincrementável disponível para cada entidade. Note que o ID do próximo usuário será `2` (pois o admin é `1`) e o do produto será `4` (pois já existem 3 produtos).

---

### 3. Gerador de Identificadores (Auto-Incremento)
```javascript
function getNextId(entity) {
  const nextId = store.counters[entity]; // 1. Recupera o ID atual
  store.counters[entity] += 1;          // 2. Incrementa o contador para a próxima chamada
  return nextId;                         // 3. Retorna o ID recuperado
}
```
* **O que faz:** Simula o comportamento `SERIAL` (PostgreSQL) ou `AUTO_INCREMENT` (MySQL).
* **Exemplo de Execução:**
  Se você chamar `getNextId("products")`:
  1. Ela lê `store.counters.products` (que vale `4`).
  2. Incrementa o valor no store para `5`.
  3. Retorna o número `4` para ser usado no novo produto.

---

### 4. Exportação do Módulo
```javascript
module.exports = {
  store,
  getNextId
};
```
* **O que faz:** Exporta os dados e a função utilitária usando o padrão **CommonJS** (`module.exports`). Qualquer arquivo que importar este módulo compartilhará a **mesma instância** do objeto `store` na memória do Node.js (comportamento de *Singleton*).

---

### 🧠 Avaliação Arquitetural (Prós, Contras e Recomendações)

#### Pontos Fortes:
1. **Desacoplamento:** Isolar o estado em um arquivo separado facilita a substituição futura por um ORM real (como Prisma, Sequelize ou Mongoose) sem impactar as regras de negócio.
2. **Pronto para Testes:** Permite testar rotas e controladores de forma ultra-rápida, pois operações em memória não sofrem latência de rede.

#### Pontos de Atenção (Gargalos de Produção):
1. **Bloqueio da Event Loop (`hashSync`):** O método `hashSync` bloqueia a única thread do Node.js durante a geração do hash. Para o *startup* do servidor (como é o caso aqui), não há problema. Porém, **nunca** utilize métodos `Sync` do bcrypt dentro de rotas de cadastro/login em produção. Prefira a versão assíncrona: `await bcrypt.hash(password, 10)`.
2. **Volatilidade:** Se o processo do Node.js cair ou reiniciar (devido a um crash ou deploy), todos os novos usuários, produtos e pedidos criados serão perdidos, resetando para o estado inicial.