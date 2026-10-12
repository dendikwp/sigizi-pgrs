import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Calculator, Check, Flame, Droplets, PieChart, Sparkles, RefreshCw } from "lucide-react";

export const KalkulatorGizi = ({ onAppliedToCPPT }) => {
  const { selectedPatient, updatePatient, showToast } = useApp();

  const [formula, setFormula] = useState(
    selectedPatient.ward.includes("ICU")
      ? "PennState"
      : selectedPatient.age < 12
      ? "Schofield"
      : "Mifflin"
  );

  const [bb, setBb] = useState(selectedPatient.bb || 60);
  const [tb, setTb] = useState(selectedPatient.tb || 165);
  const [age, setAge] = useState(selectedPatient.age || 40);
  const [gender, setGender] = useState(selectedPatient.gender || "Laki-laki");

  // Ventilator specifics for Penn State
  const [minuteVentilation, setMinuteVentilation] = useState(
    selectedPatient.ventilatorData?.minuteVentilation || 10.0
  );
  const [maxTemp, setMaxTemp] = useState(selectedPatient.ventilatorData?.maxTemp || 38.5);

  // Activity & Stress factors
  const [activityFactor, setActivityFactor] = useState(
    selectedPatient.ward.includes("ICU") ? 1.0 : 1.2
  );
  const [stressFactor, setStressFactor] = useState(
    selectedPatient.diagnosisMedis.includes("Sepsis")
      ? 1.4
      : selectedPatient.diagnosisMedis.includes("Post-Operasi")
      ? 1.3
      : selectedPatient.diagnosisMedis.includes("GGK")
      ? 1.2
      : 1.1
  );

  // Protein requirement (g/kgBB)
  const [proteinPerKg, setProteinPerKg] = useState(
    selectedPatient.diagnosisMedis.includes("GGK")
      ? 0.8
      : selectedPatient.diagnosisMedis.includes("Sepsis")
      ? 1.5
      : 1.2
  );

  // Route & Form
  const [route, setRoute] = useState(
    selectedPatient.ward.includes("ICU") ? "Enteral (NGT Sonde Peptida)" : "Oral (Makanan Lunak)"
  );

  // Dynamic Calculation
  const calculateEnergy = () => {
    let bmr = 0;
    let tee = 0;

    if (formula === "HarrisBenedict") {
      if (gender === "Laki-laki") {
        bmr = 66.5 + 13.75 * bb + 5.003 * tb - 6.75 * age;
      } else {
        bmr = 655.1 + 9.563 * bb + 1.85 * tb - 4.676 * age;
      }
      tee = bmr * activityFactor * stressFactor;
    } else if (formula === "Mifflin") {
      if (gender === "Laki-laki") {
        bmr = 10 * bb + 6.25 * tb - 5 * age + 5;
      } else {
        bmr = 10 * bb + 6.25 * tb - 5 * age - 161;
      }
      tee = bmr * activityFactor * stressFactor;
    } else if (formula === "PennState") {
      // Penn State PSU 2003b: Mifflin(BMR) * 0.96 + VE * 31 + Tmax * 167 - 6212
      let mifflinBmr =
        gender === "Laki-laki"
          ? 10 * bb + 6.25 * tb - 5 * age + 5
          : 10 * bb + 6.25 * tb - 5 * age - 161;
      bmr = mifflinBmr;
      tee = mifflinBmr * 0.96 + minuteVentilation * 31 + maxTemp * 167 - 6212;
    } else if (formula === "Schofield") {
      // Pediatrik
      if (age <= 3) {
        bmr = gender === "Laki-laki" ? 59.512 * bb - 30.4 : 58.317 * bb - 31.1;
      } else if (age <= 10) {
        bmr = gender === "Laki-laki" ? 22.706 * bb + 504.3 : 20.315 * bb + 485.9;
      } else {
        bmr = gender === "Laki-laki" ? 17.686 * bb + 658.2 : 13.384 * bb + 692.6;
      }
      tee = bmr * activityFactor * stressFactor;
    } else if (formula === "HollidaySegar") {
      // Cairan & Kalori Basal Holliday-Segar (Pediatrik)
      if (bb <= 10) {
        tee = bb * 100;
      } else if (bb <= 20) {
        tee = 1000 + (bb - 10) * 50;
      } else {
        tee = 1500 + (bb - 20) * 20;
      }
      bmr = tee * 0.8;
    }

    // Macronutrients
    const targetTEE = Math.round(Math.max(800, tee));
    const targetProteinGram = Math.round(bb * proteinPerKg);
    const targetProteinKcal = targetProteinGram * 4;
    const proteinPercent = Math.round((targetProteinKcal / targetTEE) * 100);

    const fatPercent = 25; // 25% lemak
    const targetFatKcal = Math.round(targetTEE * 0.25);
    const targetFatGram = Math.round(targetFatKcal / 9);

    const carbKcal = Math.max(0, targetTEE - targetProteinKcal - targetFatKcal);
    const carbPercent = Math.round((carbKcal / targetTEE) * 100);
    const targetCarbGram = Math.round(carbKcal / 4);

    // Kebutuhan Cairan (Fluid) ml/hari
    let fluidRequirement = 0;
    if (age < 12) {
      fluidRequirement = bb <= 10 ? bb * 100 : bb <= 20 ? 1000 + (bb - 10) * 50 : 1500 + (bb - 20) * 20;
    } else {
      fluidRequirement = bb * 30; // 30 ml/kgBB dewasa
    }

    return {
      bmr: Math.round(bmr),
      tee: targetTEE,
      proteinGram: targetProteinGram,
      proteinKcal: targetProteinKcal,
      proteinPercent,
      fatGram: targetFatGram,
      fatKcal: targetFatKcal,
      fatPercent,
      carbGram: targetCarbGram,
      carbKcal,
      carbPercent,
      fluidRequirement: Math.round(fluidRequirement)
    };
  };

  const results = calculateEnergy();

  const handleApplyPrescription = () => {
    const preskripsiText = `${route} • Target Energi: ${results.tee} kkal/hari (Karbohidrat ${results.carbGram}g [${results.carbPercent}%], Protein ${results.proteinGram}g [${results.proteinPercent}%], Lemak ${results.fatGram}g [${results.fatPercent}%]) • Cairan: ${results.fluidRequirement} ml/hari.`;
    const updated = {
      ...selectedPatient,
      bb,
      tb,
      dietPrescription: preskripsiText,
      imt: parseFloat((bb / ((tb / 100) * (tb / 100))).toFixed(1))
    };
    updatePatient(updated);
    showToast("Preskripsi gizi berhasil disimpan ke rekam medis pasien!", "success");
    if (onAppliedToCPPT) onAppliedToCPPT(preskripsiText);
  };

  return (
    <div className="grid-2">
      {/* Parameter Input */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Calculator size={18} color="var(--primary)" />
            <div>
              <h3 className="card-title">Kalkulator Gizi Multiformula RSUD</h3>
              <p className="card-subtitle">
                Penghitungan kebutuhan energi spesifik komorbiditas dewasa, ICU, dan pediatrik
              </p>
            </div>
          </div>
          <span className="badge badge-primary">{formula}</span>
        </div>

        <div className="form-group">
          <label className="form-label">Pilih Formula Penghitungan Energi:</label>
          <select
            className="form-select"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
          >
            <option value="Mifflin">Mifflin-St Jeor (Presisi Pasien Dewasa Umum / Obesitas)</option>
            <option value="PennState">Penn State PSU 2003b (Khusus Pasien ICU on Ventilator)</option>
            <option value="HarrisBenedict">Harris-Benedict (Standar Klasik BMR x AF x SF)</option>
            <option value="Schofield">Schofield (Pediatrik / Anak berdasarkan kelompok usia)</option>
            <option value="HollidaySegar">Holliday-Segar (Pediatrik Kebutuhan Cairan & Kalori Basal)</option>
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Berat Badan (kg):</label>
            <input
              type="number"
              step="0.5"
              className="form-input"
              value={bb}
              onChange={(e) => setBb(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tinggi Badan (cm):</label>
            <input
              type="number"
              className="form-input"
              value={tb}
              onChange={(e) => setTb(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Usia (Tahun):</label>
            <input
              type="number"
              className="form-input"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Jenis Kelamin:</label>
            <select
              className="form-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        {formula === "PennState" && (
          <div style={{ background: "#f0fdfa", padding: "14px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #ccfbf1" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f766e", marginBottom: "8px" }}>
              Parameter Ventilator Mekanik & Suhu Pasien (Penn State):
            </div>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Minute Ventilation / VE (L/menit):</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={minuteVentilation}
                  onChange={(e) => setMinuteVentilation(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Suhu Maksimal Pasien / Tmax (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        )}

        {formula !== "PennState" && (
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Faktor Aktivitas (AF):</label>
              <select
                className="form-select"
                value={activityFactor}
                onChange={(e) => setActivityFactor(parseFloat(e.target.value))}
              >
                <option value="1.0">1.0 - Koma / Sedasi Total</option>
                <option value="1.2">1.2 - Bedrest Total di Tempat Tidur</option>
                <option value="1.3">1.3 - Bedrest dengan Mobilisasi Ringan</option>
                <option value="1.4">1.4 - Ambulasi Mandiri</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Faktor Stres / Penyakit (SF):</label>
              <select
                className="form-select"
                value={stressFactor}
                onChange={(e) => setStressFactor(parseFloat(e.target.value))}
              >
                <option value="1.0">1.0 - Tanpa Stres Metabolik</option>
                <option value="1.2">1.2 - Post-Op Sedang / GGK Non-Dialisis</option>
                <option value="1.3">1.3 - Post-Op Mayor / Kanker</option>
                <option value="1.4">1.4 - Sepsis / Infeksi Berat</option>
                <option value="1.6">1.6 - Trauma Berat / Luka Bakar Luas</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Target Protein (g/kgBB/hari):</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={proteinPerKg}
              onChange={(e) => setProteinPerKg(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Rute & Bentuk Makanan:</label>
            <select
              className="form-select"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
            >
              <option value="Oral (Makanan Lunak)">Oral (Makanan Lunak)</option>
              <option value="Oral (Makanan Biasa)">Oral (Makanan Biasa)</option>
              <option value="Oral (Makanan Saring / Bubur)">Oral (Makanan Saring / Bubur)</option>
              <option value="Enteral (NGT Sonde Polimerik)">Enteral (NGT Sonde Polimerik)</option>
              <option value="Enteral (NGT Sonde Peptida Sepsis)">Enteral (NGT Sonde Peptida Sepsis)</option>
              <option value="Enteral Rendah Protein Renal">Enteral Rendah Protein Renal</option>
              <option value="Parenteral Nutrisi Sentral (TPN)">Parenteral Nutrisi Sentral (TPN)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Flame size={18} color="#f59e0b" />
            <div>
              <h3 className="card-title">Hasil Rekomendasi Preskripsi Diet</h3>
              <p className="card-subtitle">
                Total Energy Expenditure (TEE) & Sebaran Makronutrien Klinis
              </p>
            </div>
          </div>
          <span className="badge badge-success">Siap Diintervensi</span>
        </div>

        {/* Big Energy Display */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #042f2e 100%)",
            color: "white",
            padding: "26px",
            borderRadius: "16px",
            marginBottom: "24px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(13, 148, 136, 0.25)"
          }}
        >
          <div style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.95, fontWeight: 700 }}>
            Total Kebutuhan Energi Pasien (TEE)
          </div>
          <div style={{ fontSize: "44px", fontWeight: 800, margin: "8px 0", letterSpacing: "-0.02em" }}>
            {results.tee} <span style={{ fontSize: "20px", fontWeight: 500 }}>kkal / hari</span>
          </div>
          <div style={{ fontSize: "14px", opacity: 0.9 }}>
            BMR Basal: <strong>{results.bmr} kkal</strong> • IMT Pasien: <strong>{(bb / ((tb / 100) * (tb / 100))).toFixed(1)} kg/m²</strong>
          </div>
        </div>

        {/* Macronutrients Grid */}
        <div className="grid-3" style={{ marginBottom: "24px" }}>
          <div style={{ background: "#f8fafc", padding: "18px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.04em" }}>KARBOHIDRAT</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#0284c7", margin: "4px 0" }}>
              {results.carbGram}g
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {results.carbKcal} kkal ({results.carbPercent}%)
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "18px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.04em" }}>PROTEIN</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#10b981", margin: "4px 0" }}>
              {results.proteinGram}g
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {results.proteinKcal} kkal ({results.proteinPercent}%)
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "18px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.04em" }}>LEMAK</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#f59e0b", margin: "4px 0" }}>
              {results.fatGram}g
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {results.fatKcal} kkal ({results.fatPercent}%)
            </div>
          </div>
        </div>

        {/* Fluid Requirement */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "#eff6ff",
            padding: "16px 20px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #bfdbfe"
          }}
        >
          <Droplets size={28} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e40af" }}>
              Estimasi Kebutuhan Cairan Harian:
            </div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#1e3a8a", marginTop: "2px" }}>
              {results.fluidRequirement} ml / 24 jam{" "}
              {selectedPatient.diagnosisMedis.includes("CHF") && (
                <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: 700 }}>
                  (Restriksi CHF: Max 1200 ml!)
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px 28px", fontSize: "16px", fontWeight: 800 }}
          onClick={handleApplyPrescription}
        >
          <Sparkles size={18} /> Terapkan Preskripsi Gizi ke Pasien & CPPT
        </button>
      </div>
    </div>
  );
};
