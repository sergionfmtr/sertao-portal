# sertao-portal

Portal da Clínica Médica do Sertão.

## Variáveis de Ambiente

Para que a aplicação consiga se comunicar com o backend, você pode criar um arquivo `.env` na raiz do projeto com a seguinte variável:

```env
API_URL=http://localhost:8080
```

_(Se a variável não for definida, o sistema usará `http://localhost:8080` como padrão)._

# Executando com Docker

Para iniciar a aplicação, execute:

```bash
docker compose up -d --build
```

Para parar a aplicação:

```bash
docker compose down
```
