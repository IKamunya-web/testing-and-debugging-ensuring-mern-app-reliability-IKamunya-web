FROM node:16-buster

# Ensure system libraries required by mongodb-memory-server are present
RUN apt-get update && \
    apt-get install -y --no-install-recommends libssl1.1 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package manifests first to install dependencies (cache layer)
COPY package.json package-lock.json* ./

RUN npm install --no-audit --no-fund

# Copy source
COPY . .

# Default command runs the full test suite; override with docker run <image> npm run test:unit
CMD ["npm", "test"]
