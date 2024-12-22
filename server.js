<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ratoeira Ads - Configurações</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      padding: 0;
    }

    h1 {
      text-align: center;
    }

    .form-container {
      margin-bottom: 20px;
    }

    .form-container input {
      padding: 10px;
      margin: 5px;
    }

    .form-container button {
      padding: 10px 15px;
      cursor: pointer;
    }

    .configurations {
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }

    th {
      background-color: #f4f4f4;
    }

    .generate-btn {
      padding: 5px 10px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
    }

    .delete-btn {
      padding: 5px 10px;
      background-color: #ff4d4d;
      color: white;
      border: none;
      cursor: pointer;
    }

    .edit-btn {
      padding: 5px 10px;
      background-color: #ff9800;
      color: white;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Ratoeira Ads - Gerenciamento</h1>

  <div class="form-container">
    <h3>Criar ou Editar Configuração</h3>
    <input type="text" id="platform" placeholder="Plataforma" />
    <input type="text" id="productName" placeholder="Nome do Produto" />
    <input type="text" id="conversionAction" placeholder="Ação de Conversão" />
    <input type="number" id="maxVisits" placeholder="Máx. de Visitas" />
    <input type="url" id="redirectURL" placeholder="URL de Redirecionamento" />
    <button id="saveButton" onclick="createConfiguration()">Salvar Configuração</button>
  </div>

  <div class="configurations">
    <h3>Configurações Existentes</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Plataforma</th>
          <th>Produto</th>
          <th>Ação</th>
          <th>Máx. Visitas</th>
          <th>URL</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody id="configTableBody"></tbody>
    </table>
  </div>

  <script>
    // Atualize aqui para o endereço do backend no Render
    const apiBaseUrl = "https://ratoeira-ads-backend.onrender.com/api";

    // Função para listar configurações
    function fetchConfigurations() {
      fetch(`${apiBaseUrl}/configurations`)
        .then((response) => response.json())
        .then((data) => {
          const tableBody = document.getElementById("configTableBody");
          tableBody.innerHTML = ""; // Limpa a tabela
          data.forEach((config) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${config.id}</td>
              <td>${config.platform}</td>
              <td>${config.productName}</td>
              <td>${config.conversionAction}</td>
              <td>${config.maxVisits}</td>
              <td>${config.redirectURL}</td>
              <td>
                <button class="generate-btn" onclick="generateScript(${config.id})">Gerar Script</button>
                <button class="delete-btn" onclick="deleteConfiguration(${config.id})">Excluir</button>
                <button class="edit-btn" onclick="editConfiguration(${config.id}, '${config.platform}', '${config.productName}', '${config.conversionAction}', ${config.maxVisits}, '${config.redirectURL}')">Editar</button>
              </td>
            `;
            tableBody.appendChild(row);
          });
        })
        .catch((error) => console.error("Erro ao buscar configurações:", error));
    }

    // Função para criar uma nova configuração
    function createConfiguration() {
      const platform = document.getElementById("platform").value;
      const productName = document.getElementById("productName").value;
      const conversionAction = document.getElementById("conversionAction").value;
      const maxVisits = document.getElementById("maxVisits").value;
      const redirectURL = document.getElementById("redirectURL").value;

      const payload = { platform, productName, conversionAction, maxVisits, redirectURL };

      fetch(`${apiBaseUrl}/configurations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then(() => {
          alert("Configuração criada com sucesso!");
          fetchConfigurations(); // Atualiza a lista
          resetForm();
        })
        .catch((error) => console.error("Erro ao criar configuração:", error));
    }

    // Função para gerar o script
    function generateScript(id) {
      fetch(`${apiBaseUrl}/generate-script/${id}`)
        .then((response) => response.text())
        .then((script) => {
          alert(`Script gerado:\n\n${script}`);
        })
        .catch((error) => console.error("Erro ao gerar script:", error));
    }

    // Função para excluir uma configuração
    function deleteConfiguration(id) {
      if (confirm("Tem certeza que deseja excluir esta configuração?")) {
        fetch(`${apiBaseUrl}/configurations/${id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
            fetchConfigurations(); // Atualiza a lista de configurações
          })
          .catch((error) => console.error("Erro ao excluir configuração:", error));
      }
    }

    // Função para editar uma configuração
    function editConfiguration(id, platform, productName, conversionAction, maxVisits, redirectURL) {
      document.getElementById("platform").value = platform;
      document.getElementById("productName").value = productName;
      document.getElementById("conversionAction").value = conversionAction;
      document.getElementById("maxVisits").value = maxVisits;
      document.getElementById("redirectURL").value = redirectURL;

      const saveButton = document.getElementById("saveButton");
      saveButton.textContent = "Atualizar Configuração";
      saveButton.onclick = function () {
        updateConfiguration(id);
      };
    }

    // Função para atualizar uma configuração
    function updateConfiguration(id) {
      const platform = document.getElementById("platform").value;
      const productName = document.getElementById("productName").value;
      const conversionAction = document.getElementById("conversionAction").value;
      const maxVisits = document.getElementById("maxVisits").value;
      const redirectURL = document.getElementById("redirectURL").value;

      const payload = { platform, productName, conversionAction, maxVisits, redirectURL };

      fetch(`${apiBaseUrl}/configurations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          fetchConfigurations();
          resetForm();
        })
        .catch((error) => console.error("Erro ao atualizar configuração:", error));
    }

    // Função para resetar o formulário
    function resetForm() {
      document.getElementById("platform").value = "";
      document.getElementById("productName").value = "";
      document.getElementById("conversionAction").value = "";
      document.getElementById("maxVisits").value = "";
      document.getElementById("redirectURL").value = "";

      const saveButton = document.getElementById("saveButton");
      saveButton.textContent = "Salvar Configuração";
      saveButton.onclick = createConfiguration;
    }

    // Carrega as configurações ao iniciar
    fetchConfigurations();
  </script>
</body>
</html>
