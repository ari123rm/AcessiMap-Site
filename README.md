# AcessiMap-Site

Este repositório contém o código-fonte do frontend para o site do **AcessiMap**. O objetivo do projeto é criar um mapa de acessibilidade, permitindo que os usuários encontrem locais acessíveis de forma fácil e rápida.

---

### Tecnologias Utilizadas

O site foi construído usando as seguintes tecnologias:

* **TypeScript**
* **SCSS**
* **React:** O projeto é bootstrapped com o **Create React App**.

---

### Como Executar Localmente

Para iniciar o projeto em seu ambiente de desenvolvimento, siga os passos abaixo. Certifique-se de ter o [Node.js](https://nodejs.org/en/) e o [npm](https://www.npmjs.com/) instalados em sua máquina.

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/ari123rm/AcessiMap-Site.git](https://github.com/ari123rm/AcessiMap-Site.git)
    cd AcessiMap-Site
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Execute a aplicação:**

    ```bash
    npm start
    ```

    O site estará disponível em `http://localhost:3000`.

---

### Comandos Disponíveis

No diretório do projeto, você pode executar os seguintes comandos:

* `npm start`: Inicia o servidor de desenvolvimento.
* `npm test`: Executa os testes em modo interativo.
* `npm run build`: Cria a aplicação para produção na pasta `build`.
* `npm run eject`: Remove as dependências de construção e copia os arquivos de configuração para o diretório do projeto.


### Variáveis de Ambiente Necessárias

Para o correto funcionamento do projeto AcessiMap, o arquivo `.env` deve conter as seguintes variáveis de ambiente. Elas são essenciais para a integração com a API do Google Maps e o backend da aplicação.

| Variável | Descrição | Exemplo de Valor |
| :--- | :--- | :--- |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Chave da API do Google Maps para carregar o mapa. | `SuaChaveDaAPIDoGoogleMaps` |
| `REACT_APP_API_IP` | Endereço IP ou domínio do backend da aplicação. | `http://localhost` ou `http://sua-api.com` |
| `REACT_APP_API_PORT` | Porta de acesso ao backend da aplicação. | `3001` ou a porta configurada |
| `REACT_APP_API_URL` | URL completa do backend, utilizada para requisições. | `https://backend-acessimap.onrender.com` ou a URL do ambiente |
