import React from "react";
import { useApp } from "../../context/AppContext";
import { FlaskConical, AlertCircle, CheckCircle, TrendingUp, Info } from "lucide-react";

export const LabPenunjang = () => {
  const { selectedPatient, pdpMasking } = useApp();
  const lab = selectedPatient.biokimia || {};

  const getStatusBadge = (status) => {
    if (!status) return null;
    if (status.includes("Kritis") || status.includes("Bahaya") || status.includes("Berat")) {
      return <span className="badge badge-danger">{status}</span>;
    }
    if (status.includes("Tinggi") || status.includes("Rendah")) {
      return <span className="badge badge-warning">{status}</span>;
    }
    return <span className="badge badge-success">{status}</span>;
  };

  const getClinicalNutritionImpact = (key, value) => {
    switch (key) {
      case "albumin":
        if (value < 2.5) return "Hipoalbuminemia Berat: Tekanan onkotik turun, edema masif, risiko morbiditas tinggi. Indikasi diet tinggi albumin / enteral peptida & putih telur.";
        if (value < 3.5) return "Hipoalbuminemia Ringan/Sedang: Penanda inflamasi sistemik & malnutrisi. Tingkatkan target protein 1.2 - 1.5 g/kgBB.";
        return "Normal: Status protein viseral stabil.";
      case "kalium":
        if (value > 5.0) return "Hiperkalemia: Risiko aritmia jantung fatal. STOP buah tinggi kalium (pisang, melon, alpukat) & rebus buang air sayuran.";
        if (value < 3.5) return "Hipokalemia: Berikan jus buah tinggi kalium jika toleran atau koreksi elektrolit.";
        return "Normal: Keseimbangan elektrolit aman.";
      case "gds":
        if (value > 200) return "Hiperglikemia: Batasi karbohidrat sederhana, gunakan formula enteral spesifik diabetes berindeks glikemik rendah.";
        return "Normal / Terkontrol.";
      case "kreatinin":
      case "ureum":
        if (value > 1.5 || (key === "ureum" && value > 50)) {
          return "Azotemia / Retensi Metabolit Ginjal: Pertimbangkan Diet Rendah Protein (0.6 - 0.8 g/kgBB) untuk non-HD atau 1.2 g/kgBB untuk HD reguler.";
        }
        return "Fungsi eliminasi renal stabil.";
      case "natrium":
        if (value < 135) return "Hiponatremia: Waspadai retensi cairan berlebih atau asupan natrium tidak adekuat. Batasi cairan bebas jika ada edema.";
        return "Normal.";
      default:
        return "Dalam batas normal pemantauan gizi klinis.";
    }
  };

  const labItems = [
    { key: "albumin", name: "Albumin Serum", data: lab.albumin, icon: "🧪" },
    { key: "hemoglobin", name: "Hemoglobin (Hb)", data: lab.hemoglobin, icon: "🩸" },
    { key: "gds", name: "Glukosa Darah Sewaktu (GDS)", data: lab.gds, icon: "🍬" },
    { key: "ureum", name: "Ureum Darah", data: lab.ureum, icon: "💧" },
    { key: "kreatinin", name: "Kreatinin Serum", data: lab.kreatinin, icon: "⚡" },
    { key: "natrium", name: "Natrium (Na+)", data: lab.natrium, icon: "🧂" },
    { key: "kalium", name: "Kalium (K+)", data: lab.kalium, icon: "🍌" },
    { key: "klorida", name: "Klorida (Cl-)", data: lab.klorida, icon: "🌊" }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <FlaskConical size={18} color="var(--primary)" />
          <div>
            <h3 className="card-title">Integrasi Laboratorium Klinik & Penunjang Real-Time</h3>
            <p className="card-subtitle">
              Bridging otomatis dari LIS / SIMRS RSUD Provinsi tanpa input manual
            </p>
          </div>
        </div>
        <span className="badge badge-primary">Bridged via SIMRS LIS REST API</span>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Pemeriksaan Biokimia</th>
              <th>Hasil Aktual</th>
              <th>Nilai Rujukan Standar</th>
              <th>Status Klinis</th>
              <th>Implikasi & Tatalaksana Dietisien (PAGT)</th>
            </tr>
          </thead>
          <tbody>
            {labItems.map((item) => {
              if (!item.data) return null;
              return (
                <tr key={item.key}>
                  <td>
                    <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--primary-dark)" }}>
                      {item.data.value}
                    </span>{" "}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.data.unit}</span>
                  </td>
                  <td>
                    <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                      {item.data.ref} {item.data.unit}
                    </span>
                  </td>
                  <td>{getStatusBadge(item.data.status)}</td>
                  <td style={{ fontSize: "12px", color: "var(--text-secondary)", maxWidth: "340px" }}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                      <Info size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{getClinicalNutritionImpact(item.key, item.data.value)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "16px",
          background: "#f8fafc",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "12px",
          color: "var(--text-muted)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>
          Terakhir disinkronkan otomatis dari SIMRS Laboratorium Sentral: Hari ini, 06:15:30 WIB
        </span>
        <span style={{ color: "#0d9488", fontWeight: 600 }}>
          ● HL7 / FHIR Observation Stream: Active Connected
        </span>
      </div>
    </div>
  );
};
