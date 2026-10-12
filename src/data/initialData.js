// Data Awal Sistem Informasi Manajemen Gizi Terpadu RSUD Provinsi (SIGIZI PROVINSI)
// Standar Akreditasi STARKES / KARS, Kemenkes SatuSehat FHIR, UU PDP

export const initialRoles = [
  {
    id: "dokter",
    name: "Dokter (DPJP)",
    user: "dr. Hendra Prasetyo, Sp.PD-KGEH",
    nip: "197805142005011003",
    badge: "DPJP Utama",
    description: "Menginput instruksi diet awal (CPOE), melihat perkembangan gizi pasien, verifikasi CPPT.",
    permissions: ["view_patients", "create_cpoe", "view_cppt", "approve_cppt"]
  },
  {
    id: "dietisien",
    name: "Dietisien / Ahli Gizi",
    user: "Nurul Hidayati, S.Tr.Gz, RD",
    nip: "199104122016022001",
    badge: "Clinical Dietitian (RD)",
    description: "Mengisi skrining gizi, asesmen, menentukan diagnosis gizi (PAGT/ADIME), membuat intervensi, konseling gizi.",
    permissions: ["screening_assessment", "pagt_calculator", "cppt_editor", "menu_customization", "counseling"]
  },
  {
    id: "perawat",
    name: "Perawat Bangsal",
    user: "Ns. Siti Rahmah, S.Kep",
    nip: "198809222012012004",
    badge: "Katim Bangsal Melati",
    description: "Verifikasi pemesanan makanan harian, lapor pasien puasa/pindah kamar, bedside QR scanning penyerahan plato.",
    permissions: ["verify_ward_orders", "bedside_scan", "report_fasting_transfer"]
  },
  {
    id: "kepala_gizi",
    name: "Kepala Instalasi Gizi",
    user: "Vikti May Putri, S.Tr.Gz",
    nip: "198905142014032004",
    badge: "Ka. Instalasi Gizi",
    description: "Supervisi asuhan & operasional gizi, persetujuan siklus menu & SPBM, memantau food cost & kepatuhan HACCP.",
    permissions: ["approve_menu_cycle", "view_food_cost", "quarterly_reports", "haccp_audit", "all_access"]
  },
  {
    id: "produksi_dapur",
    name: "Petugas Produksi Dapur",
    user: "Chef Bambang Sutrisno",
    nip: "198506192010011007",
    badge: "Chef Supervisor Dapur",
    description: "Melihat lembar kerja resep harian, grand total porsi per diet, cetak label makanan waterproof, input sisa makan.",
    permissions: ["view_bulk_production", "print_plato_labels", "input_comstock_waste", "recipe_worksheet"]
  },
  {
    id: "logistik_gudang",
    name: "Petugas Logistik Gudang",
    user: "Agus Salim, A.Md",
    nip: "198911042014021002",
    badge: "Koordinator Gudang Gizi",
    description: "Mencatat barang masuk/keluar gudang basah & kering, stock opname bahan pangan, memantau alarm kedaluwarsa (FEFO/FIFO).",
    permissions: ["manage_dry_wet_storage", "fefo_picking", "haccp_temperature_log", "stock_opname"]
  },
  {
    id: "direksi",
    name: "Direksi / Manajemen RS",
    user: "dr. Bambang Sudarmono, Sp.A(K), MARS",
    nip: "196808111994031001",
    badge: "Direktur Utama RSUD",
    description: "Mengakses Executive Dashboard untuk melihat efisiensi biaya makan (food cost/patient-day), kepuasan pasien, & indikator STARKES.",
    permissions: ["executive_dashboard", "cost_analytics", "starkes_compliance", "audit_trail"]
  }
];

export const initialPatients = [
  {
    id: "P001",
    noRm: "00-48-21-90",
    nik: "3201021405620003",
    name: "Tn. Sudirman",
    gender: "Laki-laki",
    age: 62,
    dob: "1964-05-14",
    bed: "Bed 02",
    ward: "ICU Sentral",
    class: "Kelas Khusus",
    dpjp: "dr. Hendra Prasetyo, Sp.PD-KGEH",
    admitDate: "2026-10-10 09:30",
    diagnosisMedis: "Sepsis Berat, ARDS on Ventilator Mekanik, DM Tipe 2 Komplikasi",
    bb: 68,
    tb: 168,
    lila: 26,
    imt: 24.1,
    statusGizi: "Gizi Baik (Komorbid Kritis)",
    dietPrescription: "Enteral Sonde Formula Rendah Karbohidrat / Peptamen 6 x 200 ml (1600 kkal)",
    dietType: "Diet Sonde / Enteral Khusus",
    allergies: ["Tidak Ada"],
    screeningScore: 5, // NRS-2002 >= 3 (High Risk)
    screeningTool: "NRS-2002",
    screeningAlert: true,
    screeningDate: "2026-10-10 11:00",
    screeningDueHoursLeft: 0,
    screeningStatus: "Perlu Asuhan Segera (<24 Jam Terlampaui)",
    weightLoss: "Penurunan BB 4 kg dalam 2 minggu terakhir",
    foodIntakeBefore: "<25% porsi biasa",
    criticalLab: true,
    biokimia: {
      albumin: { value: 2.1, unit: "g/dL", ref: "3.5 - 5.2", status: "Kritis Rendah" },
      hemoglobin: { value: 9.8, unit: "g/dL", ref: "13.0 - 17.0", status: "Rendah" },
      gds: { value: 265, unit: "mg/dL", ref: "< 140", status: "Tinggi" },
      ureum: { value: 84, unit: "mg/dL", ref: "15 - 45", status: "Tinggi" },
      kreatinin: { value: 1.8, unit: "mg/dL", ref: "0.7 - 1.3", status: "Tinggi" },
      natrium: { value: 131, unit: "mmol/L", ref: "135 - 145", status: "Rendah" },
      kalium: { value: 4.8, unit: "mmol/L", ref: "3.5 - 5.0", status: "Normal" },
      klorida: { value: 98, unit: "mmol/L", ref: "98 - 107", status: "Normal" }
    },
    ventilatorData: {
      isOnVentilator: true,
      minuteVentilation: 10.5, // VE (L/menit)
      maxTemp: 38.6 // Tmax (°C)
    },
    cpptStatus: "ADIME Tersimpan - Menunggu Review DPJP",
    mealOrderStatus: "Aktif",
    platoBarcode: "PLT-ICU-02-20261012-PAGI",
    wristbandBarcode: "GST-00-48-21-90-SUDIRMAN"
  },
  {
    id: "P002",
    noRm: "00-51-09-32",
    nik: "3201085207720005",
    name: "Ny. Ratnawati",
    gender: "Perempuan",
    age: 54,
    dob: "1972-07-12",
    bed: "Bed 04A",
    ward: "Rawat Inap Melati (Penyakit Dalam)",
    class: "Kelas 1",
    dpjp: "dr. Hendra Prasetyo, Sp.PD-KGEH",
    admitDate: "2026-10-11 14:15",
    diagnosisMedis: "Gagal Ginjal Kronis (GGK) Stadium 5 on HD Reguler + Hipertensi Heart Disease",
    bb: 52,
    tb: 155,
    lila: 23,
    imt: 21.6,
    statusGizi: "Gizi Normal dengan Risiko Malnutrisi Renal",
    dietPrescription: "Lunak - Diet Rendah Protein (RP 40g) + Rendah Garam II (RG II) + Rendah Kalium (RK)",
    dietType: "Diet Rendah Protein & Garam",
    allergies: ["Udang / Seafood", "Ikan Laut"],
    screeningScore: 4,
    screeningTool: "NRS-2002",
    screeningAlert: true,
    screeningDate: "2026-10-11 16:00",
    screeningDueHoursLeft: 6,
    screeningStatus: "Sisa 6 Jam Menuju Batas 24 Jam",
    weightLoss: "BB fluktuatif edema, asupan 50%",
    foodIntakeBefore: "Mual & anoreksia berat",
    criticalLab: true,
    biokimia: {
      albumin: { value: 3.1, unit: "g/dL", ref: "3.5 - 5.2", status: "Rendah" },
      hemoglobin: { value: 8.4, unit: "g/dL", ref: "12.0 - 15.0", status: "Anemia Berat" },
      gds: { value: 110, unit: "mg/dL", ref: "< 140", status: "Normal" },
      ureum: { value: 148, unit: "mg/dL", ref: "15 - 45", status: "Kritis Tinggi" },
      kreatinin: { value: 7.4, unit: "mg/dL", ref: "0.5 - 1.1", status: "Kritis Tinggi" },
      natrium: { value: 137, unit: "mmol/L", ref: "135 - 145", status: "Normal" },
      kalium: { value: 5.7, unit: "mmol/L", ref: "3.5 - 5.0", status: "Tinggi (Bahaya Aritmia)" },
      klorida: { value: 102, unit: "mmol/L", ref: "98 - 107", status: "Normal" }
    },
    ventilatorData: { isOnVentilator: false },
    cpptStatus: "ADIME Terverifikasi",
    mealOrderStatus: "Aktif",
    platoBarcode: "PLT-MLT-04A-20261012-PAGI",
    wristbandBarcode: "GST-00-51-09-32-RATNAWATI"
  },
  {
    id: "P003",
    noRm: "00-62-44-18",
    nik: "3201191502190001",
    name: "An. Kevin Sanjaya",
    gender: "Laki-laki",
    age: 7,
    dob: "2019-02-15",
    bed: "Bed 03",
    ward: "Kenanga (Pediatrik / Anak)",
    class: "Kelas 2",
    dpjp: "dr. Bambang Sudarmono, Sp.A(K)",
    admitDate: "2026-10-11 20:45",
    diagnosisMedis: "DHF Grade III (Dengue Shock Syndrome Pulih) + Gizi Kurang Akut",
    bb: 18,
    tb: 112,
    lila: 14.5,
    imt: 14.3,
    statusGizi: "Gizi Kurang (Z-score WAZ -2.2 SD)",
    dietPrescription: "Lunak Anak - Tinggi Kalori Tinggi Protein (TKTP Anak 1400 kkal, Protein 35g)",
    dietType: "Diet TKTP Anak",
    allergies: ["Telur Ayam", "Kacang Tanah"],
    screeningScore: 5,
    screeningTool: "STRONGkids",
    screeningAlert: true,
    screeningDate: "2026-10-11 21:30",
    screeningDueHoursLeft: 12,
    screeningStatus: "Sisa 12 Jam Menuju Batas 24 Jam",
    weightLoss: "Penurunan BB 1.5 kg selama demam 5 hari",
    foodIntakeBefore: "Nafsu makan menurun drastis",
    criticalLab: false,
    biokimia: {
      albumin: { value: 3.4, unit: "g/dL", ref: "3.8 - 5.4", status: "Sedikit Rendah" },
      hemoglobin: { value: 13.2, unit: "g/dL", ref: "11.5 - 15.5", status: "Normal" },
      gds: { value: 92, unit: "mg/dL", ref: "70 - 120", status: "Normal" },
      ureum: { value: 24, unit: "mg/dL", ref: "10 - 40", status: "Normal" },
      kreatinin: { value: 0.5, unit: "mg/dL", ref: "0.3 - 0.7", status: "Normal" },
      natrium: { value: 136, unit: "mmol/L", ref: "135 - 145", status: "Normal" },
      kalium: { value: 4.1, unit: "mmol/L", ref: "3.5 - 5.0", status: "Normal" },
      klorida: { value: 100, unit: "mmol/L", ref: "98 - 107", status: "Normal" }
    },
    ventilatorData: { isOnVentilator: false },
    cpptStatus: "ADIME Draft",
    mealOrderStatus: "Aktif",
    platoBarcode: "PLT-KNG-03-20261012-PAGI",
    wristbandBarcode: "GST-00-62-44-18-KEVIN"
  },
  {
    id: "P004",
    noRm: "00-39-88-12",
    nik: "3201011508810002",
    name: "Tn. Ahmad Fauzi",
    gender: "Laki-laki",
    age: 45,
    dob: "1981-08-15",
    bed: "Bed 10",
    ward: "Mawar (Bedah Umum)",
    class: "Kelas 2",
    dpjp: "dr. Surya Pratama, Sp.B",
    admitDate: "2026-10-09 11:00",
    diagnosisMedis: "Post-Operasi Reseksi Usus & Ileostomi H-3 e.c. Volvulus",
    bb: 60,
    tb: 165,
    lila: 25,
    imt: 22.0,
    statusGizi: "Gizi Baik",
    dietPrescription: "Lunak Saring Bertahap - Diet Rendah Sisa Rendah Lemak (1500 kkal)",
    dietType: "Diet Rendah Sisa",
    allergies: ["Tidak Ada"],
    screeningScore: 3,
    screeningTool: "NRS-2002",
    screeningAlert: false,
    screeningDate: "2026-10-09 13:00",
    screeningDueHoursLeft: 0,
    screeningStatus: "Sudah Ditata Laksana",
    weightLoss: "Penurunan BB minimal 1 kg",
    foodIntakeBefore: "Puasa post-op 2 hari, hari ini mulai bising usus positif",
    criticalLab: false,
    biokimia: {
      albumin: { value: 3.2, unit: "g/dL", ref: "3.5 - 5.2", status: "Sedikit Rendah" },
      hemoglobin: { value: 11.2, unit: "g/dL", ref: "13.0 - 17.0", status: "Rendah Sedang" },
      gds: { value: 104, unit: "mg/dL", ref: "< 140", status: "Normal" },
      ureum: { value: 32, unit: "mg/dL", ref: "15 - 45", status: "Normal" },
      kreatinin: { value: 0.9, unit: "mg/dL", ref: "0.7 - 1.3", status: "Normal" },
      natrium: { value: 139, unit: "mmol/L", ref: "135 - 145", status: "Normal" },
      kalium: { value: 3.9, unit: "mmol/L", ref: "3.5 - 5.0", status: "Normal" },
      klorida: { value: 103, unit: "mmol/L", ref: "98 - 107", status: "Normal" }
    },
    ventilatorData: { isOnVentilator: false },
    cpptStatus: "ADIME Terverifikasi",
    mealOrderStatus: "Aktif",
    platoBarcode: "PLT-MWR-10-20261012-PAGI",
    wristbandBarcode: "GST-00-39-88-12-AHMAD"
  },
  {
    id: "P005",
    noRm: "00-44-31-07",
    nik: "3201046811570004",
    name: "Ny. Endang Sri",
    gender: "Perempuan",
    age: 68,
    dob: "1957-11-28",
    bed: "Bed 01 (VIP)",
    ward: "Anggrek (Jantung & VIP)",
    class: "VIP",
    dpjp: "dr. Hendra Prasetyo, Sp.PD-KGEH",
    admitDate: "2026-10-10 17:30",
    diagnosisMedis: "Congestive Heart Failure (CHF NYHA III) + HHD + Diabetes Melitus",
    bb: 72,
    tb: 153,
    lila: 28,
    imt: 30.8,
    statusGizi: "Obesitas Tingkat I dengan Retensi Cairan",
    dietPrescription: "Biasa Lunak - Diet Jantung II + Diet DM 1500 kkal + Rendah Garam I + Pembatasan Cairan 1200 ml/hari",
    dietType: "Diet Jantung & DM",
    allergies: ["Gluten / Gandum", "Kedelai"],
    screeningScore: 3,
    screeningTool: "NRS-2002",
    screeningAlert: false,
    screeningDate: "2026-10-10 19:00",
    screeningDueHoursLeft: 0,
    screeningStatus: "Sudah Ditata Laksana",
    weightLoss: "Peningkatan BB semu karena edema pretibial",
    foodIntakeBefore: "Asupan 60%",
    criticalLab: false,
    biokimia: {
      albumin: { value: 3.6, unit: "g/dL", ref: "3.5 - 5.2", status: "Normal" },
      hemoglobin: { value: 12.1, unit: "g/dL", ref: "12.0 - 15.0", status: "Normal" },
      gds: { value: 188, unit: "mg/dL", ref: "< 140", status: "Tinggi" },
      ureum: { value: 41, unit: "mg/dL", ref: "15 - 45", status: "Normal" },
      kreatinin: { value: 1.1, unit: "mg/dL", ref: "0.5 - 1.1", status: "Normal" },
      natrium: { value: 135, unit: "mmol/L", ref: "135 - 145", status: "Normal Rendah" },
      kalium: { value: 4.2, unit: "mmol/L", ref: "3.5 - 5.0", status: "Normal" },
      klorida: { value: 99, unit: "mmol/L", ref: "98 - 107", status: "Normal" }
    },
    ventilatorData: { isOnVentilator: false },
    cpptStatus: "ADIME Terverifikasi",
    mealOrderStatus: "Aktif",
    platoBarcode: "PLT-AGR-01-20261012-PAGI",
    wristbandBarcode: "GST-00-44-31-07-ENDANG"
  },
  {
    id: "P006",
    noRm: "00-55-12-78",
    nik: "3201051210760002",
    name: "Tn. Hendro Wicaksono",
    gender: "Laki-laki",
    age: 50,
    dob: "1976-10-12",
    bed: "Bed 06",
    ward: "Rawat Inap Melati (Penyakit Dalam)",
    class: "Kelas 1",
    dpjp: "dr. Hendra Prasetyo, Sp.PD-KGEH",
    admitDate: "2026-10-12 02:00",
    diagnosisMedis: "Sirosis Hepatis Dekompensata + Asites Masif + Ensefalopati Hepatikum Grade I",
    bb: 58,
    tb: 170,
    lila: 21,
    imt: 20.1,
    statusGizi: "Malnutrisi Energi Protein (MEP) Sedang",
    dietPrescription: "Lunak - Diet Hati II (BCAA Diperkaya, Protein 1.2 g/kgBB Kering, Rendah Garam II)",
    dietType: "Diet Hati (Hepatoselular)",
    allergies: ["Susu Sapi (Laktosa)"],
    screeningScore: 4,
    screeningTool: "NRS-2002",
    screeningAlert: true,
    screeningDate: "2026-10-12 04:00",
    screeningDueHoursLeft: 19,
    screeningStatus: "Sisa 19 Jam Menuju Batas 24 Jam",
    weightLoss: "Penurunan massa otot lengan drastis",
    foodIntakeBefore: "Mual & kembung",
    criticalLab: true,
    biokimia: {
      albumin: { value: 2.2, unit: "g/dL", ref: "3.5 - 5.2", status: "Kritis Rendah" },
      hemoglobin: { value: 10.0, unit: "g/dL", ref: "13.0 - 17.0", status: "Rendah" },
      gds: { value: 115, unit: "mg/dL", ref: "< 140", status: "Normal" },
      ureum: { value: 55, unit: "mg/dL", ref: "15 - 45", status: "Tinggi" },
      kreatinin: { value: 1.3, unit: "mg/dL", ref: "0.7 - 1.3", status: "Batas Atas" },
      natrium: { value: 129, unit: "mmol/L", ref: "135 - 145", status: "Kritis Rendah (Hiponatremia)" },
      kalium: { value: 3.6, unit: "mmol/L", ref: "3.5 - 5.0", status: "Normal Rendah" },
      klorida: { value: 95, unit: "mmol/L", ref: "98 - 107", status: "Rendah" }
    },
    ventilatorData: { isOnVentilator: false },
    cpptStatus: "Menunggu Input Dietisien",
    mealOrderStatus: "Aktif",
    platoBarcode: "PLT-MLT-06-20261012-PAGI",
    wristbandBarcode: "GST-00-55-12-78-HENDRO"
  }
];

export const initialCPPTRecords = [
  {
    id: "CPPT-001",
    patientId: "P001",
    date: "2026-10-11 10:30",
    practitioner: "Nurul Hidayati, S.Tr.Gz, RD",
    role: "Dietisien",
    type: "ADIME",
    assessment: "Antropometri: BB estimasi 68 kg, TB 168 cm, IMT 24.1 kg/m2, LILA 26 cm. Biokimia: Albumin 2.1 g/dL (Hipoalbuminemia berat), GDS 265 mg/dL, Ureum 84 mg/dL. Fisik/Klinis: Terintubasi ventilator mekanik Mode SIMV, terpasang NGT No. 16, edema anasarka minimal. Riwayat Diet: Pasien puasa pre-intubasi 24 jam, toleransi residu lambung minimal (<50 ml).",
    diagnosis: "NI-1.2 Asupan oral/enteral inadekuat berkaitan dengan kondisi kritis terintubasi ventilator ditandai dengan asupan aktual 0 kkal selama 24 jam. NI-5.1 Peningkatan kebutuhan protein berkaitan dengan kondisi katabolik berat sepsis ditandai dengan kadar albumin serum 2.1 g/dL.",
    intervention: "Tujuan: Memenuhi 80-100% kebutuhan energi & protein secara bertahap dalam 48 jam, menjaga stabilitas glikemik. Preskripsi: Diet Enteral formula khusus peptida/diabetes (Peptamen / Glucerna) 6 x 200 ml, target energi 1650 kkal (24 kkal/kgBB), protein 1.5 g/kgBB = 102 g (25% total kalori). Rute: Enteral via Nasogastric Tube continuous/bolus lambat. Edukasi: KIE keluarga mengenai tujuan nutrisi klinis enteral.",
    monitoring: "Monitoring toleransi enteral tiap 4 jam (residu lambung, distensi abdomen). Monitoring GDS per 6 jam (target 140-180 mg/dL). Monitoring ulang Albumin dan elektrolit H+3.",
    soapS: "Keluarga mengatakan pasien tidak sadar penuh karena sedasi di ICU.",
    soapO: "GCS E2M3VET, ventilator on, Albumin 2.1 g/dL, GDS 265 mg/dL.",
    soapA: "Malnutrisi akut risiko tinggi e.c. Sepsis berat & ARDS on Ventilator mekanik.",
    soapP: "Nutrisi enteral dini (Early Enteral Nutrition) via NGT formula polimerik/peptida 6x200cc.",
    isSigned: true,
    signatureDate: "2026-10-11 11:00",
    signatureHash: "SIG-RD-91823901-STARKES-VERIFIED",
    dpjpApproval: "Approved by dr. Hendra Prasetyo, Sp.PD-KGEH"
  },
  {
    id: "CPPT-002",
    patientId: "P002",
    date: "2026-10-11 16:45",
    practitioner: "Nurul Hidayati, S.Tr.Gz, RD",
    role: "Dietisien",
    type: "ADIME",
    assessment: "Antropometri: BB kering estimasi 52 kg, TB 155 cm, IMT 21.6. Biokimia: Albumin 3.1 g/dL, Ureum 148 mg/dL, Kreatinin 7.4 mg/dL, Kalium 5.7 mmol/L (Hiperkalemia). Fisik/Klinis: Mual, nafsu makan buruk, TD 160/95 mmHg, edema pretibial +1. Riwayat Gizi: Kebiasaan makan rendah protein nabati, sering konsumsi buah pisang dan air berlebih.",
    diagnosis: "NI-5.6.3 Kelebihan asupan kalium berkaitan dengan kurang pengetahuan diet renal ditandai dengan kalium serum 5.7 mmol/L. NC-1.4 Gangguan fungsi ginjal berkaitan dengan GGK stadium 5 on HD ditandai Ureum 148 mg/dL dan Kreatinin 7.4 mg/dL.",
    intervention: "Preskripsi Diet: Lunak Rendah Protein 40 g (0.8 g/kgBB kering), Rendah Garam II (1000 mg Na), Rendah Kalium (<2000 mg/hari). Kebutuhan energi: 1800 kkal (35 kkal/kgBB). Konseling Gizi: Edukasi cara pengolahan sayuran dipotong kecil dan direbus buang air rebusan untuk menurunkan kadar kalium, hindari buah tinggi kalium (pisang, melon, alpukat).",
    monitoring: "Kadar kalium serum serial post-HD, tekanan darah, sisa porsi makan (target sisa <20%).",
    soapS: "Pasien mengeluh mual jika mencium bau makanan amis, merasa lemas.",
    soapO: "Ureum 148, Kreatinin 7.4, Kalium 5.7, TD 160/95 mmHg.",
    soapA: "GGK Stage 5 on HD reguler dengan komplikasi hiperkalemia dan azotemia.",
    soapP: "Diet Rendah Protein 40g, Rendah Kalium, Rendah Garam II. KIE pemilihan bahan makanan.",
    isSigned: true,
    signatureDate: "2026-10-11 17:15",
    signatureHash: "SIG-RD-77123982-STARKES-VERIFIED",
    dpjpApproval: "Approved by dr. Hendra Prasetyo, Sp.PD-KGEH"
  }
];

export const initialMenuCycle = [
  {
    day: 1,
    pagi: {
      pokok: "Nasi Tim Beras Putih",
      laukHewani: "Ayam Suwir Bumbu Kuning",
      laukNabati: "Tahu Bacem Kukus",
      sayur: "Sup Wortel Labu Siam",
      snack: "Puding Buah Naga Saus Fla Vanila"
    },
    siang: {
      pokok: "Nasi Putih Pulen / Nasi Tim",
      laukHewani: "Ikan Kakap Panggang Saus Tomat",
      laukNabati: "Tempe Mendoan Oven Sehat",
      sayur: "Sayur Bening Bayam Jagung Manis",
      buah: "Pepaya Potong 100g",
      snackSore: "Nagasari Pisang Lembut"
    },
    sore: {
      pokok: "Nasi Putih / Nasi Tim",
      laukHewani: "Semur Daging Sapi Cincang Rendah Garam",
      laukNabati: "Perkedel Tahu Panggang",
      sayur: "Tumis Labu Air & Jamur Kuping",
      buah: "Pisang Barangan 1 Buah"
    }
  },
  {
    day: 2,
    pagi: {
      pokok: "Bubur Ayam Gurih / Nasi Tim",
      laukHewani: "Telur Rebus Bumbu Terik",
      laukNabati: "Tahu Gulung Sayur",
      sayur: "Sup Oyong Bihun",
      snack: "Bubur Kacang Hijau Santan Encer"
    },
    siang: {
      pokok: "Nasi Putih Pulen",
      laukHewani: "Rolade Daging Sapi Kukus",
      laukNabati: "Tempe Bacem Bakar",
      sayur: "Sayur Asem Jakarta Rendah Asam",
      buah: "Semangka Merah Segar 100g",
      snackSore: "Bolu Kukus Ubi Ungu"
    },
    sore: {
      pokok: "Nasi Putih Pulen",
      laukHewani: "Ayam Panggang Bumbu Rujak Tanpa Cabe",
      laukNabati: "Tahu Kipas Kukus",
      sayur: "Sup Makaroni Brokoli",
      buah: "Jeruk Manis Kupas"
    }
  },
  {
    day: 3,
    pagi: {
      pokok: "Nasi Uduk Gurih Sehat / Nasi Tim",
      laukHewani: "Ayam Ungkep Laos",
      laukNabati: "Orek Tempe Basah",
      sayur: "Lalap Labu Siam Rebus",
      snack: "Kue Talam Labu Kuning"
    },
    siang: {
      pokok: "Nasi Putih",
      laukHewani: "Gepuk Daging Empuk Rendah Lemak",
      laukNabati: "Tahu Bumbu Balado Manis",
      sayur: "Sup Kimlo Ayam Jamur",
      buah: "Melon Potong 100g",
      snackSore: "Puding Lumut Pandan"
    },
    sore: {
      pokok: "Nasi Putih",
      laukHewani: "Ikan Fillet Gurame Asam Manis",
      laukNabati: "Perkedel Kentang Daging",
      sayur: "Tumis Buncis Jagung Pipil",
      buah: "Pisang Raja"
    }
  },
  {
    day: 4,
    pagi: {
      pokok: "Nasi Tim Ayam Jamur",
      laukHewani: "Opor Ayam Putih",
      laukNabati: "Tahu Sutra Kukus Kecap",
      sayur: "Sup Kembang Tahu",
      snack: "Kroket Kentang Panggang"
    },
    siang: {
      pokok: "Nasi Putih",
      laukHewani: "Rendang Daging Sapi Dapur Sehat (Tanpa Minyak Jelantah)",
      laukNabati: "Tempe Mendoan Sehat",
      sayur: "Sayur Lodeh Labu Siam Santan Encer",
      buah: "Pepaya California",
      snackSore: "Barongko Pisang"
    },
    sore: {
      pokok: "Nasi Putih",
      laukHewani: "Ayam Fillet Bakar Kecap",
      laukNabati: "Tahu Goreng Bawang",
      sayur: "Sup Wortel Jamur Tiram",
      buah: "Apel Fuji Kupas"
    }
  },
  {
    day: 5,
    pagi: {
      pokok: "Bubur Gurih Sayur",
      laukHewani: "Ikan Bandeng Cabut Duri Presto",
      laukNabati: "Tahu Bacem",
      sayur: "Sayur Bening Bayam",
      snack: "Klappertaart Sehat Rendah Gula"
    },
    siang: {
      pokok: "Nasi Putih",
      laukHewani: "Bistik Daging Cincang Kentang",
      laukNabati: "Tempe Kering Kacang Sehat",
      sayur: "Sup Kacang Merah Daging Sapi",
      buah: "Jeruk Manis",
      snackSore: "Kue Lumpur Kentang"
    },
    sore: {
      pokok: "Nasi Putih",
      laukHewani: "Ayam Kalasan Kukus",
      laukNabati: "Tahu Bakso Kukus",
      sayur: "Tumis Jagung Manis Wortel",
      buah: "Semangka Segar"
    }
  },
  {
    day: 6,
    pagi: {
      pokok: "Nasi Kuning Rendah Santan",
      laukHewani: "Telur Dadar Sayur Gulung",
      laukNabati: "Sambal Goreng Tempe Kering",
      sayur: "Ketimun & Kemangi Rebus",
      snack: "Pastel Tutup Mini Panggang"
    },
    siang: {
      pokok: "Nasi Putih",
      laukHewani: "Ayam Woku Manado Ramah Lambung",
      laukNabati: "Tahu Gejrot Sayur",
      sayur: "Sup Asparagus Jagung",
      buah: "Melon Cantaloupe",
      snackSore: "Muffin Oatmeal Pisang"
    },
    sore: {
      pokok: "Nasi Putih",
      laukHewani: "Ikan Tenggiri Kuah Kuning",
      laukNabati: "Perkedel Tahu Jamur",
      sayur: "Sayur Bening Katuk Labu Kuning",
      buah: "Pisang Ambon"
    }
  },
  {
    day: 7,
    pagi: {
      pokok: "Bubur Manado Sehat (Tinutuan)",
      laukHewani: "Ikan Cakalang Suwir Asap Sehat",
      laukNabati: "Tahu Kukus Daun Kemangi",
      sayur: "Kangkung Rebus Manado",
      snack: "Puding Coklat Chia Seed"
    },
    siang: {
      pokok: "Nasi Putih",
      laukHewani: "Sop Buntut Dapur Sehat Rendah Lemak",
      laukNabati: "Tempe Goreng Bumbu Ketumbar",
      sayur: "Wortel Kentang Kaldu Sapi",
      buah: "Pepaya Potong",
      snackSore: "Lemper Ayam Kukus"
    },
    sore: {
      pokok: "Nasi Putih",
      laukHewani: "Ayam Bumbu Bali Manis",
      laukNabati: "Tahu Masak Kecap",
      sayur: "Tumis Labu Siam Jagung",
      buah: "Jeruk Medan"
    }
  },
  {
    day: 8,
    pagi: {
      pokok: "Nasi Liwet Sehat",
      laukHewani: "Ayam Suwir Opor",
      laukNabati: "Tahu Bacem Basah",
      sayur: "Sayur Labu Siam Kuah Santan Encer",
      snack: "Kue Putu Ayu Pandan"
    },
    siang: {
      pokok: "Nasi Putih",
      laukHewani: "Kakap Asam Pedas Lembut",
      laukNabati: "Perkedel Tempe Daun Bawang",
      sayur: "Sayur Asam Bening",
      buah: "Semangka Merah",
      snackSore: "Puding Mangga Susu Rendah Lemak"
    },
    sore: {
      pokok: "Nasi Putih",
      laukHewani: "Daging Teriyaki Wijen",
      laukNabati: "Tahu Sapo Jepang",
      sayur: "Sup Jamur Kuping Brokoli",
      buah: "Pisang Barangan"
    }
  },
  {
    day: 9,
    pagi: {
      pokok: "Lontong Sayur Dapur Sehat",
      laukHewani: "Telur Balado Manis",
      laukNabati: "Tahu Goreng Tepung Tipis",
      sayur: "Sayur Pepaya Muda Wortel",
      snack: "Cantik Manis Pacar Cina"
    },
    siang: {
      pokok: "Nasi Putih",
      laukHewani: "Ayam Goreng Lengkuas",
      laukNabati: "Tempe Mendoan Basah",
      sayur: "Sup Jagung Manis Ayam Suwir",
      buah: "Melon Segar",
      snackSore: "Kue Cubit Gandum Lembut"
    },
    sore: {
      pokok: "Nasi Putih",
      laukHewani: "Ikan Nila Bakar Cianjur",
      laukNabati: "Perkedel Kentang Panggang",
      sayur: "Sayur Bening Bayam Oyong",
      buah: "Jeruk Manis"
    }
  },
  {
    day: 10,
    pagi: {
      pokok: "Nasi Tim Ayam Hainan",
      laukHewani: "Ayam Rebus Hainan Saus Jahe",
      laukNabati: "Tahu Sutra Kukus Saus Tiram",
      sayur: "Sup Sawi Putih Bakso Ikan",
      snack: "Puding Karamel Rendah Gula"
    },
    siang: {
      pokok: "Nasi Putih",
      laukHewani: "Rawon Daging Sapi Dapur Sehat",
      laukNabati: "Tempe Goreng Bumbu Kuning",
      sayur: "Tauge Pendek Rebus & Labu Siam",
      buah: "Semangka Kuning",
      snackSore: "Pancake Pisang Oatmeal"
    },
    sore: {
      pokok: "Nasi Putih",
      laukHewani: "Ayam Bakar Madu Kecap",
      laukNabati: "Tahu Tempe Bacem Kukus",
      sayur: "Sup Sayuran Campur",
      buah: "Pepaya California"
    }
  },
  {
    day: 31,
    pagi: {
      pokok: "Nasi Gurih Kuning Hari Ke-31",
      laukHewani: "Ayam Suwir Bumbu Rujak Manis",
      laukNabati: "Tahu Bacem",
      sayur: "Sup Oyong Telur Puyuh",
      snack: "Puding Sutra Coklat Buah"
    },
    siang: {
      pokok: "Nasi Putih Pulen",
      laukHewani: "Bistik Daging Sapi Komplit",
      laukNabati: "Perkedel Tahu Jamur",
      sayur: "Sup Wortel Kacang Polong",
      buah: "Melon Madu",
      snackSore: "Roti Kukus Srikaya Sehat"
    },
    sore: {
      pokok: "Nasi Putih Pulen",
      laukHewani: "Ikan Fillet Saus Padang Manis",
      laukNabati: "Tempe Mendoan Kukus",
      sayur: "Sayur Bening Bayam Jagung",
      buah: "Jeruk Manis"
    }
  }
];

export const initialFoodSubstitutions = [
  {
    originalId: "SUB-01",
    originalName: "Daging Sapi Has Luar (Sirloin)",
    category: "Lauk Hewani",
    reason: "Stok distributor kosong / harga melonjak",
    substitutes: [
      {
        name: "Daging Ayam Fillet Dada",
        ratioGram: "100g sapi = 100g ayam dada",
        kaloriDelta: "-40 kkal (Lebih rendah lemak)",
        proteinDelta: "+2g protein",
        status: "Rekomendasi Utama Dietisien",
        allergens: []
      },
      {
        name: "Ikan Kakap Fillet",
        ratioGram: "100g sapi = 110g kakap",
        kaloriDelta: "-60 kkal",
        proteinDelta: "Setara",
        status: "Pilihan Kedua (Perhatikan Alergi Seafood)",
        allergens: ["Seafood", "Ikan Laut"]
      }
    ]
  },
  {
    originalId: "SUB-02",
    originalName: "Udang Segar / Seafood",
    category: "Lauk Hewani",
    reason: "Pasien Riwayat Alergi Seafood atau Stok Kosong",
    substitutes: [
      {
        name: "Daging Ayam Cincang",
        ratioGram: "100g udang = 90g ayam cincang",
        kaloriDelta: "Setara",
        proteinDelta: "Setara",
        status: "Aman Alergen (Sangat Dianjurkan)",
        allergens: []
      },
      {
        name: "Tahu Sutra + Telur Puyuh",
        ratioGram: "100g udang = 70g tahu + 2 butir telur puyuh",
        kaloriDelta: "+10 kkal",
        proteinDelta: "Setara",
        status: "Pilihan Lunak (Perhatikan Alergi Telur)",
        allergens: ["Telur"]
      }
    ]
  },
  {
    originalId: "SUB-03",
    originalName: "Brokoli Hijau Segar",
    category: "Sayuran",
    reason: "Kualitas pasar menurun / musim hujan",
    substitutes: [
      {
        name: "Buncis Muda Baby Bean",
        ratioGram: "100g brokoli = 100g buncis",
        kaloriDelta: "Setara (35 kkal)",
        proteinDelta: "Setara (2.5g)",
        status: "Substitusi Setara Serat & Vitamin",
        allergens: []
      },
      {
        name: "Kacang Kapri Manis",
        ratioGram: "100g brokoli = 90g kapri",
        kaloriDelta: "+15 kkal",
        proteinDelta: "+1g",
        status: "Pilihan Pengganti Sup",
        allergens: []
      }
    ]
  },
  {
    originalId: "SUB-04",
    originalName: "Beras Putih Premium",
    category: "Makanan Pokok",
    reason: "Diet Diabetes Melitus (Kebutuhan Indeks Glikemik Rendah)",
    substitutes: [
      {
        name: "Beras Merah Organik / Nasi Jagung",
        ratioGram: "100g beras putih = 100g beras merah",
        kaloriDelta: "-20 kkal (Serat +3g, IG Rendah)",
        proteinDelta: "Setara",
        status: "Rekomendasi Diet DM",
        allergens: []
      },
      {
        name: "Kentang Kukus / Oatmeal",
        ratioGram: "100g nasi = 210g kentang kukus",
        kaloriDelta: "Setara kalori (175 kkal)",
        proteinDelta: "Setara",
        status: "Alternatif Pasien Bosan Nasi",
        allergens: []
      }
    ]
  }
];

export const initialInventory = [
  // GUDANG BASAH / SEGAR (Cold Storage Chiller & Freezer)
  {
    id: "INV-WET-001",
    name: "Daging Ayam Broiler Karkas Utuh",
    category: "Gudang Basah",
    storageType: "Freezer Daging (-18°C)",
    currentStockKg: 145.0,
    minStockKg: 50.0,
    unit: "kg",
    pricePerUnit: 38000,
    bddPercent: 58, // Berat Dapat Dimakan 58%
    lotNumber: "LOT-AYM-20261010-01",
    supplier: "PT Unggas Sejahtera Nusantara",
    receivedDate: "2026-10-10",
    expiryDate: "2026-10-17",
    daysUntilExpiry: 5,
    status: "Aman",
    tempRequirement: "-18°C s/d -20°C",
    lastTempChecked: -18.4,
    allergens: []
  },
  {
    id: "INV-WET-002",
    name: "Daging Sapi Has Dalam (Tenderloin)",
    category: "Gudang Basah",
    storageType: "Freezer Daging (-18°C)",
    currentStockKg: 85.0,
    minStockKg: 30.0,
    unit: "kg",
    pricePerUnit: 140000,
    bddPercent: 100, // Fillet bersih 100%
    lotNumber: "LOT-SPI-20261009-03",
    supplier: "CV Berkah Daging Segar",
    receivedDate: "2026-10-09",
    expiryDate: "2026-10-23",
    daysUntilExpiry: 11,
    status: "Aman",
    tempRequirement: "-18°C s/d -22°C",
    lastTempChecked: -19.1,
    allergens: []
  },
  {
    id: "INV-WET-003",
    name: "Ikan Kakap Merah Fillet Segar",
    category: "Gudang Basah",
    storageType: "Freezer Ikan (-18°C)",
    currentStockKg: 42.0,
    minStockKg: 20.0,
    unit: "kg",
    pricePerUnit: 85000,
    bddPercent: 80,
    lotNumber: "LOT-KKP-20261011-02",
    supplier: "PT Bahari Nusantara Segar",
    receivedDate: "2026-10-11",
    expiryDate: "2026-10-18",
    daysUntilExpiry: 6,
    status: "Aman",
    tempRequirement: "-18°C s/d -20°C",
    lastTempChecked: -18.2,
    allergens: ["Seafood", "Ikan Laut"]
  },
  {
    id: "INV-WET-004",
    name: "Telur Ayam Ras Segar",
    category: "Gudang Basah",
    storageType: "Chiller Telur (4°C - 7°C)",
    currentStockKg: 120.0,
    minStockKg: 40.0,
    unit: "kg",
    pricePerUnit: 29000,
    bddPercent: 89, // Kulit dibuang 11%
    lotNumber: "LOT-TLR-20261008-04",
    supplier: "Peternakan Barokah Jaya",
    receivedDate: "2026-10-08",
    expiryDate: "2026-10-15",
    daysUntilExpiry: 3,
    status: "Perhatian (FEFO Segera Pakai)",
    tempRequirement: "4°C s/d 7°C",
    lastTempChecked: 4.8,
    allergens: ["Telur"]
  },
  {
    id: "INV-WET-005",
    name: "Wortel Brastagi Segar",
    category: "Gudang Basah",
    storageType: "Chiller Sayur (2°C - 5°C)",
    currentStockKg: 65.0,
    minStockKg: 25.0,
    unit: "kg",
    pricePerUnit: 16000,
    bddPercent: 88, // Kupas kulit 12%
    lotNumber: "LOT-WRT-20261011-01",
    supplier: "Koperasi Tani Agro Makmur",
    receivedDate: "2026-10-11",
    expiryDate: "2026-10-16",
    daysUntilExpiry: 4,
    status: "Aman",
    tempRequirement: "2°C s/d 5°C",
    lastTempChecked: 3.5,
    allergens: []
  },
  {
    id: "INV-WET-006",
    name: "Bayam Hijau Segar",
    category: "Gudang Basah",
    storageType: "Chiller Sayur (2°C - 5°C)",
    currentStockKg: 30.0,
    minStockKg: 15.0,
    unit: "kg",
    pricePerUnit: 12000,
    bddPercent: 71, // Batang kasar dibuang 29%
    lotNumber: "LOT-BYM-20261012-01",
    supplier: "Koperasi Tani Agro Makmur",
    receivedDate: "2026-10-12",
    expiryDate: "2026-10-14",
    daysUntilExpiry: 2,
    status: "Prioritas FEFO Hari Ini",
    tempRequirement: "2°C s/d 5°C",
    lastTempChecked: 3.6,
    allergens: []
  },
  {
    id: "INV-WET-007",
    name: "Tahu Putih Sutra Organik",
    category: "Gudang Basah",
    storageType: "Chiller Basah (2°C - 4°C)",
    currentStockKg: 50.0,
    minStockKg: 20.0,
    unit: "kg",
    pricePerUnit: 18000,
    bddPercent: 100,
    lotNumber: "LOT-THU-20261012-02",
    supplier: "Pabrik Tahu Lestari",
    receivedDate: "2026-10-12",
    expiryDate: "2026-10-15",
    daysUntilExpiry: 3,
    status: "Aman",
    tempRequirement: "2°C s/d 4°C",
    lastTempChecked: 3.2,
    allergens: ["Kedelai"]
  },

  // GUDANG KERING (Suhu Ruang Terkontrol 20°C - 25°C & Kelembapan <70%)
  {
    id: "INV-DRY-001",
    name: "Beras Ramos Setra Premium",
    category: "Gudang Kering",
    storageType: "Gudang Kering (Palet Kayu)",
    currentStockKg: 850.0,
    minStockKg: 300.0,
    unit: "kg",
    pricePerUnit: 15500,
    bddPercent: 100,
    lotNumber: "LOT-BRS-20260920-01",
    supplier: "Perum BULOG Divre Jawa Barat",
    receivedDate: "2026-09-20",
    expiryDate: "2027-03-20",
    daysUntilExpiry: 159,
    status: "Aman",
    tempRequirement: "20°C s/d 25°C, RH < 70%",
    lastTempChecked: 22.4,
    allergens: []
  },
  {
    id: "INV-DRY-002",
    name: "Susu Enteral Khusus Peptamen 400g (Peptida Sepsis/ICU)",
    category: "Gudang Kering",
    storageType: "Gudang Kering Formula Medis",
    currentStockKg: 48.0, // 120 kaleng
    minStockKg: 20.0,
    unit: "kaleng",
    pricePerUnit: 285000,
    bddPercent: 100,
    lotNumber: "LOT-PEP-20260815-99",
    supplier: "PT Nestle Health Science Indonesia",
    receivedDate: "2026-08-15",
    expiryDate: "2027-08-15",
    daysUntilExpiry: 307,
    status: "Aman",
    tempRequirement: "Ruang Bersih Medis 20°C",
    lastTempChecked: 21.8,
    allergens: ["Susu (Hidrolisat Sebagian)"]
  },
  {
    id: "INV-DRY-003",
    name: "Susu Enteral Nephrisol Vanilla 201g (Diet Rendah Protein GGK)",
    category: "Gudang Kering",
    storageType: "Gudang Kering Formula Medis",
    currentStockKg: 65.0,
    minStockKg: 25.0,
    unit: "box",
    pricePerUnit: 92000,
    bddPercent: 100,
    lotNumber: "LOT-NEP-20260710-12",
    supplier: "PT Kalbe Farma Nutrition",
    receivedDate: "2026-07-10",
    expiryDate: "2027-04-10",
    daysUntilExpiry: 180,
    status: "Aman",
    tempRequirement: "20°C s/d 24°C",
    lastTempChecked: 21.9,
    allergens: ["Susu Sapi"]
  },
  {
    id: "INV-DRY-004",
    name: "Minyak Goreng Kelapa Sawit Fortifikasi Vitamin A",
    category: "Gudang Kering",
    storageType: "Gudang Kering Rak A",
    currentStockKg: 240.0,
    minStockKg: 80.0,
    unit: "liter",
    pricePerUnit: 17500,
    bddPercent: 100,
    lotNumber: "LOT-MYK-20260901-08",
    supplier: "PT Wilmar Nabati",
    receivedDate: "2026-09-01",
    expiryDate: "2027-09-01",
    daysUntilExpiry: 324,
    status: "Aman",
    tempRequirement: "Suhu Ruang 20°C - 26°C",
    lastTempChecked: 23.0,
    allergens: []
  },
  {
    id: "INV-DRY-005",
    name: "Gula Jagung Rendah Kalori (Diabetasol Stevia)",
    category: "Gudang Kering",
    storageType: "Gudang Kering Formula Medis",
    currentStockKg: 35.0,
    minStockKg: 10.0,
    unit: "kg",
    pricePerUnit: 78000,
    bddPercent: 100,
    lotNumber: "LOT-GLA-20260615-05",
    supplier: "PT Kalbe Farma Nutrition",
    receivedDate: "2026-06-15",
    expiryDate: "2027-06-15",
    daysUntilExpiry: 246,
    status: "Aman",
    tempRequirement: "Ruang Kering 20°C - 24°C",
    lastTempChecked: 22.1,
    allergens: []
  }
];

export const initialHACCPLogs = [
  {
    id: "HACCP-LOG-001",
    pointName: "Freezer Daging 1 (Penyimpanan Daging Beku)",
    standardTemp: "< -18.0°C",
    measuredTemp: -18.6,
    timestamp: "2026-10-12 06:00",
    officer: "Agus Salim, A.Md",
    status: "Pass (Sesuai)",
    correctiveAction: "-"
  },
  {
    id: "HACCP-LOG-002",
    pointName: "Chiller Sayur & Buah Segar",
    standardTemp: "2.0°C - 5.0°C",
    measuredTemp: 3.4,
    timestamp: "2026-10-12 06:15",
    officer: "Agus Salim, A.Md",
    status: "Pass (Sesuai)",
    correctiveAction: "-"
  },
  {
    id: "HACCP-LOG-003",
    pointName: "CCP 1 - Pemasakan Ayam Bumbu Kuning (Suhu Pusat Daging)",
    standardTemp: ">= 75.0°C selama minimal 2 menit",
    measuredTemp: 84.5,
    timestamp: "2026-10-12 09:45",
    officer: "Chef Bambang Sutrisno",
    status: "Pass (Bakteri Patogen Mati)",
    correctiveAction: "-"
  },
  {
    id: "HACCP-LOG-004",
    pointName: "CCP 2 - Holding Suhu Makanan Sebelum Distribusi (Penyajian Hangat)",
    standardTemp: ">= 60.0°C",
    measuredTemp: 64.2,
    timestamp: "2026-10-12 11:15",
    officer: "Chef Bambang Sutrisno",
    status: "Pass (Aman)",
    correctiveAction: "-"
  },
  {
    id: "HACCP-LOG-005",
    pointName: "Freezer Ikan & Seafood 2",
    standardTemp: "< -18.0°C",
    measuredTemp: -16.8, // Pernah terjadi insiden ringan
    timestamp: "2026-10-11 14:00",
    officer: "Agus Salim, A.Md",
    status: "Warning (Tercatat Koreksi)",
    correctiveAction: "Pintu freezer dibuka terlalu lama saat loading stok. Kompresor disetel ke Mode High, suhu kembali normal -19.2°C dalam 30 menit."
  }
];

export const initialSIMRSTransactions = [
  {
    id: "TRX-ADT-001",
    type: "ADT (Admission)",
    time: "2026-10-12 02:00:14",
    endpoint: "/api/v1/simrs/adt/admission",
    status: "200 OK (Success)",
    source: "SIMRS Sentral RSUD",
    patientName: "Tn. Hendro Wicaksono",
    noRm: "00-55-12-78",
    ward: "Rawat Inap Melati Bed 06",
    actionTaken: "Otomatis membuat antrean Skrining Gizi <24 Jam & akun diet sementara."
  },
  {
    id: "TRX-CPOE-002",
    type: "CPOE (Diet Order)",
    time: "2026-10-11 15:30:22",
    endpoint: "/api/v1/simrs/cpoe/diet-prescription",
    status: "200 OK (Success)",
    source: "RME Dokter DPJP",
    patientName: "Ny. Ratnawati",
    noRm: "00-51-09-32",
    ward: "Melati Bed 04A",
    actionTaken: "Instruksi Diet Rendah Protein 40g + RG II + RK diterima & bridging ke Dapur Gizi."
  },
  {
    id: "TRX-BILL-003",
    type: "Billing (Kasir Gizi)",
    time: "2026-10-11 18:00:05",
    endpoint: "/api/v1/simrs/billing/nutrition-charges",
    status: "201 Created",
    source: "SIGIZI Klinis",
    patientName: "Ny. Endang Sri",
    noRm: "00-44-31-07",
    ward: "Anggrek VIP Bed 01",
    actionTaken: "Tarif Konseling Gizi Spesialis Rp 85.000 & Paket Makan VIP Rp 120.000/hari terkirim ke Billing SIMRS."
  }
];

export const initialAuditLogs = [
  {
    id: "AUDIT-001",
    timestamp: "2026-10-12 08:30:11",
    user: "Nurul Hidayati, S.Tr.Gz, RD",
    role: "Dietisien",
    action: "READ_MEDICAL_DATA",
    target: "Tn. Sudirman (RM: 00-48-21-90)",
    details: "Melihat hasil laboratorium Albumin & GDS untuk asuhan gizi PAGT.",
    pdpEncrypted: true
  },
  {
    id: "AUDIT-002",
    timestamp: "2026-10-12 08:35:45",
    user: "dr. Hendra Prasetyo, Sp.PD-KGEH",
    role: "Dokter (DPJP)",
    action: "APPROVE_CPPT",
    target: "Tn. Sudirman (RM: 00-48-21-90)",
    details: "Melakukan verifikasi dan digital signature pada formulir CPPT ADIME.",
    pdpEncrypted: true
  },
  {
    id: "AUDIT-003",
    timestamp: "2026-10-12 08:42:00",
    user: "Chef Bambang Sutrisno",
    role: "Petugas Produksi Dapur",
    action: "BATCH_PRINT_LABELS",
    target: "Shift Siang - 180 Plato",
    details: "Mencetak barcode label makan tahan air untuk Bangsal Melati, Mawar, dan ICU.",
    pdpEncrypted: false
  },
  {
    id: "AUDIT-004",
    timestamp: "2026-10-12 08:50:20",
    user: "Ns. Siti Rahmah, S.Kep",
    role: "Perawat Bangsal",
    action: "BEDSIDE_VERIFICATION",
    target: "Ny. Ratnawati (Bed 04A)",
    details: "Scan QR plato PLT-MLT-04A cocok dengan gelang pasien GST-00-51-09-32. Makanan diserahkan.",
    pdpEncrypted: true
  }
];

export const initialStarkesMetrics = {
  skp1IdentifikasiPasien: {
    title: "SKP 1: Ketepatan Identifikasi Pasien (Double Check Label vs Gelang)",
    score: 99.6,
    target: 100.0,
    unit: "%",
    status: "Memenuhi Standar",
    evaluatedCount: 1480,
    mismatchPrevented: 6 // 6 kali insiden nyaris cedera (koreksi sebelum pasien makan)
  },
  asuhanGizi24Jam: {
    title: "PGRS / PAP 4: Asuhan Gizi < 24 Jam Pasien Risiko Tinggi (Skrining Awal)",
    score: 97.2,
    target: 95.0,
    unit: "%",
    status: "Sangat Baik (Di atas Target)",
    evaluatedCount: 420
  },
  sisaMakananComstock: {
    title: "Indikator Mutu Nasional: Sisa Makanan yang Tidak Dihabiskan Pasien",
    score: 13.8, // Standar STARKES Kemenkes adalah < 20%
    target: 20.0,
    unit: "%",
    status: "Sangat Baik (< 20%)",
    targetLabel: "Target Nasional < 20%"
  },
  haccpSanitasiDapur: {
    title: "PPI 7 / MFK 5: Inspeksi Sanitasi Dapur & Kepatuhan Suhu Cold Storage HACCP",
    score: 98.4,
    target: 95.0,
    unit: "%",
    status: "Lulus Akreditasi Paripurna"
  },
  foodCostRealization: {
    title: "Efisiensi Food Cost per Patient Day (Harian Rawat)",
    actualCost: 46500, // Rp 46.500
    budgetLimit: 52000, // Budget pagu RS Rp 52.000
    unit: "Rp/Pasien/Hari",
    variance: "-10.5% (Hemat Anggaran RS)"
  }
};
