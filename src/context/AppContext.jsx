import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialRoles,
  initialPatients,
  initialCPPTRecords,
  initialMenuCycle,
  initialFoodSubstitutions,
  initialInventory,
  initialHACCPLogs,
  initialSIMRSTransactions,
  initialAuditLogs,
  initialStarkesMetrics
} from "../data/initialData";
import {
  getStoredItem,
  setStoredItem,
  initializeStorage,
  exportDatabaseJSON,
  importDatabaseJSON,
  resetStorageToDefaults,
  addAuditLog,
  STORAGE_KEYS
} from "../data/storage";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Initialize storage on first mount
  useEffect(() => {
    initializeStorage();
  }, []);

  const [roles] = useState(() => {
    // Ensure Ka. Instalasi is always Vikti May Putri
    return initialRoles.map((r) =>
      r.id === "kepala_gizi"
        ? {
            ...r,
            user: "Vikti May Putri, S.Tr.Gz",
            badge: "Ka. Instalasi Gizi"
          }
        : r
    );
  });

  const [currentRoleId, setCurrentRoleId] = useState(() =>
    getStoredItem(STORAGE_KEYS.CURRENT_ROLE, "kepala_gizi")
  );
  const currentRole = roles.find((r) => r.id === currentRoleId) || roles[3];

  // Auth / Login Session
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    getStoredItem(STORAGE_KEYS.IS_AUTHENTICATED, true)
  );

  const login = (roleId) => {
    setCurrentRoleId(roleId);
    setStoredItem(STORAGE_KEYS.CURRENT_ROLE, roleId);
    setIsAuthenticated(true);
    setStoredItem(STORAGE_KEYS.IS_AUTHENTICATED, true);
    const r = roles.find((item) => item.id === roleId);
    addAuditLog("USER_LOGIN", r?.user, `Login berhasil sebagai ${r?.name}`, r?.user, r?.name);
    showToast(`Selamat datang, ${r?.user}! Anda masuk sebagai ${r?.name}.`, "success");
  };

  const logout = () => {
    addAuditLog("USER_LOGOUT", currentRole.user, "Logout dari SIGIZI RSUD Provinsi", currentRole.user, currentRole.name);
    setIsAuthenticated(false);
    setStoredItem(STORAGE_KEYS.IS_AUTHENTICATED, false);
    showToast("Anda telah keluar dari SIGIZI RSUD Provinsi.");
  };

  // RBAC Permission Mapping
  const ROLE_PERMISSIONS = {
    dokter: ["asuhan_gizi", "integrasi_simrs", "regulasi_kepatuhan"],
    dietisien: ["asuhan_gizi", "produksi_dapur", "distribusi_safety", "integrasi_simrs", "regulasi_kepatuhan"],
    perawat: ["asuhan_gizi", "distribusi_safety"],
    kepala_gizi: ["asuhan_gizi", "produksi_dapur", "logistik_gudang", "distribusi_safety", "integrasi_simrs", "regulasi_kepatuhan", "executive_dashboard"],
    produksi_dapur: ["produksi_dapur", "distribusi_safety", "logistik_gudang"],
    logistik_gudang: ["logistik_gudang", "produksi_dapur"],
    direksi: ["executive_dashboard", "regulasi_kepatuhan", "integrasi_simrs"]
  };

  const canAccess = (moduleKey) => {
    if (currentRole.id === "kepala_gizi") return true;
    const allowed = ROLE_PERMISSIONS[currentRole.id] || [];
    return allowed.includes(moduleKey);
  };

  // Patients (Ranap)
  const [patients, setPatients] = useState(() =>
    getStoredItem(STORAGE_KEYS.PATIENTS, initialPatients)
  );
  const [selectedPatientId, setSelectedPatientId] = useState("P001");
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0] || {};

  // CPPT Records
  const [cpptRecords, setCpptRecords] = useState(() =>
    getStoredItem(STORAGE_KEYS.CPPT, initialCPPTRecords)
  );

  // Menu Cycle
  const [menuCycle, setMenuCycle] = useState(() =>
    getStoredItem(STORAGE_KEYS.MENU_CYCLE, initialMenuCycle)
  );

  const [substitutions, setSubstitutions] = useState(() =>
    getStoredItem(STORAGE_KEYS.SUBSTITUTIONS, initialFoodSubstitutions)
  );

  // Logistics & Inventory
  const [inventory, setInventory] = useState(() =>
    getStoredItem(STORAGE_KEYS.INVENTORY, initialInventory)
  );

  const [haccpLogs, setHaccpLogs] = useState(() =>
    getStoredItem(STORAGE_KEYS.HACCP, initialHACCPLogs)
  );

  // SIMRS Transactions
  const [simrsTransactions, setSimrsTransactions] = useState(() =>
    getStoredItem(STORAGE_KEYS.SIMRS_TRX, initialSIMRSTransactions)
  );

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(() =>
    getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs)
  );

  const [starkesMetrics, setStarkesMetrics] = useState(initialStarkesMetrics);

  const [pdpMasking, setPdpMasking] = useState(() =>
    getStoredItem(STORAGE_KEYS.PDP_MASKING, true)
  );

  const [activeTab, setActiveTabState] = useState(() =>
    getStoredItem(STORAGE_KEYS.ACTIVE_TAB, "asuhan_gizi")
  );

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setStoredItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  };

  const [toastMessage, setToastMessage] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    getStoredItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, false)
  );

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      setStoredItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, next);
      return next;
    });
  };

  const switchRole = (roleId) => {
    setCurrentRoleId(roleId);
    setStoredItem(STORAGE_KEYS.CURRENT_ROLE, roleId);
    const newRole = roles.find((r) => r.id === roleId);
    addAuditLog("SWITCH_ROLE", "Aplikasi", `Beralih ke peran ${newRole?.name}`, newRole?.user, newRole?.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast(`Beralih ke peran: ${newRole?.name}`);
  };

  const togglePdpMasking = () => {
    const newVal = !pdpMasking;
    setPdpMasking(newVal);
    setStoredItem(STORAGE_KEYS.PDP_MASKING, newVal);
    showToast(newVal ? "Proteksi UU PDP diaktifkan: Data sensitif disamarkan" : "Proteksi UU PDP dinonaktifkan: Menampilkan data lengkap medis");
  };

  const showToast = (msg, type = "info") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ==================== CRUD PATIENT ====================
  const addPatient = (patientData) => {
    const newId = `P00${patients.length + 1}`;
    const weight = parseFloat(patientData.bb) || 60;
    const height = parseFloat(patientData.tb) || 165;
    const imtVal = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));

    const newPatient = {
      id: newId,
      noRm: patientData.noRm || `01-24-${Math.floor(10 + Math.random() * 90)}-${Math.floor(10 + Math.random() * 90)}`,
      nik: patientData.nik || "330101" + Math.floor(1000000000 + Math.random() * 9000000000),
      name: patientData.name,
      gender: patientData.gender || "Laki-laki",
      age: parseInt(patientData.age) || 35,
      ward: patientData.ward || "Rawat Inap Melati (Penyakit Dalam)",
      bed: patientData.bed || "Bed 05",
      dpjp: patientData.dpjp || "dr. Hendra Prasetyo, Sp.PD-KGEH",
      dietisien: "Vikti May Putri, S.Tr.Gz",
      admitDate: patientData.admitDate || new Date().toISOString().slice(0, 10),
      diagnosisMedis: patientData.diagnosisMedis || "Observasi Klinis",
      dietType: patientData.dietType || "Diet Biasa",
      allergies: patientData.allergies?.length ? patientData.allergies : ["Tidak Ada"],
      bb: weight,
      tb: height,
      imt: imtVal,
      screeningAlert: Boolean(patientData.screeningAlert),
      screeningScore: patientData.screeningScore || 1,
      screeningStatus: patientData.screeningAlert ? "Perlu Asuhan Gizi (<24 Jam)" : "Risiko Rendah",
      statusGizi: imtVal < 18.5 ? "Gizi Kurang" : imtVal > 25 ? "Kelebihan BB" : "Gizi Baik",
      platoStatus: "Belum Distribusi"
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);
    setStoredItem(STORAGE_KEYS.PATIENTS, updated);
    setSelectedPatientId(newId);
    addAuditLog("CREATE_PATIENT", newPatient.name, `Admisi Ranap Baru di ${newPatient.ward} (${newPatient.noRm})`, currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast(`Pasien baru ${newPatient.name} berhasil ditambahkan!`, "success");
    return newPatient;
  };

  const updatePatient = (updated) => {
    const updatedList = patients.map((p) => (p.id === updated.id ? updated : p));
    setPatients(updatedList);
    setStoredItem(STORAGE_KEYS.PATIENTS, updatedList);
    addAuditLog("UPDATE_PATIENT_CARE", `${updated.name} (${updated.noRm})`, "Pembaruan data asuhan gizi / diet pasien", currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast(`Data pasien ${updated.name} berhasil diperbarui!`, "success");
  };

  const deletePatient = (patientId) => {
    const target = patients.find((p) => p.id === patientId);
    const filtered = patients.filter((p) => p.id !== patientId);
    setPatients(filtered);
    setStoredItem(STORAGE_KEYS.PATIENTS, filtered);
    if (selectedPatientId === patientId && filtered.length > 0) {
      setSelectedPatientId(filtered[0].id);
    }
    addAuditLog("DISCHARGE_PATIENT", target?.name || patientId, "Pasien Pulang / Discharge dari Rawat Inap", currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast(`Pasien ${target?.name} berhasil dipulangkan / dihapus dari rawat inap.`, "info");
  };

  // ==================== CRUD CPPT ====================
  const addCPPT = (newRecord) => {
    const recordWithId = {
      ...newRecord,
      id: newRecord.id || `CPPT-${Date.now().toString().slice(-4)}`,
      date: newRecord.date || new Date().toISOString().replace("T", " ").slice(0, 16),
      profession: currentRole.badge,
      officer: currentRole.user
    };
    const updatedCPPT = [recordWithId, ...cpptRecords];
    setCpptRecords(updatedCPPT);
    setStoredItem(STORAGE_KEYS.CPPT, updatedCPPT);
    addAuditLog("CREATE_CPPT", `Pasien ID ${recordWithId.patientId}`, "Input CPPT Baru (Format ADIME/SOAP)", currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast("Formulir CPPT berhasil disimpan dan tersinkronisasi!", "success");
  };

  const signCPPT = (cpptId) => {
    const updatedCPPT = cpptRecords.map((c) => {
      if (c.id === cpptId) {
        return {
          ...c,
          isSigned: true,
          signatureDate: new Date().toISOString().replace("T", " ").slice(0, 16),
          signatureHash: `SIG-${currentRole.id.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}-STARKES-VERIFIED`,
          dpjpApproval: currentRole.id === "dokter" ? `Verified by ${currentRole.user}` : c.dpjpApproval
        };
      }
      return c;
    });
    setCpptRecords(updatedCPPT);
    setStoredItem(STORAGE_KEYS.CPPT, updatedCPPT);
    addAuditLog("SIGN_CPPT", `CPPT Record ${cpptId}`, `Tanda tangan digital oleh ${currentRole.user}`, currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast("Dokumen CPPT berhasil ditandatangani secara digital!", "success");
  };

  const deleteCPPT = (cpptId) => {
    const filtered = cpptRecords.filter((c) => c.id !== cpptId);
    setCpptRecords(filtered);
    setStoredItem(STORAGE_KEYS.CPPT, filtered);
    addAuditLog("DELETE_CPPT", cpptId, "Penghapusan catatan CPPT", currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast("Catatan CPPT berhasil dihapus.", "info");
  };

  // ==================== CRUD INVENTORY ====================
  const addInventoryItem = (itemData) => {
    const isDry = itemData.category === "Gudang Kering";
    const newId = `INV-${isDry ? "DRY" : "WET"}-${Date.now().toString().slice(-4)}`;
    const newItem = {
      id: newId,
      name: itemData.name,
      category: itemData.category || "Gudang Kering",
      storageType: itemData.storageType || (isDry ? "Suhu Ruang (25°C)" : "Chiller (2°C - 5°C)"),
      currentStockKg: parseFloat(itemData.currentStockKg) || 0,
      minStockKg: parseFloat(itemData.minStockKg) || 10,
      unit: itemData.unit || "kg",
      lotNumber: itemData.lotNumber || `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: itemData.expiryDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      daysUntilExpiry: parseInt(itemData.daysUntilExpiry) || 30,
      haccpTempStandard: itemData.haccpTempStandard || (isDry ? "Suhu Ruang 20-25°C" : "Chiller 2-5°C"),
      supplier: itemData.supplier || "Distributor Pangan RSUD",
      status: "Aman FEFO"
    };
    const updated = [newItem, ...inventory];
    setInventory(updated);
    setStoredItem(STORAGE_KEYS.INVENTORY, updated);
    addAuditLog("ADD_INVENTORY", newItem.name, `Penambahan item bahan ${newItem.name} (${newItem.currentStockKg} ${newItem.unit})`, currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast(`Bahan baku ${newItem.name} berhasil ditambahkan ke gudang!`, "success");
    return newItem;
  };

  const updateInventoryItem = (updatedData) => {
    const updated = inventory.map((item) => (item.id === updatedData.id ? { ...item, ...updatedData } : item));
    setInventory(updated);
    setStoredItem(STORAGE_KEYS.INVENTORY, updated);
    addAuditLog("UPDATE_INVENTORY", updatedData.name, `Pembaruan data stok/lot ${updatedData.name}`, currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast(`Data bahan ${updatedData.name} berhasil diperbarui!`, "success");
  };

  const deleteInventoryItem = (itemId) => {
    const target = inventory.find((i) => i.id === itemId);
    const filtered = inventory.filter((i) => i.id !== itemId);
    setInventory(filtered);
    setStoredItem(STORAGE_KEYS.INVENTORY, filtered);
    addAuditLog("DELETE_INVENTORY", target?.name || itemId, `Penghapusan item bahan baku dari inventaris gudang`, currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast(`Item ${target?.name} berhasil dihapus dari inventaris.`, "info");
  };

  const updateInventoryStock = (invId, changeQty, reason = "Pengeluaran Bahan Dapur") => {
    const updated = inventory.map((item) => {
      if (item.id === invId) {
        const newStock = Math.max(0, item.currentStockKg + changeQty);
        return { ...item, currentStockKg: parseFloat(newStock.toFixed(2)) };
      }
      return item;
    });
    setInventory(updated);
    setStoredItem(STORAGE_KEYS.INVENTORY, updated);
    addAuditLog("STOCK_TRANSACTION", `Item ID ${invId}`, `${reason}: perubahan ${changeQty > 0 ? "+" : ""}${changeQty} kg`, currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
  };

  // ==================== CRUD HACCP ====================
  const addHaccpEntry = (logData) => {
    const newLog = {
      id: `HACCP-LOG-${Date.now().toString().slice(-4)}`,
      ...logData,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      officer: currentRole.user
    };
    const updated = [newLog, ...haccpLogs];
    setHaccpLogs(updated);
    setStoredItem(STORAGE_KEYS.HACCP, updated);
    addAuditLog("HACCP_LOGGING", logData.pointName, `Pencatatan suhu ${logData.measuredTemp}°C, status: ${logData.status}`, currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast("Pencatatan HACCP berhasil disimpan!", "success");
  };

  const deleteHaccpEntry = (logId) => {
    const filtered = haccpLogs.filter((l) => l.id !== logId);
    setHaccpLogs(filtered);
    setStoredItem(STORAGE_KEYS.HACCP, filtered);
    showToast("Log HACCP berhasil dihapus.", "info");
  };

  // ==================== SIMRS BRIDGING ====================
  const triggerSimrsBridge = (type, payload) => {
    const newTrx = {
      id: `TRX-${type.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-3)}`,
      type,
      time: new Date().toISOString().replace("T", " ").slice(0, 19),
      endpoint: `/api/v1/simrs/${type.toLowerCase()}/sync`,
      status: "200 OK (Simulated REST API)",
      source: "SIGIZI Clinical Web Service",
      patientName: payload.patientName || "Sistem Gizi",
      noRm: payload.noRm || "00-00-00-00",
      ward: payload.ward || "Dapur Sentral",
      actionTaken: payload.actionTaken || "Sinkronisasi Berhasil",
      payload
    };
    const updated = [newTrx, ...simrsTransactions];
    setSimrsTransactions(updated);
    setStoredItem(STORAGE_KEYS.SIMRS_TRX, updated);
    addAuditLog("SIMRS_BRIDGING", type, `Bridging ${type} berhasil ke SIMRS`, currentRole.user, currentRole.name);
    setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
    showToast(`Bridging ${type} ke SIMRS berhasil! Payload tersinkron.`, "success");
    return newTrx;
  };

  // ==================== SYSTEM BACKUP / RESET ====================
  const resetAllData = () => {
    resetStorageToDefaults();
    setPatients(initialPatients);
    setCpptRecords(initialCPPTRecords);
    setMenuCycle(initialMenuCycle);
    setSubstitutions(initialFoodSubstitutions);
    setInventory(initialInventory);
    setHaccpLogs(initialHACCPLogs);
    setSimrsTransactions(initialSIMRSTransactions);
    setAuditLogs(initialAuditLogs);
    showToast("Database berhasil direset ke data default RSUD Provinsi!", "success");
  };

  const exportAllData = () => {
    exportDatabaseJSON();
    showToast("File backup JSON berhasil diunduh!", "success");
  };

  const importData = (jsonStr) => {
    const res = importDatabaseJSON(jsonStr);
    if (res.success) {
      setPatients(getStoredItem(STORAGE_KEYS.PATIENTS, initialPatients));
      setCpptRecords(getStoredItem(STORAGE_KEYS.CPPT, initialCPPTRecords));
      setMenuCycle(getStoredItem(STORAGE_KEYS.MENU_CYCLE, initialMenuCycle));
      setInventory(getStoredItem(STORAGE_KEYS.INVENTORY, initialInventory));
      setHaccpLogs(getStoredItem(STORAGE_KEYS.HACCP, initialHACCPLogs));
      setSimrsTransactions(getStoredItem(STORAGE_KEYS.SIMRS_TRX, initialSIMRSTransactions));
      setAuditLogs(getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs));
      showToast(res.message, "success");
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <AppContext.Provider
      value={{
        roles,
        currentRole,
        switchRole,
        isAuthenticated,
        login,
        logout,
        canAccess,
        patients,
        selectedPatient,
        setSelectedPatientId,
        addPatient,
        updatePatient,
        deletePatient,
        cpptRecords,
        addCPPT,
        signCPPT,
        deleteCPPT,
        menuCycle,
        setMenuCycle,
        substitutions,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        updateInventoryStock,
        haccpLogs,
        addHaccpEntry,
        deleteHaccpEntry,
        simrsTransactions,
        triggerSimrsBridge,
        auditLogs,
        starkesMetrics,
        pdpMasking,
        togglePdpMasking,
        activeTab,
        setActiveTab,
        toastMessage,
        showToast,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        isSidebarCollapsed,
        toggleSidebarCollapse,
        resetAllData,
        exportAllData,
        importData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
