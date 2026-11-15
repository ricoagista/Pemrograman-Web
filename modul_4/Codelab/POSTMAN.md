# Panduan Pengujian API dengan Postman

REST API Peminjaman Buku Perpustakaan (Laravel 12).

## 1. Menjalankan Server

Prasyarat: PHP 8.2+ (dipakai 8.5), MySQL aktif (Laragon), `.env` sudah dikonfigurasi, `vendor/` terpasang.

```bash
php artisan migrate:fresh --seed
php artisan serve
```

- Base URL: `http://127.0.0.1:8000/api`
- Biarkan terminal `php artisan serve` tetap terbuka selama pengujian.
- Seeder hanya mengisi tabel `members` (2 member). Data buku harus dibuat lewat API.

## 2. Pengaturan Postman

Buat **Collection** baru (misalnya `Codelab 4 - Perpustakaan`) lalu tambahkan variabel:

| Variable | Value |
|---|---|
| `base_url` | `http://127.0.0.1:8000/api` |

Untuk **setiap request**, tambahkan header:

| Key | Value |
|---|---|
| `Accept` | `application/json` |

Untuk request dengan body: tab **Body** -> **raw** -> **JSON**.

> Tanpa header `Accept: application/json`, error validasi atau 404 bisa dikembalikan sebagai HTML/redirect, bukan JSON.

## 3. Alur Utama (Happy Path)

Jalankan berurutan.

| # | Method & URL | Body | Hasil yang diharapkan |
|---|---|---|---|
| 1 | `POST {{base_url}}/books` | JSON buku (field mengikuti `StoreBookRequest`, mis. `{"title": "Laravel 12"}`) | **201 Created** |
| 2 | `GET {{base_url}}/members/1` | - | **200**, `books` kosong |
| 3 | `POST {{base_url}}/members/1/borrow-book` | `{"book_id": 1}` | **200**, `"Buku berhasil dipinjam"` |
| 4 | `GET {{base_url}}/members/1` | - | **200**, buku muncul, `is_available: false` |
| 5 | `PATCH {{base_url}}/members/1/return-book/1` | - | **200**, `"Buku berhasil dikembalikan"` |
| 6 | `GET {{base_url}}/books/1` | - | **200**, `is_available: true`, `member_id: null` |

Jika langkah 1 menghasilkan **422**, baca isi `errors` pada response untuk mengetahui field wajib, atau lihat `app/Http/Requests/StoreBookRequest.php`.

## 4. Skenario Gagal (Failure Path)

Pastikan ada buku dengan `id = 1` yang **sedang dipinjam** member 1 untuk skenario 1 dan 4.

| # | Skenario | Request | Hasil yang diharapkan |
|---|---|---|---|
| 1 | Pinjam buku yang sudah dipinjam | `POST {{base_url}}/members/1/borrow-book` `{"book_id": 1}` | **409** `"Buku sedang dipinjam"` |
| 2 | Member tidak ditemukan (pinjam) | `POST {{base_url}}/members/999/borrow-book` `{"book_id": 1}` | **404** |
| 3 | Buku tidak ditemukan (kembalikan) | `PATCH {{base_url}}/members/1/return-book/999` | **404** |
| 4 | Dikembalikan oleh bukan peminjam | `PATCH {{base_url}}/members/2/return-book/1` | **409** `"Buku tidak sedang dipinjam oleh member ini"` |
| 5 | Member tidak ditemukan (kembalikan) | `PATCH {{base_url}}/members/999/return-book/1` | **404** |
| 6 | Validasi gagal (buku tanpa data) | `POST {{base_url}}/books` body `{}` | **422** |

## 5. Ringkasan Status Code

| Kode | Arti | Contoh kasus |
|---|---|---|
| 200 | OK | Pinjam / kembalikan / ambil data berhasil |
| 201 | Created | Buku baru berhasil dibuat |
| 404 | Not Found | Member atau buku tidak ada |
| 409 | Conflict | Buku sedang dipinjam / bukan peminjam |
| 422 | Unprocessable Entity | Validasi input gagal |

## 6. Tips & Troubleshooting

- **Mengulang dari awal:** `php artisan migrate:fresh --seed` (bukan `migrate --seed`, agar data tidak terduplikasi).
- **Error 500:** lihat baris paling bawah `storage/logs/laravel.log`.
- **Port 8000 terpakai:** `php artisan serve --port=8001`, lalu ubah `base_url`.
- **Cek daftar route:** `php artisan route:list`.
- **Warning `Deprecated: PDO::MYSQL_ATTR_SSL_CA`** di terminal berasal dari PHP 8.5 dan dapat diabaikan.
