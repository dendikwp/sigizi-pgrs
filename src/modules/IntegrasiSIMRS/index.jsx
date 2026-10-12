import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Network, ArrowRightLeft, Send, CheckCircle2, RefreshCw, FileCode, Database, CreditCard } from "lucide-react";

export const IntegrasiSIMRSModule = () => {
  const { simrsTransactions, triggerSimrsBridge, patients, updatePatient, showToast, currentRole } = useApp();

  const [activeBridgingTab, setActiveBridgingTab] = useState("adt");

  // ADT State
  const [adtPatientName, setAdtPatientName] = useState("Tn. Kurniawan Santoso");
  const [adtNoRm, setAdtNoRm] = useState("00-58-77-21");
  const [adtWard, setAdtWard] = useState("Rawat Inap Melati Bed 08");
  const [adtAction, setAdtAction] = useState("ADMISSION");

  // CPOE State
  const [cpoePatientId, setCpoePatientId] = useState("P001");
  const [cpoeDietInstruction, setCpoeDietInstruction] = useState("Diet DM 1700 kkal + Rendah Garam II");

  // Billing State
  const [billPatientId, setBillPatientId] = useState("P002");
  const [billItem, setBillItem] = useState("Paket Konseling Gizi Spesialis RD (Klinis)");
  const [billAmount, setBillAmount] = useState(85000);

  // Console output
  const [lastPayloadView, setLastPayloadView] = useState(null);

  const handleSimulateADT = (e) => {
    e.preventDefault();
    const payload = {
      event: `ADT_${adtAction}`,
      patientName: adtPatientName,
      noRm: adtNoRm,
      ward: adtWard,
      actionTaken:
        adtAction === "ADMISSION"
          ? "Pasien baru terdaftar di bangsal. Antrean skrining gizi otomatis dibuat (<24 Jam)."
          : adtAction === "TRANSFER"
          ? "Pasien dipindahkan ke ICU Sentral. Diet disesuaikan otomatis menjadi enteral."
          : "Pasien pulang (Discharge). Pemesanan makanan dihentikan."
    };
    const trx = triggerSimrsBridge("ADT", payload);
    setLastPayloadView(trx);
  };

  const handleSimulateCPOE = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === cpoePatientId) || patients[0];
    const payload = {
      orderId: `CPOE-${Date.now().toString().slice(-5)}`,
      patientName: pat.name,
      noRm: pat.noRm,
      ward: pat.ward,
      doctor: "dr. Hendra Prasetyo, Sp.PD-KGEH",
      dietPrescription: cpoeDietInstruction,
      actionTaken: "Instruksi diet dokter DPJP diterima. Otomatis masuk daftar olah dapur & rekap shift."
    };
    const trx = triggerSimrsBridge("CPOE", payload);
    setLastPayloadView(trx);
  };

  const handleSimulateBilling = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === billPatientId) || patients[0];
    const payload = {
      invoiceNumber: `INV-GZ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      patientName: pat.name,
      noRm: pat.noRm,
      ward: pat.ward,
      chargeItem: billItem,
      totalAmountRp: billAmount,
      claimType: "Klaim BPJS Kesehatan / INA-CBG",
      actionTaken: `Tagihan Rp ${billAmount.toLocaleString("id-ID")} terkirim ke modul Kasir SIMRS Sentral.`
    };
    const trx = triggerSimrsBridge("BILLING", payload);
    setLastPayloadView(trx);
  };

  return (
    <div>
      <div className="card no-print">
        <div className="card-header">
          <div className="card-title-group">
            <Network size={20} color="var(--primary)" />
            <div>
              <h3 className="card-title">Simulator Web Services & Bridging RESTful API SIMRS</h3>
              <p className="card-subtitle">
                Interoperabilitas data pasien (ADT), instruksi dokter (CPOE), dan billing kasir/BPJS
              </p>
            </div>
          </div>
          <span className="badge badge-primary">REST API / JSON Active</span>
        </div>

        {/* Bridging Subtabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            className={`btn ${activeBridgingTab === "adt" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveBridgingTab("adt")}
          >
            1. Bridging Data Pasien (ADT)
          </button>
          <button
            className={`btn ${activeBridgingTab === "cpoe" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveBridgingTab("cpoe")}
          >
            2. Bridging Order Medis (CPOE DPJP)
          </button>
          <button
            className={`btn ${activeBridgingTab === "billing" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveBridgingTab("billing")}
          >
            3. Bridging Billing & Kasir BPJS
          </button>
        </div>

        {/* Form 1: ADT */}
        {activeBridgingTab === "adt" && (
          <form onSubmit={handleSimulateADT}>
            <div className="alert-box alert-info">
              <div>
                <strong>Fungsi Bridging ADT (Admission, Discharge, Transfer):</strong> Menangkap event pasien masuk baru dari admisi IGD/Poliklinik, perpindahan tempat tidur/kamar isolasi/ICU, dan status pemulangan pasien tanpa entri berulang.
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Tipe Event ADT:</label>
                <select
                  className="form-select"
                  value={adtAction}
                  onChange={(e) => setAdtAction(e.target.value)}
                >
                  <option value="ADMISSION">Pasien Masuk Baru (Admission Rawat Inap)</option>
                  <option value="TRANSFER">Perpindahan Bangsal (Transfer Bed / ICU)</option>
                  <option value="DISCHARGE">Pasien Pulang / Checkout (Discharge)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Pasien:</label>
                <input
                  type="text"
                  className="form-input"
                  value={adtPatientName}
                  onChange={(e) => setAdtPatientName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nomor Rekam Medis (No. RM):</label>
                <input
                  type="text"
                  className="form-input"
                  value={adtNoRm}
                  onChange={(e) => setAdtNoRm(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ruangan Rawat Inap / Bed:</label>
              <input
                type="text"
                className="form-input"
                value={adtWard}
                onChange={(e) => setAdtWard(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Simulasikan Pengiriman Webhook ADT dari SIMRS
            </button>
          </form>
        )}

        {/* Form 2: CPOE */}
        {activeBridgingTab === "cpoe" && (
          <form onSubmit={handleSimulateCPOE}>
            <div className="alert-box alert-info">
              <div>
                <strong>Fungsi Bridging CPOE (Computerized Physician Order Entry):</strong> Menangkap instruksi diet awal yang diresepkan oleh Dokter Spesialis Penanggung Jawab Pasien (DPJP) dari sistem RME utama rumah sakit langsung ke sistem dapur gizi.
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Pilih Pasien Target:</label>
                <select
                  className="form-select"
                  value={cpoePatientId}
                  onChange={(e) => setCpoePatientId(e.target.value)}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.ward}) - {p.noRm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Instruksi Diet Awal DPJP (CPOE):</label>
                <input
                  type="text"
                  className="form-input"
                  value={cpoeDietInstruction}
                  onChange={(e) => setCpoeDietInstruction(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Simulasikan Bridging Order CPOE dari DPJP
            </button>
          </form>
        )}

        {/* Form 3: Billing */}
        {activeBridgingTab === "billing" && (
          <form onSubmit={handleSimulateBilling}>
            <div className="alert-box alert-info">
              <div>
                <strong>Fungsi Bridging Billing System:</strong> Mengirimkan rincian tarif konseling gizi klinis dan biaya makan harian pasien ke modul Kasir SIMRS Sentral untuk penagihan umum atau klaim BPJS Kesehatan.
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Pilih Pasien:</label>
                <select
                  className="form-select"
                  value={billPatientId}
                  onChange={(e) => setBillPatientId(e.target.value)}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.ward} ({p.class})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Item Tagihan Pelayanan Gizi:</label>
                <select
                  className="form-select"
                  value={billItem}
                  onChange={(e) => {
                    setBillItem(e.target.value);
                    if (e.target.value.includes("Konseling")) setBillAmount(85000);
                    else if (e.target.value.includes("VIP")) setBillAmount(120000);
                    else setBillAmount(50000);
                  }}
                >
                  <option value="Paket Konseling Gizi Spesialis RD (Klinis)">Paket Konseling Gizi Spesialis RD (Klinis) - Rp 85.000</option>
                  <option value="Biaya Makan Rawat Inap VIP (3x Makan + 2x Snack)">Biaya Makan Rawat Inap VIP (3x Makan + 2x Snack) - Rp 120.000/hari</option>
                  <option value="Biaya Makan Rawat Inap Reguler (BPJS Kelas 1/2)">Biaya Makan Rawat Inap Reguler (BPJS Kelas 1/2) - Rp 50.000/hari</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nominal Tarif (Rp):</label>
                <input
                  type="number"
                  className="form-input"
                  value={billAmount}
                  onChange={(e) => setBillAmount(parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              <CreditCard size={16} /> Kirim Data Tagihan ke Kasir SIMRS Sentral
            </button>
          </form>
        )}
      </div>

      {/* JSON Payload Inspector & Log Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <FileCode size={18} color="var(--primary)" />
            <h3 className="card-title">Riwayat Transaksi Bridging & JSON Payload Debugger</h3>
          </div>
          <span className="badge badge-success">HTTP 200 OK Connection</span>
        </div>

        {/* Live Payload Viewer */}
        {lastPayloadView && (
          <div style={{ marginBottom: "16px", background: "#0f172a", color: "#38bdf8", padding: "16px", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px", overflowX: "auto" }}>
            <div style={{ color: "#94a3b8", marginBottom: "6px" }}>
              // LIVE REST API JSON RESPONSE (HTTP Status: {lastPayloadView.status})
            </div>
            <pre>{JSON.stringify(lastPayloadView, null, 2)}</pre>
          </div>
        )}

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Tipe Modul</th>
                <th>Waktu Sinkron</th>
                <th>Endpoint REST API</th>
                <th>Pasien / RM</th>
                <th>Status Respons</th>
                <th>Hasil Sinkronisasi</th>
              </tr>
            </thead>
            <tbody>
              {simrsTransactions.map((trx) => (
                <tr key={trx.id}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{trx.id}</span>
                  </td>
                  <td>
                    <span className="badge badge-primary">{trx.type}</span>
                  </td>
                  <td>{trx.time}</td>
                  <td>
                    <code style={{ fontSize: "11px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                      {trx.endpoint}
                    </code>
                  </td>
                  <td>
                    <strong>{trx.patientName}</strong> ({trx.noRm})
                  </td>
                  <td>
                    <span className="badge badge-success">{trx.status}</span>
                  </td>
                  <td style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {trx.actionTaken}
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
