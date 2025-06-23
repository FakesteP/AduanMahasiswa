import React, { useEffect, useState } from "react";
import { Base_Url } from "../utils/utils";

function ComplaintDetail({ token, aduanId, isAdmin, onUpdated, onBack }) {
  const [aduan, setAduan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${Base_Url}/aduan/${aduanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal mengambil data");
        setAduan(data);
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [aduanId, token]);

  async function handleUpdateStatus(newStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`${Base_Url}/aduan/${aduanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal update status");
      setStatus(newStatus);
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="text-blue-600">Memuat detail aduan...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!aduan) return <p>Tidak ada data aduan</p>;

  // Tambahkan fungsi untuk download lampiran
  const handleDownloadLampiran = async () => {
    try {
      const res = await fetch(`${Base_Url}/aduan/${aduanId}/lampiran`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lampiran tidak ditemukan");
      const blob = await res.blob();
      // Dapatkan ekstensi file dari response header jika ada
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "lampiran";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      // Buat link download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (st) => {
    switch (st) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "proses":
        return "bg-blue-100 text-blue-700";
      case "selesai":
        return "bg-green-100 text-green-700";
      case "batal":
        return "bg-gray-200 text-gray-700";
      case "tolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* Tombol kembali */}
      {onBack && (
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow-sm transition mb-4"
        >
          ← Kembali ke Daftar
        </button>
      )}

      <h3 className="text-2xl font-bold text-blue-800">{aduan.judul}</h3>

      <div className="space-y-1">
        <p>
          <strong className="text-gray-700">Kategori:</strong> {aduan.kategori}
        </p>
        <p className="flex items-center gap-2">
          <strong className="text-gray-700">Status:</strong>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(
              status
            )}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </p>
      </div>

      <p className="text-gray-800 whitespace-pre-wrap">{aduan.isi}</p>

      <div className="text-sm text-gray-500">
        Diajukan oleh:{" "}
        <strong>
          {aduan.user?.nama || "Unknown"}{" "}
          <span className="text-gray-400">{aduan.user?.username}</span>
        </strong>
        <br />
        Pada:{" "}
        {aduan.tanggal_dibuat
          ? new Date(aduan.tanggal_dibuat).toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "-"}
      </div>

      {/* Tambahkan tombol download lampiran jika ada */}
      {aduan.lampiran && (
        <div className="mt-4">
          <button
            onClick={handleDownloadLampiran}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
          >
            Download Lampiran
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="flex flex-wrap gap-2 pt-4 border-t mt-4">
          {["pending", "proses", "selesai", "batal", "tolak"].map((st) => (
            <button
              key={st}
              disabled={updating || status === st}
              onClick={() => handleUpdateStatus(st)}
              className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                st === "pending"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : st === "proses"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : st === "selesai"
                  ? "bg-green-500 hover:bg-green-600"
                  : st === "batal"
                  ? "bg-gray-500 hover:bg-gray-600"
                  : st === "tolak"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-400"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintDetail;
