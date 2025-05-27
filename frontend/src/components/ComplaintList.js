const React = require("react");
const { Base_Url } = require("../utils/utils");

function ComplaintList({ token }) {
  const [aduan, setAduan] = React.useState([]);

  React.useEffect(() => {
    fetch(`${Base_Url}/aduan`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setAduan(data));
  }, [token]);

  return React.createElement("div", null,
    React.createElement("h3", { className: "text-lg font-semibold mb-2" }, "Daftar Aduan"),
    aduan.map((item, index) =>
      React.createElement("div", {
        key: index,
        className: "border rounded p-3 mb-3 bg-white shadow"
      },
        React.createElement("p", { className: "font-semibold" }, item.kategori),
        React.createElement("p", null, item.deskripsi),
        React.createElement("p", { className: "text-sm text-gray-500 mt-1" }, `Status: ${item.status}`)
      )
    )
  );
}

module.exports = ComplaintList;
