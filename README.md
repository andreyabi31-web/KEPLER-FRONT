# KEPLER FRONT: Operasi Pemulihan Stasiun Kepler

Game FPS 3D berbasis browser (HTML, CSS, JavaScript, three.js) yang dibuat sebagai proyek akhir mata kuliah Fisika.
Setiap konsep fisika yang diajarkan menjadi mekanik permainan, bukan sekadar teks.

**Cerita.** Tahun 2187. AI pemberontak bernama TITAN meretas Stasiun Kepler di planet Kepler-186f.
Kamu adalah Letnan Arka dengan Exo-Suit prototipe. Rebut kembali 11 sektor, jawab uji teknis di tiap titik pemeriksaan, lalu hancurkan inti Titan.

## Fitur
- Dunia terbuka 3D dengan bukit, lembah, kawah, dataran tinggi bertebing, 3 bangunan stasiun besar yang bisa dimasuki (rover pun muat lewat pintunya), radar bergambar medan dan ketinggian, reruntuhan dan penghalang sebagai tempat berlindung, serta suasana langit dan kabut yang berbeda di tiap sektor. 11 sektor dengan checkpoint, bos, dan soal uji fisika di tiap sektor
- 3 senjata (senapan dengan red dot, shotgun dengan ghost ring, railgun dengan scope 2x/4x), medkit, granat, jetpack
- Rover 4x4 dengan kabin interior, fisika gesekan, tikungan, dan tumbukan. Pengemudi fokus menyetir (tanpa senjata), penumpang online bisa menembak dari kursi
- Drone pendamping KAI-7, toko pedagang dengan sistem kredit, kejadian acak (hujan meteor, badai debu, peti suplai parasut, penyergapan)
- Mode online co-op sampai 4 pemain (WebRTC lewat PeerJS): revive teman yang tumbang, 4 peran (Serbaguna, Medik, Penyerbu, Teknisi), berbagi amunisi dan medkit, konsol kerja sama dua pemain, penumpang rover yang bisa menembak, titik lemah Titan yang butuh tembakan dua pemain, dan gelombang tekanan yang mengenai semua pemain
- Night Vision (computer vision): deteksi warna, pelacakan antar-frame, grafik v-t
- Boss Titan 3 fase (armor terbuka dengan titik lemah, gelombang tekanan, animasi kehancuran), musuh penembak jitu, AI yang mencari, berlindung, mengepung, dan memanggil bala bantuan
- Misi sampingan (selamatkan ilmuwan, cari komponen, aktifkan generator), cerita KAI-7, drum ledak, upgrade senjata, armor, jetpack, dan drone
- Laboratorium fisika dengan database eksperimen, grafik real-time, lintasan granat, 9 pencapaian
- Simpan progres, tingkat kesulitan, nilai akhir A+ sampai D, laporan eksperimen fisika, mode pameran

## Kontrol
| Tombol | Fungsi |
|---|---|
| W A S D | Bergerak |
| Shift | Sprint |
| Spasi | Lompat (tahan di udara untuk jetpack) |
| Klik kiri / klik kanan | Tembak / bidik (scope) |
| Z | Ganti zoom scope railgun (2x / 4x) |
| 1, 2, 3 | Ganti senjata |
| R, G, H | Isi ulang, granat, medkit |
| Q | Serangan orbital (aktif di Sektor 4) |
| F | Naik atau turun rover |
| E | Toko pedagang |
| V | Night Vision (computer vision) |
| Tab | Sembunyikan atau tampilkan panel rumus di kanan atas |
| T | Grafik fisika real-time (s-t, v-t, a-t, KE dan PE) |
| L | Laboratorium fisika (eksperimen proyektil dan gaya-gesekan) |
| I | Statistik dan pencapaian |
| Tahan G | Lihat lintasan parabola granat, lepas untuk melempar |
| B / N | Bagi amunisi / medkit ke teman terdekat (online) |
| E | Interaksi: toko, selamatkan ilmuwan, hidupkan teman yang tumbang, aktifkan generator dan konsol |
| C | Kodeks Fisika |
| M | Matikan atau nyalakan musik |
| Esc | Jeda (ada tombol Menu utama) |

## Peta konsep fisika
Acuan: Giancoli, *Physics: Principles with Applications*, Bab 1 sampai 7, ditambah proyek JOULE (energi), IMPULSE (momentum), ORBITAL (Kepler), simulasi FBD robotika, dan computer vision.

| Materi | Di dalam game |
|---|---|
| Bab 1: Pengukuran, satuan SI | Semua angka HUD memakai satuan SI |
| Bab 2: Kinematika 1D | Panel v dan a, lompat, jetpack, peti suplai berparasut |
| Bab 3: Vektor dan gerak 2D | Komponen vx dan vz, peluru dan granat parabola, zeroing senjata |
| Bab 4: Hukum Newton | Traksi a <= mu*g di es, rekoil (hukum III), rover (F = ma), panel FBD |
| Bab 5: Gerak melingkar, gravitasi | Rover menikung (Fc = mv^2/r, selip), tikungan miring, satelit elips (Kepler), bobot semu |
| Bab 6: Usaha, energi, daya | KE, PE, Em, pad pegas (1/2 k x^2), panas dari gesekan, P = F.v |
| Bab 7: Momentum | Impuls peluru dan granat, tumbukan tak lenting rover, restitusi, pusat massa serpihan, roket jetpack |
| Computer vision | Night Vision: deteksi warna MERAH/HIJAU/BIRU, pelacakan, filter EMA alpha = 0,25 |

## Menjalankan
Tidak perlu instalasi. Buka `index.html` di Chrome atau Edge (perlu internet untuk memuat three.js, PeerJS, dan font).
Atau jalankan server lokal: `python -m http.server 8000` lalu buka `http://localhost:8000`.

## Deploy ke GitHub Pages
1. Unggah isi folder ini ke repositori GitHub.
2. Settings, Pages, Source: *Deploy from a branch*, pilih branch `main` dan folder `/ (root)`.
3. Bagikan link `https://<username>.github.io/<nama-repo>/` ke teman.

## Main online
Semua pemain membuka link yang sama, mengisi **kode room yang sama** (nama bebas, misalnya `kelompok7`), lalu klik *Main online*.
Pemain yang masuk pertama menjadi penghubung dan tidak boleh keluar selama yang lain masih bermain.
Koneksi memakai server sinyal publik PeerJS, tanpa server milik sendiri. Pada jaringan yang memblokir WebRTC, koneksi bisa gagal.

## Pengujian
Jalankan `npm test` (atau `node tests/run-all.js`). Butuh Node 18 atau lebih baru, tanpa dependensi tambahan.
Tes menjalankan kode game apa adanya di dalam sandbox Node dengan mesin 3D tiruan, jadi yang diuji adalah **logika**, bukan tampilan.

| Suite | Yang divalidasi |
|---|---|
| Fisika (19 tes) | gesekan kinetik (jarak berhenti = v²/2μg) di tanah dan es, traksi a ≤ μg, tinggi lompat dan kekekalan energi mekanik, gerak parabola peluru, rem rover, kekekalan momentum pada tumbukan tak lenting, impuls peluru (Δv = J/m), hukum Kepler 2 dan 3, vis-viva, pad pegas (½kx² = ½mv²), laboratorium simulasi vs teori, konsistensi medan |
| UI, senjata, scope (9 tes) | model senjata, sight disembunyikan saat membidik, zeroing peluru tepat di crosshair (hip dan ADS), jejak peluru sejajar sumbu pandang, ketahanan terhadap posisi tidak valid, musuh tidak menembus rintangan |
| Multiplayer (23 tes) | tiga salinan game nyata terhubung lewat jaringan tiruan: pemilihan host, sinkron posisi, sinkron musuh dan misi, kerusakan dari klien ke host, soal uji dan kemajuan sektor, berbagi amunisi dan medkit, revive, konsol kerja sama, titik lemah boss kerja sama, gelombang tekanan, pemain terlambat, host keluar |

**Batas pengujian:** tidak mencakup tampilan (render WebGL), performa, jaringan sungguhan (WebRTC), dan perangkat input nyata.
Itu tetap perlu dicoba manual di browser dengan beberapa pemain.

## Teknologi dan atribusi
- [three.js](https://threejs.org) r128 (MIT), [PeerJS](https://peerjs.com) (MIT), font Chakra Petch dan Barlow (SIL OFL)
- Semua model, tekstur, dan suara dibuat secara prosedural dalam kode
- Proyek ini dibuat dengan bantuan asisten AI (Claude, Anthropic)

## Keterbatasan
Model 3D disusun dari bentuk dasar, medan masih datar, dan AI musuh masih sederhana. Mode online belum diuji di berbagai jaringan.

## Lisensi
MIT, lihat `LICENSE`.
