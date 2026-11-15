# FlipPlay REST API (Demo Modul 4 Pemrograman Web UMM)

FlipPlay adalah RESTful API untuk katalog media anime/manga serta pengelolaan koleksi media pengguna. Proyek ini merupakan evolusi dan transisi dari simulasi Object-Oriented Programming (OOP) terminal pada Modul 3 menjadi layanan web service modern berbasis Laravel 12.

---

## Cara Setup

1. **Clone repository & Konfigurasi Lingkungan (`.env`)**
   Salin `.env.example` ke `.env` (jika belum ada) dan sesuaikan kredensial database MySQL:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=flipplay_api
   DB_USERNAME=root
   DB_PASSWORD=
   ```

2. **Install Dependensi & Generate Key**
   ```bash
   composer install
   php artisan key:generate
   ```

3. **Migrasi Database & Seeding**
   Menyiapkan skema database dan mengisi data statis awal (3 user termasuk "Rico" dan 5 media katalog):
   ```bash
   php artisan migrate:fresh --seed
   ```

4. **Menjalankan Server Pengembangan**
   ```bash
   php artisan serve
   ```
   API dapat diakses melalui `http://127.0.0.1:8000/api`.

---

## Desain Data & Relasi Entitas

| Model / Entitas | Tabel Database | Deskripsi Kolom |
|---|---|---|
| `User` | `users` | `id`, `name`, `email`, `password`, `timestamps` |
| `Media` | `media` | `id`, `title` (unique), `creator`, `year` (unsigned small int), `aura` (default: 'Cozy'), `type` ('anime' / 'manga'), `timestamps` |
| `media_user` (Pivot) | `media_user` | `id`, `media_id` (foreign key ke `media`), `user_id` (foreign key ke `users`), composite unique (`media_id`, `user_id`), `timestamps` |

### Relasi Eloquent
- **User ke Media**: `User::media()` memakai `belongsToMany(Media::class, 'media_user')->withTimestamps()`.
- **Media ke User**: `Media::users()` memakai `belongsToMany(User::class, 'media_user')->withTimestamps()`.

---

## Daftar Endpoint API

| Method | Endpoint | Deskripsi | Status Code |
|---|---|---|---|
| `GET` | `/api/media` | Menampilkan daftar katalog media (mendukung pagination 10 item dan filter opsional `search` (LIKE pada title), `aura`, dan `type` exact match, serta eager loading relasi `users`). | `200 OK` |
| `POST` | `/api/media` | Membuat entri media baru ke dalam katalog (validasi field required, title unik, tipe anime/manga). | `201 Created` / `422 Unprocessable` |
| `GET` | `/api/media/{media}` | Menampilkan detail media tertentu beserta pengguna yang mengoleksinya (`whenLoaded`). | `200 OK` / `404 Not Found` |
| `PATCH` | `/api/media/{media}` | Memperbarui sebagian atribut media (validasi `sometimes`, title ignore record sendiri). | `200 OK` / `422 Unprocessable` / `404 Not Found` |
| `DELETE` | `/api/media/{media}` | Menghapus media dari katalog. | `200 OK` / `404 Not Found` |
| `GET` | `/api/users/{user}/collection` | Mengambil daftar koleksi media yang disimpan oleh user terkait. | `200 OK` / `404 Not Found` |
| `POST` | `/api/users/{user}/collection` | Menambahkan media ke dalam koleksi user (body JSON: `{"media_id": <id>}`). Menolak duplikasi. | `201 Created` / `409 Conflict` / `422 Unprocessable` / `404 Not Found` |
| `DELETE` | `/api/users/{user}/collection/{media}` | Menghapus media dari koleksi user. | `200 OK` / `404 Not Found` |

---

## Daftar File yang Dibuat / Diubah

- `database/migrations/2026_11_15_151500_create_media_table.php` - Migrasi untuk tabel `media` (katalog media anime/manga).
- `database/migrations/2026_11_15_151507_create_media_user_table.php` - Migrasi untuk tabel pivot `media_user` dengan composite unique dan foreign keys.
- `app/Models/Media.php` - Model Media dengan atribut fillable dan relasi `users()` (`belongsToMany`).
- `app/Models/User.php` - Menambahkan relasi `media()` (`belongsToMany`) pada model bawaan User.
- `database/seeders/DatabaseSeeder.php` - Seeder data statis 3 user (termasuk "Rico") dan 5 item media.
- `app/Http/Requests/StoreMediaRequest.php` - Form Request validasi media dengan aturan POST/PATCH dan pesan error Bahasa Indonesia.
- `app/Http/Resources/MediaResource.php` - API Resource untuk memformat representasi JSON model Media (`whenLoaded('users')`).
- `app/Http/Resources/UserResource.php` - API Resource untuk memformat representasi JSON model User (`whenLoaded('media')`).
- `app/Http/Controllers/MediaController.php` - Controller CRUD katalog media dengan filter dan pagination.
- `app/Http/Controllers/UserCollectionController.php` - Controller koleksi pengguna (index, attach dengan deteksi duplikat 409, detach 404).
- `routes/api.php` - Konfigurasi rute API dengan binding parameter `media` dan endpoint koleksi pengguna.
- `README.md` - Dokumentasi proyek, panduan instalasi, spesifikasi data, dan daftar rute endpoint.
