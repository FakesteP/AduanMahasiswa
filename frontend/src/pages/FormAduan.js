import React, { useState } from "react";
import { Base_Url } from "../utils/utils";

function FormAduan() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setPesan("");

    try {
      const response = await fetch(`${Base_Url}/aduan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // penting untuk mengirim cookie session
        body: JSON.stringify({ judul, isi, status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mengirim aduan");
      }

      const data = await response.json();
      setPesan("Aduan berhasil dikirim!");
      setJudul("");
      setIsi("");
      setStatus("pending");
    } catch (error) {
      setPesan(error.message);
    } finally {
      setLoading(false);
    }
  }

  return React.createElement(
    "div",
    { className: "max-w-md mx-auto mt-20 p-6 bg-white rounded shadow" },
    React.createElement("h2", { className: "text-xl font-semibold mb-4 text-center" }, "Form Aduan"),
    pesan &&
      React.createElement(
        "div",
        { className: `mb-4 text-center ${pesan.includes("berhasil") ? "text-green-600" : "text-red-600"}` },
        pesan
      ),
    React.createElement(
      "form",
      { onSubmit: handleSubmit },
      React.createElement("input", {
        type: "text",
        placeholder: "Judul Aduan",
        value: judul,
        onChange: (e) => setJudul(e.target.value),
        className: "w-full border px-3 py-2 mb-3 rounded",
        required: true,
      }),
      React.createElement("textarea", {
        placeholder: "Deskripsi Aduan",
        value: isi,
        onChange: (e) => setIsi(e.target.value),
        className: "w-full border px-3 py-2 mb-3 rounded",
        required: true,
        rows: 4,
      }),
      React.createElement(
        "select",
        {
          value: status,
          onChange: (e) => setStatus(e.target.value),
          className: "w-full border px-3 py-2 mb-3 rounded",
          required: true,
        },
        React.createElement("option", { value: "pending" }, "Pending"),
        React.createElement("option", { value: "diproses" }, "Diproses"),
        React.createElement("option", { value: "selesai" }, "Selesai")
      ),
      React.createElement(
        "button",
        {
          type: "submit",
          className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50",
          disabled: loading,
        },
        loading ? "Mengirim..." : "Kirim Aduan"
      )
    )
  );
}

export default FormAduan;
