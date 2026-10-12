import React, { useState } from "react";
import { GudangManager } from "./GudangManager";
import { HACCPLog } from "./HACCPLog";
import { FEFOManager } from "./FEFOManager";
import { Boxes, Thermometer, Clock } from "lucide-react";

export const LogistikGudangModule = () => {
  const [subTab, setSubTab] = useState("gudang");

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
          className={`btn ${subTab === "gudang" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("gudang")}
        >
          <Boxes size={18} /> Gudang Kering vs Gudang Basah
        </button>
        <button
          className={`btn ${subTab === "haccp" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("haccp")}
        >
          <Thermometer size={18} /> HACCP Mutu & Food Recall Simulator
        </button>
        <button
          className={`btn ${subTab === "fefo" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("fefo")}
        >
          <Clock size={18} /> Metode Rekomendasi FEFO / FIFO
        </button>
      </div>

      {subTab === "gudang" && <GudangManager />}
      {subTab === "haccp" && <HACCPLog />}
      {subTab === "fefo" && <FEFOManager />}
    </div>
  );
};
