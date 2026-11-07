#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
set -a
source .env.deploy
set +a

SSH_CMD="ssh -p $SSH_PORT -i $SSH_KEY"
BUILD=$(mktemp -d)
trap 'rm -rf "$BUILD"' EXIT

mkdir -p cache
git archive main | tar -x -C "$BUILD"
ln -s "$PWD/cache" "$BUILD/cache"
cd "$BUILD"

npm ci
npm run build

tar -C dist -cz . | $SSH_CMD "$SSH_USERNAME@$SSH_HOST" "tar -xzf - --no-overwrite-dir -C $FOLDER_PATH"
