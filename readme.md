# 🧾 Pretest – Admin Pembelian Toko

Aplikasi **admin page sederhana** untuk mengelola **produk, stok, dan pembelian**, termasuk fitur **cancel pembelian oleh admin** dengan pengembalian stok otomatis.

Project ini dibuat untuk memenuhi **soal pretest** dengan ketentuan:

* Node.js + Express.js (EJS)
* Database SQL
* Desain UI bebas

---

## 🚀 Fitur Utama

### 1. Manajemen Produk

* Menampilkan daftar produk
* Menampilkan stok per produk
* Menambahkan produk baru beserta stok awal
* Seed awal **10 produk**

### 2. Manajemen Pembelian

* Input pembelian (multi-produk)
* Stok produk otomatis **berkurang saat pembelian**
* Detail pembelian (invoice, item, subtotal, total)

### 3. Cancel Pembelian (Admin)

* Admin dapat membatalkan pembelian
* Status pembelian berubah menjadi **CANCELLED**
* Stok produk otomatis **dikembalikan**
* Menggunakan **SQL transaction** (aman & konsisten)

---

## 🛠️ Teknologi yang Digunakan

* **Node.js**
* **Express.js**
* **EJS (Template Engine)**
* **PostgreSQL (SQL Database)**
* **Bootstrap 5** (UI sederhana)

---

## 📁 Struktur Folder

```
pretest-admin-pembelian/
├─ src/
│  ├─ app.js
│  ├─ db.js
│  ├─ routes/
│  │  ├─ products.js
│  │  └─ purchases.js
│  ├─ views/
│  │  ├─ layout.ejs
│  │  ├─ footer.ejs
│  │  ├─ products/
│  │  │  ├─ index.ejs
│  │  │  └─ new.ejs
│  │  └─ purchases/
│  │     ├─ index.ejs
│  │     ├─ new.ejs
│  │     └─ show.ejs
│  └─ public/
│     └─ styles.css
├─ sql/
│  ├─ 001_schema.sql
│  └─ 002_seed.sql
├─ .env.example
├─ package.json
└─ README.md
```

---

## 🧩 Database Schema

### Tabel:

* `products` → data produk
* `product_stocks` → stok produk
* `purchases` → header pembelian
* `purchase_items` → detail item pembelian

---

## ⚙️ Cara Instalasi & Menjalankan Aplikasi

### 1️⃣ Prasyarat

Pastikan sudah terinstall:

* Node.js (LTS)
* PostgreSQL
* npm

---

### 2️⃣ Clone Repository

```bash
git clone https://github.com/illumemindid-hash/pretest-admin-pembelian.git
cd pretest-admin-pembelian
```

---

### 3️⃣ Install Dependency

```bash
npm install
```

---

### 4️⃣ Setup Database

#### Buat database

```sql
CREATE DATABASE pretest_admin;
```

#### Import schema & seed

```bash
psql -d pretest_admin -f sql/001_schema.sql
psql -d pretest_admin -f sql/002_seed.sql
```

> `002_seed.sql` akan otomatis mengisi **10 produk awal**.

---

### 5️⃣ Setup Environment

Copy file environment:

```bash
cp .env.example .env
```

Isi `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pretest_admin
DB_USER=postgres
DB_PASSWORD=your_password
```

---

### 6️⃣ Jalankan Aplikasi

```bash
npm start
```

Buka di browser:

```
http://localhost:3000
```

---

## 🧪 Alur Pengujian (Flow Test)

### 1. Produk

* Buka `/products`
* Pastikan ada **10 produk**
* Tambahkan produk baru (opsional)

### 2. Pembelian

* Buka `/purchases`
* Klik **Input Pembelian**
* Pilih produk + qty
* Simpan pembelian
* Cek stok → **stok berkurang**

### 3. Cancel Pembelian

* Masuk ke detail pembelian
* Klik **Cancel Pembelian**
* Status berubah menjadi **CANCELLED**
* Cek stok → **stok kembali**

---

## 📌 Catatan Teknis

* Cancel pembelian menggunakan **SQL Transaction**
* Stok tidak akan rusak walaupun terjadi error
* Struktur database dibuat sederhana dan realistis

---

## 📄 Kesimpulan

Aplikasi ini telah memenuhi seluruh kebutuhan soal pretest:

* Sistem admin pembelian ✔
* Database produk, stok, dan pembelian ✔
* Cancel pembelian oleh admin ✔
* Node.js + Express + EJS ✔
* SQL Database ✔

---

## 👤 Author

**Nama:** *Tsar Ahmad Alkhowarizmi*
**Tanggal:** *14 January 2026*