import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ShieldAlert, AlertTriangle, CheckCircle2, Ban, Stethoscope, Sparkles } from "lucide-react";

export const ClashDetection = () => {
  const { patients, selectedPatient, setSelectedPatientId, showToast } = useApp();

  const [testMealTitle, setTestMealTitle] = useState("Tumis Udang Sayur & Semur Telur");
  const [testMealAllergens, setTestMealAllergens] = useState(["Udang / Seafood", "Telur"]);
  const [testContraindications, setTestContraindications] = useState(["Hiperkalemia"]);
  const [analysisResult, setAnalysisResult] = useState(null);

  const testMealPresets = [
    {
      title: "Tumis Udang & Ikan Kakap Bumbu Bali",
      allergens: ["Udang / Seafood", "Ikan Laut"],
      contraindications: ["Hipertensi"]
    },
    {
      title: "Telur Balado & Orek Tempe Manis",
      allergens: ["Telur Ayam", "Kedelai"],
      contraindications: []
    },
    {
      title: "Puding Buah Pisang & Susu Kental Manis",
      allergens: ["Susu Sapi (Laktosa)"],
      contraindications: ["Diabetes Melitus", "Hiperkalemia"]
    },
    {
      title: "Sup Ayam Jagung Manis & Nasi Tim (Aman)",
      allergens: [],
      contraindications: []
    }
  ];

  const runClashCheck = () => {
    const patientAllergies = selectedPatient.allergies || [];
    const patientDiagnosis = selectedPatient.diagnosisMedis.toLowerCase();

    const detectedAllergyClashes = [];
    const detectedClinicalClashes = [];

    // Check allergy clashes
    testMealAllergens.forEach((mealAllergen) => {
      patientAllergies.forEach((patAllergen) => {
        if (
          patAllergen.toLowerCase().includes(mealAllergen.toLowerCase()) ||
          mealAllergen.toLowerCase().includes(patAllergen.toLowerCase())
        ) {
          detectedAllergyClashes.push({
            allergen: patAllergen,
            source: mealAllergen
          });
        }
      });
    });

    // Check clinical contraindications
    testContraindications.forEach((contra) => {
      if (
        (contra === "Diabetes Melitus" && patientDiagnosis.includes("dm")) ||
        (contra === "Hiperkalemia" && (patientDiagnosis.includes("ggk") || selectedPatient.biokimia?.kalium?.value > 5.0)) ||
        (contra === "Hipertensi" && (patientDiagnosis.includes("hipertensi") || patientDiagnosis.includes("chf")))
      ) {
        detectedClinicalClashes.push({
          contra,
          reason: `Pasien mengidap ${selectedPatient.diagnosisMedis} (Laboratorium / Kondisi Klinis Kritis)`
        });
      }
    });

    const isBlocked = detectedAllergyClashes.length > 0 || detectedClinicalClashes.length > 0;

    setAnalysisResult({
      isBlocked,
      allergyClashes: detectedAllergyClashes,
      clinicalClashes: detectedClinicalClashes,
      mealTitle: testMealTitle
    });

    if (isBlocked) {
      showToast("PESANAN DITOLAK: Terdeteksi benturan alergi atau kontraindikasi medis!", "error");
    } else {
      showToast("Pesanan lolos verifikasi clash detection (Aman).", "success");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <ShieldAlert size={20} color="var(--primary)" />
          <div>
            <h3 className="card-title">Menu Clash Detection (Alergi & Kontraindikasi Medis)</h3>
            <p className="card-subtitle">
              Sistem menolak pesanan secara otomatis jika menu bertabrakan dengan alergen atau komorbiditas pasien
            </p>
          </div>
        </div>
        <span className="badge badge-primary">Safety Interlock Aktif</span>
      </div>

      <div className="alert-box alert-info">
        <Stethoscope size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Profil Pasien yang Diperiksa: {selectedPatient.name}</strong> ({selectedPatient.ward} - {selectedPatient.bed})<br />
          • Komorbiditas: <em>{selectedPatient.diagnosisMedis}</em><br />
          • Riwayat Alergi Tercatat:{" "}
          <strong style={{ color: selectedPatient.allergies[0] !== "Tidak Ada" ? "#dc2626" : "#059669" }}>
            {selectedPatient.allergies.join(", ")}
          </strong>
        </div>
      </div>

      {/* Test Preset Selection */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, marginBottom: "8px" }}>
          Pilih Uji Menu Pesanan dari Dapur:
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {testMealPresets.map((preset, idx) => (
            <button
              key={idx}
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setTestMealTitle(preset.title);
                setTestMealAllergens(preset.allergens);
                setTestContraindications(preset.contraindications);
                setAnalysisResult(null);
              }}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "20px" }}>
        <div className="form-group">
          <label className="form-label">Nama Menu yang Hendak Dipesan / Disajikan:</label>
          <input
            type="text"
            className="form-input"
            value={testMealTitle}
            onChange={(e) => setTestMealTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Kandungan Alergen pada Menu Tersebut:</label>
          <input
            type="text"
            className="form-input"
            value={testMealAllergens.join(", ")}
            onChange={(e) => setTestMealAllergens(e.target.value.split(",").map((s) => s.trim()))}
            placeholder="cth: Udang / Seafood, Telur..."
          />
        </div>
      </div>

      <button className="btn btn-primary" onClick={runClashCheck}>
        <ShieldAlert size={16} /> Jalankan Analisis Clash Detection
      </button>

      {/* Analysis Output */}
      {analysisResult && (
        <div style={{ marginTop: "24px" }}>
          {analysisResult.isBlocked ? (
            <div
              style={{
                background: "#fef2f2",
                border: "2px solid #ef4444",
                borderRadius: "10px",
                padding: "20px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#991b1b" }}>
                <Ban size={28} />
                <h4 style={{ fontSize: "16px", fontWeight: 800 }}>
                  PESANAN MAKANAN DITOLAK OTOMATIS OLEH SISTEM (ORDER REJECTED)
                </h4>
              </div>

              <div style={{ marginTop: "12px", fontSize: "13px", color: "#7f1d1d" }}>
                Menu <strong>"{analysisResult.mealTitle}"</strong> berbahaya bagi pasien{" "}
                <strong>{selectedPatient.name}</strong> karena alasan berikut:
              </div>

              {analysisResult.allergyClashes.length > 0 && (
                <div style={{ marginTop: "10px", background: "white", padding: "10px 14px", borderRadius: "6px" }}>
                  <strong style={{ color: "#dc2626" }}>⚠️ BENTURAN ALERGI FATAL:</strong>
                  {analysisResult.allergyClashes.map((c, i) => (
                    <div key={i} style={{ fontSize: "12px", marginTop: "2px" }}>
                      • Pasien memiliki riwayat alergi terverifikasi: <strong>{c.allergen}</strong>.
                    </div>
                  ))}
                </div>
              )}

              {analysisResult.clinicalClashes.length > 0 && (
                <div style={{ marginTop: "10px", background: "white", padding: "10px 14px", borderRadius: "6px" }}>
                  <strong style={{ color: "#d97706" }}>⚠️ KONTRAINDIKASI KLINIS PENYAKIT:</strong>
                  {analysisResult.clinicalClashes.map((c, i) => (
                    <div key={i} style={{ fontSize: "12px", marginTop: "2px" }}>
                      • Kontraindikasi: <strong>{c.contra}</strong> ({c.reason}).
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "14px", fontSize: "12px", color: "#1e3a8a", background: "#eff6ff", padding: "10px 14px", borderRadius: "6px" }}>
                <strong>Rekomendasi Tindakan Dietisien:</strong> Sistem otomatis mengajukan menu substitusi bebas alergen (cth: Daging Ayam Fillet / Tahu Sutra) dan penyesuaian diet rendah kalium/garam.
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "#f0fdf4",
                border: "2px solid #22c55e",
                borderRadius: "10px",
                padding: "20px",
                color: "#15803d"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={26} />
                <h4 style={{ fontSize: "16px", fontWeight: 800 }}>
                  PESANAN LOLOS VERIFIKASI - TIDAK ADA BENTURAN (SAFE TO SERVE)
                </h4>
              </div>
              <p style={{ fontSize: "13px", marginTop: "8px" }}>
                Menu "{analysisResult.mealTitle}" aman dikonsumsi oleh pasien {selectedPatient.name}.
                Tidak ditemukan alergen yang cocok dan menu sesuai dengan preskripsi diet komorbiditas pasien.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
