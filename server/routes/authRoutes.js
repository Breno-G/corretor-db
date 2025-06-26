const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const { admin, db } = require("../services/firebase");

router.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token ausente" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    return res.status(200).json({
      uid,
      email,
      name: name || null,
    });
  } catch (error) {
    console.error("Erro ao verificar token Firebase:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

router.get("/me", verificarToken, async (req, res) => {
  try {
    const { uid, name, email } = req.usuario;
    res.status(200).json({ uid, name, email });
  } catch (err) {
    console.error("Erro ao verificar usuário logado:", err);
    res.status(500).json({ error: "Erro ao obter usuário" });
  }
});

module.exports = router;
