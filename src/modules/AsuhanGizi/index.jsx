import React, { useState } from "react";
import { SkriningGizi } from "./SkriningGizi";
import { KalkulatorGizi } from "./KalkulatorGizi";
import { LabPenunjang } from "./LabPenunjang";
import { FormCPPT } from "./FormCPPT";
import { Activity, Calculator, FlaskConical, FileText } from "lucide-react";

export const AsuhanGiziModule = () => {
  const [subTab, setSubTab] = useState("skrining");

  return (
    <div>
      {/* Sub Tabs */}
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
          className={`btn ${subTab === "skrining" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("skrining")}
        >
          <Activity size={18} /> Skrining Gizi Otomatis (&lt;24 Jam Alert)
        </button>
        <button
          className={`btn ${subTab === "kalkulator" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("kalkulator")}
        >
          <Calculator size={18} /> Kalkulator Gizi Multiformula
        </button>
        <button
          className={`btn ${subTab === "lab" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("lab")}
        >
          <FlaskConical size={18} /> Integrasi Lab Klinik & Biokimia
        </button>
        <button
          className={`btn ${subTab === "cppt" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("cppt")}
        >
          <FileText size={18} /> Formulir CPPT (ADIME / SOAP)
        </button>
      </div>

      {subTab === "skrining" && (
        <SkriningGizi
          onSelectCalculator={() => setSubTab("kalkulator")}
          onOpenCPPT={() => setSubTab("cppt")}
        />
      )}
      {subTab === "kalkulator" && (
        <KalkulatorGizi onAppliedToCPPT={() => setSubTab("cppt")} />
      )}
      {subTab === "lab" && <LabPenunjang />}
      {subTab === "cppt" && <FormCPPT />}
    </div>
  );
};
