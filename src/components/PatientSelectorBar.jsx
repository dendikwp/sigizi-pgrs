import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  User,
  AlertTriangle,
  ShieldCheck,
  Heart,
  Stethoscope,
  Building,
  Scale,
  Sparkles,
  UserPlus,
  Edit3,
  UserMinus,
  Check,
  X
} from "lucide-react";

export const PatientSelectorBar = () => {
  const {
    patients,
    selectedPatient,
    setSelectedPatientId,
    addPatient,
    updatePatient,
    deletePatient,
    pdpMasking,
    currentRole,
    showToast
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    noRm: "",
    gender: "Laki-laki",
    age: 35,
    ward: "Rawat Inap Melati (Penyakit Dalam)",
    bed: "Bed 06",
    dpjp: "dr. Hendra Prasetyo, Sp.PD-KGEH",
    diagnosisMedis: "",
    bb: 60,
    tb: 165,
    allergies: "Tidak Ada",
    dietType: "Diet Biasa",
    screeningAlert: false
  });

  // Open add modal
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      noRm: `01-24-${Math.floor(10 + Math.random() * 90)}-${Math.floor(10 + Math.random() * 90)}`,
      gender: "Laki-laki",
      age: 40,
      ward: "Rawat Inap Melati (Penyakit Dalam)",
      bed: "Bed 08",
      dpjp: "dr. Hendra Prasetyo, Sp.PD-KGEH",
      diagnosisMedis: "Dispepsia & Observasi Klinis",
      bb: 62,
      tb: 165,
      allergies: "Tidak Ada",
      dietType: "Diet Lunak Rendah Serat",
      screeningAlert: false
    });
    setShowAddModal(true);
  };

  // Open edit modal
  const handleOpenEdit = () => {
    setFormData({
      name: selectedPatient.name || "",
      noRm: selectedPatient.noRm || "",
      gender: selectedPatient.gender || "Laki-laki",
      age: selectedPatient.age || 35,
      ward: selectedPatient.ward || "Rawat Inap Melati (Penyakit Dalam)",
      bed: selectedPatient.bed || "Bed 01",
      dpjp: selectedPatient.dpjp || "dr. Hendra Prasetyo, Sp.PD-KGEH",
      diagnosisMedis: selectedPatient.diagnosisMedis || "",
      bb: selectedPatient.bb || 60,
      tb: selectedPatient.tb || 165,
      allergies: (selectedPatient.allergies || []).join(", "),
      dietType: selectedPatient.dietType || "Diet Biasa",
      screeningAlert: Boolean(selectedPatient.screeningAlert)
    });
    setShowEditModal(true);
  };

  // Submit Add
  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama pasien wajib diisi!", "error");
      return;
    }
    const allergyList = formData.allergies
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    addPatient({
      ...formData,
      allergies: allergyList.length ? allergyList : ["Tidak Ada"]
    });
    setShowAddModal(false);
  };

  // Submit Edit
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama pasien wajib diisi!", "error");
      return;
    }
    const allergyList = formData.allergies
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const weight = parseFloat(formData.bb) || 60;
    const height = parseFloat(formData.tb) || 165;
    const imtVal = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));

    updatePatient({
      ...selectedPatient,
      ...formData,
      bb: weight,
      tb: height,
      imt: imtVal,
      allergies: allergyList.length ? allergyList : ["Tidak Ada"],
      screeningStatus: formData.screeningAlert ? "Perlu Asuhan Gizi (<24 Jam)" : "Risiko Rendah"
    });
    setShowEditModal(false);
  };

  // Handle Delete
  const handleDeleteCurrent = () => {
    if (
      window.confirm(
        `Konfirmasi: Pulangkan / hapus pasien ${selectedPatient.name} (${selectedPatient.noRm}) dari daftar rawat inap aktif?`
      )
    ) {
      deletePatient(selectedPatient.id);
    }
  };

  // Helper UU PDP masking
  const maskRm = (rm) => {
    if (!pdpMasking || !rm) return rm;
    const parts = rm.split("-");
    if (parts.length === 4) {
      return `${parts[0]}-${parts[1]}-**-${parts[3]}`;
    }
    return rm;
  };

  const hasAllergy = selectedPatient.allergies && selectedPatient.allergies[0] !== "Tidak Ada";

  return (
    <>
      <div className="patient-quick-bar no-print">
        <div className="patient-info-summary">
          <div className="patient-avatar">
            {selectedPatient.gender === "Laki-laki" ? "Tn" : selectedPatient.age < 12 ? "An" : "Ny"}
          </div>
          <div className="patient-meta">
            <div className="patient-name-title">
              <span>{selectedPatient.name}</span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>
                ({selectedPatient.age} th • {selectedPatient.gender})
              </span>
              <span className="badge badge-primary" style={{ fontSize: "13px" }}>
                No. RM: {maskRm(selectedPatient.noRm)}
              </span>
              {selectedPatient.screeningAlert && (
                <span className="badge badge-danger" style={{ fontSize: "13px" }}>
                  <AlertTriangle size={14} />
                  Asuhan &lt;24 Jam: {selectedPatient.screeningStatus}
                </span>
              )}
            </div>

            <div className="patient-tags">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Building size={15} color="var(--primary)" />
                <strong>Ruangan:</strong> {selectedPatient.ward} ({selectedPatient.bed})
              </span>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Stethoscope size={15} color="var(--primary)" />
                <strong>DPJP:</strong> {selectedPatient.dpjp}
              </span>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Scale size={15} color="var(--primary)" />
                <strong>Antropometri:</strong> {selectedPatient.bb} kg / {selectedPatient.tb} cm (IMT {selectedPatient.imt})
              </span>
              <span>•</span>
              <span>
                <strong>Alergi:</strong>{" "}
                {hasAllergy ? (
                  <span style={{ color: "#dc2626", fontWeight: 800, background: "#fee2e2", padding: "2px 8px", borderRadius: "4px" }}>
                    ⚠️ {selectedPatient.allergies.join(", ")}
                  </span>
                ) : (
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>✓ Tidak Ada</span>
                )}
              </span>
            </div>

            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              <strong>Diagnosis Medis:</strong> <em>{selectedPatient.diagnosisMedis}</em>
              <span style={{ marginLeft: "14px" }}>
                <strong>Diet Aktif:</strong> <span style={{ color: "var(--primary-dark)", fontWeight: 700 }}>{selectedPatient.dietType}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Select Dropdown & CRUD Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div>
            <select
              className="form-select"
              style={{
                minWidth: "240px",
                fontSize: "14px",
                fontWeight: 700,
                padding: "8px 12px",
                borderColor: "var(--primary)",
                height: "42px"
              }}
              value={selectedPatient.id}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.ward.split("(")[0]} ({maskRm(p.noRm)}) {p.screeningAlert ? "⚠️" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* CRUD Buttons */}
          <button
            className="btn btn-primary btn-sm"
            onClick={handleOpenAdd}
            title="Tambah Pasien Rawat Inap Baru (Create)"
            style={{ height: "42px", gap: "6px" }}
          >
            <UserPlus size={16} />
            <span>Tambah Pasien</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleOpenEdit}
            title="Edit Data Pasien Terpilih (Update)"
            style={{ height: "42px", gap: "6px" }}
          >
            <Edit3 size={16} />
            <span>Edit Pasien</span>
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={handleDeleteCurrent}
            title="Pulangkan / Hapus Pasien dari Rawat Inap (Delete)"
            style={{ height: "42px", gap: "6px" }}
          >
            <UserMinus size={16} />
            <span>Pasien Pulang</span>
          </button>
        </div>
      </div>

      {/* Modal: Tambah Pasien Baru (CREATE) */}
      {showAddModal && (
        <div className="modal-overlay no-print" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <UserPlus size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "17px", fontWeight: 800 }}>Tambah Pasien Baru (Admisi Ranap)</h3>
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
                  <label className="form-label">Nama Lengkap Pasien *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Contoh: Tn. Bambang Irawan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nomor Rekam Medis (No. RM)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.noRm}
                    onChange={(e) => setFormData({ ...formData, noRm: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Usia (Tahun)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ruangan Perawatan</label>
                  <select
                    className="form-select"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  >
                    <option value="Rawat Inap Melati (Penyakit Dalam)">Melati (Penyakit Dalam)</option>
                    <option value="Mawar (Bedah Umum & Digestif)">Mawar (Bedah Umum)</option>
                    <option value="Anggrek (Jantung & VIP)">Anggrek (Jantung & VIP)</option>
                    <option value="Kenanga (Pediatrik / Anak)">Kenanga (Pediatrik/Anak)</option>
                    <option value="ICU Sentral (Nutrisi Enteral)">ICU Sentral</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nomor Bed</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Bed 05"
                    value={formData.bed}
                    onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Dokter DPJP</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.dpjp}
                    onChange={(e) => setFormData({ ...formData, dpjp: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label className="form-label">Diagnosis Medis</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Diabetes Melitus Tipe 2 + Ulkus Diabetikum"
                    value={formData.diagnosisMedis}
                    onChange={(e) => setFormData({ ...formData, diagnosisMedis: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={formData.bb}
                    onChange={(e) => setFormData({ ...formData, bb: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.tb}
                    onChange={(e) => setFormData({ ...formData, tb: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Riwayat Alergi (Pisahkan koma)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Udang, Telur"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preskripsi Diet Awal</label>
                  <select
                    className="form-select"
                    value={formData.dietType}
                    onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                  >
                    <option value="Diet Biasa">Diet Biasa (Nasi Pulen)</option>
                    <option value="Diet Lunak Rendah Serat">Diet Lunak Rendah Serat</option>
                    <option value="Diet Diabetes Melitus (DM 1700 kkal)">Diet Diabetes Melitus</option>
                    <option value="Diet Jantung & Rendah Garam">Diet Jantung & Rendah Garam</option>
                    <option value="Diet Rendah Protein (GGK)">Diet Rendah Protein (GGK)</option>
                    <option value="Diet Cair Sonde Enteral">Diet Cair Sonde Enteral (ICU)</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
                    <input
                      type="checkbox"
                      checked={formData.screeningAlert}
                      onChange={(e) => setFormData({ ...formData, screeningAlert: e.target.checked })}
                    />
                    <span style={{ fontWeight: 700, color: formData.screeningAlert ? "#dc2626" : "inherit" }}>
                      ⚠️ Tetapkan Alert Asuhan Gizi Segera (&lt; 24 Jam) - Risiko Malnutrisi Tinggi
                    </span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Simpan Pasien Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Data Pasien (UPDATE) */}
      {showEditModal && (
        <div className="modal-overlay no-print" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Edit3 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "17px", fontWeight: 800 }}>Edit Data Pasien: {selectedPatient.name}</h3>
              </div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label className="form-label">Nama Lengkap Pasien *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nomor Rekam Medis (No. RM)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.noRm}
                    onChange={(e) => setFormData({ ...formData, noRm: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Usia (Tahun)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ruangan</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Bed</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bed}
                    onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label className="form-label">Diagnosis Medis</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.diagnosisMedis}
                    onChange={(e) => setFormData({ ...formData, diagnosisMedis: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={formData.bb}
                    onChange={(e) => setFormData({ ...formData, bb: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.tb}
                    onChange={(e) => setFormData({ ...formData, tb: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Alergi Makanan</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Diet Terjadwal</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.dietType}
                    onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
                    <input
                      type="checkbox"
                      checked={formData.screeningAlert}
                      onChange={(e) => setFormData({ ...formData, screeningAlert: e.target.checked })}
                    />
                    <span style={{ fontWeight: 700, color: formData.screeningAlert ? "#dc2626" : "inherit" }}>
                      ⚠️ Status Alert Asuhan Gizi Segera (&lt; 24 Jam)
                    </span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Simpan Perubahan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
