const request = require('supertest');
const createApp = require('../index'); // Import the createApp function

let app; // Declare app in a scope accessible by before/after hooks

describe('API Endpoints', () => {
  beforeEach(() => {
    app = createApp(); // Create a fresh app instance before each test
  });

  // Test GET /items
  test('GET /items should return all items', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(2); // Initial data has 2 items
  });

  // Test POST /items
  test('POST /items should create a new item', async () => {
    const newItemName = 'Тестовый элемент';
    const res = await request(app)
      .post('/items')
      .send({ name: newItemName });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual(newItemName);

    const getRes = await request(app).get('/items');
    expect(getRes.body.length).toEqual(3); // Now 3 items
  });

  // Test POST /items with missing name
  test('POST /items with missing name should return 400', async () => {
    const res = await request(app)
      .post('/items')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Требуется поле name');
  });

  // Test GET /status
  test('GET /status should return API status', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
  });

  // Test GET /items/count
  test('GET /items/count should return the number of items', async () => {
    const res = await request(app).get('/items/count');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('count', 2); // Initial data has 2 items
  });

  // Test POST /users
  test('POST /users should create a new user', async () => {
    const newUser = { username: 'testuser', email: 'test@example.com' };
    const res = await request(app)
      .post('/users')
      .send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toEqual(newUser.username);
    expect(res.body.email).toEqual(newUser.email);
  });

  // Test POST /users with missing fields
  test('POST /users with missing username should return 400', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com' });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Требуются поля username и email');
  });

  // Test GET /items/:id
  test('GET /items/:id should return a specific item', async () => {
    const res = await request(app).get('/items/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('name', 'Первый элемент');
  });

  test('GET /items/:id should return 404 for non-existent item', async () => {
    const res = await request(app).get('/items/999');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Элемент не найден');
  });

  // Test PUT /items/update
  test('PUT /items/update should update an existing item', async () => {
    const updatedItem = { id: 1, name: 'Обновленный первый элемент' };
    const res = await request(app)
      .put('/items/update')
      .send(updatedItem);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(updatedItem.name);

    const getRes = await request(app).get('/items/1');
    expect(getRes.body.name).toEqual(updatedItem.name);
  });

  test('PUT /items/update should return 404 for non-existent item', async () => {
    const updatedItem = { id: 999, name: 'Несуществующий элемент' };
    const res = await request(app)
      .put('/items/update')
      .send(updatedItem);
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Элемент не найден');
  });

  // Test GET /items/search
  test('GET /items/search should return items matching the search query', async () => {
    const res = await request(app).get('/items/search?name=' + encodeURIComponent('Первый'));
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual('Первый элемент');
  });

  test('GET /items/search should return 400 if name query parameter is missing', async () => {
    const res = await request(app).get('/items/search');
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Требуется query-параметр "name"');
  });

  // Test POST /items/bulk
  test('POST /items/bulk should add multiple items', async () => {
    const newItems = [{ name: 'Новый элемент 3' }, { name: 'Новый элемент 4' }];
    const res = await request(app)
      .post('/items/bulk')
      .send(newItems);
    expect(res.statusCode).toEqual(201);
    expect(res.body.added.length).toEqual(2);

    const getRes = await request(app).get('/items/count');
    expect(getRes.body.count).toEqual(4); // 2 initial + 2 new
  });

  test('POST /items/bulk should return 400 for empty array', async () => {
    const res = await request(app)
      .post('/items/bulk')
      .send([]);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Требуется массив элементов.');
  });

  // Test POST /items/clear
  test('POST /items/clear should clear all items', async () => {
    const res = await request(app).post('/items/clear');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Список элементов очищен');

    const getRes = await request(app).get('/items/count');
    expect(getRes.body.count).toEqual(0);
  });
});

