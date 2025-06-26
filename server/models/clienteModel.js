const { db } = require("../services/firebase");

class ClienteModel {
  static async criarCliente(dados) {
    const docRef = await db.collection("clientes").add({
      ...dados,
      criado_em: new Date(),
      atualizado_em: new Date()
    });

    return docRef.id;
  }

  static async listarClientes(filtros = {}) {
    let query = db.collection("clientes");

    const camposFiltraveis = ["nome", "cpf", "email", "cidade", "estado", "profissao"];

    for (const campo of camposFiltraveis) {
      if (filtros[campo]) {
        query = query.where(campo, "==", filtros[campo]);
      }
    }

    const snapshot = await query.get();

    const clientes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return clientes;
  }


  static async atualizarCliente(id, dados) {
    const clienteRef = db.collection("clientes").doc(id);

    await clienteRef.update({
      ...dados,
      atualizado_em: new Date()
    });
  }

  static async excluirCliente(id) {
    const clienteRef = db.collection("clientes").doc(id);
    await clienteRef.delete();
  }

  static async buscarClientePorId(id) {
    const docRef = db.collection("clientes").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  }
}

module.exports = ClienteModel;
