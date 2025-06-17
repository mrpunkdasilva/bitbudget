#!/bin/bash

# Script para limpar e reinstalar as dependências do projeto

echo "🧹 Limpando node_modules..."
rm -rf node_modules

echo "🧹 Limpando package-lock.json..."
rm -f package-lock.json

echo "🧹 Limpando cache do npm..."
npm cache clean --force

echo "📦 Instalando dependências com --legacy-peer-deps..."
npm install --legacy-peer-deps

echo "✅ Instalação concluída!"