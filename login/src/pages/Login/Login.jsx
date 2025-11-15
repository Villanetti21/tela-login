import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/login.scss";

export default function Login() {
  let [form, setForm] = useState({ email: "", senha: "" });
  let navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      let res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let data = await res.json();
      if (!res.ok) return alert(data.message);

      alert(`Bem-vindo, ${data.nome}!`);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("erro ao logar");
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    try {
      let res = await fetch("http://localhost:3001/login-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: form.email, senha: form.senha }),
      });
      let data = await res.json();
      if (!res.ok) return alert(data.message);

      alert(`Bem-vindo admin, ${data.usuario}!`);
      navigate("/admin");
    } catch (err) {
      console.log(err);
      alert("erro ao logar admin");
    }
  }

  return (
    <div className="login-container">
      <h2>login</h2>
      <form>
        <input name="email" placeholder="email" onChange={handleChange} />
        <input name="senha" type="password" placeholder="senha" onChange={handleChange} />
        <button type="button" onClick={handleLogin}>entrar</button>
        <button type="button" onClick={handleAdminLogin}>entrar admin</button>
      </form>
      <p>não tem conta? <Link to="/register">registrar</Link></p>
    </div>
  );
}
