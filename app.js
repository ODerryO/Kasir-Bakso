let cart = [];
let total = 0;

const menuItems = {
    "Bakso":[
        {name:"Bakso Biasa",price:15000},{name:"Bakso Biasa + Tetelan",price:20000},{name:"Bakso Biasa + Extra Tetelan",price:25000},
        {name:"Bakso Isian Daging",price:15000},{name:"Bakso Isian Daging + Tetelan",price:20000},{name:"Bakso Isian Daging + Extra Tetelan",price:25000},
        {name:"Bakso Urat",price:15000},{name:"Bakso Urat + Tetelan",price:20000},{name:"Bakso Urat + Extra Tetelan",price:25000},
        {name:"Bakso Telur",price:15000},{name:"Bakso Telur + Tetelan",price:20000},{name:"Bakso Telur + Extra Tetelan",price:25000},
        {name:"Bakso Beranak",price:20000},{name:"Bakso Beranak + Tetelan",price:25000},{name:"Bakso Beranak + Extra Tetelan",price:30000},
        {name:"Bakso Lava",price:20000},{name:"Bakso Lava Komplit",price:25000},{name:"Bakso Tulang",price:20000},
        {name:"Bakso Tulang + Tetelan",price:25000},{name:"Bakso Tulang + Extra Tetelan",price:30000},{name:"Bakso Bebalung Komplit",price:30000},
        {name:"Bakso Sum Sum Biasa",price:25000},{name:"Bakso Sum Sum Komplit",price:30000},{name:"Bakso Rusuk Jumbo",price:40000}
    ],
    "Mie Ayam":[
        {name:"Mie Ayan Biasa",price:15000},{name:"Mie Ayan Bakso",price:15000}
    ],
    "Minuman":[
        {name:"Air Mineral",price:5000},{name:"Es Jeruk",price:5000},{name:"Es The",price:5000},{name:"Es Cincau Full Cream",price:10000}
    ],
    "Cemilan":[
        {name:"Mie Peluk",price:10000},{name:"Basreng",price:12000}
    ],
    "Frozen":[
        {name:"Bakso Frozen Biasa",price:120000},{name:"Bakso Frozen Urat",price:150000},{name:"Bumbu Bakso",price:50000},{name:"Tetelan Presto",price:50000}
    ]
};

// Format harga ribuan
function formatPrice(price){ return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."); }

// Tampilkan menu
function displayMenu(){
    const menuDiv=document.getElementById("menu");
    for(const category in menuItems){
        const categoryDiv=document.createElement("div"); categoryDiv.classList.add("category");
        const categoryTitle=document.createElement("h3"); categoryTitle.textContent=category; categoryDiv.appendChild(categoryTitle);

        const menuGrid=document.createElement("div");
        if(category==="Bakso"||category==="Mie Ayam"||category==="Minuman") menuGrid.classList.add("menu-grid");
        else {menuGrid.style.display="flex"; menuGrid.style.flexWrap="wrap"; menuGrid.style.gap="10px";}

        menuItems[category].forEach(item=>{
            const menuItemDiv=document.createElement("div"); menuItemDiv.classList.add("menu-item");
            menuItemDiv.onclick=()=>addToCart(item.name,item.price);
            menuItemDiv.innerHTML=`<p>${item.name} - Rp ${formatPrice(item.price)}</p>`;
            menuGrid.appendChild(menuItemDiv);
        });

        categoryDiv.appendChild(menuGrid);
        menuDiv.appendChild(categoryDiv);
    }
}

// Keranjang dengan jumlah item
function addToCart(name, price){
    const existingItem=cart.find(i=>i.name===name);
    if(existingItem){ existingItem.quantity+=1; existingItem.priceTotal=existingItem.price*existingItem.quantity;}
    else cart.push({name, price, quantity:1, priceTotal:price});
    updateCart();
}

function updateCart(){
    const cartList=document.getElementById("cart-list"); cartList.innerHTML="";
    total=0;
    cart.forEach(item=>{
        const li=document.createElement("li");
        li.textContent=item.quantity>1? `${item.name} x${item.quantity} - Rp ${formatPrice(item.priceTotal)}`:`${item.name} - Rp ${formatPrice(item.price)}`;
        cartList.appendChild(li); total+=item.priceTotal;
    });
    document.getElementById("total").textContent=`Total: Rp ${formatPrice(total)}`;
}

// Checkout
function checkout(){
    if(!cart.length) return alert("Keranjang kosong!");
    const customer=document.getElementById("customer-name").value.trim();
    if(!customer) return alert("Masukkan nama pelanggan / nomor meja");
    const transaction={customerName:customer, items:cart, total, date:new Date().toLocaleString()};
    const transactions=JSON.parse(localStorage.getItem("transactions"))||[];
    transactions.push(transaction); localStorage.setItem("transactions",JSON.stringify(transactions));
    alert("Transaksi berhasil!"); cart=[]; total=0; updateCart();
}

// Reset manual
function resetManual(){ if(confirm("Hapus semua transaksi?")){localStorage.removeItem("transactions"); alert("Data transaksi berhasil direset");}}

// Export Excel
function exportToExcel(){
    const transactions=JSON.parse(localStorage.getItem("transactions"))||[];
    if(!transactions.length) return alert("Tidak ada data untuk diekspor");
    const formatted=transactions.map(t=>{
        const items=t.items.map(i=>`${i.name} x${i.quantity} - Rp ${formatPrice(i.priceTotal)}`).join(", ");
        return {Tanggal:t.date,"Nama Pelanggan / Nomor Meja":t.customerName, Items:items, Total:`Rp ${formatPrice(t.total)}`};
    });
    const ws=XLSX.utils.json_to_sheet(formatted); const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Transaksi"); XLSX.writeFile(wb,"Laporan_Transaksi.xlsx");
}

window.onload=displayMenu;