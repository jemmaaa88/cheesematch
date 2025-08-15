# KHAIRCHEESEMATCH — Static Website

Teknologi: HTML + CSS + JavaScript murni (tanpa framework) — cocok untuk GitHub Pages.

## Fitur
- Slider produk terlaris (maks 5) dengan autoplay, tombol prev/next, dan dot nav.
- Keranjang belanja dengan drawer (localStorage, hitung total, tambah/kurangi qty).
- Testimoni pelanggan (seed + input testimoni baru, tersimpan di localStorage).
- Form Kritik & Saran (tersimpan di localStorage).
- Skema warna kuning–oranye dan hijau matcha (CSS variables).
- Aset gambar dalam bentuk **SVG** agar tajam dan ringan.
- Desain responsif.

## Struktur Folder
```
/
├─ index.html
└─ assets/
   ├─ css/styles.css
   ├─ js/app.js
   └─ img/
      ├─ favicon.svg
      ├─ logo.svg
      ├─ hero-platters.svg
      ├─ prod-original.svg
      ├─ prod-matcha.svg
      ├─ prod-strawberry.svg
      ├─ prod-blueberry.svg
      ├─ prod-tiramisu.svg
      └─ prod-minibox.svg
```

## Deploy ke GitHub Pages
1. Buat repo baru bernama `khaircheesematch` (atau bebas).
2. Upload semua file/folder ini ke root repo.
3. Buka **Settings → Pages** → pilih **Deploy from a branch**, branch `main`, folder `/root`.
4. Simpan, tunggu beberapa saat hingga situs aktif di URL GitHub Pages kamu.

> Catatan: Semua data form dan keranjang tersimpan di **localStorage** perangkat pengunjung.
