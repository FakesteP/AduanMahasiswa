import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../utils/utils";

function RegisterPage() {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak sama!");
      return;
    }

    try {
      const res = await axios.post(`${Base_Url}/users`, {
        nama,
        nim,
        email,
        password,
        role: "mahasiswa",
      });

      if (res.status === 201) {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
      } else {
        alert(res.data.message || "Gagal registrasi!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan saat registrasi");
    }
  }

  return React.createElement(
    "div",
    { className: "max-w-md mx-auto mt-32 bg-white p-6 rounded shadow" },
    React.createElement("h2", { className: "text-xl font-semibold mb-4 text-center" }, "Register Mahasiswa"),
    React.createElement(
      "form",
      { onSubmit: handleSubmit },
      React.createElement("input", {
        type: "text",
        placeholder: "Nama",
        value: nama,
        onChange: (e) => setNama(e.target.value),
        className: "w-full border px-3 py-2 mb-3 rounded",
        required: true,
      }),
      React.createElement("input", {
        type: "text",
        placeholder: "NIM",
        value: nim,
        onChange: (e) => setNim(e.target.value),
        className: "w-full border px-3 py-2 mb-3 rounded",
        required: true,
      }),
      React.createElement("input", {
        type: "email",
        placeholder: "Email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        className: "w-full border px-3 py-2 mb-3 rounded",
        required: true,
      }),
      React.createElement("input", {
        type: "password",
        placeholder: "Password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        className: "w-full border px-3 py-2 mb-3 rounded",
        required: true,
      }),
      React.createElement("input", {
        type: "password",
        placeholder: "Konfirmasi Password",
        value: confirmPassword,
        onChange: (e) => setConfirmPassword(e.target.value),
        className: "w-full border px-3 py-2 mb-3 rounded",
        required: true,
      }),
      React.createElement(
        "button",
        {
          type: "submit",
          className: "w-full bg-green-500 text-white py-2 rounded hover:bg-green-600",
        },
        "Register"
      )
    )
  );
}

export default RegisterPage;
