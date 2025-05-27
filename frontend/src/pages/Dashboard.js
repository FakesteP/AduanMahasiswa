const React = require("react");
const ComplaintForm = require("../components/ComplaintForm");
const ComplaintList = require("../components/ComplaintList");

function Dashboard({ token }) {
  return React.createElement("div", null,
    React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Dashboard Pengaduan"),
    React.createElement(ComplaintForm, { token }),
    React.createElement("hr", { className: "my-6" }),
    React.createElement(ComplaintList, { token })
  );
}

module.exports = Dashboard;
