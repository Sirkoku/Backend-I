const socket = io();

document.addEventListener("DOMContentLoaded", () => {
const list = document.getElementById("productList");
const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");

  const cartId = "68c481f77bea91422c331d2f"; // tu carrito fijo en MongoDB

const renderProducts = (products) => {
    list.innerHTML = "";

    products.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";
    card.style.padding = "12px";
    card.style.width = "200px";
    card.style.background = "#fafafa";
    card.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.1)";
    card.style.marginBottom = "10px";

    card.innerHTML = `
        <h3>${p.title}</h3>
        <p><b>Precio:</b> $${p.price}</p>
        <p><b>Categoría:</b> ${p.category}</p>
        <p><b>Stock:</b> ${p.stock}</p>
        <p><b>Código:</b> ${p.code}</p>
        <p><b>ID:</b> ${p._id}</p>

        <label for="qty-${p._id}">Cantidad:</label>
        <input type="number" id="qty-${p._id}" value="1" min="1" style="width:50px">
        <button class="add-to-cart" data-id="${p._id}">Agregar al carrito</button>
    `;

    list.appendChild(card);
    });

    // Asignar eventos a los botones después de renderizar
    list.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", async () => {
        const productId = button.dataset.id;
        const qtyInput = document.getElementById(`qty-${productId}`);
        const quantity = Number(qtyInput.value);

        try {
        const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity })
        });

        if (res.ok) {
            alert(`Se agregaron ${quantity} unidades al carrito`);
        } else {
            alert("Error al agregar al carrito");
        }
        } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor");
        }
    });
    });
};

  // Recibir productos desde Socket.io
socket.on("updateProducts", (products) => renderProducts(products));

  // Agregar producto nuevo (solo admins o testing)
if (productForm) {
    productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const product = {
        title: document.getElementById("title").value,
        price: Number(document.getElementById("price").value),
        code: document.getElementById("code").value,
        stock: Number(document.getElementById("stock").value),
        category: document.getElementById("category").value
    };

    if (!product.title || !product.price || !product.code || !product.stock || !product.category) {
        alert("Todos los campos son obligatorios");
        return;
    }

    socket.emit("newProduct", product);
    productForm.reset();
    });
}

  // Eliminar producto (solo admins o testing)
if (deleteForm) {
    deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("deleteId").value;
    socket.emit("deleteProduct", id);
    deleteForm.reset();
    });
}
});
