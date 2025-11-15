import { useEffect, useState } from "react";
import "../../styles/admin.scss";

export default function Admin() {
  let [users, setUsers] = useState([]);
  let [registros, setRegistros] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        let resUsers = await fetch("http://localhost:3001/users");
        let dataUsers = await resUsers.json();
        setUsers(dataUsers);

        let resRegs = await fetch("http://localhost:3001/registros");
        let dataRegs = await resRegs.json();
        setRegistros(dataRegs);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, []);

  return (
    <div className="admin-container">
      <h2>painel admin</h2>

      <h3>usuarios ({users.length})</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.nome} — {u.email}</li>
        ))}
      </ul>

      <h3>registros</h3>
      <ul>
        {registros.map(r => (
          <li key={r.id_registro}>{r.nome} — {r.acao} — {r.data_hora}</li>
        ))}
      </ul>
    </div>
  );
}
