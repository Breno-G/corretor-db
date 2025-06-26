const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const verificarToken = require("../middlewares/authMiddleware");


// Middleware de autenticação
router.use(verificarToken);
//crud
router.post("/", clienteController.create);
router.get("/", clienteController.getAll);
router.get("/:id/exportar", clienteController.exportar);
router.put("/:id", clienteController.update);
router.delete("/:id", clienteController.delete);    


module.exports = router;
