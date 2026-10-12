import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Thermometer, ShieldAlert, CheckCircle2, Search, AlertOctagon, Plus, FileSpreadsheet } from "lucide-react";

export const HACCPLog = () => {
  const { haccpLogs, addHaccpEntry, inventory, patients, showToast, currentRole } = useApp();

  const [recallLotQuery, setRecallLotQuery] = useState("LOT-AYM-20261010-01");
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  // New log form state
  const [pointName, setPointName] = useState("Freezer Daging 1 (Penyimpanan Daging Beku)");
  const [standardTemp, setStandardTemp] = useState("< -18.0°C");
  const [measuredTemp, setMeasuredTemp] = useState(-18.5);
  const [status, setStatus] = useState("Pass (Sesuai)");
  const [correctiveAction, setCorrectiveAction] = useState("-");

  const handleCreateLog = (e) => {
    e.preventDefault();
    addHaccpEntry({
      pointName,
      standardTemp,
      measuredTemp: parseFloat(measuredTemp),
      status,
      correctiveAction
    });
    setShowAddLogModal(false);
  };

  // Find inventory item matching lot number for food recall simulation
  const matchedInv = inventory.find(
    (item) => item.lotNumber.toLowerCase() === recallLotQuery.trim().toLowerCase()
  );

  return (
    <div>
      {/* Food Recall / Traceability Simulator Banner */}
      <div className="card" style={{ border: "2px solid #fecaca", background: "#fff5f5" }}>
        <div className="card-header" style={{ borderBottomColor: "#fee2e2" }}>
          <div className="card-title-group">
            <AlertOctagon size={20} color="#dc2626" />
            <div>
              <h3 className="card-title" style={{ color: "#991b1b" }}>
                Simulator Traceability & Food Recall Cepat (Standar HACCP & SKP)
              </h3>
              <p className="card-subtitle">
                Pelacakan cepat nomor lot bahan pangan jika terdeteksi kontaminasi atau insiden keracunan
              </p>
            </div>
          </div>
          <span className="badge badge-danger">HACCP Recall Protocol</span>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-input"
            style={{ maxWidth: "340px", fontFamily: "monospace", fontWeight: 700 }}
            placeholder="Ketik Nomor Lot (cth: LOT-AYM-20261010-01)..."
            value={recallLotQuery}
            onChange={(e) => setRecallLotQuery(e.target.value)}
          />
          <button
            className="btn btn-danger"
            onClick={() => {
              if (matchedInv) {
                showToast(`Peringatan Recall Diterbitkan untuk Lot ${matchedInv.lotNumber}!`, "error");
              } else {
                showToast("Nomor Lot tidak ditemukan dalam inventori", "info");
              }
            }}
          >
            <ShieldAlert size={16} /> Lacak & Terbitkan Emergency Recall
          </button>
        </div>

        {matchedInv ? (
          <div
            style={{
              background: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #fca5a5"
            }}
          >
            <div className="grid-3" style={{ marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>BAHAN PANGAN:</span>
                <div style={{ fontWeight: 800, fontSize: "14px", color: "#991b1b" }}>{matchedInv.name}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>SUPPLIER RESMI:</span>
                <div style={{ fontWeight: 700 }}>{matchedInv.supplier}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>TANGGAL TERIMA & EXPIRED:</span>
                <div>{matchedInv.receivedDate} s/d {matchedInv.expiryDate}</div>
              </div>
            </div>

            <div style={{ background: "#fef2f2", padding: "12px", borderRadius: "6px", fontSize: "12px", color: "#7f1d1d" }}>
              <strong>Jejak Distribusi Bahan Ini Hari Ini:</strong>
              <div style={{ marginTop: "4px" }}>
                • Diolah menjadi: <em>Ayam Suwir Bumbu Kuning (150 porsi) & Semur Daging Dapur</em><br />
                • Didistribusikan ke: <strong>Bangsal Melati (42 pasien), Mawar (30 pasien), ICU Sentral (4 pasien)</strong><br />
                • Status Tindakan Kedaruratan: <em>Blokir seluruh sisa stok di Gudang ({matchedInv.currentStockKg} kg) dan hubungi perawat ruangan untuk penarikan plato!</em>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Masukkan nomor lot valid seperti: <code>LOT-AYM-20261010-01</code>, <code>LOT-SPI-20261009-03</code>, atau <code>LOT-TLR-20261008-04</code>
          </div>
        )}
      </div>

      {/* HACCP Temperature Log Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Thermometer size={18} color="var(--primary)" />
            <div>
              <h3 className="card-title">Log Pemantauan Suhu Titik Kritis (HACCP Log Sheet)</h3>
              <p className="card-subtitle">
                Monitoring suhu freezer daging, chiller sayur, dan suhu pengolahan pusat makanan (&ge;75°C)
              </p>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddLogModal(true)}>
            <Plus size={14} /> Catat Log Suhu Baru
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Titik Pantau HACCP (CCP / Storage)</th>
                <th>Standar Kritis</th>
                <th>Suhu Terukur (°C)</th>
                <th>Waktu Catat</th>
                <th>Petugas Validasi</th>
                <th>Status Mutu</th>
                <th>Tindakan Koreksi</th>
              </tr>
            </thead>
            <tbody>
              {haccpLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{log.pointName}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {log.standardTemp}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 800,
                        color: log.status.includes("Warning") ? "#d97706" : "#0d9488"
                      }}
                    >
                      {log.measuredTemp}°C
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "12px" }}>{log.timestamp} WIB</span>
                  </td>
                  <td>
                    <span style={{ fontSize: "12px", fontWeight: 600 }}>{log.officer}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        log.status.includes("Pass") ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {log.correctiveAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Log */}
      {showAddLogModal && (
        <div className="modal-overlay" onClick={() => setShowAddLogModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Input Log Pemantauan Suhu HACCP</h3>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                onClick={() => setShowAddLogModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateLog}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Titik Kendali Kritis (CCP) / Cold Storage:</label>
                  <select
                    className="form-select"
                    value={pointName}
                    onChange={(e) => {
                      setPointName(e.target.value);
                      if (e.target.value.includes("Freezer")) setStandardTemp("< -18.0°C");
                      else if (e.target.value.includes("Chiller")) setStandardTemp("2.0°C - 5.0°C");
                      else if (e.target.value.includes("CCP 1")) setStandardTemp(">= 75.0°C selama 2 menit");
                      else if (e.target.value.includes("CCP 2")) setStandardTemp(">= 60.0°C");
                    }}
                  >
                    <option value="Freezer Daging 1 (Penyimpanan Daging Beku)">Freezer Daging 1 (Penyimpanan Daging Beku)</option>
                    <option value="Freezer Ikan & Seafood 2">Freezer Ikan & Seafood 2</option>
                    <option value="Chiller Sayur & Buah Segar">Chiller Sayur & Buah Segar</option>
                    <option value="Chiller Telur Ayam">Chiller Telur Ayam</option>
                    <option value="CCP 1 - Pemasakan Lauk Hewani (Suhu Pusat)">CCP 1 - Pemasakan Lauk Hewani (Suhu Pusat)</option>
                    <option value="CCP 2 - Holding Suhu Makanan Sebelum Distribusi">CCP 2 - Holding Suhu Makanan Sebelum Distribusi</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Standar Rujukan Suhu:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={standardTemp}
                      readOnly
                      style={{ background: "#f8fafc" }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Suhu Terukur Aktual (°C):</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={measuredTemp}
                      onChange={(e) => setMeasuredTemp(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Kesesuaian:</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pass (Sesuai)">Pass (Sesuai Mutu HACCP)</option>
                    <option value="Warning (Perlu Tindakan Koreksi)">Warning (Perlu Tindakan Koreksi Segera)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tindakan Koreksi (Jika Ada Penyimpangan):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="Contoh: Setting kompresor disesuaikan, masak ulang..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddLogModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Log HACCP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
