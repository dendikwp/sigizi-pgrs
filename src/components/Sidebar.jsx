import React from "react";
import { useApp } from "../context/AppContext";
import {
  Activity,
  UtensilsCrossed,
  Boxes,
  QrCode,
  Network,
  FileCheck2,
  LayoutDashboard,
  HeartPulse,
  Scale,
  CalendarDays,
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  PanelLeftClose,
  PanelLeftOpen,
  Lock,
  LogOut
} from "lucide-react";

export const Sidebar = () => {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    canAccess,
    logout,
    patients,
    inventory,
    isMobileSidebarOpen,
    toggleMobileSidebar,
    isSidebarCollapsed,
    toggleSidebarCollapse
  } = useApp();

  const alertScreenings = patients.filter((p) => p.screeningAlert).length;
  const fefoWarnings = inventory.filter((i) => i.daysUntilExpiry <= 3).length;

  const menuSections = [
    {
      title: "Asuhan Gizi Klinik (PAGT)",
      items: [
        {
          id: "asuhan_gizi",
          label: "Asuhan Gizi & PAGT",
          icon: Activity,
          badge: alertScreenings > 0 ? `${alertScreenings} Alert` : null,
          badgeAlert: alertScreenings > 0
        }
      ]
    },
    {
      title: "Produksi & Dapur Sentral",
      items: [
        {
          id: "produksi_dapur",
          label: "Penyelenggaraan Makanan",
          icon: UtensilsCrossed
        }
      ]
    },
    {
      title: "Smart Logistics Supply Chain",
      items: [
        {
          id: "logistik_gudang",
          label: "Gudang & HACCP Cold Storage",
          icon: Boxes,
          badge: fefoWarnings > 0 ? `${fefoWarnings} FEFO` : null,
          badgeAlert: false
        }
      ]
    },
    {
      title: "Distribusi & Patient Safety",
      items: [
        {
          id: "distribusi_safety",
          label: "Distribusi & Label Plato",
          icon: QrCode
        }
      ]
    },
    {
      title: "Interoperabilitas & Kepatuhan",
      items: [
        {
          id: "integrasi_simrs",
          label: "Bridging SIMRS Web Service",
          icon: Network
        },
        {
          id: "regulasi_kepatuhan",
          label: "SatuSehat & STARKES KARS",
          icon: FileCheck2
        }
      ]
    },
    {
      title: "Eksekutif & Kinerja RS",
      items: [
        {
          id: "executive_dashboard",
          label: "Executive Dashboard",
          icon: LayoutDashboard
        }
      ]
    }
  ];

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={toggleMobileSidebar}
          aria-label="Tutup Navigasi Menu"
        />
      )}
      <aside
        className={`sidebar no-print ${isMobileSidebarOpen ? "mobile-open" : ""} ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="sidebar-header">
          <div
            style={{
              display: "flex",
              justifyContent: isSidebarCollapsed ? "center" : "space-between",
              alignItems: "center"
            }}
          >
            {!isSidebarCollapsed && (
              <span className="system-tag">SIGIZI RSUD PROVINSI</span>
            )}
            <button
              className="sidebar-collapse-btn"
              onClick={toggleSidebarCollapse}
              title={isSidebarCollapsed ? "Tampilkan Sidebar Penuh (Buka Menu)" : "Persempit Sidebar (Mode Ikon Ringkas)"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            {isMobileSidebarOpen && (
              <button
                onClick={toggleMobileSidebar}
                style={{
                  background: "none",
                  border: "none",
                  color: "#cbd5e1",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                ✕
              </button>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="sidebar-user-card">
              <div className="user-card-name">{currentRole.user}</div>
              <div className="user-card-role">{currentRole.name} • {currentRole.badge}</div>
              <div style={{ fontSize: "11px", color: "#6ee7b7", marginTop: "4px" }}>
                NIP: {currentRole.nip}
              </div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              {!isSidebarCollapsed && (
                <div className="nav-section-title">{section.title}</div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const hasPermission = canAccess(item.id);

                return (
                  <div
                    key={item.id}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    style={{
                      opacity: hasPermission ? 1 : 0.65
                    }}
                    title={
                      !hasPermission
                        ? `Akses Terbatas: Bukan kewenangan ${currentRole.name}`
                        : isSidebarCollapsed
                        ? item.label
                        : undefined
                    }
                    onClick={() => {
                      setActiveTab(item.id);
                      if (isMobileSidebarOpen) toggleMobileSidebar();
                    }}
                  >
                    <Icon size={20} style={{ flexShrink: 0 }} />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                    {!isSidebarCollapsed && !hasPermission && (
                      <span
                        title="Akses Terbatas"
                        style={{
                          marginLeft: "auto",
                          display: "inline-flex",
                          alignItems: "center",
                          color: "#94a3b8"
                        }}
                      >
                        <Lock size={12} />
                      </span>
                    )}
                    {!isSidebarCollapsed && item.badge && hasPermission && (
                      <span className={`nav-item-badge ${item.badgeAlert ? "alert" : ""}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {!isSidebarCollapsed && (
          <div className="sidebar-footer">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={16} color="#10b981" />
                <span style={{ fontWeight: 700, color: "#e2e8f0" }}>STARKES 2024</span>
              </div>
              <button
                onClick={logout}
                title="Keluar / Logout"
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#fca5a5",
                  borderRadius: "6px",
                  padding: "3px 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <LogOut size={11} /> Keluar
              </button>
            </div>
            <div>SatuSehat FHIR Ready</div>
            <div style={{ opacity: 0.6, fontSize: "11px" }}>Ka. Instalasi: Vikti May Putri, S.Tr.Gz</div>
          </div>
        )}
      </aside>
    </>
  );
};
