# Estágio 1: Build da aplicação React (Vite)
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos de configuração de pacotes primeiro
COPY package*.json ./
RUN npm install

# Copia o restante do código e executa o build
COPY . .
RUN npm run build

# Estágio 2: Servidor Web (Nginx) para produção
FROM nginx:alpine

# O Vite gera os arquivos estáticos na pasta "dist"
# Vamos copiá-los do Estágio 1 para a pasta pública padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta padrão que o Nginx usa
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]