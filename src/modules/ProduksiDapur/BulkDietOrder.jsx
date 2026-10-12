import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Utensils, Users, Building, CheckCircle, Clock, AlertCircle, Printer } from "lucide-react";

export const BulkDietOrder = () => {
  const { patients, currentRole, showToast } = useApp();
  const [selectedShift, setSelectedShift] = useState("Siang");
  const [productionStatus, setProductionStatus] = useState("Dalam Pengolahan Dapur");

  // Aggregated dietary breakdown across wards
  const dietSummary = [
    { type: "Diet Biasa (Nasi Tim / Nasi Pulen)", count: 320, color: "#0d9488" },
    { type: "Diet Lunak Rendah Serat / Pasca Bedah", count: 185, color: "#0284c7" },
    { type: "Diet Diabetes Melitus (DM 1500 - 1700 kkal)", count: 210, color: "#f59e0b" },
    { type: "Diet Jantung & Rendah Garam (RG I / RG II)", count: 145, color: "#ec4899" },
    { type: "Diet Rendah Protein (RP 40g GGK HD/Non-HD)", count: 95, color: "#8b5cf6" },
    { type: "Diet Cair Sonde Enteral Khusus (ICU / HCU)", count: 68, color: "#10b981" },
    { type: "Diet TKTP Anak (Tinggi Kalori Tinggi Protein)", count: 77, color: "#06b6d4" }
  ];

  const totalPortions = dietSummary.reduce((acc, curr) => acc + curr.count, 0);

  // Ward Orders breakdown
  const wardOrders = [
    { ward: "ICU Sentral & HCU", beds: 24, regular: 0, special: 24, enteral: 18, status: "Siap Packing" },
    { ward: "Rawat Inap Melati (Penyakit Dalam)", beds: 80, regular: 25, special: 55, enteral: 4, status: "Pengolahan" },
    { ward: "Mawar (Bedah Umum & Digestif)", beds: 65, regular: 30, special: 35, enteral: 2, status: "Pengolahan" },
    { ward: "Anggrek (Jantung & VIP)", beds: 40, regular: 12, special: 28, enteral: 0, status: "Siap Packing" },
    { ward: "Kenanga (Pediatrik / Anak)", beds: 50, regular: 15, special: 35, enteral: 1, status: "Pengolahan" },
    { ward: "Cempaka (Kebidanan & Kandungan)", beds: 45, regular: 35, special: 10, enteral: 0, status: "Selesai Siap Kirim" },
    { ward: "Flamboyan (Isolasi Infeksius)", beds: 20, regular: 5, special: 15, enteral: 3, status: "Pengolahan" }
  ];

  return (
    <div>
      {/* Top Banner Grand Total */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f766e 0%, #042f2e 100%)",
          color: "white",
          padding: "28px 32px",
          borderRadius: "16px",
          marginBottom: "26px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "0 8px 24px rgba(4, 47, 46, 0.25)"
        }}
      >
        <div>
          <div style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#5eead4", fontWeight: 700 }}>
            Rekapitulasi Produksi Dapur Sentral RSUD Provinsi
          </div>
          <div style={{ fontSize: "44px", fontWeight: 800, margin: "6px 0", letterSpacing: "-0.02em" }}>
            {totalPortions} <span style={{ fontSize: "22px", fontWeight: 500 }}>Porsi (Shift {selectedShift})</span>
          </div>
          <div style={{ fontSize: "14px", opacity: 0.9 }}>
            Melayani 324 Tempat Tidur Pasien Rawat Inap • Dapur Produksi Higienis Berstandar Akreditasi HACCP
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <select
            className="form-select"
            style={{ minWidth: "180px", fontWeight: 700, fontSize: "15px", height: "46px" }}
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            <option value="Pagi">Shift Pagi (06:00)</option>
            <option value="Siang">Shift Siang (11:30)</option>
            <option value="Sore">Shift Sore (17:00)</option>
            <option value="Snack Pagi">Snack Pagi (09:30)</option>
            <option value="Snack Sore">Snack Sore (15:00)</option>
          </select>

          <button
            className="btn btn-secondary"
            style={{ fontSize: "14px", fontWeight: 700, height: "46px" }}
            onClick={() => {
              showToast("Lembar Rekapitulasi Produksi Dapur berhasil dicetak!", "success");
              window.print();
            }}
          >
            <Printer size={18} /> Cetak Rekap Shift
          </button>
        </div>
      </div>

      {/* Diet Summary Cards Grid */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Utensils size={20} color="var(--primary)" />
            <div>
              <h3 className="card-title">Grand Total Porsi per Jenis Diet (Shift {selectedShift})</h3>
              <p className="card-subtitle">
                Agregasi real-time otomatis dari pesanan RME DPJP & Dietisien seluruh ruangan
              </p>
            </div>
          </div>
          <span className="badge badge-primary">Total: 7 Kategori Diet</span>
        </div>

        <div className="grid-4">
          {dietSummary.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid var(--border-color)",
                borderRadius: "14px",
                padding: "20px",
                background: "#ffffff",
                borderTop: `5px solid ${item.color}`,
                boxShadow: "var(--shadow-card)",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 700, minHeight: "44px" }}>
                {item.type}
              </div>
              <div style={{ fontSize: "34px", fontWeight: 800, color: "var(--text-primary)", margin: "8px 0", letterSpacing: "-0.02em" }}>
                {item.count}{" "}
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-muted)" }}>porsi</span>
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>
                {((item.count / totalPortions) * 100).toFixed(1)}% dari total produksi shift
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Building size={18} color="var(--primary)" />
            <div>
              <h3 className="card-title">Rincian Pesanan Makanan per Bangsal / Ruang Rawat Inap</h3>
              <p className="card-subtitle">
                Status kesiapan batch pengolahan & pengiriman ke pantry masing-masing lantai
              </p>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ruang Rawat / Bangsal</th>
                <th>Kapasitas Bed</th>
                <th>Diet Biasa</th>
                <th>Diet Khusus / Komorbid</th>
                <th>Diet Cair / Sonde</th>
                <th>Status Produksi</th>
                <th>Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              {wardOrders.map((w, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{w.ward}</div>
                  </td>
                  <td>{w.beds} Bed</td>
                  <td><strong>{w.regular}</strong> porsi</td>
                  <td>
                    <span style={{ color: "#b45309", fontWeight: 700 }}>{w.special}</span> porsi
                  </td>
                  <td>
                    <span style={{ color: "#047857", fontWeight: 700 }}>{w.enteral}</span> porsi
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        w.status.includes("Selesai")
                          ? "badge-success"
                          : w.status.includes("Siap")
                          ? "badge-primary"
                          : "badge-warning"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => showToast(`Batch ${w.ward} diverifikasi siap packing!`)}
                    >
                      Verifikasi Batch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
