const express = require('express');
const mongoose = require('mongoose');

const Post = require('./models/Post');
const User = require('./models/User');
const Bug = require('./models/Bug');
const { validatePostInput, validateBugInput } = require('./utils/validators');
const structuredLogger = require('./utils/structuredLogger');

const app = express();
app.use(express.json());

const authMiddleware = require('./middleware/auth');

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    structuredLogger.info(`${req.method} ${req.path}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      method: req.method,
      path: req.path,
      userId: req.user ? req.user.id : 'anonymous'
    });
  });
  next();
});

// use auth middleware
app.use(authMiddleware);

// Create post
app.post('/api/posts', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) return res.status(400).json({ error: errors });

  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: new mongoose.Types.ObjectId(req.user.id),
      category: req.body.category ? new mongoose.Types.ObjectId(req.body.category) : undefined,
      slug: req.body.slug || (req.body.title || '').toLowerCase().replace(/\s+/g, '-'),
    });
    structuredLogger.info('Post created', {
      postId: post._id.toString(),
      userId: req.user.id,
      title: post.title
    });
    const obj = post.toObject();
    obj._id = obj._id.toString();
    obj.author = obj.author.toString();
    obj.category = obj.category ? obj.category.toString() : null;
    return res.status(201).json(obj);
  } catch (err) {
    structuredLogger.error('Failed to create post', { error: err.message, userId: req.user.id });
    return res.status(500).json({ error: err.message });
  }
});

// Get posts (with optional category filter and pagination)
app.get('/api/posts', async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (category) filter.category = new mongoose.Types.ObjectId(category);
  try {
    const skip = (Number(page) - 1) * Number(limit);
    const posts = await Post.find(filter).skip(skip).limit(Number(limit)).lean();
    const normalized = posts.map(p => ({
      ...p,
      _id: p._id.toString(),
      author: p.author ? p.author.toString() : null,
      category: p.category ? p.category.toString() : null,
    }));
    structuredLogger.info('Posts retrieved', { count: normalized.length, page, limit });
    return res.json(normalized);
  } catch (err) {
    structuredLogger.error('Failed to retrieve posts', { error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

// Get by id
app.get('/api/posts/:id', async (req, res) => {
  try {
  const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    post._id = post._id.toString();
    post.author = post.author ? post.author.toString() : null;
    post.category = post.category ? post.category.toString() : null;
    return res.json(post);
  } catch (err) {
    structuredLogger.error('Failed to retrieve post', { postId: req.params.id, error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

// Update
app.put('/api/posts/:id', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
  const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;
    await post.save();
    structuredLogger.info('Post updated', { postId: req.params.id, userId: req.user.id });
    const obj = post.toObject();
    obj._id = obj._id.toString();
    obj.author = obj.author.toString();
    obj.category = obj.category ? obj.category.toString() : null;
    return res.json(obj);
  } catch (err) {
    structuredLogger.error('Failed to update post', { postId: req.params.id, error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

// Delete
app.delete('/api/posts/:id', async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await post.remove();
    structuredLogger.info('Post deleted', { postId: req.params.id, userId: req.user.id });
    return res.json({ success: true });
  } catch (err) {
    structuredLogger.error('Failed to delete post', { postId: req.params.id, error: err.message });
    return next(err);
  }
});

// --- Bug Tracker endpoints ---

// Create bug
app.post('/api/bugs', async (req, res) => {
  const { errors, isValid } = validateBugInput(req.body);
  if (!isValid) return res.status(400).json({ error: errors });
  try {
    const bug = await Bug.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'open',
      reporter: req.user ? new mongoose.Types.ObjectId(req.user.id) : undefined
    });
    structuredLogger.info('Bug reported', { bugId: bug._id.toString(), title: bug.title });
    const obj = bug.toObject ? bug.toObject() : bug;
    obj._id = obj._id && obj._id.toString ? obj._id.toString() : obj._id;
    obj.reporter = obj.reporter && obj.reporter.toString ? obj.reporter.toString() : obj.reporter;
    return res.status(201).json(obj);
  } catch (err) {
    structuredLogger.error('Failed to create bug', { error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

// List bugs
app.get('/api/bugs', async (req, res) => {
  try {
    const bugs = await Bug.find({}).lean();
    const normalized = bugs.map(b => ({
      ...b,
      _id: b._id && b._id.toString ? b._id.toString() : b._id,
      reporter: b.reporter && b.reporter.toString ? b.reporter.toString() : b.reporter
    }));
    structuredLogger.info('Bugs retrieved', { count: normalized.length });
    return res.json(normalized);
  } catch (err) {
    structuredLogger.error('Failed to retrieve bugs', { error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

// Get bug by id
app.get('/api/bugs/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id).lean();
    if (!bug) return res.status(404).json({ error: 'Not found' });
    bug._id = bug._id && bug._id.toString ? bug._id.toString() : bug._id;
    bug.reporter = bug.reporter && bug.reporter.toString ? bug.reporter.toString() : bug.reporter;
    return res.json(bug);
  } catch (err) {
    structuredLogger.error('Failed to retrieve bug', { bugId: req.params.id, error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

// Update bug (partial update allowed)
app.put('/api/bugs/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ error: 'Not found' });
    if (req.body.title) bug.title = req.body.title;
    if (req.body.description) bug.description = req.body.description;
    if (req.body.status && ['open', 'in-progress', 'resolved'].includes(req.body.status)) bug.status = req.body.status;
    await bug.save();
    structuredLogger.info('Bug updated', { bugId: req.params.id, status: bug.status });
    const obj = bug.toObject();
    obj._id = obj._id.toString();
    obj.reporter = obj.reporter ? obj.reporter.toString() : null;
    return res.json(obj);
  } catch (err) {
    structuredLogger.error('Failed to update bug', { bugId: req.params.id, error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

// Delete bug
app.delete('/api/bugs/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ error: 'Not found' });
    await bug.remove();
    structuredLogger.info('Bug deleted', { bugId: req.params.id });
    return res.json({ success: true });
  } catch (err) {
    structuredLogger.error('Failed to delete bug', { bugId: req.params.id, error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

// Global error handler (last middleware)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
