# Debugging Guide - MERN Testing Application

## 🔍 Overview
This guide explains how to use the debugging features implemented in this MERN application for identifying and fixing issues during development and testing.

## 🖥️ Server-Side Debugging

### 1. Structured Logging with Winston

**What It Does:**
Captures detailed logs with context about every operation on the server.

**Where to Look:**
- Console output: Shows colorized logs during development
- `app.log`: General application logs (production mode)
- `error.log`: Error-specific logs (production mode)

**Example Log Entry:**
```json
{
  "level": "info",
  "message": "Post created",
  "timestamp": "2025-11-11 14:25:28",
  "postId": "507f1f77bcf86cd799439021",
  "userId": "507f1f77bcf86cd799439011",
  "title": "My First Post",
  "service": "mern-app"
}
```

**How to Use:**
```bash
# View logs in real-time
npm run dev 2>&1 | grep "Post created"

# For production with file logging
LOG_LEVEL=debug LOG_FILE=app.log npm start

# View error logs
tail -f error.log
```

### 2. Global Error Handler

**What It Does:**
Catches all unhandled errors and logs them with full context.

**What Gets Logged:**
- Error message
- HTTP method and URL
- Status code
- Request ID (if available)
- Timestamp

**Example Error Log:**
```json
{
  "level": "error",
  "message": "Failed to create post",
  "timestamp": "2025-11-11 14:26:15",
  "method": "POST",
  "url": "/api/posts",
  "statusCode": 500,
  "error": "Post validation failed",
  "userId": "507f1f77bcf86cd799439011"
}
```

**How to Debug:**
1. Look for errors with timestamp
2. Match HTTP method and URL
3. Check the userId to trace user actions
4. Refer to the error message for root cause

### 3. Request/Response Logging Middleware

**What It Does:**
Logs every HTTP request and response with duration.

**Example Log:**
```
2025-11-11 14:25:28 [info]: GET /api/posts {"service":"mern-app","status":200,"duration":"12ms","method":"GET","path":"/api/posts","userId":"anonymous"}
```

**How to Use:**
- Track API endpoint performance
- Identify slow requests (look for high `duration` values)
- Track user interactions by `userId`

## 💻 Client-Side Debugging

### 1. Error Boundaries

**What They Do:**
Prevent entire app from crashing when a component throws an error.

**How to Spot:**
1. See error message: "Something went wrong"
2. Error details shown in development mode
3. "Try Again" button available to recover

**Example Error Boundary Display:**
```
┌─────────────────────────────────┐
│ Something went wrong             │
│ An unexpected error occurred...  │
│                                 │
│ Error details (dev only):       │
│ TypeError: Cannot read...        │
│ Error Stack: at Button.jsx:45   │
│                                 │
│ [Try Again] button              │
│ Error count: 1                  │
└─────────────────────────────────┘
```

**How to Use:**
1. Read the error message in development
2. Check the component stack trace
3. Fix the component code
4. Click "Try Again" to retry

### 2. Component Testing

**What It Does:**
Catches component-level issues before they reach production.

**Run Tests:**
```bash
npm run test:unit
```

**Fixes Component Issues:**
- Props validation errors
- Missing required props
- Incorrect state management
- Event handler issues

## 🧪 Testing for Debugging

### Run Tests with Detailed Output

```bash
# Verbose output showing each test
npm test -- --verbose

# Show which files changed
npm test -- --onlyChanged

# Debug a specific test
npm test -- --testNamePattern="specific test name"

# Stop at first test failure
npm test -- --bail

# Keep tests running, re-run on file change
npm test -- --watch
```

### Debug a Failing Test

1. **Read the Error Message**
   ```
   ● Test suite › Test name
   Expected: 200
   Received: 404
   ```

2. **Check the Stack Trace**
   - Points to exact line where test failed
   - File path and line number provided

3. **Modify Test for Debugging**
   ```javascript
   it('creates a post', async () => {
     console.log('Test started');
     const response = await request(app).post('/api/posts');
     console.log('Response:', response.status, response.body);
     expect(response.status).toBe(201);
   });
   ```

4. **Run Single Test**
   ```bash
   npm test -- --testNamePattern="creates a post"
   ```

## 📊 Reading Coverage Reports

After running tests:
```bash
npm test -- --coverage
```

Look for `coverage/` directory with HTML report:
```
coverage/
├── index.html (open in browser)
├── client/
│   └── index.html
└── server/
    └── index.html
```

**Coverage Metrics Explained:**
- **Statements**: Lines of code executed by tests
- **Branches**: If/else paths taken during tests  
- **Functions**: Functions that were called
- **Lines**: Actual lines with code

**Interpreting Results:**
- 🟢 Green (>80%): Good coverage
- 🟡 Yellow (50-80%): Acceptable but could improve
- 🔴 Red (<50%): Needs more tests

## 🔨 Common Debugging Scenarios

### Scenario 1: API Returns 500 Error

**Steps:**
1. Check server logs for error details
2. Look for the timestamp matching the request
3. Read the error message
4. Check if it's a validation error or database issue
5. Add console.log() in the route handler
6. Run test with `--verbose` flag

**Example:**
```javascript
// In app.js - add debugging
app.post('/api/posts', async (req, res) => {
  console.log('POST /api/posts - Body:', req.body);
  try {
    // ... code
  } catch (err) {
    console.error('Error details:', err);
  }
});
```

### Scenario 2: Component Throws Error

**Steps:**
1. Error Boundary catches and displays error
2. Read error message and stack trace
3. Check props being passed to component
4. Check component's useEffect or state
5. Run component test: `npm run test:unit -- --testNamePattern="component name"`

### Scenario 3: Test Failures

**Steps:**
1. Read the "Expected" vs "Received" values
2. Check if test is using correct mock data
3. Verify test setup/teardown
4. Add debugging console.log in test
5. Run with `--verbose` for details

### Scenario 4: Performance Issues

**Steps:**
1. Check request duration in logs (look for high duration values)
2. Identify slow endpoints
3. Add performance markers in code
4. Profile with Node.js built-in tools:
   ```bash
   node --inspect-brk app.js
   ```
5. Open `chrome://inspect` in browser

## 📱 Browser DevTools for Client Debugging

### Chrome/Firefox DevTools

**1. Console Tab:**
```javascript
// Component logged errors
console.error('Component error:', error);

// Debug object state
console.table(posts);
```

**2. Network Tab:**
- Monitor API calls
- Check request/response payloads
- See response times
- Identify failed requests (status 4xx, 5xx)

**3. Elements Tab:**
- Inspect rendered HTML
- Check computed styles
- Verify DOM structure

**4. Debugger Tab:**
- Set breakpoints in component code
- Step through execution
- Inspect variable values

## 🐛 Environment Variables for Debugging

```bash
# Enable debug logging
DEBUG=* npm test

# Node debugging
NODE_DEBUG=* npm start

# Jest debugging
NODE_OPTIONS="--inspect-brk" npm test

# Extended logging
LOG_LEVEL=debug npm start

# Save logs to files
LOG_FILE=app.log ERROR_LOG_FILE=error.log npm start
```

## 📝 Debugging Checklist

- [ ] Check error message and stack trace
- [ ] Look at server logs with matching timestamp
- [ ] Verify API request/response in Network tab
- [ ] Check component props and state
- [ ] Run relevant unit tests
- [ ] Add console.log for debugging
- [ ] Check environment variables
- [ ] Review recent code changes
- [ ] Test with different data inputs
- [ ] Clear browser cache/local storage

## 🎯 Tips & Tricks

1. **Use debugger statement:**
   ```javascript
   debugger; // Execution pauses here in DevTools
   ```

2. **Log on specific conditions:**
   ```javascript
   if (error) {
     structuredLogger.error('Critical error:', { error, context });
   }
   ```

3. **Use error codes for tracking:**
   ```javascript
   const error = new Error('Invalid input');
   error.code = 'VALIDATION_ERROR';
   throw error;
   ```

4. **Track request flow:**
   ```javascript
   structuredLogger.info('Step 1: Received request');
   structuredLogger.info('Step 2: Validated input');
   structuredLogger.info('Step 3: Saved to DB');
   ```

## 🚀 Debugging in Docker

Run integration tests with visible logs:
```bash
docker run --rm -it mern-test npm run test:integration
```

View logs in container:
```bash
docker exec container-id tail -f app.log
```

## 📞 Quick Reference

| Issue | Solution |
|-------|----------|
| Test fails | Run with `--verbose` |
| App crashes | Check error logs, Error Boundary UI |
| Slow API | Check duration in logs |
| Missing data | Verify mocks in test |
| Component error | Check props, run component test |
| DB connection | Check error handler logs |

---

**Remember**: Logs are your best friend! Structured logging with Winston provides visibility into your application's behavior. Use tests to catch issues early!
