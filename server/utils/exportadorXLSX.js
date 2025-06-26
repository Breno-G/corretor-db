const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

function gerarPlanilha(cliente) {
  const end = cliente.endereco || {};

  const enderecoCompleto = [
    end.logradouro,
    end.numero,
    end.complemento,
    end.bairro
  ]
    .filter(Boolean)
    .join(", ");

  const cidadeEstadoCep = [
    end.cidade,
    end.estado,
    end.cep
  ]
    .filter(Boolean)
    .join(" - ");

  const dados = [{
    Nome: cliente.nome,
    CPF: cliente.cpf,
    Email: cliente.email,
    Telefone: cliente.telefone,
    Profissão: cliente.profissao,
    DataNascimento: cliente.dataNascimento,
    Endereço: enderecoCompleto,
    Cidade: cidadeEstadoCep
  }];

  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cliente");

  const filePath = path.join(__dirname, "..", "temp", `cliente-${cliente.id}.xlsx`);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  XLSX.writeFile(workbook, filePath);

  return filePath;
}

module.exports = {
  gerarPlanilha
};
