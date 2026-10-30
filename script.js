const products = [
    { id: 1, name: "Café Espresso Gourmet", price: 8.50, category: "cafes", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400" },
    { id: 2, name: "Cappuccino Italiano", price: 12.00, category: "cafes", img: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=400" },
    { id: 3, name: "Latte Macchiato", price: 13.50, category: "cafes", img: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=400" },
    { id: 4, name: "Torta de Doce de Leite", price: 16.00, category: "doces", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=400" },
    { id: 5, name: "Brownie com Nossas Nozes", price: 14.00, category: "doces", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400" },
    { id: 6, name: "Croissant de Queijo e Presunto", price: 15.00, category: "salgados", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400" },
    { id: 7, name: "Empada de Frango Cremosa", price: 9.00, category: "salgados", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400" }
];

let cart = [];
let orders = [];

function renderProducts(items) {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";
    items.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <img src="${p.img}" alt="${p.name}">
                <div class="card-body">
                    <div class="card-title">${p.name}</div>
                    <div class="card-price">R$ ${p.price.toFixed(2)}</div>
                    <button class="btn-primary" onclick="addToCart(${p.id})">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
    });
}

function filterCategory(cat) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
    if (cat === 'todos') {
        renderProducts(products);
    } else {
        renderProducts(products.filter(p => p.category === cat));
    }
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty++;
    } else {
        cart.push({ ...prod, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    document.getElementById("cart-count").innerText = cart.reduce((acc, i) => acc + i.qty, 0);
    const cartItems = document.getElementById("cart-items");
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        cartItems.innerHTML = "";
        cart.forEach(i => {
            total += i.price * i.qty;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${i.name} (x${i.qty})</span>
                    <strong>R$ ${(i.price * i.qty).toFixed(2)}</strong>
                </div>
            `;
        });
    }
    document.getElementById("cart-total").innerText = `R$ ${total.toFixed(2)}`;
}

function openCart() { document.getElementById("cart-modal").style.display = "flex"; }
function closeCart() { document.getElementById("cart-modal").style.display = "none"; }
function closePix() { document.getElementById("pix-modal").style.display = "none"; }

function goToCheckout() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    closeCart();
    document.getElementById("pix-modal").style.display = "flex";
}

function confirmPayment() {
    const orderId = orders.length + 101;
    const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const itemsSummary = cart.map(i => `${i.qty}x ${i.name}`).join(", ");
    
    orders.push({ id: orderId, items: itemsSummary, total: total, status: "Aprovado (PIX)" });
    
    cart = [];
    updateCartUI();
    closePix();
    renderOrders();
    alert("Pagamento verificado com sucesso! Seu pedido foi enviado para o lojista.");
}

function renderOrders() {
    const tbody = document.getElementById("admin-orders");
    tbody.innerHTML = "";
    orders.forEach(o => {
        tbody.innerHTML += `
            <tr>
                <td>#${o.id}</td>
                <td>${o.items}</td>
                <td>R$ ${o.total.toFixed(2)}</td>
                <td><span style="color: green; font-weight: 600;">${o.status}</span></td>
                <td><button onclick="alert('Pedido em preparação!')">Ver Detalhes</button></td>
            </tr>
        `;
    });
}

// Inicializa a página
renderProducts(products);
