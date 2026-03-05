let cart = [];
let total = 0;

// Daftar Menu Bakso dan Makanan Lainnya
const menuItems = {
    "Bakso": [
        { name: "Bakso Biasa", price: 15000 },
        { name: "Bakso Biasa + Tetelan", price: 20000 },
        { name: "Bakso Biasa + Extra Tetelan", price: 25000 },
        { name: "Bakso Isian Daging", price: 15000 },
        { name: "Bakso Isian Daging + Tetelan", price: 20000 },
        { name: "Bakso Isian Daging + Extra Tetelan", price: 25000 },
        { name: "Bakso Urat", price: 15000 },
        { name: "Bakso Urat + Tetelan", price: 20000 },
        { name: "Bakso Urat + Extra Tetelan", price: 25000 },
        { name: "Bakso Telur", price: 15000 },
        { name: "Bakso Telur + Tetelan", price: 20000 },
        { name: "Bakso Telur + Extra Tetelan", price: 25000 },
        { name: "Bakso Beranak", price: 20000 },
        { name: "Bakso Beranak + Tetelan", price: 25000 },
        { name: "Bakso Beranak + Extra Tetelan", price: 30000 },
        { name: "Bakso Lava", price: 20000 },
        { name: "Bakso Lava Komplit", price: 25000 },
        { name: "Bakso Tulang", price: 20000 },
        { name: "Bakso Tulang + Tetelan", price: 25000 },
        { name: "Bakso Tulang + Extra Tetelan", price: 30000 },
        { name: "Bakso Bebalung Komplit", price: 30000 },
        { name: "Bakso Sum Sum Biasa", price: 25000 },
        { name: "Bakso Sum Sum Komplit", price: 30000 },
        { name: "Bakso Rusuk Jumbo", price: 40000 }
    ],
    "Mie Ayam": [
        { name: "Mie Ayan Biasa", price: 15000 },
        { name: "Mie Ayan Bakso", price: 15000 }
    ],
    "Minuman": [
        { name: "Air Mineral", price: 5000 },
        { name: "Es Jeruk", price: 5000 },
        { name: "Es The", price: 5000 },
        { name: "Es Cincau Full Cream", price: 10000 },
    ],
    "Cemilan": [
        { name: "Mie Peluk", price: 10000 },
        { name: "Basreng", price: 12000 }
    ],
    "Frozen": [
        { name: "Bakso Frozen Biasa", price: 120000 },
        { name: "Bakso Frozen Urat", price: 150000 },
        { name: "Bumbu Bakso", price: 50000 },
        { name: "Tetelan Presto", price: 50000 }
    ]
};

// Fungsi untuk memformat harga dengan titik pemisah ribuan
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk menampilkan menu secara dinamis berdasarkan kategori
function displayMenu() {
    const menuDiv = document.getElementById('menu');
    
    for (const category in menuItems) {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        const menuGrid = document.createElement('div');
        menuGrid.classList.add('menu-grid');

        menuItems[category].forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.onclick = function() {
                addToCart(item.name, item.price);
            };

            menuItemDiv.innerHTML = `<p>${item.name} - Rp ${formatPrice(item.price)}</p>`;
            menuGrid.appendChild(menuItemDiv);
        });

        categoryDiv.appendChild(menuGrid);
        menuDiv.appendChild(categoryDiv);
    }
}

// Fungsi untuk menambahkan item ke keranjang
function addToCart(itemName, itemPrice) {
    cart.push({ name: itemName, price: itemPrice });
    total += itemPrice;
    updateCart();
}

// Fungsi untuk memperbarui tampilan keranjang
function updateCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Rp ${formatPrice(item.price)}`;
        cartList.appendChild(li);
    });

    document.getElementById('total').textContent = `Rp ${formatPrice(total)}`;
}

// Fungsi untuk memproses pembayaran dan menyimpan transaksi offline
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang kosong, silakan pilih menu!');
        return;
    }

    const customerName = document.getElementById('customer-name').value.trim();
    if (!customerName) {
        alert('Harap masukkan nama pelanggan atau nomor meja!');
        return;
    }

    const transaction = {
        customerName: customerName, // Menyimpan nama pelanggan atau nomor meja
        items: cart,
        total: total,
        date: new Date().toLocaleString()
    };

    // Simpan transaksi secara offline menggunakan localStorage
    saveTransactionOffline(transaction);

    alert('Pembayaran berhasil, transaksi telah disimpan!');
    cart = [];
    total = 0;
    updateCart();
}

// Fungsi untuk menyimpan transaksi secara offline menggunakan localStorage
function saveTransactionOffline(transaction) {
    const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    existingTransactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
}

// Fungsi untuk mengekspor transaksi ke Excel
function exportToExcel() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    if (transactions.length === 0) {
        alert('Tidak ada data untuk diekspor');
        return;
    }

    // Membuat array yang berisi transaksi dalam format yang sesuai untuk Excel
    const formattedTransactions = transactions.map(transaction => {
        const transactionItems = transaction.items.map(item => `${item.name} - Rp ${formatPrice(item.price)}`).join(", ");
        return {
            'Tanggal': transaction.date,
            'Nama Pelanggan / Nomor Meja': transaction.customerName, // Menambahkan nama pelanggan atau nomor meja
            'Items': transactionItems,
            'Total': `Rp ${formatPrice(transaction.total)}`,
        };
    });

    // Mengonversi data transaksi ke format worksheet untuk SheetJS
    const ws = XLSX.utils.json_to_sheet(formattedTransactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');

    // Unduh file Excel
    XLSX.writeFile(wb, 'Laporan_Transaksi.xlsx');
}

// Fungsi untuk reset data transaksi manual
function resetManual() {
    const confirmation = confirm("Apakah Anda yakin ingin menghapus semua transaksi?");
    if (confirmation) {
        localStorage.removeItem('transactions'); // Menghapus semua data transaksi
        alert('Data transaksi berhasil di-reset!');
    }
}

// Panggil displayMenu() untuk menampilkan menu ketika halaman dimuat
window.onload = function() {
    displayMenu();
};