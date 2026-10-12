import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  UserCheck,
  FileText,
  HelpCircle,
  Stethoscope
} from "lucide-react";

export const SkriningGizi = ({ onSelectCalculator, onOpenCPPT }) => {
  const { patients, selectedPatient, setSelectedPatientId, updatePatient, currentRole } = useApp();

  const [screeningTool, setScreeningTool] = useState(selectedPatient.screeningTool || "NRS-2002");
  const [bbLoss, setBbLoss] = useState(selectedPatient.screeningScore >= 3 ? "yes_severe" : "no");
  const [intakeDrop, setIntakeDrop] = useState(selectedPatient.screeningScore >= 3 ? "under_50" : "normal");
  const [diseaseSeverity, setDiseaseSeverity] = useState(
    selectedPatient.ward.includes("ICU") ? "critical" : selectedPatient.diagnosisMedis.includes("GGK") ? "severe" : "moderate"
  );

  const calculateScore = () => {
    let score = 0;
    if (bbLoss === "yes_mild") score += 1;
    if (bbLoss === "yes_severe") score += 2;
    if (intakeDrop === "50_75") score += 1;
    if (intakeDrop === "under_50") score += 2;
    if (diseaseSeverity === "moderate") score += 1;
    if (diseaseSeverity === "severe") score += 2;
    if (diseaseSeverity === "critical") score += 3;
    if (selectedPatient.age >= 70) score += 1; // NRS-2002 age adjustment
    return score;
  };

  const calculatedScore = calculateScore();
  const isHighRisk = calculatedScore >= 3;

  const handleSaveScreening = () => {
    const updated = {
      ...selectedPatient,
      screeningTool,
      screeningScore: calculatedScore,
      screeningAlert: isHighRisk,
      screeningStatus: isHighRisk ? "Perlu Asuhan Gizi (<24 Jam)" : "Risiko Rendah (Reskrining 7 Hari)",
      weightLoss: bbLoss === "yes_severe" ? "Penurunan BB >5% dalam 1 bulan" : "Tidak ada penurunan BB signifikan",
      foodIntakeBefore: intakeDrop === "under_50" ? "Asupan makan <50% kebutuhan" : "Asupan makan cukup"
    };
    updatePatient(updated);
  };

  return (
    <div>
      {/* Alert Banner for Overdue / Urgent Screenings */}
      {selectedPatient.screeningAlert && (
        <div className="alert-box alert-danger" style={{ padding: "20px 24px" }}>
          <AlertTriangle size={32} style={{ flexShrink: 0, marginTop: "2px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "6px", letterSpacing: "0.02em" }}>
              ALERT ASUHAN GIZI KLINIK (&lt; 24 JAM) - STANDAR STARKES KARS / PGRS
            </div>
            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Pasien <strong>{selectedPatient.name}</strong> di {selectedPatient.ward} memiliki skor skrining gizi:{" "}
              <strong style={{ color: "#991b1b", textDecoration: "underline" }}>
                {selectedPatient.screeningScore} (Risiko Malnutrisi Tinggi)
              </strong>{" "}
              dengan komorbiditas klinis: <em>{selectedPatient.diagnosisMedis}</em>.
              Dietisien wajib melakukan asesmen gizi dan formulasi intervensi dalam kurun waktu kurang dari 24 jam sejak admisi.
            </div>
            <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={onSelectCalculator}>
                Buka Kalkulator Gizi Multiformula →
              </button>
              <button className="btn btn-secondary" onClick={onOpenCPPT}>
                Isi Formulir CPPT / ADIME Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Screening Form Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <Activity size={18} color="var(--primary)" />
              <div>
                <h3 className="card-title">Skrining Gizi Otomatis RME (Admisi Awal)</h3>
                <p className="card-subtitle">
                  Metode NRS-2002 (Nutritional Risk Screening) / MST / STRONGkids Pediatrik
                </p>
              </div>
            </div>
            <span className={`badge ${isHighRisk ? "badge-danger" : "badge-success"}`}>
              Skor: {calculatedScore} ({isHighRisk ? "Risiko Malnutrisi Tinggi" : "Risiko Rendah"})
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Alat Skrining (Sesuai Karakteristik Pasien):</label>
            <select
              className="form-select"
              value={screeningTool}
              onChange={(e) => setScreeningTool(e.target.value)}
            >
              <option value="NRS-2002">NRS-2002 (Dewasa & Kondisi Kritis / Standar STARKES)</option>
              <option value="MST">MST (Malnutrition Screening Tool Dewasa Umum)</option>
              <option value="STRONGkids">STRONGkids (Skrining Khusus Pasien Pediatrik / Anak)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">1. Riwayat Penurunan Berat Badan (BB) Terakhir:</label>
            <select
              className="form-select"
              value={bbLoss}
              onChange={(e) => setBbLoss(e.target.value)}
            >
              <option value="no">Tidak ada penurunan BB (0 poin)</option>
              <option value="yes_mild">Penurunan BB 1 - 3 kg dalam 1-3 bulan terakhir (1 poin)</option>
              <option value="yes_severe">Penurunan BB drastis &gt; 5% / celana longgar mendadak (2 poin)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. Penurunan Asupan Makan 1 Minggu Terakhir:</label>
            <select
              className="form-select"
              value={intakeDrop}
              onChange={(e) => setIntakeDrop(e.target.value)}
            >
              <option value="normal">Asupan makan normal &gt; 75% porsi biasa (0 poin)</option>
              <option value="50_75">Asupan makan menurun menjadi 50% - 75% porsi (1 poin)</option>
              <option value="under_50">Asupan makan sangat sedikit &lt; 50% porsi / puasa medis (2 poin)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">3. Derajat Keparahan Penyakit & Komorbiditas:</label>
            <select
              className="form-select"
              value={diseaseSeverity}
              onChange={(e) => setDiseaseSeverity(e.target.value)}
            >
              <option value="mild">Ringan: Patah tulang panggul, sirosis kompensata, PPOK stabil (1 poin)</option>
              <option value="moderate">Sedang: Bedah perut mayor, stroke berat, pneumonia berat, GGK HD (2 poin)</option>
              <option value="critical">Kritis: Trauma kepala, transplantasi, sepsis ICU, pasien ventilator mekanik (3 poin)</option>
            </select>
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {selectedPatient.age >= 70 && (
                <span>*Bonus +1 poin ditambahkan karena usia pasien &ge; 70 tahun</span>
              )}
            </div>
            <button className="btn btn-primary" onClick={handleSaveScreening}>
              <CheckCircle2 size={16} /> Simpan Skrining Gizi Pasien
            </button>
          </div>
        </div>

        {/* Ward Overview Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <Clock size={18} color="var(--primary)" />
              <div>
                <h3 className="card-title">Pemantauan Skrining Seluruh Bangsal RSUD</h3>
                <p className="card-subtitle">
                  Daftar pasien rawat inap & countdown pemenuhan batas asuhan &lt;24 jam
                </p>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pasien & Bangsal</th>
                  <th>Skor Skrining</th>
                  <th>Status & Batas Waktu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      background: p.id === selectedPatient.id ? "#f0fdfa" : "inherit",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedPatientId(p.id)}
                  >
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {p.ward} ({p.bed}) • {p.diagnosisMedis.slice(0, 32)}...
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${p.screeningScore >= 3 ? "badge-danger" : "badge-success"}`}>
                        {p.screeningTool}: {p.screeningScore}
                      </span>
                    </td>
                    <td>
                      {p.screeningAlert ? (
                        <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: 700 }}>
                          <AlertTriangle size={12} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
                          {p.screeningStatus}
                        </div>
                      ) : (
                        <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>
                          <CheckCircle2 size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Selesai Asuhan
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(p.id);
                        }}
                      >
                        Pilih
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
