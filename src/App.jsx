import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { HospitalQuickStats } from "./components/HospitalQuickStats";
import { PatientSelectorBar } from "./components/PatientSelectorBar";
import { AsuhanGiziModule } from "./modules/AsuhanGizi";
import { ProduksiDapurModule } from "./modules/ProduksiDapur";
import { LogistikGudangModule } from "./modules/LogistikGudang";
import { DistribusiKeamananModule } from "./modules/DistribusiKeamanan";
import { IntegrasiSIMRSModule } from "./modules/IntegrasiSIMRS";
import { RegulasiKepatuhanModule } from "./modules/RegulasiKepatuhan";
import { ExecutiveDashboard } from "./modules/Dashboard/ExecutiveDashboard";
import { LoginPage } from "./components/LoginPage";
import { CheckCircle2, AlertCircle, Info, Lock, ShieldAlert } from "lucide-react";
import "./styles/main.css";
import "./styles/print.css";

const MainAppLayout = () => {
  const {
    activeTab,
    toastMessage,
    isAuthenticated,
    canAccess,
    currentRole,
    switchRole
  } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const hasAccess = canAccess(activeTab);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-body">
          {/* Informative Hospital KPI Quick Ribbon */}
          <HospitalQuickStats />

          {/* Patient Selector only on relevant clinical/distribution modules */}
          {(activeTab === "asuhan_gizi" || activeTab === "distribusi_safety") && (
            <PatientSelectorBar />
          )}

          {!hasAccess ? (
            <div
              className="card"
              style={{
                padding: "48px 32px",
                textAlign: "center",
                background: "#ffffff",
                border: "1px solid #fed7aa",
                borderRadius: "16px",
                marginTop: "16px"
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "#fff7ed",
                  color: "#ea580c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  border: "1px solid #ffedd5"
                }}
              >
                <Lock size={32} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                Akses Terbatas: Kewenangan Klinis & Operasional (RBAC)
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  maxWidth: "640px",
                  margin: "0 auto 20px",
                  lineHeight: "1.6"
                }}
              >
                Akun aktif Anda saat ini adalah <strong>{currentRole.name} ({currentRole.user})</strong>. Sesuai standar tata kelola rumah sakit, standar akreditasi STARKES, dan UU PDP No. 27/2022, modul ini memiliki batasan otorisasi.
              </p>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  maxWidth: "540px",
                  margin: "0 auto 24px",
                  fontSize: "13px",
                  color: "#334155",
                  border: "1px solid #e2e8f0"
                }}
              >
                <strong>Deskripsi Tugas Peran Anda:</strong> {currentRole.description}
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => switchRole("kepala_gizi")}
                >
                  Beralih ke Ka. Instalasi (Vikti May Putri) untuk Akses Penuh
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "asuhan_gizi" && <AsuhanGiziModule />}
              {activeTab === "produksi_dapur" && <ProduksiDapurModule />}
              {activeTab === "logistik_gudang" && <LogistikGudangModule />}
              {activeTab === "distribusi_safety" && <DistribusiKeamananModule />}
              {activeTab === "integrasi_simrs" && <IntegrasiSIMRSModule />}
              {activeTab === "regulasi_kepatuhan" && <RegulasiKepatuhanModule />}
              {activeTab === "executive_dashboard" && <ExecutiveDashboard />}
            </>
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-container no-print">
          <div className={`toast ${toastMessage.type}`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 size={20} color="#10b981" />
            ) : toastMessage.type === "error" ? (
              <AlertCircle size={20} color="#ef4444" />
            ) : (
              <Info size={20} color="#0d9488" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SIGIZI Error Boundary Caught:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f5f9",
            padding: "24px",
            fontFamily: "system-ui, sans-serif"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "36px",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              maxWidth: "560px",
              width: "100%",
              textAlign: "center",
              border: "1px solid #e2e8f0"
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "#fee2e2",
                color: "#dc2626",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "30px"
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              Terjadi Kendala Sistem SIGIZI
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px", lineHeight: "1.6" }}>
              {this.state.error?.message || "Terjadi kesalahan pada komponen antarmuka pengguna."}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  background: "#0d9488",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Muat Ulang Halaman
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  background: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Reset Data Default
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainAppLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
