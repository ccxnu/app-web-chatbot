#!/bin/bash

# Ir al directorio del script
cd "$(dirname "$0")"
echo ">> Start"

# Variables
NAME_CONTAINER="cnt_front_chatbot"
NAME_IMAGE="img-front-chatbot"
PORT_EXPOSE=6600

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
    -p "$PORT_EXPOSE":80 \
    "$NAME_IMAGE"

echo ">> Successfully service"
