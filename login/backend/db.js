import mysql from "mysql2/promise";

// ajuste aqui seus dados do MySQL
let db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "181021", 
  database: "Login"
});

console.log("conexão com o banco criada");

export default db;
