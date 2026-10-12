import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { QrCode, CheckCircle, AlertTriangle, ShieldCheck, UserCheck, RefreshCw, Volume2 } from "lucide-react";

export const DoubleCheckScanner = () => {
  const { patients, selectedPatient, currentRole, showToast } = useApp();

  const [scannedPlato, setScannedPlato] = useState(selectedPatient.platoBarcode);
  const [scannedWristband, setScannedWristband] = useState(selectedPatient.wristbandBarcode);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = () => {
    // Find patient matching scanned plato
    const platoPatient = patients.find((p) => p.platoBarcode === scannedPlato.trim());
    // Find patient matching scanned wristband
    const wristPatient = patients.find((p) => p.wristbandBarcode === scannedWristband.trim());

    if (!platoPatient || !wristPatient) {
      setVerificationResult({
        matched: false,
        errorType: "NOT_FOUND",
        message: "Barcode plato atau gelang tidak terdaftar dalam sistem RME aktif RSUD!"
      });
      return;
    }

    if (platoPatient.id === wristPatient.id) {
      setVerificationResult({
        matched: true,
        patient: platoPatient,
        message: `VERIFIKASI BERHASIL (COCOK): Plato makanan "${platoPatient.dietPrescription}" sesuai dengan identitas gelang pasien ${platoPatient.name} (${platoPatient.ward} - ${platoPatient.bed}). Aman diserahkan!`
      });
      showToast("Verifikasi Double Check SKP 1 Berhasil: Makanan Aman!", "success");
    } else {
      setVerificationResult({
        matched: false,
        errorType: "MISMATCH",
        platoPatient,
        wristPatient,
        message: `PERINGATAN BAHAYA (NEAR MISS): KETIDAKCOCOKAN IDENTITAS PASIEN! Plato makanan diperuntukkan bagi "${platoPatient.name}" (${platoPatient.ward} ${platoPatient.bed}), namun gelang yang dipindai adalah milik "${wristPatient.name}" (${wristPatient.ward} ${wristPatient.bed}). MAKANAN DILARANG DISERAHKAN!`
      });
      showToast("BAHAYA: Plato dan Gelang Tidak Cocok! Potensi Salah Diet Dicegah.", "error");
    }
  };

  const setTestScenario = (type) => {
    if (type === "match") {
      setScannedPlato(patients[1].platoBarcode); // Ny. Ratnawati
      setScannedWristband(patients[1].wristbandBarcode);
    } else if (type === "mismatch") {
      setScannedPlato(patients[0].platoBarcode); // Tn. Sudirman (ICU)
      setScannedWristband(patients[1].wristbandBarcode); // Ny. Ratnawati (Melati)
    }
    setVerificationResult(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <ShieldCheck size={20} color="var(--primary)" />
          <div>
            <h3 className="card-title">Double Check System di Samping Tempat Tidur Pasien (SKP 1)</h3>
            <p className="card-subtitle">
              Pencegahan insiden salah diet & alergi makanan melalui pencocokan barcode plato vs gelang pasien
            </p>
          </div>
        </div>
        <span className="badge badge-primary">Sasaran Keselamatan Pasien (SKP)</span>
      </div>

      {/* Preset simulation buttons */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>
          Skenario Pengujian Klinis:
        </span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setTestScenario("match")}
        >
          ✓ Uji Kasus COCOK (Ny. Ratnawati)
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => setTestScenario("mismatch")}
        >
          ⚠️ Uji Kasus SALAH PASIEN (Near Miss)
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: "24px" }}>
        {/* Scanner 1: Plato */}
        <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <QrCode size={18} color="var(--primary)" />
            <strong style={{ fontSize: "13px" }}>1. Scan QR Code Label Plato Makanan:</strong>
          </div>
          <input
            type="text"
            className="form-input"
            style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "14px" }}
            value={scannedPlato}
            onChange={(e) => setScannedPlato(e.target.value)}
            placeholder="Scan barcode plato..."
          />
          <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
            Contoh Barcode Plato Pasien:
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
              {patients.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "10px", padding: "2px 6px" }}
                  onClick={() => setScannedPlato(p.platoBarcode)}
                >
                  {p.name.split(" ")[0]} ({p.bed})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scanner 2: Wristband */}
        <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <UserCheck size={18} color="var(--secondary)" />
            <strong style={{ fontSize: "13px" }}>2. Scan QR Code Gelang Tangan Pasien (Wristband):</strong>
          </div>
          <input
            type="text"
            className="form-input"
            style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "14px" }}
            value={scannedWristband}
            onChange={(e) => setScannedWristband(e.target.value)}
            placeholder="Scan barcode gelang pasien..."
          />
          <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
            Contoh Barcode Gelang Pasien:
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
              {patients.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "10px", padding: "2px 6px" }}
                  onClick={() => setScannedWristband(p.wristbandBarcode)}
                >
                  Gelang {p.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button
          className="btn btn-primary"
          style={{ padding: "12px 32px", fontSize: "15px", fontWeight: 800 }}
          onClick={handleVerify}
        >
          <ShieldCheck size={20} /> Lakukan Double Check Pencocokan Identitas
        </button>
      </div>

      {/* Verification Result Display */}
      {verificationResult && (
        <div>
          {verificationResult.matched ? (
            <div
              style={{
                background: "#f0fdf4",
                border: "2px solid #22c55e",
                borderRadius: "10px",
                padding: "20px",
                color: "#15803d"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <CheckCircle size={26} color="#16a34a" />
                <h4 style={{ fontSize: "16px", fontWeight: 800 }}>IDENTITAS 100% COCOK - AMAN DISERAHKAN</h4>
              </div>
              <p style={{ fontSize: "13px", lineHeight: "1.6" }}>{verificationResult.message}</p>
              <div style={{ marginTop: "10px", fontSize: "12px", color: "#166534" }}>
                • Petugas Verifikator: <strong>{currentRole.user}</strong> ({currentRole.name})<br />
                • Waktu Verifikasi: {new Date().toLocaleTimeString("id-ID")} WIB • Dicatat ke Log Kepatuhan SKP 1
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "#fef2f2",
                border: "2px solid #ef4444",
                borderRadius: "10px",
                padding: "20px",
                color: "#991b1b"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <AlertTriangle size={26} color="#dc2626" />
                <h4 style={{ fontSize: "16px", fontWeight: 800 }}>
                  ALARM BAHAYA: KETIDAKCOCOKAN PLATO VS GELANG PASIEN!
                </h4>
              </div>
              <p style={{ fontSize: "13px", lineHeight: "1.6", fontWeight: 600 }}>
                {verificationResult.message}
              </p>
              <div
                style={{
                  marginTop: "12px",
                  background: "white",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #fecaca",
                  fontSize: "12px"
                }}
              >
                <strong>Tindakan Wajib Petugas (SOP Keselamatan Pasien):</strong>
                <ol style={{ marginLeft: "18px", marginTop: "4px" }}>
                  <li>Tahan makanan, jangan berikan kepada pasien.</li>
                  <li>Lakukan konfirmasi ulang nomor bed dan gelang tangan pasien.</li>
                  <li>Laporkan kejadian nyaris cedera (KNC) ke Kepala Ruangan dan Instalasi Gizi.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
