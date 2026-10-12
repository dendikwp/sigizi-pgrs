import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { QrCode, Printer, CheckCircle, Tag, Building2, AlertTriangle, ShieldCheck } from "lucide-react";

export const LabelGenerator = () => {
  const { patients, selectedPatient, setSelectedPatientId, pdpMasking, showToast } = useApp();
  const [selectedShift, setSelectedShift] = useState("Siang");
  const [printAllWard, setPrintAllWard] = useState(false);

  const maskRm = (rm) => {
    if (!pdpMasking || !rm) return rm;
    const parts = rm.split("-");
    if (parts.length === 4) {
      return `${parts[0]}-${parts[1]}-**-${parts[3]}`;
    }
    return rm;
  };

  const handlePrintLabels = () => {
    showToast("Mencetak label stiker waterproof plato makanan...", "success");
    window.print();
  };

  const currentPatientList = printAllWard ? patients : [selectedPatient];

  return (
    <div>
      <div className="card no-print">
        <div className="card-header">
          <div className="card-title-group">
            <QrCode size={18} color="var(--primary)" />
            <div>
              <h3 className="card-title">Sistem Cetak Label Plato Barcode & QR Code Waterproof</h3>
              <p className="card-subtitle">
                Label standar stiker tahan air ditempel pada kotak makan pasien (Sasaran Keselamatan Pasien SKP 1)
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={printAllWard}
                onChange={(e) => setPrintAllWard(e.target.checked)}
              />
              Cetak Massal Seluruh Pasien Bangsal ({patients.length} Label)
            </label>
            <select
              className="form-select"
              style={{ width: "130px", padding: "6px 10px" }}
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="Pagi">Makan Pagi</option>
              <option value="Siang">Makan Siang</option>
              <option value="Sore">Makan Sore</option>
            </select>
            <button className="btn btn-primary" onClick={handlePrintLabels}>
              <Printer size={16} /> Cetak Label Waterproof
            </button>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Pratinjau label stiker di bawah ini siap dicetak menggunakan printer thermal atau stiker A4 vinyl tahan air.
          Setiap label memuat QR code unik untuk double check di samping tempat tidur pasien.
        </p>
      </div>

      {/* Grid of Preview Labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: "24px"
        }}
      >
        {currentPatientList.map((p) => {
          const hasAllergy = p.allergies && p.allergies[0] !== "Tidak Ada";

          return (
            <div
              key={p.id}
              className="printable-plato-label"
              style={{
                background: "#ffffff",
                border: "2.5px solid #0f172a",
                borderRadius: "14px",
                padding: "22px",
                boxShadow: "var(--shadow-lg)",
                position: "relative"
              }}
            >
              {/* Header Label */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid #0f172a",
                  paddingBottom: "10px",
                  marginBottom: "14px"
                }}
              >
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 900, color: "#042f2e", letterSpacing: "0.02em" }}>
                    RSUD PROVINSI
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>
                    INSTALASI PELAYANAN GIZI
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background: "#0f172a",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 800,
                      padding: "4px 12px",
                      borderRadius: "6px"
                    }}
                  >
                    SHIFT {selectedShift.toUpperCase()}
                  </span>
                  <div style={{ fontSize: "11px", marginTop: "3px", color: "var(--text-muted)", fontWeight: 600 }}>
                    {new Date().toISOString().slice(0, 10)}
                  </div>
                </div>
              </div>

              {/* Patient Core Info */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", lineHeight: "1.2" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0d9488", marginTop: "4px" }}>
                    No. RM: {maskRm(p.noRm)} ({p.age} th / {p.gender === "Laki-laki" ? "L" : "P"})
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#1e293b", marginTop: "4px" }}>
                    {p.ward} • {p.bed}
                  </div>
                </div>

                {/* Simulated QR Code Graphic */}
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    background: "#f8fafc",
                    border: "2px solid #0f172a",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    flexShrink: 0
                  }}
                >
                  <QrCode size={56} color="#0f172a" />
                  <span style={{ fontSize: "8px", fontWeight: 800, fontFamily: "monospace", textAlign: "center", marginTop: "2px" }}>
                    {p.platoBarcode.slice(0, 14)}
                  </span>
                </div>
              </div>

              {/* Diet Specification Box */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "2px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginTop: "14px"
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-muted)" }}>
                  PRESKRIPSI DIET & TEKSTUR:
                </div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#042f2e", marginTop: "3px", lineHeight: "1.4" }}>
                  {p.dietPrescription}
                </div>
              </div>

              {/* Allergies Highlight */}
              {hasAllergy ? (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "2px solid #ef4444",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    marginTop: "12px",
                    color: "#991b1b",
                    fontSize: "13px",
                    fontWeight: 900
                  }}
                >
                  ⚠️ ALERGI PASIEN: {p.allergies.join(", ").toUpperCase()}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#059669",
                    fontWeight: 800,
                    marginTop: "10px"
                  }}
                >
                  ✓ Tidak Ada Riwayat Alergi Makanan
                </div>
              )}

              {/* Expiry / Safety Guard */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "14px",
                  paddingTop: "10px",
                  borderTop: "1.5px dashed #cbd5e1",
                  fontWeight: 600
                }}
              >
                <span>Batas Konsumsi: 2 Jam Setelah Distribusi</span>
                <span>DPJP: {p.dpjp.split(",")[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
