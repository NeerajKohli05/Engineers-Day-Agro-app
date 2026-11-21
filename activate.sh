#!/bin/sh
# Source this file to activate the local environment in your current shell:
# source ./activate.sh

# Determine script directory
if [ -n "$ZSH_VERSION" ]; then
  SCRIPT_PATH="${(%):-%x}"
elif [ -n "$BASH_VERSION" ]; then
  SCRIPT_PATH="${BASH_SOURCE[0]}"
else
  SCRIPT_PATH="$0"
fi

if [ -n "$SCRIPT_PATH" ] && [ -f "$SCRIPT_PATH" ]; then
  PROJECT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
else
  PROJECT_DIR="$(pwd)"
fi

if [ -d "$PROJECT_DIR/.local_node/bin" ]; then
  export PATH="$PROJECT_DIR/.local_node/bin:$PATH"
  echo "🌱 Local environment activated!"
  echo "   Node: $(node -v)"
  echo "   npm:  $(npm -v)"
  echo "   Run 'npm run dev' to start the development server."
else
  echo "Error: $PROJECT_DIR/.local_node/bin not found."
fi
