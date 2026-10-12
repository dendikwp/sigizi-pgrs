import React, { useState } from "react";
import { LabelGenerator } from "./LabelGenerator";
import { DoubleCheckScanner } from "./DoubleCheckScanner";
import { ClashDetection } from "./ClashDetection";
import { QrCode, ShieldCheck, ShieldAlert } from "lucide-react";

export const DistribusiKeamananModule = () => {
  const [subTab, setSubTab] = useState("label");

  return (
    <div>
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          borderBottom: "2px solid var(--border-color)",
          paddingBottom: "14px",
          overflowX: "auto"
        }}
      >
        <button
          className={`btn ${subTab === "label" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("label")}
        >
          <QrCode size={18} /> Cetak Label Plato Waterproof (QR & Barcode)
        </button>
        <button
          className={`btn ${subTab === "scanner" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("scanner")}
        >
          <ShieldCheck size={18} /> Double Check Scanner Gelang Pasien (SKP 1)
        </button>
        <button
          className={`btn ${subTab === "clash" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("clash")}
        >
          <ShieldAlert size={18} /> Menu Clash Detection (Alergi & Kontraindikasi)
        </button>
      </div>

      {subTab === "label" && <LabelGenerator />}
      {subTab === "scanner" && <DoubleCheckScanner />}
      {subTab === "clash" && <ClashDetection />}
    </div>
  );
};
