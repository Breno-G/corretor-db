const ClienteModel = require("../models/clienteModel");
const { gerarPlanilha } = require("../utils/exportadorXLSX");
const path = require("path");

class ClienteController {
  static async create(req, res) {
    try {
      const dados = req.body;

      if (!dados.cpf || !dados.nome || !dados.email) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const id = await ClienteModel.criarCliente(dados);

      return res.status(201).json({ message: "Cliente cadastrado", id });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async getAll(req, res) {
    try {
      const filtros = req.query; // nome, cpf, cidade, etc.
      const clientes = await ClienteModel.listarClientes(filtros);
      return res.status(200).json(clientes);
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      return res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      if (!id || !dados) {
        return res.status(400).json({ error: "ID ou dados ausentes" });
      }

      await ClienteModel.atualizarCliente(id, dados);

      return res.status(200).json({ message: "Cliente atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      return res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID do cliente não fornecido" });
      }

      await ClienteModel.excluirCliente(id);

      return res.status(200).json({ message: "Cliente excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      return res.status(500).json({ error: "Erro ao excluir cliente" });
    }
  }

  static async exportar(req, res) {
    try {
      const { id } = req.params;

      const cliente = await ClienteModel.buscarClientePorId(id);

      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      const filePath = gerarPlanilha(cliente);

      return res.download(filePath, `cliente-${id}.xlsx`);
    } catch (error) {
      console.error("Erro ao exportar cliente:", error);
      return res.status(500).json({ error: "Erro ao gerar planilha do cliente" });
    }
  }
}

module.exports = ClienteController;