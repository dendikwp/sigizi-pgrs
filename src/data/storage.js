// Storage Helper untuk SIGIZI PROVINSI (Client-side JSON Storage di LocalStorage)
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
} from "./initialData";

const STORAGE_KEYS = {
  ROLES: "SIGIZI_ROLES",
  CURRENT_ROLE: "SIGIZI_CURRENT_ROLE",
  PATIENTS: "SIGIZI_PATIENTS",
  CPPT: "SIGIZI_CPPT",
  MENU_CYCLE: "SIGIZI_MENU_CYCLE",
  SUBSTITUTIONS: "SIGIZI_SUBSTITUTIONS",
  INVENTORY: "SIGIZI_INVENTORY",
  HACCP: "SIGIZI_HACCP",
  SIMRS_TRX: "SIGIZI_SIMRS_TRX",
  AUDIT_LOGS: "SIGIZI_AUDIT_LOGS",
  PDP_MASKING: "SIGIZI_PDP_MASKING",
  SIDEBAR_COLLAPSED: "SIGIZI_SIDEBAR_COLLAPSED",
  ACTIVE_TAB: "SIGIZI_ACTIVE_TAB",
  IS_AUTHENTICATED: "SIGIZI_IS_AUTHENTICATED",
  THEME: "SIGIZI_THEME"
};

export const getStoredItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key ${key}:`, error);
    return defaultValue;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
};

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    setStoredItem(STORAGE_KEYS.PATIENTS, initialPatients);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CPPT)) {
    setStoredItem(STORAGE_KEYS.CPPT, initialCPPTRecords);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MENU_CYCLE)) {
    setStoredItem(STORAGE_KEYS.MENU_CYCLE, initialMenuCycle);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSTITUTIONS)) {
    setStoredItem(STORAGE_KEYS.SUBSTITUTIONS, initialFoodSubstitutions);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    setStoredItem(STORAGE_KEYS.INVENTORY, initialInventory);
  }
  if (!localStorage.getItem(STORAGE_KEYS.HACCP)) {
    setStoredItem(STORAGE_KEYS.HACCP, initialHACCPLogs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SIMRS_TRX)) {
    setStoredItem(STORAGE_KEYS.SIMRS_TRX, initialSIMRSTransactions);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE)) {
    setStoredItem(STORAGE_KEYS.CURRENT_ROLE, "dietisien");
  }
  if (localStorage.getItem(STORAGE_KEYS.PDP_MASKING) === null) {
    setStoredItem(STORAGE_KEYS.PDP_MASKING, true);
  }
};

export const exportDatabaseJSON = () => {
  const database = {
    exportedAt: new Date().toISOString(),
    system: "SIGIZI PROVINSI - RSUD Provinsi",
    version: "2.5.0-STARKES-FHIR",
    patients: getStoredItem(STORAGE_KEYS.PATIENTS, initialPatients),
    cppt: getStoredItem(STORAGE_KEYS.CPPT, initialCPPTRecords),
    menuCycle: getStoredItem(STORAGE_KEYS.MENU_CYCLE, initialMenuCycle),
    substitutions: getStoredItem(STORAGE_KEYS.SUBSTITUTIONS, initialFoodSubstitutions),
    inventory: getStoredItem(STORAGE_KEYS.INVENTORY, initialInventory),
    haccp: getStoredItem(STORAGE_KEYS.HACCP, initialHACCPLogs),
    simrsTransactions: getStoredItem(STORAGE_KEYS.SIMRS_TRX, initialSIMRSTransactions),
    auditLogs: getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs)
  };

  const jsonStr = JSON.stringify(database, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SIGIZI_RSUD_PROVINSI_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importDatabaseJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.patients && Array.isArray(data.patients)) {
      setStoredItem(STORAGE_KEYS.PATIENTS, data.patients);
    }
    if (data.cppt && Array.isArray(data.cppt)) {
      setStoredItem(STORAGE_KEYS.CPPT, data.cppt);
    }
    if (data.menuCycle && Array.isArray(data.menuCycle)) {
      setStoredItem(STORAGE_KEYS.MENU_CYCLE, data.menuCycle);
    }
    if (data.inventory && Array.isArray(data.inventory)) {
      setStoredItem(STORAGE_KEYS.INVENTORY, data.inventory);
    }
    if (data.haccp && Array.isArray(data.haccp)) {
      setStoredItem(STORAGE_KEYS.HACCP, data.haccp);
    }
    if (data.simrsTransactions && Array.isArray(data.simrsTransactions)) {
      setStoredItem(STORAGE_KEYS.SIMRS_TRX, data.simrsTransactions);
    }
    if (data.auditLogs && Array.isArray(data.auditLogs)) {
      setStoredItem(STORAGE_KEYS.AUDIT_LOGS, data.auditLogs);
    }
    return { success: true, message: "Database JSON berhasil diimpor!" };
  } catch (error) {
    return { success: false, message: "Format file JSON tidak valid: " + error.message };
  }
};

export const resetStorageToDefaults = () => {
  localStorage.clear();
  initializeStorage();
};

export const addAuditLog = (action, target, details, user, role) => {
  const currentLogs = getStoredItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  const newLog = {
    id: `AUDIT-${Date.now().toString().slice(-5)}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    user: user || "Petugas RSUD",
    role: role || "Sistem",
    action,
    target,
    details,
    pdpEncrypted: true
  };
  const updatedLogs = [newLog, ...currentLogs];
  setStoredItem(STORAGE_KEYS.AUDIT_LOGS, updatedLogs);
  return updatedLogs;
};

export { STORAGE_KEYS };
