const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // optional
// Inisialisasi Express
const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Buat koneksi ke database MySQL
const db = mysql.createConnection({
    host: 'localhost',   // Ganti dengan host MySQL Anda jika perlu
    user: 'root',        // Ganti dengan username MySQL Anda
    password: '140317',        // Ganti dengan password MySQL Anda
    database: 'kasir_bakso'
});

// Koneksi ke MySQL
db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err);
        return;
    }
    console.log('Terhubung ke database MySQL');
});

// Endpoint untuk menyimpan transaksi
app.post('/transaksi', (req, res) => {
    const { items, total, date } = req.body;

    // Query untuk memasukkan data transaksi
    const query = 'INSERT INTO transaksi (items, total, date) VALUES (?, ?, ?)';
    db.query(query, [JSON.stringify(items), total, date], (err, result) => {
        if (err) {
            res.status(500).send('Gagal menyimpan transaksi');
            return;
        }
        res.status(200).send('Transaksi berhasil disimpan');
    });
});

// Endpoint untuk mengambil laporan transaksi
app.get('/laporan', (req, res) => {
    db.query('SELECT * FROM transaksi ORDER BY date DESC', (err, results) => {
        if (err) {
            res.status(500).send('Gagal mengambil laporan');
            return;
        }
        res.status(200).json(results);
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

db.query(query, [JSON.stringify(items), total, date], (err, result) => {
    if (err) {
        console.error('Error saat insert transaksi:', err); // <-- tampilkan error
        res.status(500).send('Gagal menyimpan transaksi');
        return;
    }
    res.status(200).json({ message: 'Transaksi berhasil disimpan' });
});