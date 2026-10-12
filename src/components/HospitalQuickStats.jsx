import React from "react";
import { useApp } from "../context/AppContext";
import {
  Users,
  AlertTriangle,
  Utensils,
  Award,
  Thermometer,
  ShieldCheck,
  TrendingDown
} from "lucide-react";

export const HospitalQuickStats = () => {
  const { patients, starkesMetrics, inventory, activeTab } = useApp();

  const highRiskCount = patients.filter((p) => p.screeningAlert).length;
  const fefoNearExpiry = inventory.filter((i) => i.daysUntilExpiry <= 3).length;

  return (
    <div className="hospital-kpi-ribbon no-print">
      <div className="kpi-ribbon-item">
        <div className="kpi-icon-box bg-teal">
          <Users size={22} color="#0f766e" />
        </div>
        <div className="kpi-ribbon-text">
          <span className="kpi-label">Pasien Rawat Inap</span>
          <div className="kpi-value-row">
            <span className="kpi-number">{patients.length * 54}</span>
            <span className="kpi-sub">Bed Terisi (88%)</span>
          </div>
        </div>
      </div>

      <div className={`kpi-ribbon-item ${highRiskCount > 0 ? "highlight-alert" : ""}`}>
        <div className={`kpi-icon-box ${highRiskCount > 0 ? "bg-red" : "bg-teal"}`}>
          <AlertTriangle size={22} color={highRiskCount > 0 ? "#dc2626" : "#0f766e"} />
        </div>
        <div className="kpi-ribbon-text">
          <span className="kpi-label">Asuhan Gizi &lt;24 Jam</span>
          <div className="kpi-value-row">
            <span className="kpi-number" style={{ color: highRiskCount > 0 ? "#dc2626" : "inherit" }}>
              {highRiskCount} Pasien
            </span>
            <span className="kpi-badge-alert">Perlu Tindakan Segera</span>
          </div>
        </div>
      </div>

      <div className="kpi-ribbon-item">
        <div className="kpi-icon-box bg-amber">
          <Utensils size={22} color="#b45309" />
        </div>
        <div className="kpi-ribbon-text">
          <span className="kpi-label">Produksi Makanan Shift</span>
          <div className="kpi-value-row">
            <span className="kpi-number">1.100</span>
            <span className="kpi-sub">Porsi / Shift Siang</span>
          </div>
        </div>
      </div>

      <div className="kpi-ribbon-item">
        <div className="kpi-icon-box bg-green">
          <TrendingDown size={22} color="#15803d" />
        </div>
        <div className="kpi-ribbon-text">
          <span className="kpi-label">Sisa Makanan Comstock</span>
          <div className="kpi-value-row">
            <span className="kpi-number" style={{ color: "#16a34a" }}>
              {starkesMetrics.sisaMakananComstock.score}%
            </span>
            <span className="kpi-sub" style={{ color: "#16a34a", fontWeight: 700 }}>
              ✓ Target STARKES &lt;20%
            </span>
          </div>
        </div>
      </div>

      <div className="kpi-ribbon-item">
        <div className="kpi-icon-box bg-blue">
          <ShieldCheck size={22} color="#1d4ed8" />
        </div>
        <div className="kpi-ribbon-text">
          <span className="kpi-label">Patient Safety SKP 1</span>
          <div className="kpi-value-row">
            <span className="kpi-number">99.6%</span>
            <span className="kpi-sub">Double Check Gelang</span>
          </div>
        </div>
      </div>
    </div>
  );
};
