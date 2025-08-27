const socket = io();


document.addEventListener("DOMContentLoaded", () => {
    
    const list = document.getElementById("productList");

    const renderProducts = (products) => {
        list.innerHTML = "";
        products.forEach(p => {
            const card = document.createElement("div");
            card.style = `
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            `;

            card.innerHTML = `
                <h3 style="margin: 0 0 10px 0;">${p.title}</h3>
                <p><strong>ID:</strong> ${p.id}</p>
                <p><strong>Precio:</strong> $${p.price}</p>
                <p><strong>Categoría:</strong> ${p.category}</p>
                <p><strong>Stock:</strong> ${p.stock}</p>
                <p><strong>Código:</strong> ${p.code}</p>
            `;
            list.appendChild(card);
        });
    };

    socket.on("updateProducts", (products) => {
        renderProducts(products);
    });
});
