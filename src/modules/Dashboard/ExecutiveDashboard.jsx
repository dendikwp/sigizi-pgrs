import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  Smile,
  HeartPulse,
  DollarSign,
  Utensils,
  Award,
  Printer
} from "lucide-react";

export const ExecutiveDashboard = () => {
  const { starkesMetrics, currentRole, showToast } = useApp();

  const wardWasteBreakdown = [
    { ward: "Rawat Inap Melati (Penyakit Dalam)", wastePct: 15.2, satisfactionPct: 92.5, costPerPatient: "Rp 44.500" },
    { ward: "Mawar (Bedah Umum)", wastePct: 12.1, satisfactionPct: 95.0, costPerPatient: "Rp 46.000" },
    { ward: "Anggrek (Jantung & VIP)", wastePct: 9.8, satisfactionPct: 98.2, costPerPatient: "Rp 58.000" },
    { ward: "Kenanga (Pediatrik / Anak)", wastePct: 16.5, satisfactionPct: 91.0, costPerPatient: "Rp 45.000" },
    { ward: "ICU Sentral (Nutrisi Enteral)", wastePct: 6.2, satisfactionPct: 96.0, costPerPatient: "Rp 62.000" }
  ];

  return (
    <div>
      {/* Top Banner Executive */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          padding: "24px",
          borderRadius: "14px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#5eead4", fontWeight: 700 }}>
            LAPORAN KINERJA INSTALASI GIZI & LAYANAN KLINIS
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, margin: "4px 0" }}>
            Executive Dashboard Direksi RSUD Provinsi
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>
            Periode Triwulan IV 2026 • Terkoneksi SIMRS & Standar Akreditasi STARKES
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            showToast("Mencetak Laporan Eksekutif Triwulan Direksi...", "success");
            window.print();
          }}
        >
          <Printer size={16} /> Cetak Laporan Eksekutif
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-4" style={{ marginBottom: "28px" }}>
        {/* Card 1: Food Cost */}
        <div className="card" style={{ marginBottom: 0, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.04em" }}>
                FOOD COST PER PATIENT DAY
              </div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)", margin: "6px 0", letterSpacing: "-0.02em" }}>
                Rp 46.500
              </div>
            </div>
            <div style={{ background: "#d1fae5", padding: "10px", borderRadius: "10px", color: "#065f46" }}>
              <TrendingDown size={24} />
            </div>
          </div>
          <div style={{ fontSize: "14px", color: "#16a34a", fontWeight: 800, marginTop: "8px" }}>
            -10.5% (Hemat di bawah Pagu Rp 52.000)
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
            Efisiensi anggaran tercapai tanpa mengurangi standar nutrisi
          </div>
        </div>

        {/* Card 2: Plate Waste Comstock */}
        <div className="card" style={{ marginBottom: 0, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.04em" }}>
                RATA-RATA SISA MAKANAN (COMSTOCK)
              </div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#16a34a", margin: "6px 0", letterSpacing: "-0.02em" }}>
                13.8%
              </div>
            </div>
            <div style={{ background: "#ccfbf1", padding: "10px", borderRadius: "10px", color: "#0f766e" }}>
              <Utensils size={24} />
            </div>
          </div>
          <div style={{ fontSize: "14px", color: "#0d9488", fontWeight: 800, marginTop: "8px" }}>
            Target Nasional STARKES: &lt; 20%
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
            Daya terima makanan pasien sangat baik dan higienis
          </div>
        </div>

        {/* Card 3: Satisfaction */}
        <div className="card" style={{ marginBottom: 0, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.04em" }}>
                INDEKS KEPUASAN PASIEN
              </div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#0284c7", margin: "6px 0", letterSpacing: "-0.02em" }}>
                94.6%
              </div>
            </div>
            <div style={{ background: "#e0f2fe", padding: "10px", borderRadius: "10px", color: "#0369a1" }}>
              <Smile size={24} />
            </div>
          </div>
          <div style={{ fontSize: "14px", color: "#0284c7", fontWeight: 800, marginTop: "8px" }}>
            Target Rumah Sakit: &gt; 85%
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
            Evaluasi rasa, suhu penyajian, dan kerapihan plato
          </div>
        </div>

        {/* Card 4: Clinical Care Speed */}
        <div className="card" style={{ marginBottom: 0, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.04em" }}>
                ASUHAN GIZI &lt; 24 JAM
              </div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#7c3aed", margin: "6px 0", letterSpacing: "-0.02em" }}>
                97.2%
              </div>
            </div>
            <div style={{ background: "#ede9fe", padding: "10px", borderRadius: "10px", color: "#6d28d9" }}>
              <HeartPulse size={24} />
            </div>
          </div>
          <div style={{ fontSize: "14px", color: "#7c3aed", fontWeight: 800, marginTop: "8px" }}>
            Target STARKES: &gt; 90%
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
            Respon asuhan klinis cepat Dietisien RD berlisensi
          </div>
        </div>
      </div>

      {/* Ward Comparison Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Award size={18} color="var(--primary)" />
            <div>
              <h3 className="card-title">Analisis Kinerja Pelayanan Gizi per Bangsal Rawat Inap</h3>
              <p className="card-subtitle">
                Komparasi sisa makanan Comstock, kepuasan pasien, dan realisasi biaya makan harian
              </p>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ruang Rawat Inap</th>
                <th>Sisa Makanan Pasien (Metode Comstock)</th>
                <th>Kepuasan Terhadap Makanan (%)</th>
                <th>Realisasi Food Cost Harian</th>
                <th>Status Kinerja STARKES</th>
              </tr>
            </thead>
            <tbody>
              {wardWasteBreakdown.map((w, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{w.ward}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "8px",
                          background: "#e2e8f0",
                          borderRadius: "4px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${w.wastePct * 4}%`,
                            height: "100%",
                            background: w.wastePct < 15 ? "#10b981" : "#f59e0b"
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: 800 }}>{w.wastePct}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: "#0284c7" }}>{w.satisfactionPct}%</span>
                  </td>
                  <td>
                    <strong>{w.costPerPatient}</strong>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      ✓ Memenuhi Indikator Mutu Nasional
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
