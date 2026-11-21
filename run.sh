#!/bin/sh
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="$PROJECT_DIR/.local_node/bin:$PATH"
npm run dev
