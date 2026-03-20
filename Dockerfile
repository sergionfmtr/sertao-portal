# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Define a variável de ambiente para a API com um valor padrão
ENV API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=http://localhost:8080

# Expõe a porta do Next.js
EXPOSE 3000

# Comando para rodar em desenvolvimento
CMD ["npm", "run", "dev"]