import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import db from "./db.js";

let app = express();
app.use(cors());
app.use(express.json());

console.log("Servidor iniciado");


app.post("/register", async (req, res) => {
  let { nome, email, senha } = req.body;
  console.log("[REGISTER] dados recebidos:", nome, email, senha);

  try {

    let [existing] = await db.query("select * from usuario where email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ message: "email já cadastrado" });


    let hashed = await bcrypt.hash(senha, 10);
    console.log("[REGISTER] senha hashed:", hashed);


    let [result] = await db.query(
      "insert into usuario (nome, email, senha) values (?, ?, ?)",
      [nome, email, hashed]
    );
    console.log("[REGISTER] resultado do insert:", result);


    let id_usuario = result.insertId;
    await db.query("insert into registro (id_usuario, acao) values (?, ?)", [id_usuario, "cadastro realizado"]);
    console.log("[REGISTER] registro criado para id_usuario:", id_usuario);

    res.json({ message: "cadastro realizado!" });
  } catch (err) {
    console.log("[REGISTER] erro no backend:", err);
    res.status(500).json({ message: "erro no servidor" });
  }
});


app.post("/login", async (req, res) => {
  let { email, senha } = req.body;
  console.log("[LOGIN] email:", email);

  try {
    let [users] = await db.query("select * from usuario where email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ message: "usuário não encontrado" });

    let user = users[0];
    let match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(400).json({ message: "senha incorreta" });


    await db.query("insert into registro (id_usuario, acao) values (?, ?)", [user.id, "login realizado"]);
    console.log("[LOGIN] registro criado para id_usuario:", user.id);

    res.json({ id: user.id, nome: user.nome, email: user.email, role: "user" });
  } catch (err) {
    console.log("[LOGIN] erro no backend:", err);
    res.status(500).json({ message: "erro no servidor" });
  }
});


app.post("/login-admin", async (req, res) => {
  let { usuario, senha } = req.body;
  console.log("[LOGIN-ADMIN] usuario:", usuario);

  try {
    let [admins] = await db.query("select * from administrador where usuario = ? and senha = ?", [usuario, senha]);
    if (admins.length === 0) return res.status(400).json({ message: "admin não encontrado" });

    let admin = admins[0];
    console.log("[LOGIN-ADMIN] login realizado:", admin.usuario);

    res.json({ id: admin.id, usuario: admin.usuario, role: "admin" });
  } catch (err) {
    console.log("[LOGIN-ADMIN] erro no backend:", err);
    res.status(500).json({ message: "erro no servidor" });
  }
});


app.get("/users", async (req, res) => {
  try {
    let [users] = await db.query("select id, nome, email from usuario");
    res.json(users);
  } catch (err) {
    console.log("[USERS] erro no backend:", err);
    res.status(500).json({ message: "erro no servidor" });
  }
});


app.get("/registros", async (req, res) => {
  try {
    let [registros] = await db.query(
      "select r.id_registro, u.nome, r.acao, r.data_hora from registro r join usuario u on r.id_usuario = u.id order by r.data_hora desc"
    );
    res.json(registros);
  } catch (err) {
    console.log("[REGISTROS] erro no backend:", err);
    res.status(500).json({ message: "erro no servidor" });
  }
});

app.listen(3001, () => console.log("backend rodando na porta 3001"));
