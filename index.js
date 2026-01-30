const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

function createApp() {
  const app = express();
  app.use(express.json());

  let data = [
    { id: 1, name: 'Первый элемент' },
    { id: 2, name: 'Второй элемент' },
  ];

  let users = []; // Дополнительный массив для демонстрации POST /users

  // --- Standard routes ---
  app.get('/items', (req, res) => {
    res.status(200).send(data);
  });

  app.post('/items', (req, res) => {
    if (!req.body.name) {
      return res.status(400).send('Требуется поле name');
    }
    const newItem = {
      id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
      name: req.body.name,
    };
    data.push(newItem);
    res.status(201).send(newItem);
  });

  app.get('/status', (req, res) => {
    res.status(200).send({ status: 'OK', timestamp: new Date().toISOString() });
  });

  app.post('/users', (req, res) => {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).send('Требуются поля username и email');
    }

    const newUser = {
      id: users.length + 1,
      username: username,
      email: email,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    res.status(201).send(newUser);
  });

  // --- More specific /items/* routes (before /items/:id) ---
  app.get('/items/count', (req, res) => {
    res.status(200).send({ count: data.length });
  });

  app.get('/items/search', (req, res) => {
    const { name } = req.query;
    if (!name) {
      return res.status(400).send('Требуется query-параметр "name"');
    }
    const results = data.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    res.status(200).send(results);
  });

  app.post('/items/bulk', (req, res) => {
    const newItems = req.body;
    if (!Array.isArray(newItems) || newItems.length === 0) {
      return res.status(400).send('Требуется массив элементов.');
    }

    const addedItems = [];
    let currentId = data.length > 0 ? data[data.length - 1].id + 1 : 1;

    newItems.forEach(item => {
      if (item.name) {
        const newItem = { id: currentId++, name: item.name };
        data.push(newItem);
        addedItems.push(newItem);
      }
    });

    if (addedItems.length === 0) {
      return res.status(400).send('Не удалось добавить ни одного элемента. Проверьте формат.');
    }

    res.status(201).send({ message: `${addedItems.length} элементов добавлено`, added: addedItems });
  });

  app.post('/items/clear', (req, res) => {
    data = [];
    res.status(200).send({ message: 'Список элементов очищен' });
  });

  app.put('/items/update', (req, res) => {
    const item = data.find((i) => i.id === parseInt(req.body.id));
    if (item) {
      item.name = req.body.name;
      res.status(200).send(item);
    } else {
      res.status(404).send('Элемент не найден');
    }
  });

  // --- General /items/:id route (after specific /items/* routes) ---
  app.get('/items/:id', (req, res) => {
    const item = data.find((i) => i.id === parseInt(req.params.id));
    if (item) {
      res.status(200).send(item);
    } else {
      res.status(404).send('Элемент не найден');
    }
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
}


const PORT = 3000;
if (require.main === module) {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Документация Swagger доступна на http://localhost:${PORT}/api-docs`);
  });
}

module.exports = createApp;