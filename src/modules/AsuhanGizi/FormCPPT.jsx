import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Send,
  Download,
  QrCode
} from "lucide-react";

export const FormCPPT = () => {
  const { selectedPatient, cpptRecords, addCPPT, signCPPT, currentRole, pdpMasking } = useApp();

  const [formType, setFormType] = useState("ADIME");
  const [assessment, setAssessment] = useState(
    `Antropometri: BB ${selectedPatient.bb} kg, TB ${selectedPatient.tb} cm, IMT ${selectedPatient.imt} (${selectedPatient.statusGizi}). Biokimia: Albumin ${selectedPatient.biokimia?.albumin?.value} g/dL, GDS ${selectedPatient.biokimia?.gds?.value} mg/dL, Ureum ${selectedPatient.biokimia?.ureum?.value} mg/dL, Kalium ${selectedPatient.biokimia?.kalium?.value} mmol/L. Klinis: ${selectedPatient.diagnosisMedis}. Riwayat Asupan: ${selectedPatient.foodIntakeBefore}.`
  );
  const [diagnosisCode, setDiagnosisCode] = useState(
    selectedPatient.diagnosisMedis.includes("Sepsis")
      ? "NI-1.2"
      : selectedPatient.diagnosisMedis.includes("GGK")
      ? "NI-5.6.3"
      : "NC-3.1"
  );
  const [diagnosisText, setDiagnosisText] = useState(
    selectedPatient.diagnosisMedis.includes("Sepsis")
      ? "NI-1.2 Asupan oral/enteral inadekuat berkaitan dengan kondisi kritis ICU sepsis ditandai dengan asupan aktual tidak memenuhi kebutuhan."
      : selectedPatient.diagnosisMedis.includes("GGK")
      ? "NI-5.6.3 Kelebihan asupan kalium & retensi protein berkaitan dengan gangguan eliminasi renal stadium 5 ditandai kadar kalium 5.7 mmol/L & ureum tinggi."
      : "NC-3.1 Berat badan kurang berkaitan dengan malnutrisi akut ditandai dengan IMT di bawah rujukan dan asupan makan turun."
  );
  const [intervention, setIntervention] = useState(selectedPatient.dietPrescription || "");
  const [monitoring, setMonitoring] = useState(
    "Monitoring toleransi saluran cerna harian, evaluasi sisa makanan (metode Comstock), cek biokimia serial H+3."
  );

  // SOAP fields
  const [soapS, setSoapS] = useState("Pasien mengeluh nafsu makan menurun, lemas, dan mual.");
  const [soapO, setSoapO] = useState(
    `IMT ${selectedPatient.imt}, Albumin ${selectedPatient.biokimia?.albumin?.value} g/dL, Hb ${selectedPatient.biokimia?.hemoglobin?.value} g/dL.`
  );
  const [soapA, setSoapA] = useState("Risiko malnutrisi tinggi pada kondisi penyakit penyerta berat.");
  const [soapP, setSoapP] = useState(selectedPatient.dietPrescription || "");

  const patientCPPTList = cpptRecords.filter((c) => c.patientId === selectedPatient.id);

  const handleSaveCPPT = (e) => {
    e.preventDefault();
    const newRecord = {
      id: `CPPT-${Date.now().toString().slice(-4)}`,
      patientId: selectedPatient.id,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      practitioner: currentRole.user,
      role: currentRole.name,
      type: formType,
      assessment,
      diagnosis: diagnosisText,
      intervention,
      monitoring,
      soapS,
      soapO,
      soapA,
      soapP,
      isSigned: true,
      signatureDate: new Date().toISOString().replace("T", " ").slice(0, 16),
      signatureHash: `SIG-${currentRole.id.toUpperCase()}-${Date.now().toString().slice(-6)}-STARKES-VERIFIED`,
      dpjpApproval: currentRole.id === "dokter" ? `Approved by ${currentRole.user}` : "Menunggu Review DPJP"
    };
    addCPPT(newRecord);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="card no-print">
        <div className="card-header">
          <div className="card-title-group">
            <FileText size={18} color="var(--primary)" />
            <div>
              <h3 className="card-title">Formulir Asuhan Gizi Terintegrasi (CPPT - ADIME / SOAP)</h3>
              <p className="card-subtitle">
                Standar Akreditasi STARKES KARS 2024 & Pelayanan Gizi Rumah Sakit (PGRS)
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`btn btn-sm ${formType === "ADIME" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setFormType("ADIME")}
            >
              Format ADIME (Gizi Klinik)
            </button>
            <button
              className={`btn btn-sm ${formType === "SOAP" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setFormType("SOAP")}
            >
              Format SOAP (Medis Terintegrasi)
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={14} /> Cetak Lembar CPPT
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveCPPT}>
          {formType === "ADIME" ? (
            <div>
              <div className="form-group">
                <label className="form-label">
                  A - Assessment (Asesmen Gizi: Antropometri, Biokimia, Fisik/Klinis, Riwayat Gizi):
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Kode Diagnosis Gizi Internasional (eNCPT):</label>
                  <select
                    className="form-select"
                    value={diagnosisCode}
                    onChange={(e) => {
                      setDiagnosisCode(e.target.value);
                      if (e.target.value === "NI-1.2") {
                        setDiagnosisText("NI-1.2 Asupan oral/enteral inadekuat berkaitan dengan kondisi kritis ICU sepsis ditandai dengan asupan aktual tidak memenuhi kebutuhan.");
                      } else if (e.target.value === "NI-5.1") {
                        setDiagnosisText("NI-5.1 Peningkatan kebutuhan zat gizi protein berkaitan dengan hiperkatabolik luka/sepsis ditandai albumin rendah.");
                      } else if (e.target.value === "NI-5.6.3") {
                        setDiagnosisText("NI-5.6.3 Kelebihan asupan kalium & retensi nitrogen berkaitan dengan GGK stadium 5 ditandai kalium 5.7 & ureum tinggi.");
                      } else if (e.target.value === "NC-1.4") {
                        setDiagnosisText("NC-1.4 Perubahan fungsi gastrointestinal berkaitan dengan post-operasi bedah digestif ditandai toleransi makan terbatas.");
                      } else if (e.target.value === "NC-3.1") {
                        setDiagnosisText("NC-3.1 Berat badan kurang berkaitan dengan malnutrisi akut ditandai dengan IMT rendah.");
                      }
                    }}
                  >
                    <option value="NI-1.2">NI-1.2 Asupan Oral/Enteral Inadekuat</option>
                    <option value="NI-5.1">NI-5.1 Peningkatan Kebutuhan Protein</option>
                    <option value="NI-5.6.3">NI-5.6.3 Kelebihan Asupan Kalium / Mineral Spesifik</option>
                    <option value="NC-1.4">NC-1.4 Perubahan Fungsi Saluran Cerna / GI Track</option>
                    <option value="NC-3.1">NC-3.1 Berat Badan Kurang (Underweight)</option>
                    <option value="NB-1.1">NB-1.1 Kurang Pengetahuan Terkait Makanan & Zat Gizi</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">D - Diagnosis Gizi (PES Statement):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={diagnosisText}
                    onChange={(e) => setDiagnosisText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  I - Intervention (Preskripsi Diet, Rute, Edukasi & Konseling Gizi):
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={intervention}
                  onChange={(e) => setIntervention(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  ME - Monitoring & Evaluation (Target Klinis, Toleransi & Evaluasi Sisa Makan):
                </label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={monitoring}
                  onChange={(e) => setMonitoring(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label className="form-label">S - Subjective (Keluhan Pasien / Riwayat Diet):</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={soapS}
                  onChange={(e) => setSoapS(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">O - Objective (Data Antropometri & Lab Biokimia):</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={soapO}
                  onChange={(e) => setSoapO(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">A - Assessment (Analisis Masalah Gizi Pasien):</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={soapA}
                  onChange={(e) => setSoapA(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">P - Plan (Rencana Terapi Diet & Intervensi):</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={soapP}
                  onChange={(e) => setSoapP(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Digital Signature Panel */}
          <div
            style={{
              background: "#f0fdfa",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #ccfbf1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px"
            }}
          >
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f766e" }}>
                <ShieldCheck size={14} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
                Tanda Tangan Digital Terverifikasi (Digital Signature)
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Dokumen akan ditandatangani secara digital atas nama: <strong>{currentRole.user}</strong> ({currentRole.name})
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Simpan & Tandatangani CPPT
            </button>
          </div>
        </form>
      </div>

      {/* History CPPT List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Calendar size={18} color="var(--primary)" />
            <h3 className="card-title">Riwayat Catatan Perkembangan Pasien ({selectedPatient.name})</h3>
          </div>
          <span className="badge badge-primary">{patientCPPTList.length} Catatan Tersimpan</span>
        </div>

        {patientCPPTList.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
            Belum ada catatan CPPT untuk pasien ini. Silakan input formulir di atas.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {patientCPPTList.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#ffffff"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div>
                    <span style={{ fontWeight: 800, color: "var(--primary-dark)", fontSize: "14px" }}>
                      {item.type} Gizi Terintegrasi
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "10px" }}>
                      {item.date} WIB
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="badge badge-success">
                      <ShieldCheck size={12} /> {item.signatureHash}
                    </span>
                    {currentRole.id === "dokter" && !item.dpjpApproval.includes("dr.") && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => signCPPT(item.id)}
                      >
                        Approve CPPT Sebagai DPJP
                      </button>
                    )}
                  </div>
                </div>

                {item.type === "ADIME" ? (
                  <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                    <p><strong>A (Asesmen):</strong> {item.assessment}</p>
                    <p style={{ marginTop: "6px" }}><strong>D (Diagnosis):</strong> {item.diagnosis}</p>
                    <p style={{ marginTop: "6px" }}><strong>I (Intervensi):</strong> {item.intervention}</p>
                    <p style={{ marginTop: "6px" }}><strong>ME (Monitoring & Evaluasi):</strong> {item.monitoring}</p>
                  </div>
                ) : (
                  <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                    <p><strong>S:</strong> {item.soapS}</p>
                    <p style={{ marginTop: "4px" }}><strong>O:</strong> {item.soapO}</p>
                    <p style={{ marginTop: "4px" }}><strong>A:</strong> {item.soapA}</p>
                    <p style={{ marginTop: "4px" }}><strong>P:</strong> {item.soapP}</p>
                  </div>
                )}

                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "10px",
                    borderTop: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "var(--text-muted)"
                  }}
                >
                  <div>
                    Ditulis oleh: <strong>{item.practitioner}</strong> ({item.role})
                  </div>
                  <div style={{ color: "#0d9488", fontWeight: 600 }}>
                    Status Review: {item.dpjpApproval}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Official Document Structure for Browser Print Dialog */}
      <div className="printable-cppt-document" style={{ display: "none" }}>
        <div className="print-header">
          <h2>PEMERINTAH DAERAH PROVINSI</h2>
          <h1>RUMAH SAKIT UMUM DAERAH PROVINSI</h1>
          <p>INSTALASI GIZI & PELAYANAN ASUHAN GIZI KLINIK TERPADU</p>
          <hr style={{ margin: "10px 0" }} />
          <h3>LEMBAR CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (CPPT)</h3>
        </div>
        <div style={{ marginBottom: "16px", fontSize: "11pt" }}>
          <p><strong>Nama Pasien:</strong> {selectedPatient.name}</p>
          <p><strong>No. Rekam Medis:</strong> {selectedPatient.noRm}</p>
          <p><strong>Ruang / Bangsal:</strong> {selectedPatient.ward} - {selectedPatient.bed}</p>
          <p><strong>Diagnosa Medis:</strong> {selectedPatient.diagnosisMedis}</p>
        </div>
        <hr />
        {patientCPPTList.map((c) => (
          <div key={c.id} style={{ margin: "16px 0", borderBottom: "1px solid #000", paddingBottom: "12px" }}>
            <p><strong>Tanggal/Jam:</strong> {c.date} | <strong>Metode:</strong> {c.type}</p>
            <p><strong>Asesmen/Subjektif-Objektif:</strong> {c.assessment || `${c.soapS} ${c.soapO}`}</p>
            <p><strong>Diagnosis Gizi/Assesment:</strong> {c.diagnosis || c.soapA}</p>
            <p><strong>Intervensi/Plan:</strong> {c.intervention || c.soapP}</p>
            <p><strong>Monitoring:</strong> {c.monitoring}</p>
            <p><strong>Tanda Tangan Elektronik:</strong> {c.practitioner} ({c.signatureHash})</p>
          </div>
        ))}
      </div>
    </div>
  );
};
