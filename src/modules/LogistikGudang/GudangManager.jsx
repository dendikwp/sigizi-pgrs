import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Boxes,
  Snowflake,
  Sun,
  AlertTriangle,
  Plus,
  Search,
  ShieldCheck,
  Edit,
  Trash2,
  Check,
  PackagePlus,
  RefreshCw
} from "lucide-react";

export const GudangManager = () => {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateInventoryStock,
    showToast,
    currentRole
  } = useApp();

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Gudang Basah",
    storageType: "Chiller (2°C - 5°C)",
    currentStockKg: 25,
    minStockKg: 10,
    unit: "kg",
    lotNumber: `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    expiryDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    daysUntilExpiry: 14,
    supplier: "PT Pangan Segar Nusantara"
  });

  const filteredItems = inventory.filter((item) => {
    const matchCategory =
      activeCategory === "Semua" ? true : item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      category: "Gudang Basah",
      storageType: "Chiller (2°C - 5°C)",
      currentStockKg: 30,
      minStockKg: 10,
      unit: "kg",
      lotNumber: `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      daysUntilExpiry: 14,
      supplier: "PT Pangan Segar Nusantara"
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      storageType: item.storageType,
      currentStockKg: item.currentStockKg,
      minStockKg: item.minStockKg,
      unit: item.unit,
      lotNumber: item.lotNumber,
      expiryDate: item.expiryDate,
      daysUntilExpiry: item.daysUntilExpiry,
      supplier: item.supplier
    });
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama bahan baku wajib diisi!", "error");
      return;
    }
    addInventoryItem(formData);
    setShowAddModal(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama bahan baku wajib diisi!", "error");
      return;
    }
    updateInventoryItem({
      ...editingItem,
      ...formData,
      currentStockKg: parseFloat(formData.currentStockKg) || 0,
      minStockKg: parseFloat(formData.minStockKg) || 0
    });
    setEditingItem(null);
  };

  const handleDelete = (item) => {
    if (
      window.confirm(
        `Konfirmasi: Hapus item "${item.name}" (Lot: ${item.lotNumber}) dari database inventaris gudang?`
      )
    ) {
      deleteInventoryItem(item.id);
    }
  };

  return (
    <div>
      {/* Category Tabs & Controls */}
      <div className="card no-print">
        <div className="card-header">
          <div className="card-title-group">
            <Boxes size={20} color="var(--primary)" />
            <div>
              <h3 className="card-title">Manajemen Gudang Terpisah & CRUD Bahan Pangan</h3>
              <p className="card-subtitle">
                Pencatatan suhu penyimpanan, kontrol sanitasi bahan pangan, dan pelacakan batch lot
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleOpenAdd}
              style={{ gap: "6px" }}
            >
              <PackagePlus size={16} />
              <span>Tambah Bahan Baku</span>
            </button>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                className={`btn btn-sm ${activeCategory === "Semua" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveCategory("Semua")}
              >
                Semua ({inventory.length})
              </button>
              <button
                className={`btn btn-sm ${activeCategory === "Gudang Basah" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveCategory("Gudang Basah")}
              >
                <Snowflake size={14} /> Basah / Chiller
              </button>
              <button
                className={`btn btn-sm ${activeCategory === "Gudang Kering" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveCategory("Gudang Kering")}
              >
                <Sun size={14} /> Kering / Formula
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Cari nama bahan makanan atau nomor lot (cth: Daging Sapi, Beras, LOT-AYM)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nama Bahan Pangan</th>
                <th>Tipe Gudang & Suhu</th>
                <th>Sisa Stok Fisik</th>
                <th>Nomor Lot & Supplier</th>
                <th>Kedaluwarsa (FEFO)</th>
                <th>Aksi Stok Cepat</th>
                <th>Kelola (CRUD)</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      ID: {item.id} • Standar: {item.haccpTempStandard || "Suhu Standar"}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {item.category === "Gudang Basah" ? (
                        <Snowflake size={14} color="#0284c7" />
                      ) : (
                        <Sun size={14} color="#d97706" />
                      )}
                      <span style={{ fontWeight: 600 }}>{item.storageType}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "16px", fontWeight: 800 }}>
                      {item.currentStockKg} {item.unit}
                    </div>
                    {item.currentStockKg <= item.minStockKg && (
                      <span className="badge badge-danger" style={{ marginTop: "3px" }}>
                        <AlertTriangle size={10} /> Reorder (&lt; {item.minStockKg} kg)
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--primary-dark)" }}>
                      {item.lotNumber}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {item.supplier}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{item.expiryDate}</div>
                    <span
                      className={`badge ${
                        item.daysUntilExpiry <= 2
                          ? "badge-danger"
                          : item.daysUntilExpiry <= 7
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                      style={{ marginTop: "3px" }}
                    >
                      {item.daysUntilExpiry} hari lagi
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 8px", fontSize: "11px" }}
                        onClick={() => {
                          const qty = prompt(`Tambah stok masuk untuk ${item.name} (${item.unit}):`, "10");
                          if (qty && !isNaN(qty)) {
                            updateInventoryStock(item.id, parseFloat(qty), "Penerimaan Barang Supplier");
                            showToast(`Stok ${item.name} bertambah ${qty} ${item.unit}!`, "success");
                          }
                        }}
                      >
                        + Masuk
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 8px", fontSize: "11px" }}
                        onClick={() => {
                          const qty = prompt(`Pengeluaran bahan ke dapur untuk ${item.name} (${item.unit}):`, "5");
                          if (qty && !isNaN(qty)) {
                            updateInventoryStock(item.id, -parseFloat(qty), "Pengeluaran Bahan Dapur");
                            showToast(`Pengeluaran ${item.name} tercatat ${qty} ${item.unit}!`, "info");
                          }
                        }}
                      >
                        - Keluar
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Bahan Makanan (Update)"
                        style={{ padding: "6px" }}
                      >
                        <Edit size={14} color="#0284c7" />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDelete(item)}
                        title="Hapus Bahan Makanan (Delete)"
                        style={{ padding: "6px" }}
                      >
                        <Trash2 size={14} color="#dc2626" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Bahan Baku (CREATE) */}
      {showAddModal && (
        <div className="modal-overlay no-print" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <PackagePlus size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "17px", fontWeight: 800 }}>Tambah Item Bahan Baku Gudang Baru</h3>
              </div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAdd}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label className="form-label">Nama Bahan Pangan *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Contoh: Daging Sapi Has Luar Segar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Kategori Gudang</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setFormData({
                        ...formData,
                        category: cat,
                        storageType: cat === "Gudang Kering" ? "Suhu Ruang (25°C)" : "Chiller (2°C - 5°C)"
                      });
                    }}
                  >
                    <option value="Gudang Basah">Gudang Basah / Cold Storage</option>
                    <option value="Gudang Kering">Gudang Kering / Formula Medis</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tipe Penyimpanan & Suhu</label>
                  <select
                    className="form-select"
                    value={formData.storageType}
                    onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                  >
                    <option value="Chiller (2°C - 5°C)">Chiller (2°C - 5°C)</option>
                    <option value="Freezer (-18°C)">Freezer (-18°C)</option>
                    <option value="Suhu Ruang (25°C)">Suhu Ruang (20°C - 25°C)</option>
                    <option value="Khusus Formula Medis">Khusus Formula Medis Steril</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Stok Awal (kg / bungkus)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={formData.currentStockKg}
                    onChange={(e) => setFormData({ ...formData, currentStockKg: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Batas Minimum (Reorder Point)</label>
                  <input
                    type="number"
                    step="1"
                    className="form-input"
                    value={formData.minStockKg}
                    onChange={(e) => setFormData({ ...formData, minStockKg: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nomor Batch / Lot</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.lotNumber}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tanggal Kedaluwarsa (FEFO)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label className="form-label">Nama Supplier / Pemasok</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: PT Pangan Segar Nusantara"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Simpan Bahan Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Bahan Baku (UPDATE) */}
      {editingItem && (
        <div className="modal-overlay no-print" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Edit size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "17px", fontWeight: 800 }}>Edit Bahan: {editingItem.name}</h3>
              </div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                onClick={() => setEditingItem(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label className="form-label">Nama Bahan Pangan *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Stok Fisik Saat Ini (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={formData.currentStockKg}
                    onChange={(e) => setFormData({ ...formData, currentStockKg: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Batas Minimum (Reorder Point)</label>
                  <input
                    type="number"
                    step="1"
                    className="form-input"
                    value={formData.minStockKg}
                    onChange={(e) => setFormData({ ...formData, minStockKg: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nomor Lot / Batch</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.lotNumber}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tanggal Kedaluwarsa</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label className="form-label">Supplier / Pemasok</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Simpan Perubahan Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
