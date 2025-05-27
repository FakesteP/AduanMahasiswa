const React = require("react");
const { Base_Url } = require("../utils/utils");

function ComplaintForm({ token }) {
  const [kategori, setKategori] = React.useState("");
  const [deskripsi, setDeskripsi] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${Base_Url}/aduan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ kategori, deskripsi })
    })
      .then(res => res.json())
      .then(() => {
        setKategori("");
        setDeskripsi("");
        alert("Aduan dikirim!");
      });
  }

  return React.createElement("form", { onSubmit: handleSubmit },
    React.createElement("h3", { className: "text-lg font-semibold mb-2" }, "Form Aduan"),
    React.createElement("select", {
      value: kategori,
      onChange: e => setKategori(e.target.value),
      className: "w-full mb-3 border px-3 py-2 rounded"
    },
      React.createElement("option", { value: "" }, "-- Pilih Kategori --"),
      React.createElement("option", { value: "fasilitas" }, "Fasilitas"),
      React.createElement("option", { value: "akademik" }, "Akademik"),
      React.createElement("option", { value: "layanan" }, "Layanan")
    ),
    React.createElement("textarea", {
      placeholder: "Deskripsi aduan...",
      value: deskripsi,
      onChange: e => setDeskripsi(e.target.value),
      className: "w-full mb-3 border px-3 py-2 rounded"
    }),
    React.createElement("button", {
      type: "submit",
      className: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    }, "Kirim Aduan")
  );
}

module.exports = ComplaintForm;
