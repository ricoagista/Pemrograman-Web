# Codelab Modul 2 — Pemrograman Web

**Nama:** Rico  
**NIM:** 202410370110433  
**Mata Kuliah:** Pemrograman Web  
**Modul:** 2 (JavaScript DOM & Fetch API)

---

## Struktur Folder

```
modul_2/Codelab/
├── index.html      ← Landing page (dimodifikasi dari Modul 1)
├── script.js       ← JavaScript untuk navbar toggle + validasi form
├── api.html        ← Halaman baru: menampilkan data dari public API
├── api.js          ← JavaScript untuk Fetch API
├── 1.jpg
├── 2.jpg
└── 3.jpg
```

> `modul_1/Codelab/` tidak diubah sama sekali.

---

## Bagian 1 — Interaksi DOM

### Perubahan pada `index.html`

**1. Navbar toggle mobile**

Struktur navbar diubah agar responsif. Ditambahkan:

- Tombol hamburger (`<button id="menu-toggle">`) dengan tiga garis putih, hanya tampil di layar kecil (`md:hidden`).
- `<ul id="nav-menu">` untuk desktop: `hidden md:flex` — selalu terlihat di ≥ 768px.
- `<ul id="nav-menu-mobile">` untuk mobile: `hidden flex-col ... md:hidden` — menu vertikal yang toggle saat hamburger diklik.
- Atribut `aria-label` dan `aria-expanded="false"` pada tombol untuk aksesibilitas.

**2. Validasi form kontak**

- `<form>` diberi `id="contact-form"`.
- Ditambahkan `<p id="error-name">`, `<p id="error-email">`, `<p id="error-message">` di bawah tiap field sebagai tempat pesan error.
- Ditambahkan `<p id="success-msg">` di atas tombol submit untuk pesan sukses.
- Tag `<script src="script.js" defer></script>` dihubungkan sebelum `</body>`.
- Baris ` ``` ` yang nyasar di akhir file dihapus.

**3. Link "API" di navbar** *(ditambahkan saat Bagian 2)*

- Item `<li><a href="api.html">API</a></li>` ditambahkan di `#nav-menu` (desktop) dan `#nav-menu-mobile` (mobile).

---

### File baru: `script.js`

Dua fitur utama:

**A. Navbar Toggle**

```js
const menuToggle = document.querySelector("#menu-toggle");
const navMenuMobile = document.querySelector("#nav-menu-mobile");

menuToggle.addEventListener("click", function () { ... });
```

- Klik tombol → `classList.toggle("hidden")` pada `#nav-menu-mobile`.
- `aria-expanded` diperbarui setiap toggle (`"true"` / `"false"`).
- `aria-label` ikut berubah ("Buka" / "Tutup menu navigasi").
- Tiap link di menu mobile punya listener `click` → menutup menu otomatis.

**B. Validasi Form**

Dibungkus dalam `if (form) { ... }` agar aman dijalankan di halaman tanpa form (seperti `api.html`).

| Field | Aturan validasi |
|-------|----------------|
| Nama | Wajib diisi, minimal 3 karakter |
| Email | Wajib diisi, harus cocok regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Pesan | Wajib diisi, minimal 10 karakter |

- `event.preventDefault()` mencegah form terkirim ke server.
- Jika ada error: `textContent` diisi pesan, border input berubah merah (`border-red-500`).
- Event `input` di tiap field → error langsung hilang saat user mengetik ulang.
- Jika semua valid: pesan sukses muncul hijau, `form.reset()` dipanggil.

---

## Bagian 2 — Fetch API

### File baru: `api.html`

Struktur dan gaya identik dengan `index.html`:
- Head: Tailwind CDN + `@theme` yang sama.
- Navbar: tombol hamburger + menu desktop + menu mobile, dengan link mengarah ke `index.html`, `index.html#cards`, `index.html#contact`, dan `api.html`.
- Footer: sama persis.
- Isi `<main>`: section "Data Pengguna" berisi:
  - `<p id="loading-message">` — status loading.
  - `<p id="error-message">` — pesan jika fetch gagal.
  - `<div id="user-list">` — grid responsif (1 kolom mobile / 2 kolom md / 3 kolom lg).
- Memuat `script.js` (navbar toggle) dan `api.js` (fetch data).

---

### File baru: `api.js`

**Konstanta & elemen:**

```js
const API_URL = "https://jsonplaceholder.typicode.com/users";
const loadingMessage = document.querySelector("#loading-message");
const errorMessage   = document.querySelector("#error-message");
const userList       = document.querySelector("#user-list");
```

**`renderUsers(users)`**

Menerima array user, menghasilkan HTML card dengan `map()` + template literal + `join("")`, lalu dimasukkan ke `userList.innerHTML`.

Tiap card menampilkan:
- Nama (`user.name`)
- Email (`user.email`)
- Nama perusahaan (`user.company.name`)
- Kota (`user.address.city`)

**`getUsers()` — async/await dengan try/catch/finally**

```
sebelum fetch  → loadingMessage = "Loading data..."
try            → fetch → cek response.ok → parse JSON → renderUsers()
catch          → errorMessage = "Data gagal dimuat. Coba lagi nanti."
finally        → loadingMessage = ""   (selalu bersih)
```

Jika `response.ok` bernilai `false` (misal status 404), dilempar `new Error(...)` yang akan ditangkap oleh blok `catch`.

---

## Konsep JavaScript yang Digunakan

| Konsep | Dipakai di |
|--------|-----------|
| `const` / `let` | Semua file |
| `querySelector` / `querySelectorAll` | `script.js`, `api.js` |
| `addEventListener` | `script.js` |
| `classList.toggle` / `.add` / `.remove` | `script.js` |
| `setAttribute` / `getAttribute` | `script.js` |
| `textContent` / `innerHTML` | `script.js`, `api.js` |
| Template literal (`` ` ` ``) | `api.js` |
| `Array.map()` + `join("")` | `api.js` |
| `fetch` + `async/await` | `api.js` |
| `response.ok` | `api.js` |
| `try / catch / finally` | `api.js` |

---

## Cara Menjalankan

1. Buka folder `modul_2/Codelab/` dengan **Live Server** di VS Code (klik kanan `index.html` → *Open with Live Server*), atau buka langsung file `index.html` di browser.
2. Halaman API dapat diakses lewat link **API** di navbar, atau buka `api.html` langsung.

> Tanpa Live Server pun bisa jalan karena tidak ada build step — Tailwind dimuat via CDN.

---

## Catatan

- `modul_1/Codelab/` tidak disentuh sama sekali; semua perubahan ada di `modul_2/Codelab/`.
- JavaScript yang digunakan murni **vanilla JS** tanpa library tambahan.
- Tailwind CSS tetap digunakan via CDN (`@tailwindcss/browser@4`).
