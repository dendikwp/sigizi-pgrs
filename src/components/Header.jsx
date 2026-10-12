import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Shield,
  ShieldAlert,
  Download,
  Upload,
  RotateCcw,
  Bell,
  Building2,
  Lock,
  Unlock,
  UserCheck,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  LogOut
} from "lucide-react";

export const Header = () => {
  const {
    currentRole,
    roles,
    switchRole,
    logout,
    pdpMasking,
    togglePdpMasking,
    patients,
    exportAllData,
    importData,
    resetAllData,
    toggleMobileSidebar,
    isSidebarCollapsed,
    toggleSidebarCollapse
  } = useApp();

  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const pendingScreenings = patients.filter((p) => p.screeningAlert).length;

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    importData(importJsonText);
    setShowImportModal(false);
    setImportJsonText("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importData(event.target.result);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <header className="top-header no-print">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileSidebar}
            aria-label="Buka Navigasi Menu"
          >
            <Menu size={22} />
          </button>

          <button
            className={`desktop-sidebar-toggle ${isSidebarCollapsed ? "active" : ""}`}
            onClick={toggleSidebarCollapse}
            title={isSidebarCollapsed ? "Tampilkan Sidebar Penuh (Buka Menu Lengkap)" : "Kecilkan Sidebar (Mode Ikon Ringkas)"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            <span>{isSidebarCollapsed ? "Buka Sidebar Penuh" : "Kecilkan Sidebar"}</span>
          </button>

          <button
            className={`desktop-sidebar-toggle ${isFullscreen ? "active" : ""}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh (Widescreen)"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            <span>{isFullscreen ? "Normal" : "Layar Penuh"}</span>
          </button>

          <div className="hospital-brand">
            <div className="hospital-logo">
              <Building2 size={26} />
            </div>
            <div className="hospital-titles">
              <h1>RSUD PROVINSI</h1>
              <p>Sistem Informasi Manajemen Gizi Terpadu (SIGIZI - PGRS)</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* UU PDP Masking Toggle */}
          <button
            className="pdp-pill"
            onClick={togglePdpMasking}
            title="Sesuai UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)"
          >
            {pdpMasking ? <Lock size={14} /> : <Unlock size={14} color="#dc2626" />}
            <span>UU PDP: {pdpMasking ? "Data Masked (Aman)" : "Buka Masking"}</span>
          </button>

          {/* Quick Database Backup / Restore */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={exportAllData}
              title="Unduh Backup Database Client JSON"
            >
              <Download size={14} />
              <span>Ekspor JSON</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowImportModal(true)}
              title="Impor Database dari File JSON"
            >
              <Upload size={14} />
              <span>Impor JSON</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (window.confirm("Apakah Anda yakin ingin mereset database ke data awal bawaan RSUD Provinsi?")) {
                  resetAllData();
                }
              }}
              title="Reset ke Data Bawaan"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Notification Indicator */}
          {pendingScreenings > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#fef2f2",
                color: "#991b1b",
                padding: "6px 12px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "700",
                border: "1px solid #fecaca"
              }}
              title={`${pendingScreenings} pasien kritis membutuhkan asuhan gizi <24 jam`}
            >
              <Bell size={14} className="alert" />
              <span>{pendingScreenings} Alert Asuhan &lt;24 Jam</span>
            </div>
          )}

          {/* Role Switcher Pill */}
          <div className="role-switcher-container">
            <span className="role-badge-label">
              <UserCheck size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              Role:
            </span>
            <select
              className="role-select"
              value={currentRole.id}
              onChange={(e) => switchRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - {r.user.split(",")[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Logout Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={logout}
            title="Keluar dari Sistem (Halaman Login)"
            style={{
              color: "#dc2626",
              borderColor: "#fecaca",
              background: "#fff5f5",
              fontWeight: 700,
              gap: "6px",
              height: "40px"
            }}
          >
            <LogOut size={15} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Modal Import JSON */}
      {showImportModal && (
        <div className="modal-overlay no-print" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Impor Database Client JSON</h3>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                onClick={() => setShowImportModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleImportSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                  Unggah file JSON cadangan atau tempelkan teks format JSON untuk memulihkan seluruh dataset
                  pasien, rekam CPPT, inventori, HACCP, dan log audit.
                </p>

                <div className="form-group">
                  <label className="form-label">Pilih File JSON (.json):</label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Atau Tempelkan JSON String:</label>
                  <textarea
                    rows={6}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"patients": [...], "cppt": [...]}'
                    className="form-textarea"
                    style={{ fontFamily: "monospace", fontSize: "11px" }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowImportModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Impor Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
