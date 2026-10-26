FROM node:24-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends blender ffmpeg python3 python3-numpy chromium ca-certificates && rm -rf /var/lib/apt/lists/*
USER node
