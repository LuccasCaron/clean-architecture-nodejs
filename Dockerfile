# Use uma imagem base do Node.js
FROM node:18

# Crie um diretório de trabalho
WORKDIR /app


# Copie o código-fonte da aplicação para o diretório de trabalho
COPY . .

RUN npm install

# Compile o código TypeScript
RUN npm run build

# Exponha a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
