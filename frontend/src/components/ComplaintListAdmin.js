import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaHeartbeat,
  FaUserShield,
  FaUsers,
  FaLaptop,
  FaBriefcase,
  FaEllipsisH,
} from "react-icons/fa";
import { Base_Url } from "../utils/utils";

function getKategoriBadge(kategori) {
  const lower = kategori?.toLowerCase() || "";

  switch (lower) {
    case "akademik":
      return {
        className: "bg-green-100 text-green-800",
        icon: <FaBook className="inline mr-1" />,
      };
    case "fasilitas dan infrastruktur":
      return {
        className: "bg-blue-100 text-blue-800",
        icon: <FaBuilding className="inline mr-1" />,
      };
    case "keuangan":
      return {
        className: "bg-yellow-100 text-yellow-800",
        icon: <FaMoneyBillWave className="inline mr-1" />,
      };
    case "pelayanan administrasi":
      return {
        className: "bg-purple-100 text-purple-800",
        icon: <FaFileAlt className="inline mr-1" />,
      };
    case "kesehatan dan kesejahteraan":
      return {
        className: "bg-pink-100 text-pink-800",
        icon: <FaHeartbeat className="inline mr-1" />,
      };
    case "etika dan perilaku":
      return {
        className: "bg-red-100 text-red-800",
        icon: <FaUserShield className="inline mr-1" />,
      };
    case "organisasi kemahasiswaan dan kegiatan kampus":
      return {
        className: "bg-indigo-100 text-indigo-800",
        icon: <FaUsers className="inline mr-1" />,
      };
    case "layanan teknologi dan informasi":
      return {
        className: "bg-teal-100 text-teal-800",
        icon: <FaLaptop className="inline mr-1" />,
      };
    case "layanan karir dan alumni":
      return {
        className: "bg-orange-100 text-orange-800",
        icon: <FaBriefcase className="inline mr-1" />,
      };
    case "lain-lain":
    default:
      return {
        className: "bg-gray-100 text-gray-800",
        icon: <FaEllipsisH className="inline mr-1" />,
      };
  }
}

function ComplaintListAdmin({ token }) {
  const [aduanList, setAduanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAduan, setSelectedAduan] = useState(null);

  async function fetchAduan() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${Base_Url}/aduan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Gagal mengambil data aduan");

      setAduanList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAduan();
  }, []);

  async function handleStatusChange(id, newStatus) {
    try {
      const res = await fetch(`${Base_Url}/aduan/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal mengupdate status");
      }

      setAduanList((prev) =>
        prev.map((aduan) =>
          aduan.id === id ? { ...aduan, status: newStatus } : aduan
        )
      );
    } catch (err) {
      alert(`Error update status: ${err.message}`);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (aduanList.length === 0) return <p>Belum ada aduan.</p>;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Daftar Aduan (Admin)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="border-b px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul
                </th>
                <th className="border-b px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Kategori
                </th>
                <th className="border-b px-5 py-3 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="border-b px-5 py-3 text-center text-sm font-semibold text-gray-700">
                  Ubah Status
                </th>
                <th className="border-b px-5 py-3 text-center text-sm font-semibold text-gray-700">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {aduanList.map((aduan) => (
                <tr
                  key={aduan.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="border-b px-5 py-3 text-gray-700 text-sm">
                    {aduan.id}
                  </td>
                  <td className="border-b px-5 py-3 text-gray-800 text-sm">
                    {aduan.judul}
                  </td>
                  <td className="border-b px-5 py-3 text-gray-700 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        getKategoriBadge(aduan.kategori).className
                      }`}
                    >
                      {getKategoriBadge(aduan.kategori).icon}
                      {aduan.kategori}
                    </span>
                  </td>
                  <td
                    className={`border-b px-5 py-3 text-center text-sm font-semibold ${
                      aduan.status === "proses"
                        ? "text-blue-600"
                        : aduan.status === "selesai"
                        ? "text-green-600"
                        : aduan.status === "batal"
                        ? "text-gray-500"
                        : aduan.status === "tolak"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {aduan.status.charAt(0).toUpperCase() +
                      aduan.status.slice(1)}
                  </td>
                  <td className="border-b px-5 py-3 text-center">
                    <select
                      value={aduan.status}
                      onChange={(e) =>
                        handleStatusChange(aduan.id, e.target.value)
                      }
                      className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                      <option value="proses">Proses</option>
                      <option value="selesai">Selesai</option>
                      <option value="batal">Batal</option>
                      <option value="tolak">Tolak</option>
                    </select>
                  </td>
                  <td className="border-b px-5 py-3 text-center">
                    <button
                      onClick={() => setSelectedAduan(aduan)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md shadow-md transition-colors duration-200"
                      aria-label={`Lihat detail aduan ${aduan.judul}`}
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedAduan && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedAduan(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-lg p-8 relative text-gray-900"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
          >
            <button
              onClick={() => setSelectedAduan(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none transition"
              aria-label="Tutup modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3
              id="modal-title"
              className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200"
            >
              {selectedAduan.judul}
            </h3>
            <p className="mb-2 text-sm text-gray-500">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  getKategoriBadge(selectedAduan.kategori).className
                }`}
              >
                {getKategoriBadge(selectedAduan.kategori).icon}
                {selectedAduan.kategori || "-"}
              </span>
            </p>
            <div className="mb-6">
              <span className="font-semibold text-gray-700 block mb-1">
                Deskripsi:
              </span>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedAduan.isi}
              </p>
            </div>
            <p className="mb-6 text-sm">
              <span className="font-semibold">Status: </span>
              <span
                className={`font-semibold ${
                  selectedAduan.status === "proses"
                    ? "text-blue-600"
                    : selectedAduan.status === "selesai"
                    ? "text-green-600"
                    : selectedAduan.status === "batal"
                    ? "text-gray-500"
                    : selectedAduan.status === "tolak"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {selectedAduan.status.charAt(0).toUpperCase() +
                  selectedAduan.status.slice(1)}
              </span>
            </p>

            <button
              onClick={() => setSelectedAduan(null)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ComplaintListAdmin;
