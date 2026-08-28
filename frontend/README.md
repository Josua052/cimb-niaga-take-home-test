# Call Monitoring Dashboard - Frontend

Frontend antarmuka web untuk aplikasi **Supervisor Call Monitoring Dashboard** yang dibangun menggunakan **React 18**, **TypeScript**, **Vite**, dan **Tailwind CSS**.

Aplikasi ini digunakan khusus oleh **Supervisor** untuk memantau, memfilter, dan menganalisis performa interaksi panggilan antara petugas **Customer Service (CS)** dan **Nasabah**.

---

## Fitur Utama dan Arsitektur

1. **Dashboard Khusus Supervisor (Read-Only)**:
   - Menampilkan data rekaman panggilan customer service secara langsung dari backend REST API PostgreSQL tanpa manipulasi data lokal.
2. **Pencarian Responsif dengan Debouncing**:
   - Mendukung pencarian kata kunci berdasarkan Call ID, CS Name, dan Nama Nasabah dengan proteksi anti-spam API (debounce 300ms).
3. **Penyaringan Tanggal Presisi**:
   - Filter rentang periode dibatasi maksimal 3 bulan terakhir dengan penanganan waktu lokal untuk memastikan akurasi kalender di seluruh zona waktu Indonesia.
4. **Indikator Visual Kategori Sentimen**:
   - Pilihan filter sentimen (skor di bawah 70% dan 70% atau lebih) disertai badge visual penanda kepuasan nasabah (merah/hijau).
5. **Penanganan Status Tabel (3-State Handling)**:
   - Tampilan kerangka animasi (skeleton) saat memuat data untuk menjaga kestabilan tata letak antarmuka.
   - Penanganan kondisi galat dengan pesan informatif dan tombol pemulihan.
   - Pesan kontekstual saat hasil pencarian tidak ditemukan.
   - Pengurutan per-kolom dengan indikator arah sort yang jelas.
6. **Kontrol Paginasi Server-Side**:
   - Navigasi halaman dengan batasan tetap 5 data per halaman, indikator halaman yang mudah dibaca, serta ringkasan jumlah rekaman.
7. **Tata Letak Responsif dan Error Boundary**:
   - Penyesuaian antarmuka otomatis untuk perangkat desktop, tablet, dan ponsel.
   - Dilengkapi komponen penangkap galat runtime untuk mencegah kegagalan tampilan secara menyeluruh.

---

## Spesifikasi Teknologi

- **Framework**: React 18.3 + TypeScript (Strict Mode)
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **HTTP Client**: Axios (dengan mekanisme pembatalan request `AbortController`)
- **Testing**: Vitest + React Testing Library + jsdom

---

## Panduan Instalasi dan Menjalankan

### 1. Prasyarat Sistem
- Node.js versi 18.x atau 20.x
- npm versi 9.x atau lebih baru

### 2. Instalasi Dependensi
```bash
cd frontend
npm install
```

### 3. Konfigurasi Lingkungan
Pastikan file konfigurasi `.env` telah disiapkan:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173`.

---

## Pengujian dan Build Produksi

### Menjalankan Automated Tests (42 Tests Passed)
```bash
npm test
```

### Membangun Bundle Produksi
```bash
npm run build
```
Hasil kompilasi produksi yang teroptimasi akan disimpan di folder `dist/`.

---

## Struktur Direktori

```
frontend/
├── src/
│   ├── assets/              # Asset statis
│   ├── components/          # Reusable UI Primitives (SearchBar, Pagination, ErrorBoundary)
│   │   └── layout/          # Layout Shell (AppLayout, Header, Sidebar)
│   ├── constants/           # Konstanta Aplikasi
│   ├── features/
│   │   └── monitoring/      # Modul Fitur Monitoring
│   │       ├── components/  # Table, FilterToolbar, SentimentBadge, PeriodFilter, SentimentFilter
│   │       ├── hooks/       # useCallMonitoring (Data fetching, state management, cancellation)
│   │       ├── services/    # callMonitoringService (Axios API Client)
│   │       └── types/       # TypeScript Type Definitions
│   ├── pages/               # MonitoringPage (Komponen Halaman Utama)
│   ├── utils/               # Fungsi Formatter dan Utilitas
│   ├── App.tsx              # Root Component
│   └── main.tsx             # Entry Point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
