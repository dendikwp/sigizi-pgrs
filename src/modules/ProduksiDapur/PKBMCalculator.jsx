import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Scale, FileCheck, Send, Printer, CheckCircle, Info } from "lucide-react";

export const PKBMCalculator = () => {
  const { inventory, updateInventoryStock, showToast, currentRole } = useApp();

  const [portionCount, setPortionCount] = useState(150);
  const [selectedShift, setSelectedShift] = useState("Siang");
  const [isSpbmGenerated, setIsSpbmGenerated] = useState(false);

  // Master ingredients with standard portions (gram bersih) and % BDD
  const masterIngredients = [
    {
      id: "ING-01",
      name: "Daging Ayam (Ayam Bakar / Suwir)",
      category: "Lauk Hewani",
      netPerPortionGram: 70, // 70g daging bersih
      bddPercent: 58, // BDD 58% (karkas bertulang)
      linkedInvId: "INV-WET-001"
    },
    {
      id: "ING-02",
      name: "Daging Sapi (Semur / Rendang Sehat)",
      category: "Lauk Hewani",
      netPerPortionGram: 50,
      bddPercent: 100, // Fillet daging has
      linkedInvId: "INV-WET-002"
    },
    {
      id: "ING-03",
      name: "Ikan Kakap (Panggang / Fillet Asam Manis)",
      category: "Lauk Hewani",
      netPerPortionGram: 60,
      bddPercent: 80, // Dibuang sisik/kepala
      linkedInvId: "INV-WET-003"
    },
    {
      id: "ING-04",
      name: "Telur Ayam Ras (Telur Balado / Rebus)",
      category: "Lauk Hewani",
      netPerPortionGram: 55, // 1 butir
      bddPercent: 89, // Kulit telur 11%
      linkedInvId: "INV-WET-004"
    },
    {
      id: "ING-05",
      name: "Beras Putih Ramos Premium (Nasi Putih / Tim)",
      category: "Makanan Pokok",
      netPerPortionGram: 100, // 100g beras mentah = 200g nasi matang
      bddPercent: 100,
      linkedInvId: "INV-DRY-001"
    },
    {
      id: "ING-06",
      name: "Tahu Putih Sutra (Tahu Bacem / Goreng)",
      category: "Lauk Nabati",
      netPerPortionGram: 60,
      bddPercent: 100,
      linkedInvId: "INV-WET-007"
    },
    {
      id: "ING-07",
      name: "Wortel Brastagi Segar (Sup / Sayur Bening)",
      category: "Sayuran",
      netPerPortionGram: 50,
      bddPercent: 88, // Kupas kulit 12%
      linkedInvId: "INV-WET-005"
    },
    {
      id: "ING-08",
      name: "Bayam Hijau Segar (Sayur Bening)",
      category: "Sayuran",
      netPerPortionGram: 50,
      bddPercent: 71, // Batang kasar dibuang 29%
      linkedInvId: "INV-WET-006"
    }
  ];

  // Calculate gross weight needed for each ingredient
  const calculateGrossWeightKg = (netGram, bddPercent, portions) => {
    const totalNetKg = (portions * netGram) / 1000;
    const grossKg = totalNetKg / (bddPercent / 100);
    return parseFloat(grossKg.toFixed(2));
  };

  const handleSendSPBM = () => {
    // Deduct warehouse stock or send requisition order
    masterIngredients.slice(0, 4).forEach((ing) => {
      const gross = calculateGrossWeightKg(ing.netPerPortionGram, ing.bddPercent, portionCount);
      updateInventoryStock(ing.linkedInvId, -gross, `Permintaan Dapur SPBM Shift ${selectedShift}`);
    });

    setIsSpbmGenerated(true);
    showToast(
      `Surat Permintaan Bahan Makanan (SPBM) Shift ${selectedShift} berhasil diteruskan ke Gudang!`,
      "success"
    );
  };

  return (
    <div>
      <div className="card no-print">
        <div className="card-header">
          <div className="card-title-group">
            <Scale size={18} color="var(--primary)" />
            <div>
              <h3 className="card-title">Perencanaan Kebutuhan Bahan Makanan (PKBM Cerdas)</h3>
              <p className="card-subtitle">
                Konversi otomatis porsi ke berat kotor (Gross Weight) berdasarkan faktor %BDD (Berat Dapat Dimakan)
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Shift:</span>
            <select
              className="form-select"
              style={{ width: "120px", padding: "6px 10px" }}
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Sore">Sore</option>
            </select>
          </div>
        </div>

        {/* Portions input bar */}
        <div
          style={{
            background: "#f0fdfa",
            padding: "20px 24px",
            borderRadius: "14px",
            border: "1.5px solid #ccfbf1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "24px"
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: "17px", color: "var(--primary-dark)" }}>
              Jumlah Porsi Makan yang Diproduksi Dapur:
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "3px" }}>
              Rumus Standar PGRS: <em>Berat Kotor (kg) = (Porsi × Standar Porsi Bersih [g]) / (%BDD / 100) / 1000</em>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="number"
              step="10"
              className="form-input"
              style={{ width: "140px", fontSize: "18px", fontWeight: 800, textAlign: "center", height: "48px" }}
              value={portionCount}
              onChange={(e) => setPortionCount(Math.max(1, parseInt(e.target.value) || 0))}
            />
            <span style={{ fontWeight: 800, fontSize: "16px", color: "var(--text-primary)" }}>Porsi</span>
          </div>
        </div>

        {/* Calculation Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nama Bahan Makanan</th>
                <th>Kategori</th>
                <th>Standar Bersih / Porsi</th>
                <th>Faktor %BDD</th>
                <th>Total Berat Bersih (Net)</th>
                <th>Total Berat Kotor (Gross Dibutuhkan dari Gudang)</th>
                <th>Stok Gudang Terkini</th>
              </tr>
            </thead>
            <tbody>
              {masterIngredients.map((item) => {
                const totalNetKg = ((portionCount * item.netPerPortionGram) / 1000).toFixed(2);
                const grossKg = calculateGrossWeightKg(item.netPerPortionGram, item.bddPercent, portionCount);
                const invItem = inventory.find((i) => i.id === item.linkedInvId);

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{item.category}</span>
                    </td>
                    <td>{item.netPerPortionGram} gram</td>
                    <td>
                      <span className="badge badge-primary">{item.bddPercent}%</span>
                    </td>
                    <td>{totalNetKg} kg</td>
                    <td>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: "#0d9488" }}>
                        {grossKg} kg
                      </span>
                    </td>
                    <td>
                      {invItem ? (
                        <span style={{ fontWeight: 600, color: invItem.currentStockKg < grossKg ? "#dc2626" : "#16a34a" }}>
                          {invItem.currentStockKg} kg {invItem.currentStockKg < grossKg ? "⚠️ Menipis" : "✓ Cukup"}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Cetak Formulir PKBM
          </button>
          <button className="btn btn-primary" onClick={handleSendSPBM}>
            <Send size={16} /> Terbitkan SPBM ke Petugas Gudang
          </button>
        </div>
      </div>

      {isSpbmGenerated && (
        <div className="alert-box alert-info">
          <CheckCircle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Surat Permintaan Bahan Makanan (SPBM) No. SPBM/GZ/20261012-004</strong> telah berhasil
            diterbitkan dan dikirimkan secara otomatis ke modul Logistik Gudang Basah & Kering. Stok bahan baku
            terkait telah dialokasikan untuk jadwal produksi shift {selectedShift}.
          </div>
        </div>
      )}
    </div>
  );
};
