import React, { useState } from "react";
import { BulkDietOrder } from "./BulkDietOrder";
import { SiklusMenu } from "./SiklusMenu";
import { PKBMCalculator } from "./PKBMCalculator";
import { UtensilsCrossed, CalendarDays, Scale } from "lucide-react";

export const ProduksiDapurModule = () => {
  const [subTab, setSubTab] = useState("bulk_order");

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
          className={`btn ${subTab === "bulk_order" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("bulk_order")}
        >
          <UtensilsCrossed size={18} /> Bulk Diet Order & Grand Total Porsi
        </button>
        <button
          className={`btn ${subTab === "siklus_menu" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("siklus_menu")}
        >
          <CalendarDays size={18} /> Siklus Menu 10 Hari & Substitusi Otomatis
        </button>
        <button
          className={`btn ${subTab === "pkbm" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSubTab("pkbm")}
        >
          <Scale size={18} /> Perencanaan Kebutuhan Bahan (PKBM / BDD)
        </button>
      </div>

      {subTab === "bulk_order" && <BulkDietOrder />}
      {subTab === "siklus_menu" && <SiklusMenu />}
      {subTab === "pkbm" && <PKBMCalculator />}
    </div>
  );
};
