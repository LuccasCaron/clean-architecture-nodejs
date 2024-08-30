# Serviço de Gerenciamento de Leitura de Medidores

## Descrição

 Este projeto desenvolve o back-end de um serviço para gerenciar a leitura individualizada de consumo de água e gás.
 O serviço utiliza inteligência artificial para obter a medição através da foto de um medidor.
 O sistema foi projetado seguindo os princípios da **Clean Architecture** e **SOLID**, garantindo uma estrutura de código robusta e manutenível.
 O projeto é desenvolvido utilizando **TypeScript** para fornecer tipagem estática e melhorar a qualidade do código. 
 Testes automatizados são realizados com **JEST** para assegurar a confiabilidade da aplicação.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para a criação da API.
- **TypeScript**: Tipagem estática ao JavaScript.
- **Docker**: Para containerização e orquestração dos serviços.
- **Prisma**: ORM para interação com o banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Google Gemini API**: Serviço de IA para extração de dados de imagens.

## Instalação e Execução

Para configurar e rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**

   git clone <url-do-repositorio>
   cd <nome-do-repositorio>

2. **Configure o ambiente:**

Crie um arquivo .env na raiz do projeto com a variável de ambiente necessária. Exemplo:

GEMINI_API_KEY=value

3. **Inicie os serviços com Docker Compose::**

docker-compose up -d

## Testando a API

Com os contêineres em execução, você pode testar a API utilizando os seguintes endpoints:

POST /upload: Upload de uma nova medição.

PATCH /confirm: Confirmação de uma medição.

GET /<custumer_code>/list: Listagem de medições para um código de cliente específico.

Exemplo de requisição para o endpoint /upload:

curl -X POST http://localhost:3000/upload \
-H "Content-Type: application/json" \
-d '{
  "customer_code": "ABC123",
  "measure_type": "WATER",
  "measure_datetime": "2024-08-30T18:00:00Z",
  "image_base64": "<base64-image-data>"
}'

## Testes

Para rodar os testes automatizados, use o seguinte comando:

npm test
