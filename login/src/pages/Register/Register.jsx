import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.scss";

export default function Register() {
  let navigate = useNavigate();
  let [form, setForm] = useState({ nome: "", email: "", senha: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      let res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let data = await res.json();
      if (!res.ok) return alert(data.message);

      alert("Cadastro realizado!");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("erro ao registrar");
    }
  }

  return (
    <div className="register-container">
      <h2>registrar</h2>
      <form>
        <input name="nome" placeholder="nome" onChange={handleChange} />
        <input name="email" placeholder="email" onChange={handleChange} />
        <input name="senha" type="password" placeholder="senha" onChange={handleChange} />
        <button type="button" onClick={handleRegister}>criar conta</button>
      </form>
      <p>já tem conta? <Link to="/">login</Link></p>
    </div>
  );
}
