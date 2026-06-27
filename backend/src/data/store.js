const bcrypt = require("bcryptjs");

const initialPasswordHash = bcrypt.hashSync("admin123", 10);

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

function getNextId(entity) {
  const nextId = store.counters[entity];
  store.counters[entity] += 1;
  return nextId;
}

module.exports = {
  store,
  getNextId
};
