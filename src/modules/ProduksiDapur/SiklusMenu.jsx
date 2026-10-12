import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CalendarDays, Shuffle, CheckCircle, AlertTriangle, ArrowRight, Sparkles, ChefHat } from "lucide-react";

export const SiklusMenu = () => {
  const { menuCycle, substitutions, setMenuCycle, showToast, currentRole } = useApp();
  const [selectedDay, setSelectedDay] = useState(1);
  const [showSubModal, setShowSubModal] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState(substitutions[0]);

  const currentMenu = menuCycle.find((m) => m.day === selectedDay) || menuCycle[0];

  const handleApplySubstitution = (subChoice) => {
    // Replace animal protein in lunch menu as demonstration of dynamic substitution
    const updatedCycle = menuCycle.map((day) => {
      if (day.day === selectedDay) {
        return {
          ...day,
          siang: {
            ...day.siang,
            laukHewani: `${subChoice.name} (Substitusi: ${activeSubItem.originalName})`
          }
        };
      }
      return day;
    });

    setMenuCycle(updatedCycle);
    setShowSubModal(false);
    showToast(`Substitusi ${subChoice.name} berhasil diterapkan untuk Hari ke-${selectedDay}!`, "success");
  };

  return (
    <div>
      {/* Dynamic Day Selector */}
      <div className="card no-print">
        <div className="card-header">
          <div className="card-title-group">
            <CalendarDays size={18} color="var(--primary)" />
            <div>
              <h3 className="card-title">Siklus Menu Master RSUD Provinsi (10 Hari + Hari ke-31)</h3>
              <p className="card-subtitle">
                Standar penyusunan hidangan seimbang bergizi instalasi gizi RSUD Provinsi
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowSubModal(true)}
          >
            <Shuffle size={14} /> Substitusi Bahan Kosong Otomatis
          </button>
        </div>

        {/* Days Pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
          {menuCycle.map((m) => (
            <button
              key={m.day}
              className={`btn ${selectedDay === m.day ? "btn-primary" : "btn-secondary"}`}
              style={{ minWidth: "90px", fontWeight: 700 }}
              onClick={() => setSelectedDay(m.day)}
            >
              Hari {m.day === 31 ? "31 (Ekstra)" : m.day}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Meals Breakdown for Selected Day */}
      <div className="grid-3">
        {/* Pagi & Snack */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <ChefHat size={16} color="var(--primary)" />
              <h4 style={{ fontSize: "15px", fontWeight: 700 }}>Menu Makan Pagi (06:30)</h4>
            </div>
            <span className="badge badge-primary">Shift 1</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                MAKANAN POKOK:
              </span>
              <strong>{currentMenu.pagi?.pokok}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                LAUK HEWANI:
              </span>
              <strong style={{ color: "var(--primary-dark)" }}>{currentMenu.pagi?.laukHewani}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                LAUK NABATI:
              </span>
              <strong>{currentMenu.pagi?.laukNabati}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                SAYURAN:
              </span>
              <strong>{currentMenu.pagi?.sayur}</strong>
            </div>
            <div style={{ marginTop: "6px", background: "#f0fdfa", padding: "8px 12px", borderRadius: "6px" }}>
              <span style={{ color: "#0d9488", fontSize: "11px", fontWeight: 700, display: "block" }}>
                SNACK SELINGAN PAGI (09:30):
              </span>
              <strong>{currentMenu.pagi?.snack}</strong>
            </div>
          </div>
        </div>

        {/* Siang & Snack Sore */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <ChefHat size={16} color="var(--primary)" />
              <h4 style={{ fontSize: "15px", fontWeight: 700 }}>Menu Makan Siang (12:00)</h4>
            </div>
            <span className="badge badge-success">Shift 2</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                MAKANAN POKOK:
              </span>
              <strong>{currentMenu.siang?.pokok}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                LAUK HEWANI:
              </span>
              <strong style={{ color: "var(--primary-dark)" }}>{currentMenu.siang?.laukHewani}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                LAUK NABATI:
              </span>
              <strong>{currentMenu.siang?.laukNabati}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                SAYURAN:
              </span>
              <strong>{currentMenu.siang?.sayur}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                BUAH SEGAR:
              </span>
              <strong>{currentMenu.siang?.buah}</strong>
            </div>
            <div style={{ marginTop: "6px", background: "#fef3c7", padding: "8px 12px", borderRadius: "6px" }}>
              <span style={{ color: "#b45309", fontSize: "11px", fontWeight: 700, display: "block" }}>
                SNACK SELINGAN SORE (15:30):
              </span>
              <strong>{currentMenu.siang?.snackSore}</strong>
            </div>
          </div>
        </div>

        {/* Sore */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <ChefHat size={16} color="var(--primary)" />
              <h4 style={{ fontSize: "15px", fontWeight: 700 }}>Menu Makan Sore (17:30)</h4>
            </div>
            <span className="badge badge-warning">Shift 3</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                MAKANAN POKOK:
              </span>
              <strong>{currentMenu.sore?.pokok}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                LAUK HEWANI:
              </span>
              <strong style={{ color: "var(--primary-dark)" }}>{currentMenu.sore?.laukHewani}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                LAUK NABATI:
              </span>
              <strong>{currentMenu.sore?.laukNabati}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                SAYURAN:
              </span>
              <strong>{currentMenu.sore?.sayur}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block" }}>
                BUAH PENUTUP:
              </span>
              <strong>{currentMenu.sore?.buah}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Substitusi Bahan Makanan */}
      {showSubModal && (
        <div className="modal-overlay" onClick={() => setShowSubModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Shuffle size={18} color="var(--primary)" />
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
                  Substitusi Bahan Makanan Otomatis (Bahan Kosong / Fluktuasi Pasar)
                </h3>
              </div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                onClick={() => setShowSubModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Sistem cerdas SIGIZI merekomendasikan bahan pengganti setara nilai gizi (kalori & protein)
                secara otomatis ketika bahan mentah kosong di pasar/distributor tanpa merusak kepatuhan diet pasien.
              </p>

              <div className="form-group">
                <label className="form-label">Pilih Bahan Baku yang Mengalami Kekosongan:</label>
                <select
                  className="form-select"
                  value={activeSubItem.originalId}
                  onChange={(e) => {
                    const found = substitutions.find((s) => s.originalId === e.target.value);
                    if (found) setActiveSubItem(found);
                  }}
                >
                  {substitutions.map((s) => (
                    <option key={s.originalId} value={s.originalId}>
                      {s.originalName} ({s.category}) - {s.reason}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                  Rekomendasi Bahan Pengganti dari Dietisien:
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {activeSubItem.substitutes.map((sub, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        padding: "14px",
                        background: "#f8fafc",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--primary-dark)" }}>
                          {sub.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          Konversi Rasio: <strong>{sub.ratioGram}</strong> • Delta Kalori: {sub.kaloriDelta} • Delta Protein: {sub.proteinDelta}
                        </div>
                        {sub.allergens.length > 0 && (
                          <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: 700, marginTop: "4px" }}>
                            ⚠️ Perhatian Alergen: Mengandung {sub.allergens.join(", ")}
                          </div>
                        )}
                        <span className="badge badge-success" style={{ marginTop: "6px" }}>
                          {sub.status}
                        </span>
                      </div>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleApplySubstitution(sub)}
                      >
                        Terapkan ke Siklus Hari ke-{selectedDay}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowSubModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
