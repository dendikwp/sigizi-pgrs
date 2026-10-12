import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Building2,
  ShieldCheck,
  Lock,
  User,
  Stethoscope,
  Utensils,
  Boxes,
  Activity,
  Award,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  KeyRound
} from "lucide-react";

export const LoginPage = () => {
  const { roles, login, showToast } = useApp();
  const [selectedRoleForForm, setSelectedRoleForForm] = useState("kepala_gizi");
  const [nipInput, setNipInput] = useState("198905142014032004");
  const [passwordInput, setPasswordInput] = useState("RSUDProvinsi2026!");
  const [loginTab, setLoginTab] = useState("quick"); // 'quick' or 'form'

  const roleIcons = {
    dokter: Stethoscope,
    dietisien: Activity,
    perawat: ShieldCheck,
    kepala_gizi: Award,
    produksi_dapur: Utensils,
    logistik_gudang: Boxes,
    direksi: LayoutDashboard
  };

  const handleRoleCardClick = (roleId) => {
    login(roleId);
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (!nipInput.trim()) {
      showToast("Silakan masukkan NIP atau Username!", "error");
      return;
    }
    const cleanNip = nipInput.trim().replace(/\s+/g, "");
    const matchedRole =
      roles.find((r) => r.nip === cleanNip) ||
      roles.find((r) => r.id === selectedRoleForForm) ||
      roles[0];
    login(matchedRole.id);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #042f2e 0%, #0f172a 100%)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif)"
      }}
    >
      {/* Top Bar Header Branding */}
      <header
        style={{
          padding: "20px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 14px rgba(20, 184, 166, 0.3)"
            }}
          >
            <Building2 size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.01em", color: "white" }}>
              RSUD PROVINSI
            </h1>
            <p style={{ fontSize: "12px", color: "#99f6e4", fontWeight: 600 }}>
              Sistem Informasi Manajemen Gizi Terpadu (SIGIZI PROVINSI - PGRS)
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              background: "rgba(13, 148, 136, 0.25)",
              color: "#5eead4",
              border: "1px solid rgba(94, 234, 212, 0.3)",
              fontSize: "12px",
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <ShieldCheck size={14} /> Terakreditasi STARKES 2024 Paripurna
          </span>
          <span
            style={{
              background: "rgba(59, 130, 246, 0.2)",
              color: "#93c5fd",
              border: "1px solid rgba(147, 197, 253, 0.3)",
              fontSize: "12px",
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: "9999px"
            }}
          >
            Kemenkes SatuSehat FHIR Ready
          </span>
        </div>
      </header>

      {/* Main Login Body */}
      <main style={{ padding: "40px 36px", flex: 1, maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {/* Title & Mode Switcher */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "6px 16px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#5eead4",
              marginBottom: "14px"
            }}
          >
            <Sparkles size={16} /> Portal Otentikasi & Role-Based Access Control (RBAC)
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff" }}>
            Pilih Akun / Peran Petugas RSUD
          </h2>
          <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "680px", margin: "8px auto 20px" }}>
            Akses sistem disesuaikan secara ketat berdasarkan kewenangan klinis & operasional rumah sakit pemerintah provinsi (UU PDP No. 27/2022).
          </p>

          <div
            style={{
              display: "inline-flex",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "4px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <button
              onClick={() => setLoginTab("quick")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: loginTab === "quick" ? "#0d9488" : "transparent",
                color: "white",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              1-Click Pilih Akun Demo RSUD (7 Peran)
            </button>
            <button
              onClick={() => setLoginTab("form")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: loginTab === "form" ? "#0d9488" : "transparent",
                color: "white",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Form Login Kredensial NIP
            </button>
          </div>
        </div>

        {/* Tab 1: 1-Click Role Cards Grid */}
        {loginTab === "quick" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: "20px"
            }}
          >
            {roles.map((role) => {
              const IconComp = roleIcons[role.id] || User;
              const isKepala = role.id === "kepala_gizi";
              const isDireksi = role.id === "direksi";

              return (
                <div
                  key={role.id}
                  onClick={() => handleRoleCardClick(role.id)}
                  style={{
                    background: isKepala
                      ? "linear-gradient(135deg, rgba(13, 148, 136, 0.25) 0%, rgba(15, 23, 42, 0.6) 100%)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: isKepala
                      ? "2px solid #14b8a6"
                      : isDireksi
                      ? "1.5px solid #38bdf8"
                      : "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "16px",
                    padding: "24px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "#5eead4";
                    e.currentTarget.style.boxShadow = "0 12px 28px rgba(13, 148, 136, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = isKepala
                      ? "#14b8a6"
                      : isDireksi
                      ? "#38bdf8"
                      : "rgba(255, 255, 255, 0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {isKepala && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "#14b8a6",
                        color: "#042f2e",
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        textTransform: "uppercase"
                      }}
                    >
                      SUPERVISI PENUH
                    </div>
                  )}

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: isKepala ? "#0d9488" : "rgba(255, 255, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isKepala ? "#ffffff" : "#5eead4"
                        }}
                      >
                        <IconComp size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#99f6e4", textTransform: "uppercase" }}>
                          {role.badge}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", lineHeight: "1.3" }}>
                          {role.user}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          NIP: {role.nip}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#cbd5e1",
                        lineHeight: "1.5",
                        marginBottom: "16px",
                        background: "rgba(0, 0, 0, 0.2)",
                        padding: "10px 14px",
                        borderRadius: "8px"
                      }}
                    >
                      {role.description}
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                        Kewenangan & Fitur Terbuka:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {role.id === "kepala_gizi" && (
                          <>
                            <span className="badge badge-primary">Semua Modul Terbuka</span>
                            <span className="badge badge-success">Supervisi & Approval SPBM</span>
                            <span className="badge badge-warning">Laporan STARKES Direksi</span>
                          </>
                        )}
                        {role.id === "dokter" && (
                          <>
                            <span className="badge badge-primary">Peresepan Diet CPOE</span>
                            <span className="badge badge-success">Verifikasi & TTD CPPT</span>
                            <span className="badge badge-neutral">Rekam Medis LIS</span>
                          </>
                        )}
                        {role.id === "dietisien" && (
                          <>
                            <span className="badge badge-primary">Skrining & PAGT Lengkap</span>
                            <span className="badge badge-success">Kalkulator Gizi Multirumus</span>
                            <span className="badge badge-warning">CRUD Pasien & ADIME</span>
                          </>
                        )}
                        {role.id === "perawat" && (
                          <>
                            <span className="badge badge-primary">Skrining Awal Ranap &lt;24 Jam</span>
                            <span className="badge badge-success">Barcode Double Check SKP 1</span>
                          </>
                        )}
                        {role.id === "produksi_dapur" && (
                          <>
                            <span className="badge badge-primary">Grand Total Porsi Shift</span>
                            <span className="badge badge-warning">Kalkulator PKBM %BDD</span>
                            <span className="badge badge-neutral">Label Plato Waterproof</span>
                          </>
                        )}
                        {role.id === "logistik_gudang" && (
                          <>
                            <span className="badge badge-primary">CRUD Stok Gudang Basah/Kering</span>
                            <span className="badge badge-warning">Log Suhu HACCP Cold Storage</span>
                            <span className="badge badge-danger">FEFO Alert & Recall Batch</span>
                          </>
                        )}
                        {role.id === "direksi" && (
                          <>
                            <span className="badge badge-primary">Executive Dashboard RS</span>
                            <span className="badge badge-success">Food Cost per Patient</span>
                            <span className="badge badge-warning">Comstock Plate Waste</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: isKepala ? "#0d9488" : "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer",
                      marginTop: "10px"
                    }}
                  >
                    <span>Masuk sebagai {role.name}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Manual Credentials Form */}
        {loginTab === "form" && (
          <div
            style={{
              maxWidth: "480px",
              margin: "0 auto",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "#0d9488",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  color: "white"
                }}
              >
                <KeyRound size={28} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800 }}>Masuk dengan NIP Resmi</h3>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                Autentikasi terenkripsi internal SIMRS RSUD Provinsi
              </p>
            </div>

            <form onSubmit={handleManualLogin}>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>
                  Pilih Jabatan / Peran:
                </label>
                <select
                  value={selectedRoleForForm}
                  onChange={(e) => {
                    setSelectedRoleForForm(e.target.value);
                    const r = roles.find((item) => item.id === e.target.value);
                    if (r) setNipInput(r.nip);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id} style={{ background: "#0f172a", color: "white" }}>
                      {r.name} - {r.user}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>
                  Nomor Induk Pegawai (NIP):
                </label>
                <input
                  type="text"
                  value={nipInput}
                  onChange={(e) => setNipInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                  placeholder="Masukkan 18 digit NIP..."
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>
                  Kata Sandi (Password):
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(13, 148, 136, 0.4)"
                }}
              >
                <Lock size={18} /> Masuk ke SIGIZI PROVINSI
              </button>
            </form>

            {/* Quick NIP Reference Box */}
            <div
              style={{
                marginTop: "24px",
                paddingTop: "18px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "12px"
              }}
            >
              <div style={{ color: "#5eead4", fontWeight: 700, marginBottom: "8px" }}>
                💡 Daftar Akun &amp; NIP Petugas RSUD:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {roles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRoleForForm(r.id);
                      setNipInput(r.nip);
                      showToast(`NIP ${r.user} berhasil disalin ke form!`);
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                    title="Klik untuk otomatis mengisi ke form"
                  >
                    <div>
                      <strong style={{ color: "#ffffff" }}>{r.name}</strong> ({r.user.split(",")[0]})
                    </div>
                    <code style={{ color: "#99f6e4", fontFamily: "monospace", fontSize: "11px" }}>
                      {r.nip}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer System Status */}
      <footer
        style={{
          padding: "16px 36px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          fontSize: "12px",
          color: "#94a3b8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div>
          Instalasi Gizi Rumah Sakit Umum Daerah Provinsi • Ka. Instalasi: <strong>Vikti May Putri, S.Tr.Gz</strong>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Versi Sistem: 3.4.0 Production</span>
          <span>•</span>
          <span>Client Storage: LocalStorage JSON</span>
          <span>•</span>
          <span>Standar STARKES KARS 2024</span>
        </div>
      </footer>
    </div>
  );
};
