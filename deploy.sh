#!/bin/bash

# Ir al directorio del script
cd "$(dirname "$0")"
echo ">> Start"

# Variables
NAME_CONTAINER="cnt-front-chatbot"
NAME_IMAGE="img_front_chatbot"
PORT_EXPOSE=6600
CONFIG_FOLDER="/config/appWebChatbot/"

docker build --target production -t "$NAME_IMAGE" -f Dockerfile .

echo ">> Compiled successfully"

# Si el contenedor existe, bórralo
if docker ps -a --format '{{.Names}}' | grep -q "^$NAME_CONTAINER$"; then
    echo ">> Removing the existing container"
    docker rm -f "$NAME_CONTAINER"
fi

docker run -d \
    --restart=always \
    --name "$NAME_CONTAINER" \
    --env-file "$CONFIG_FOLDER".env \
    -p "$PORT_EXPOSE":80 \
    "$NAME_IMAGE"

echo ">> Successfully service"
