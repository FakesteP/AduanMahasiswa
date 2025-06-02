import React, { useEffect, useState } from "react";
import { Base_Url } from "../utils/utils";
import ComplaintDetail from "./ComplaintDetail";

function ComplaintList({ token, isAdmin }) {
  const [aduanList, setAduanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAduan, setSelectedAduan] = useState(null);
  const [error, setError] = useState("");

  async function fetchAduan() {
    setLoading(true);
    setError("");
    try {
      // Untuk admin: ambil semua aduan
      // Untuk mahasiswa: backend filter berdasarkan user yang login
      const url = isAdmin ? `${Base_Url}/aduan` : `${Base_Url}/aduan/user`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mengambil data aduan");

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
      // Update lokal state supaya UI langsung update
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
  if (aduanList.length === 0) return <p></p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Daftar Aduan</h2>

      {selectedAduan ? (
        <div>
          <button
            onClick={() => setSelectedAduan(null)}
            className="mb-4 underline text-blue-600"
          >
            ← Kembali ke daftar
          </button>
          <ComplaintDetail
            token={token}
            aduanId={selectedAduan}
            isAdmin={isAdmin}
            onUpdated={fetchAduan}
          />
        </div>
      ) : (
        <ul>
          {aduanList.map((aduan) => (
            <li
              key={aduan.id}
              className={`border-b py-2 ${
                isAdmin ? "" : "cursor-pointer hover:bg-gray-50"
              }`}
              onClick={() => !isAdmin && setSelectedAduan(aduan.id)}
            >
              <strong>{aduan.judul}</strong> - <em>{aduan.kategori}</em> -{" "}
              <span
                className={`font-semibold ${
                    aduan.status === "proses"
                    ? "text-blue-600"
                    : aduan.status === "selesai"
                    ? "text-green-600"
                    : aduan.status === "batal"
                    ? "text-gray-600"
                    : aduan.status === "tolak"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {aduan.status.charAt(0).toUpperCase() + aduan.status.slice(1)}
              </span>

              {/* Jika admin tampilkan select box untuk ubah status */}
              {isAdmin && (
                <select
                  value={aduan.status}
                  onChange={(e) =>
                    handleStatusChange(aduan.id, e.target.value)
                  }
                  className="ml-4 border rounded px-2 py-1"
                >
                  <option value="proses">Proses</option>
                  <option value="selesai">Selesai</option>
                  <option value="batal">Batal</option>
                  <option value="tolak">Tolak</option>
                </select>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComplaintList;
