# Running tests inside Docker

This project uses `mongodb-memory-server` for integration tests which requires older OpenSSL libraries (libssl1.1) to run the MongoDB binary. If your host lacks `libcrypto.so.1.1` / `libssl1.1`, the integration tests will fail when mongodb-memory-server attempts to start.

This Docker configuration provides a reproducible environment that includes the required system library so the full test suite (including integration tests) can run.

Build the Docker image (run from repository root):

```bash
docker build -t mern-tests .
```

Run the full test suite inside the container:

```bash
docker run --rm mern-tests
```

Run only unit tests:

```bash
docker run --rm mern-tests npm run test:unit
```

Run only integration tests:

```bash
docker run --rm mern-tests npm run test:integration
```

Notes
- The image uses `node:16-buster` and installs `libssl1.1` so mongodb-memory-server can start the MongoDB binary.
- If you prefer to run tests locally, install `libssl1.1` on your machine (package name varies by distribution).
