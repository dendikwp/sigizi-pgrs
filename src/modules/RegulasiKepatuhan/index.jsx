import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileCheck2,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Copy,
  Download,
  AlertTriangle,
  Flame,
  FileText
} from "lucide-react";

export const RegulasiKepatuhanModule = () => {
  const {
    selectedPatient,
    starkesMetrics,
    auditLogs,
    pdpMasking,
    togglePdpMasking,
    showToast
  } = useApp();

  const [activeRegulasiSubTab, setActiveRegulasiSubTab] = useState("satusehat");

  // Construct FHIR NutritionOrder resource according to SatuSehat Kemenkes specification
  const fhirNutritionOrder = {
    resourceType: "NutritionOrder",
    id: `satusehat-nutritionorder-${selectedPatient.id.toLowerCase()}`,
    meta: {
      profile: ["https://fhir.kemkes.go.id/r4/StructureDefinition/NutritionOrder"]
    },
    status: "active",
    intent: "order",
    patient: {
      reference: `Patient/${selectedPatient.nik}`,
      display: selectedPatient.name
    },
    dateTime: new Date().toISOString(),
    orderer: {
      reference: `Practitioner/${selectedPatient.dpjp}`,
      display: selectedPatient.dpjp
    },
    oralDiet: {
      type: [
        {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "4390001",
              display: selectedPatient.dietType
            }
          ],
          text: selectedPatient.dietPrescription
        }
      ],
      schedule: [
        {
          repeat: {
            frequency: 3,
            period: 1,
            periodUnit: "d"
          }
        }
      ]
    },
    enteralFormula: selectedPatient.ward.includes("ICU")
      ? {
          baseFormulaType: {
            text: "Formula Peptida / Polimerik Khusus ICU Sepsis"
          },
          caloricDensity: {
            value: 1.0,
            unit: "kcal/mL"
          },
          routeofAdministration: [
            {
              coding: [
                {
                  system: "http://snomed.info/sct",
                  code: "127490009",
                  display: "Nasogastric tube"
                }
              ]
            }
          ]
        }
      : undefined
  };

  const copyFhirJson = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirNutritionOrder, null, 2));
    showToast("Payload JSON FHIR SatuSehat berhasil disalin ke clipboard!", "success");
  };

  return (
    <div>
      {/* Subtab selection */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          borderBottom: "2px solid var(--border-color)",
          paddingBottom: "14px",
          overflowX: "auto"
        }}
      >
        <button
          className={`btn ${activeRegulasiSubTab === "satusehat" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveRegulasiSubTab("satusehat")}
        >
          <FileCheck2 size={18} /> Kemenkes SatuSehat (Standar FHIR R4)
        </button>
        <button
          className={`btn ${activeRegulasiSubTab === "starkes" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveRegulasiSubTab("starkes")}
        >
          <ShieldCheck size={18} /> Akreditasi STARKES (KARS / PGRS / SKP)
        </button>
        <button
          className={`btn ${activeRegulasiSubTab === "uupdp" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveRegulasiSubTab("uupdp")}
        >
          <Lock size={18} /> Kepatuhan UU PDP (Privasi & Audit Trail)
        </button>
      </div>

      {/* 1. SatuSehat FHIR */}
      {activeRegulasiSubTab === "satusehat" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <FileCheck2 size={20} color="var(--primary)" />
              <div>
                <h3 className="card-title">Standar Integrasi Kemenkes RI SatuSehat (FHIR R4)</h3>
                <p className="card-subtitle">
                  Struktur data asuhan gizi sesuai profil HL7 FHIR StructureDefinition NutritionOrder Kemenkes
                </p>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={copyFhirJson}>
              <Copy size={14} /> Salin Payload FHIR
            </button>
          </div>

          <div className="alert-box alert-info">
            <div>
              <strong>Kepatuhan Regulasi Kemenkes No. 24 Tahun 2022:</strong> Seluruh rumah sakit pemerintah
              dan swasta wajib mengintegrasikan rekam medis elektronik ke Platform SatuSehat. Modul ini
              mengonversi preskripsi diet pasien secara dinamis ke standar Resource <code>NutritionOrder</code> FHIR R4.
            </div>
          </div>

          <div
            style={{
              background: "#0f172a",
              color: "#38bdf8",
              padding: "20px",
              borderRadius: "10px",
              fontFamily: "monospace",
              fontSize: "12px",
              overflowX: "auto",
              lineHeight: "1.5"
            }}
          >
            <pre>{JSON.stringify(fhirNutritionOrder, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* 2. STARKES Akreditasi */}
      {activeRegulasiSubTab === "starkes" && (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <ShieldCheck size={20} color="var(--primary)" />
                <div>
                  <h3 className="card-title">Elemen Penilaian Akreditasi STARKES KARS (PGRS & SKP)</h3>
                  <p className="card-subtitle">
                    Dashboard pencapaian indikator mutu nasional dan standar pelayanan gizi rumah sakit
                  </p>
                </div>
              </div>
              <span className="badge badge-success">Akreditasi Paripurna RSUD</span>
            </div>

            <div className="grid-2">
              {/* Metric 1 */}
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px", background: "#f8fafc" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>
                  SASARAN KESELAMATAN PASIEN (SKP 1)
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, margin: "6px 0", color: "#042f2e" }}>
                  {starkesMetrics.skp1IdentifikasiPasien.title}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 900, color: "#16a34a" }}>
                    {starkesMetrics.skp1IdentifikasiPasien.score}%
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Target: {starkesMetrics.skp1IdentifikasiPasien.target}% (Total {starkesMetrics.skp1IdentifikasiPasien.evaluatedCount} Verifikasi)
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#15803d", fontWeight: 600, marginTop: "6px" }}>
                  ✓ {starkesMetrics.skp1IdentifikasiPasien.mismatchPrevented} insiden near-miss (salah diet) berhasil dicegah sistem!
                </div>
              </div>

              {/* Metric 2 */}
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px", background: "#f8fafc" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>
                  PELAYANAN ASUHAN GIZI (PAP 4 / PGRS)
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, margin: "6px 0", color: "#042f2e" }}>
                  {starkesMetrics.asuhanGizi24Jam.title}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 900, color: "#0d9488" }}>
                    {starkesMetrics.asuhanGizi24Jam.score}%
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Target Nasional: &gt; {starkesMetrics.asuhanGizi24Jam.target}%
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600, marginTop: "6px" }}>
                  ✓ {starkesMetrics.asuhanGizi24Jam.status}
                </div>
              </div>

              {/* Metric 3 */}
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px", background: "#f8fafc" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>
                  INDIKATOR MUTU NASIONAL (IMN KEMENKES)
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, margin: "6px 0", color: "#042f2e" }}>
                  {starkesMetrics.sisaMakananComstock.title}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 900, color: "#16a34a" }}>
                    {starkesMetrics.sisaMakananComstock.score}%
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {starkesMetrics.sisaMakananComstock.targetLabel}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#166534", fontWeight: 600, marginTop: "6px" }}>
                  ✓ Capaian 13.8% jauh lebih baik dari batas maksimal 20% sisa makanan.
                </div>
              </div>

              {/* Metric 4 */}
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px", background: "#f8fafc" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>
                  PENCEGAHAN & PENGENDALIAN INFEKSI (PPI 7 / HACCP)
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, margin: "6px 0", color: "#042f2e" }}>
                  {starkesMetrics.haccpSanitasiDapur.title}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 900, color: "#0284c7" }}>
                    {starkesMetrics.haccpSanitasiDapur.score}%
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Target: &gt; {starkesMetrics.haccpSanitasiDapur.target}%
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#0369a1", fontWeight: 600, marginTop: "6px" }}>
                  ✓ {starkesMetrics.haccpSanitasiDapur.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. UU PDP & Audit Trail */}
      {activeRegulasiSubTab === "uupdp" && (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <Lock size={20} color="var(--primary)" />
                <div>
                  <h3 className="card-title">Kepatuhan UU No. 27/2022 (Perlindungan Data Pribadi / UU PDP)</h3>
                  <p className="card-subtitle">
                    Prinsip privasi data medis: pembatasan hak akses berbasis peran (RBAC) & penyamaran data sensitif
                  </p>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={togglePdpMasking}>
                {pdpMasking ? <Unlock size={14} /> : <Lock size={14} />}
                <span>{pdpMasking ? "Buka Masking (Perlu Otorisasi)" : "Aktifkan Masking NIK/RM"}</span>
              </button>
            </div>

            <div className="alert-box alert-warning">
              <div>
                <strong>Ketentuan UU PDP Pasal 4 & Pasal 35:</strong> Data kesehatan dan rekam medis pasien dikategorikan sebagai <em>Data Pribadi Spesifik</em>. Petugas dapur dan logistik hanya diberikan hak akses data non-medis tanpa identitas lengkap, sedangkan tenaga medis diwajibkan melalui otentikasi ketat.
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
                Audit Trail Log Aktivitas Medis (Akses Data Pasien & Transaksi):
              </h4>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID Log</th>
                      <th>Waktu Akses</th>
                      <th>Nama Petugas & Role</th>
                      <th>Tipe Aksi</th>
                      <th>Target Pasien / Dokumen</th>
                      <th>Detail Aktivitas</th>
                      <th>Enkripsi UU PDP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: "11px" }}>{log.id}</span>
                        </td>
                        <td>{log.timestamp}</td>
                        <td>
                          <strong>{log.user}</strong>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{log.role}</div>
                        </td>
                        <td>
                          <span className="badge badge-primary">{log.action}</span>
                        </td>
                        <td>{log.target}</td>
                        <td style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {log.details}
                        </td>
                        <td>
                          <span className="badge badge-success">
                            <Lock size={10} /> Encrypted
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
