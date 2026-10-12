import React from "react";
import { useApp } from "../../context/AppContext";
import { Clock, AlertTriangle, ArrowDownAZ, CheckCircle, PackageCheck } from "lucide-react";

export const FEFOManager = () => {
  const { inventory, updateInventoryStock, showToast, currentRole } = useApp();

  // Sort inventory strictly by daysUntilExpiry ascending (FEFO logic)
  const fefoSortedItems = [...inventory].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  const handlePickFEFO = (item) => {
    const qty = prompt(`Keluarkan stok ${item.name} berdasarkan antrean FEFO (stok tersedia ${item.currentStockKg} ${item.unit}):`, "5");
    if (qty && !isNaN(qty)) {
      updateInventoryStock(item.id, -parseFloat(qty), "Pengeluaran FEFO Terjadwal");
      showToast(`Bahan ${item.name} (${qty} ${item.unit}) berhasil dikeluarkan berdasarkan rekomendasi FEFO!`, "success");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <Clock size={18} color="var(--primary)" />
          <div>
            <h3 className="card-title">Metode FEFO (First Expired, First Out) & FIFO Otomatis</h3>
            <p className="card-subtitle">
              Sistem memprioritaskan bahan pangan dengan masa kedaluwarsa terdekat untuk mencegah food waste & keracunan
            </p>
          </div>
        </div>
        <span className="badge badge-primary">Algoritma FEFO Aktif</span>
      </div>

      <div className="alert-box alert-warning">
        <AlertTriangle size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Aturan Penyelenggaraan Makanan RSUD:</strong> Sesuai pedoman PGRS Kemenkes, bahan pangan
          dengan tanggal kedaluwarsa terdekat <em>wajib dikeluarkan terlebih dahulu</em> untuk jadwal produksi hari ini.
          Barang dengan status &quot;Prioritas FEFO&quot; tidak boleh ditunda penggunaannya.
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Urutan Prioritas FEFO</th>
              <th>Nama Bahan Pangan</th>
              <th>Tipe Penyimpanan</th>
              <th>Nomor Lot Batch</th>
              <th>Tanggal Kedaluwarsa (ED)</th>
              <th>Sisa Hari (Days Left)</th>
              <th>Status FEFO</th>
              <th>Aksi Pengambilan</th>
            </tr>
          </thead>
          <tbody>
            {fefoSortedItems.map((item, index) => {
              const isUrgent = item.daysUntilExpiry <= 3;
              const isWarning = item.daysUntilExpiry <= 7;

              return (
                <tr
                  key={item.id}
                  style={{
                    background: isUrgent ? "#fffbeb" : "inherit"
                  }}
                >
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "26px",
                        height: "26px",
                        borderRadius: "9999px",
                        background: index < 3 ? "var(--primary)" : "#e2e8f0",
                        color: index < 3 ? "white" : "var(--text-secondary)",
                        fontWeight: 800,
                        fontSize: "12px"
                      }}
                    >
                      #{index + 1}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Stok Tersedia: {item.currentStockKg} {item.unit}
                    </div>
                  </td>
                  <td>{item.storageType}</td>
                  <td>
                    <span style={{ fontFamily: "monospace", fontWeight: 700 }}>
                      {item.lotNumber}
                    </span>
                  </td>
                  <td>
                    <strong>{item.expiryDate}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: isUrgent ? "#dc2626" : "inherit" }}>
                      {item.daysUntilExpiry} hari
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        isUrgent
                          ? "badge-danger"
                          : isWarning
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {isUrgent
                        ? "Prioritas FEFO Hari Ini!"
                        : isWarning
                        ? "Mendekati ED (<7 Hari)"
                        : "Aman"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${isUrgent ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => handlePickFEFO(item)}
                    >
                      <PackageCheck size={14} /> Ambil Stok (FEFO)
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
