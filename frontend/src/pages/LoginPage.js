import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../utils/utils";

function LoginPage() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${Base_Url}/auth/login`,
        { nim, password },
        { withCredentials: true } // penting supaya cookie session dikirim!
      );

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login berhasil!");
        navigate("/form-aduan");
      } else {
        alert(res.data.message || "Login gagal!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan saat login");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-32 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Login Mahasiswa</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="w-full border px-3 py-2 mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 mb-3 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
