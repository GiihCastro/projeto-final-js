const catalog = document.getElementById('catalog');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cart = [];
const MAX_QUANTITY = 10;
let allProducts = [];
const zipCode = document.getElementById('cep').value;
const shippingMethod = document.getElementById('shipping-method').value;

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

function displayProducts(products) {
    catalog.innerHTML = '<h1>Catálogo de Produtos</h1>';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.classList.add(product.category.replace(/ /g, '-')); 

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h2>${product.title}</h2>
                <p class="description">${product.description}</p>
                <p class="price">R$ ${product.price.toFixed(2)}</p>
                <p class="availability ${product.rating.count > 0 ? 'in-stock' : 'out-of-stock'}">${product.rating.count > 0 ? 'Disponível' : 'Esgotado'}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.title}', '${product.price.toFixed(2)}', '${product.image}')">Adicionar ao Carrinho</button>
            </div>
        `;

        catalog.appendChild(productElement);
    });
}

function filterCategory(category) {
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        if (category === 'all' || product.classList.contains(category.replace(/ /g, '-'))) {
            product.style.display = 'flex';
        } else {
            product.style.display = 'none';
        }
    });
}

function filterByName(query) {
    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(filteredProducts);
}

function addToCart(id, title, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        if (existingItem.quantity < MAX_QUANTITY) {
            existingItem.quantity += 1;
        } else {
            alert(`Você não pode adicionar mais de ${MAX_QUANTITY} unidades deste item.`);
        }
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    displayCartItems();
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        cart.splice(index, 1);
        displayCartItems();
    }
}

function displayCartItems() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>R$ ${item.price}</p>
                <p class="cart-item-quantity">Quantidade: ${item.quantity}</p>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    cartTotal.innerHTML = `Total: R$ ${total.toFixed(2)}`;
}

function toggleCart() {
    if (cartModal.style.display === 'flex') {
        cartModal.style.display = 'none';
    } else {
        cartModal.style.display = 'flex';
    }
}

function toggleLogin() {
    if (cart.length > 0) {
        if (loginModal.style.display === 'flex') {
            loginModal.style.display = 'none';
        } else {
            loginModal.style.display = 'flex';
        }
    } else {
        alert('Seu carrinho está vazio!');
    }
}

const loginModal = document.getElementById('login-modal');
const paymentModal = document.getElementById('payment-modal');

function toggleLoginModal() {
    if (loginModal.style.display === 'flex') {
        loginModal.style.display = 'none';
    } else {
        loginModal.style.display = 'flex';
    }
}

function togglePaymentModal() {
    if (paymentModal.style.display === 'flex') {
        paymentModal.style.display = 'none';
    } else {
        paymentModal.style.display = 'flex';
    }
}

function togglePayment() {
    if (paymentModal.style.display === 'flex') {
        paymentModal.style.display = 'none';
    } else {
        paymentModal.style.display = 'flex';
    }
}

function toggleLogin() {
    if (cart.length > 0) {
        toggleLoginModal();
    } else {
        alert('Seu carrinho está vazio!');
    }
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    toggleLoginModal();
    toggleCart();
});

function calculateShippingCost(zipCode, shippingMethod) {
    let cost = 0;
    if (shippingMethod === 'standard') {
        cost = 10; 
    } else if (shippingMethod === 'express') {
        cost = 20; 
    }
    return cost;
}

document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const shippingCost = calculateShippingCost(zipCode, shippingMethod);

    document.getElementById('shipping-cost').textContent = `Custo do Frete: R$ ${shippingCost.toFixed(2)}`;

    alert('Compra finalizada com sucesso!');

    togglePaymentModal();
    toggleLoginModal();
    toggleCart();
});




function meu_callback(conteudo) {
    if (!conteudo.erro) {
        document.getElementById('rua').value = conteudo.logradouro;
        document.getElementById('bairro').value = conteudo.bairro;
        document.getElementById('cidade').value = conteudo.localidade;
        document.getElementById('uf').value = conteudo.uf;
    } else {
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}

function pesquisacep(valor) {
    var cep = valor.replace(/\D/g, '');

    if (cep !== "") {
        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
            document.getElementById('rua').value = "...";
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";
            document.getElementById('uf').value = "...";

            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(conteudo => meu_callback(conteudo))
                .catch(error => {
                    limpa_formulário_cep();
                    alert("Erro ao buscar CEP.");
                });

        } else {
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } else {
        limpa_formulário_cep();
    }
}


fetchProducts();