const request = require('supertest');

// Mock the Post model before requiring the app so app gets the mock
const mockCreate = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockInsertMany = jest.fn();

jest.mock('../../src/models/Post', () => ({
  create: (...args) => mockCreate(...args),
  find: (...args) => mockFind(...args),
  findById: (...args) => mockFindById(...args),
  insertMany: (...args) => mockInsertMany(...args),
}));

// Mock structured logger
jest.mock('../../src/utils/structuredLogger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

const app = require('../../src/app');

describe('App routes (unit tests with mocked Post model)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/posts', () => {
    it('creates a post when authenticated', async () => {
      const userId = '507f1f77bcf86cd799439011';
      // mock create to return an object with toObject
      mockCreate.mockResolvedValue({
        _id: { toString: () => '1' },
        author: { toString: () => userId },
        category: null,
        toObject: () => ({
          _id: { toString: () => '1' },
          title: 'New Test Post',
          content: 'This is a new test post content',
          author: { toString: () => userId },
          category: null,
        }),
      });

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${userId}`)
        .send({ title: 'New Test Post', content: 'This is a new test post content' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('New Test Post');
      expect(res.body.author).toBe(userId);
      expect(mockCreate).toHaveBeenCalled();
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).post('/api/posts').send({ title: 'x' });
      expect(res.status).toBe(401);
    });

    it('returns 400 when validation fails', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${userId}`)
        .send({ content: 'missing title' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/posts', () => {
    it('returns posts array', async () => {
      const docs = [{ _id: '1', title: 'a', content: 'b', author: 'u1', category: null }];
      mockFind.mockReturnValueOnce({
        skip: () => ({ limit: () => ({ lean: async () => docs }) }),
      });

      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('filters by category when provided', async () => {
      const categoryId = '601c1f77bcf86cd799439022';
      const docs = [{ _id: '2', title: 'filtered', content: 'c', author: 'u1', category: categoryId }];
      mockFind.mockReturnValueOnce({
        skip: () => ({ limit: () => ({ lean: async () => docs }) }),
      });

      const res = await request(app).get(`/api/posts?category=${categoryId}`);
      expect(res.status).toBe(200);
      expect(res.body[0].category).toBe(categoryId);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('returns a post by id', async () => {
      const doc = { _id: 'abc', title: 'Test Post', content: 'x', author: 'u1', category: null };
      mockFindById.mockReturnValueOnce({ lean: async () => doc });
      const res = await request(app).get('/api/posts/abc');
      expect(res.status).toBe(200);
      expect(res.body._id).toBe('abc');
    });

    it('returns 404 when not found', async () => {
      mockFindById.mockReturnValueOnce({ lean: async () => null });
      const res = await request(app).get('/api/posts/nonexistent');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('updates post when authenticated as author', async () => {
      const userId = '507f1f77bcf86cd799439011';
      // mock findById to return a mongoose-like document
      const postDoc = {
        author: userId,
        title: 'Old',
        content: 'old',
        save: jest.fn().mockResolvedValue(true),
        toObject() { return { _id: 'p1', author: this.author, title: this.title, content: this.content }; },
      };
      mockFindById.mockResolvedValueOnce(postDoc);

      const res = await request(app)
        .put('/api/posts/p1')
        .set('Authorization', `Bearer ${userId}`)
        .send({ title: 'Updated', content: 'updated' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
    });

    it('returns 401 if not authenticated', async () => {
      const res = await request(app).put('/api/posts/p1').send({ title: 'x' });
      expect(res.status).toBe(401);
    });

    it('returns 403 if not author', async () => {
      const userId = 'userA';
      const postDoc = { author: 'otherUser', save: jest.fn() };
      mockFindById.mockResolvedValueOnce(postDoc);
      const res = await request(app)
        .put('/api/posts/p1')
        .set('Authorization', `Bearer ${userId}`)
        .send({ title: 'Updated' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('deletes when authenticated as author', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const postDoc = { author: userId, remove: jest.fn().mockResolvedValue(true) };
      mockFindById.mockResolvedValueOnce(postDoc);

      const res = await request(app)
        .delete('/api/posts/p1')
        .set('Authorization', `Bearer ${userId}`);

      expect(res.status).toBe(200);
      expect(mockFindById).toHaveBeenCalled();
    });

    it('returns 401 if not authenticated', async () => {
      const res = await request(app).delete('/api/posts/p1');
      expect(res.status).toBe(401);
    });
  });
});

