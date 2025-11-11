#!/usr/bin/env bash
set -euo pipefail

# Build image
IMAGE_NAME=mern-tests
echo "Building Docker image ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .

echo "Running tests inside Docker (full test suite)..."
docker run --rm ${IMAGE_NAME}

echo "Done."
