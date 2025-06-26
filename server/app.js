const express = require("express");
const cors = require("cors");
const clienteRoutes = require("./routes/clienteRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/clientes", clienteRoutes);
app.use("/auth", authRoutes);

module.exports = app;

