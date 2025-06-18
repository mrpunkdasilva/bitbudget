#!/bin/bash

# Script para reconstruir o container Docker do frontend

echo "🔄 Parando os containers..."
docker compose down

echo "🧹 Limpando node_modules do container..."
docker volume rm $(docker volume ls -q | grep expense-tracker_node_modules) 2>/dev/null || true

echo "🏗️ Reconstruindo a imagem do frontend..."
docker compose build frontend-dev

echo "🚀 Iniciando o container..."
docker compose up frontend-dev

# Para executar este script:
# chmod +x rebuild-docker.sh
# ./rebuild-docker.sh