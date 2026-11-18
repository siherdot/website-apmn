export const site = {
  name: "PT Ade Putri Medical Nusantara",
  short: "APMN",
  url: "https://adeputrimedicalnusantara.co.id",
  tagline: "Berkomitmen menghadirkan layanan kesehatan yang mudah, cepat, dan setara.",
  phone: "0812-9690-8881",
  email: "ptapmn@adeputrimedicalnusantara.co.id",
  address: "Jentera Stabat, Kec. Wampu, Kabupaten Langkat, Sumatera Utara",
  rsUrl: "https://rsu.putribidadari.co.id/",
  docs: {
    laporanTahunan:
      "https://drive.google.com/file/d/1UvG9gG4WCmSRjfLvnFUlMLdTqL_w2sqi/view?usp=drive_link",
    piagamKomiteAudit:
      "https://drive.google.com/file/d/1PA38-94bJjKXg1gpeewv0hy_ijxQGs6A/view?usp=sharing",
    prospektus:
      "https://drive.google.com/file/d/1RMqzhbqLCWRi5nrXnQmwqMe4XylmPfa5/view",
  },
} as const;

export type Bagian = { h: string; p?: string[]; li?: string[]; taut?: { teks: string; url: string }[] };
export type Halaman = {
  slug: string;
  judul: string;
  kelompok: "Profil" | "Tata Kelola" | "Kinerja" | "Lainnya";
  ringkas: string;
  bagian: Bagian[];
};

export const navGroups: { label: string; items: { slug: string; judul: string }[] }[] = [
  { label: "Profil", items: [
    { slug: "sekilas-apmn", judul: "Sekilas APMN" },
    { slug: "tentang-kami", judul: "Tentang Kami" },
    { slug: "sejarah", judul: "Sejarah" },
    { slug: "rsu-putri-bidadari", judul: "RSU Putri Bidadari" },
  ]},
  { label: "Tata Kelola", items: [
    { slug: "tata-kelola", judul: "Gambaran Umum" },
    { slug: "struktur-tata-kelola", judul: "Struktur" },
    { slug: "dewan-komisaris", judul: "Dewan Komisaris" },
    { slug: "dewan-direksi", judul: "Dewan Direksi" },
    { slug: "komite-audit", judul: "Komite Audit" },
    { slug: "komite-nominasi-remunerasi", judul: "Komite Nominasi & Remunerasi" },
    { slug: "piagam-komite-audit", judul: "Piagam Komite Audit" },
    { slug: "prospektus", judul: "Prospektus" },
  ]},
  { label: "Kinerja", items: [
    { slug: "laporan-tahunan", judul: "Laporan Tahunan" },
    { slug: "laporan-keuangan", judul: "Laporan Keuangan" },
    { slug: "dividen", judul: "Dividen" },
    { slug: "keterbukaan-informasi", judul: "Keterbukaan Informasi" },
    { slug: "rapat-umum-pemegang-saham", judul: "RUPS" },
  ]},
  { label: "Lainnya", items: [
    { slug: "prestasi", judul: "Prestasi" },
    { slug: "video", judul: "Video" },
    { slug: "kontak", judul: "Kontak" },
  ]},
];

export const pages: Halaman[] = [
  {
    slug: "sekilas-apmn", judul: "Sekilas APMN", kelompok: "Profil",
    ringkas: "PT Ade Putri Medical Nusantara bergerak di bidang layanan kesehatan dan pengelolaan rumah sakit.",
    bagian: [
      { h: "Profil Perseroan", p: [
        "PT Ade Putri Medical Nusantara (APMN) berbisnis di bidang kesehatan. Kami berkomitmen menjadi pusat pelayanan masyarakat, termasuk di daerah yang masih minim akses layanan kesehatan.",
        "Portofolio utama perseroan adalah RSU Putri Bidadari di Kabupaten Langkat, Sumatera Utara. Pengelolaan rumah sakit dijalankan dengan prinsip tata kelola yang baik dan orientasi pada mutu layanan.",
      ]},
      { h: "Komitmen Kami", li: [
        "Menghadirkan layanan kesehatan yang mudah, cepat, dan setara.",
        "Menjaga mutu layanan melalui peningkatan kapasitas sumber daya manusia dan fasilitas.",
        "Menjalankan tata kelola perusahaan yang transparan dan akuntabel.",
      ]},
      { h: "Rumah Sakit Kami", p: ["Lihat informasi RSU Putri Bidadari, fasilitas, dan layanan yang tersedia."],
        taut: [{ teks: "Informasi RSU Putri Bidadari", url: "/rsu-putri-bidadari" }] },
    ],
  },
  {
    slug: "tentang-kami", judul: "Tentang Kami", kelompok: "Profil",
    ringkas: "APMN hadir untuk memperluas akses layanan kesehatan berkualitas di daerah yang membutuhkan.",
    bagian: [
      { h: "Siapa Kami", p: [
        "Ade Putri Medical Nusantara adalah perseroan yang bergerak di sektor kesehatan. Kami membangun dan mengelola fasilitas pelayanan kesehatan dengan fokus pada kebutuhan masyarakat di daerah terpencil maupun perkotaan.",
        "Kami meyakini layanan kesehatan yang baik bukan hanya soal fasilitas, tetapi juga soal akses, kecepatan, dan perlakuan yang setara bagi setiap pasien.",
      ]},
      { h: "Fokus Usaha", li: ["Pengelolaan rumah sakit.", "Pengembangan layanan spesialis dan penunjang medis.", "Penerapan tata kelola perusahaan yang baik."] },
    ],
  },
  {
    slug: "sejarah", judul: "Sejarah", kelompok: "Profil",
    ringkas: "Ringkasan perjalanan RSU Putri Bidadari sejak pembangunan dimulai pada 2016.",
    bagian: [
      { h: "Awal Pembangunan", p: [
        "RSU Putri Bidadari mulai dibangun pada 12 Februari 2016 berdasarkan izin prinsip Bupati Langkat H. Ngogesa Sitepu, SH, No. 645.3.267/KPT-LKT/2016. Gedung berlantai lima ini dirancang dengan kapasitas 300 tempat tidur.",
      ]},
      { h: "Peresmian", p: [
        "Rumah sakit diresmikan pada 30 Maret 2017 dengan izin Dinas Kesehatan Kabupaten Langkat. Sejak saat itu, RSU Putri Bidadari terus mengembangkan layanan spesialis, fasilitas penunjang, dan kapasitas rawat inap.",
      ]},
      { h: "Penghargaan", p: [
        "Pada 2023, RSU Putri Bidadari menerima piagam Brand Ambassador Rumah Sakit Berkomitmen Kelas B dari BPJS Kesehatan Kantor Cabang Medan.",
      ]},
    ],
  },
  {
    slug: "rsu-putri-bidadari", judul: "RSU Putri Bidadari", kelompok: "Profil",
    ringkas: "Rumah sakit umum di Stabat, Kabupaten Langkat, dengan layanan spesialis dan fasilitas penunjang.",
    bagian: [
      { h: "Tentang Rumah Sakit", p: [
        "RSU Putri Bidadari berlokasi di Jalan Stabat–Tanjung Pura, Kecamatan Wampu, Kabupaten Langkat. Rumah sakit menyediakan layanan rawat jalan, rawat inap, gawat darurat, dan berbagai layanan spesialis.",
        "Kesehatan Anda merupakan prioritas utama kami. Informasi dokter, jadwal praktik, dan fasilitas terkini tersedia di situs resmi rumah sakit.",
      ]},
      { h: "Fasilitas", li: ["Instalasi Gawat Darurat", "Rawat Inap dan Poliklinik", "Farmasi, Laboratorium, dan Radiologi", "ICU, NICU, dan Hemodialisa", "Bank Darah dan Cathlab"] },
      { h: "Kunjungi Situs RSU", p: ["Untuk jadwal dokter, layanan, dan informasi pasien, gunakan situs resmi RSU Putri Bidadari."],
        taut: [{ teks: "https://rsu.putribidadari.co.id/", url: site.rsUrl }] },
    ],
  },
  {
    slug: "tata-kelola", judul: "Tata Kelola Perusahaan", kelompok: "Tata Kelola",
    ringkas: "APMN menerapkan prinsip Good Corporate Governance dalam setiap keputusan dan kegiatan usaha.",
    bagian: [
      { h: "Gambaran Umum", p: [
        "Sebagai komitmen untuk menerapkan prinsip Good Corporate Governance (GCG) serta etika bisnis dan kerja yang baik, Dewan Komisaris, Direksi, dan seluruh pegawai PT Ade Putri Medical Nusantara menyatakan tidak akan melakukan aktivitas yang bertentangan dengan prinsip dan nilai perseroan.",
        "Tata kelola dijalankan melalui struktur Dewan Komisaris, Direksi, dan komite-komite pendukung yang bertugas memberikan pengawasan serta nasihat kepada Dewan Direksi.",
      ]},
      { h: "Dokumen Terkait", li: ["Struktur Tata Kelola Perusahaan", "Komite Audit", "Komite Nominasi & Remunerasi", "Piagam Komite Audit", "Prospektus"] },
    ],
  },
  {
    slug: "struktur-tata-kelola", judul: "Struktur Tata Kelola Perusahaan", kelompok: "Tata Kelola",
    ringkas: "Hubungan pengawasan dan pengelolaan antara Dewan Komisaris, Direksi, dan komite pendukung.",
    bagian: [
      { h: "Struktur", p: ["Dewan Komisaris melakukan pengawasan atas pengelolaan perseroan. Dewan Direksi menjalankan pengelolaan sehari-hari. Komite Audit serta Komite Nominasi dan Remunerasi mendukung pelaksanaan tugas Dewan Komisaris."] },
      { h: "Prinsip", li: ["Transparansi dan akuntabilitas.", "Pertanggungjawaban pengurus.", "Independensi pengawasan.", "Kewajaran perlakuan terhadap pemegang saham dan pemangku kepentingan."] },
    ],
  },
  {
    slug: "dewan-komisaris", judul: "Dewan Komisaris", kelompok: "Tata Kelola",
    ringkas: "Dewan Komisaris menjalankan fungsi pengawasan atas pengelolaan perseroan.",
    bagian: [
      { h: "Susunan Dewan Komisaris", p: ["Susunan nama dan riwayat jabatan Dewan Komisaris akan dimuat setelah data resmi perseroan terverifikasi."] },
      { h: "Tugas", li: ["Mengawasi kebijakan dan pelaksanaan pengelolaan oleh Direksi.", "Memberikan nasihat kepada Direksi dalam menjalankan perseroan.", "Memastikan penerapan tata kelola dan pengendalian internal."] },
    ],
  },
  {
    slug: "dewan-direksi", judul: "Dewan Direksi", kelompok: "Tata Kelola",
    ringkas: "Dewan Direksi bertanggung jawab atas pengelolaan perseroan sehari-hari.",
    bagian: [
      { h: "Susunan Dewan Direksi", p: ["Susunan nama dan riwayat jabatan Dewan Direksi akan dimuat setelah data resmi perseroan terverifikasi."] },
      { h: "Tugas", li: ["Menjalankan kegiatan usaha sesuai anggaran dasar dan keputusan RUPS.", "Menyusun rencana kerja dan anggaran perseroan.", "Melaporkan kinerja kepada Dewan Komisaris dan pemegang saham."] },
    ],
  },
  {
    slug: "komite-audit", judul: "Komite Audit", kelompok: "Tata Kelola",
    ringkas: "Komite Audit membantu Dewan Komisaris dalam pengawasan keuangan dan pengendalian internal.",
    bagian: [
      { h: "Tugas Komite Audit", li: [
        "Menelaah sistem pengendalian internal perseroan.",
        "Menelaah laporan keuangan dan informasi yang disampaikan kepada publik.",
        "Memberikan pendapat atas hasil audit internal dan eksternal.",
      ]},
      { h: "Piagam", p: ["Piagam Komite Audit dapat diunduh melalui tautan berikut."],
        taut: [{ teks: "Unduh Piagam Komite Audit", url: site.docs.piagamKomiteAudit }] },
    ],
  },
  {
    slug: "komite-nominasi-remunerasi", judul: "Komite Nominasi & Remunerasi", kelompok: "Tata Kelola",
    ringkas: "Komite yang membantu Dewan Komisaris dalam hal nominasi dan remunerasi pengurus.",
    bagian: [
      { h: "Tugas", li: [
        "Memberikan rekomendasi terkait calon anggota Dewan Komisaris dan Direksi.",
        "Menelaah kebijakan remunerasi pengurus dan karyawan.",
        "Menjaga keselarasan antara kinerja dan sistem penghargaan.",
      ]},
    ],
  },
  {
    slug: "piagam-komite-audit", judul: "Piagam Komite Audit", kelompok: "Tata Kelola",
    ringkas: "Dokumen resmi yang mengatur tugas, wewenang, dan tanggung jawab Komite Audit.",
    bagian: [
      { h: "Unduh Dokumen", p: ["Piagam Komite Audit tersedia dalam bentuk dokumen eksternal."],
        taut: [{ teks: "Buka Piagam Komite Audit", url: site.docs.piagamKomiteAudit }] },
    ],
  },
  {
    slug: "prospektus", judul: "Prospektus", kelompok: "Tata Kelola",
    ringkas: "Dokumen prospektus perseroan untuk informasi calon pemegang saham dan pemangku kepentingan.",
    bagian: [
      { h: "Dokumen", p: ["Prospektus dapat diakses melalui tautan resmi berikut."],
        taut: [{ teks: "Buka Prospektus", url: site.docs.prospektus }] },
    ],
  },
  {
    slug: "laporan-tahunan", judul: "Laporan Tahunan", kelompok: "Kinerja",
    ringkas: "Laporan tahunan perseroan sebagai bentuk pertanggungjawaban kepada pemegang saham.",
    bagian: [
      { h: "Dokumen", p: ["Laporan tahunan dapat diakses melalui tautan resmi berikut."],
        taut: [{ teks: "Buka Laporan Tahunan", url: site.docs.laporanTahunan }] },
    ],
  },
  {
    slug: "laporan-keuangan", judul: "Laporan Keuangan", kelompok: "Kinerja",
    ringkas: "Informasi laporan keuangan perseroan akan disajikan sesuai periode pelaporan.",
    bagian: [
      { h: "Laporan Keuangan", p: ["Dokumen laporan keuangan akan dimuat pada halaman ini setelah periode pelaporan dan proses audit selesai."] },
    ],
  },
  {
    slug: "dividen", judul: "Dividen", kelompok: "Kinerja",
    ringkas: "Kebijakan pembagian dividen perseroan dan hak yang sama bagi seluruh saham.",
    bagian: [
      { h: "Kebijakan Dividen", p: [
        "Seluruh saham perseroan memiliki hak yang sama, termasuk dalam hal dividen, sesuai anggaran dasar dan Undang-Undang No. 40 Tahun 2007 sebagaimana telah diubah dengan Undang-Undang No. 11 Tahun 2020 tentang Cipta Kerja.",
        "Kebijakan perseroan adalah memiliki laba ditahan apabila kinerja keuangan positif dan membayarkan dividen kepada pemegang saham. Pembayaran dividen bergantung pada arus kas, rencana investasi, serta peraturan perundang-undangan.",
      ]},
      { h: "Data Pembayaran", p: ["Untuk tahun buku 2022, RUPST dilaksanakan pada 25 Mei 2023 dengan pembayaran dividen pada 28 Juni 2023. Rasio pembayaran dari laba bersih 30,00%, jumlah dividend yang dibayarkan Rp85.776.554.500, dan jumlah per saham Rp3,17."] },
    ],
  },
  {
    slug: "keterbukaan-informasi", judul: "Keterbukaan Informasi", kelompok: "Kinerja",
    ringkas: "Komitmen perseroan menyampaikan informasi material secara tepat waktu dan dapat diakses.",
    bagian: [
      { h: "Prinsip Keterbukaan", li: [
        "Informasi material disampaikan secara akurat dan tepat waktu.",
        "Akses informasi diberikan secara setara kepada pemangku kepentingan.",
        "Dokumen penting tersedia melalui halaman terkait di situs ini.",
      ]},
      { h: "Dokumen", li: ["Laporan Tahunan", "Laporan Keuangan", "Prospektus", "Piagam Komite Audit"] },
    ],
  },
  {
    slug: "rapat-umum-pemegang-saham", judul: "Rapat Umum Pemegang Saham", kelompok: "Kinerja",
    ringkas: "Informasi terkait RUPS Tahunan dan RUPS Luar Biasa perseroan.",
    bagian: [
      { h: "RUPS Tahunan", p: ["RUPS Tahunan diselenggarakan paling lambat enam bulan setelah tahun buku berakhir untuk menyetujui laporan tahunan dan laporan keuangan serta menetapkan penggunaan laba."] },
      { h: "RUPS Luar Biasa", p: ["RUPS Luar Biasa diselenggarakan apabila diperlukan untuk keputusan di luar kewenangan RUPS Tahunan, sesuai anggaran dasar dan peraturan perundang-undangan."] },
      { h: "Jadwal", p: ["Jadwal dan materi rapat akan diumumkan pada halaman ini setelah penetapan resmi."] },
    ],
  },
  {
    slug: "prestasi", judul: "Prestasi", kelompok: "Lainnya",
    ringkas: "Apresiasi dan penghargaan yang diterima RSU Putri Bidadari.",
    bagian: [
      { h: "Brand Ambassador Rumah Sakit Berkomitmen", p: [
        "Pada 2023, RSU Putri Bidadari Langkat menerima piagam penghargaan sebagai Brand Ambassador Rumah Sakit Berkomitmen Kategori Kelas B dari BPJS Kesehatan Kantor Cabang Medan.",
        "Penghargaan ini menjadi bentuk komitmen rumah sakit dalam meningkatkan mutu layanan melalui janji layanan Mobile JKN dan inovasi yang mendukung kenyamanan pasien.",
      ]},
    ],
  },
  {
    slug: "video", judul: "Video", kelompok: "Lainnya",
    ringkas: "Kumpulan video profil dan dokumentasi kegiatan APMN serta RSU Putri Bidadari.",
    bagian: [
      { h: "Video", p: ["Materi video akan ditambahkan setelah tautan resmi dan izin penggunaan tersedia."] },
    ],
  },
  {
    slug: "kontak", judul: "Kontak Kami", kelompok: "Lainnya",
    ringkas: "Hubungi PT Ade Putri Medical Nusantara untuk pertanyaan dan informasi lebih lanjut.",
    bagian: [
      { h: "Data Kontak", li: [
        `Telepon: ${site.phone}`,
        `Email: ${site.email}`,
        `Alamat: ${site.address}`,
      ]},
      { h: "Pertanyaan", p: ["Untuk pertanyaan terkait layanan rumah sakit, jadwal dokter, atau informasi pasien, silakan mengunjungi situs resmi RSU Putri Bidadari."],
        taut: [{ teks: "Situs RSU Putri Bidadari", url: site.rsUrl }] },
    ],
  },
];

export const canonicLinks = [
  { nama: "RSU Putri Bidadari Aceh", url: "https://rsuputribidadariaceh.com" },
  { nama: "RSU Bidadari Binjai", url: "https://rsu.bidadari.co.id" },
  { nama: "RSU Bidadari Batubara", url: "https://rsu.bidadaribatubara.com" },
  { nama: "RSU Mahkota Bidadari", url: "https://rsu.mahkotabidadari.com" },
  { nama: "RSU Putri Bidadari", url: "https://rsu.putribidadari.co.id" },
];
