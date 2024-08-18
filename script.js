document.addEventListener("DOMContentLoaded", async function() {
    const productsContainer = document.querySelector('.product-grid');
    if (!productsContainer) {
        console.error('Element .product-grid not found');
        return;
    }

    async function fetchProducts() {
        try {
            console.log('Fetching products...');
            const response = await fetch('http://localhost:1337/api/posts?populate=*'); // Replace with your API URL

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Products fetched successfully:', data);

            data.data.forEach(product => {
                const productId = product.id;
                const imageUrl = product.attributes.image.data 
                    ? `http://localhost:1337${product.attributes.image.data.attributes.url}`
                    : 'fallback-image.jpg';

                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                    <a href="purchase.html?productName=${encodeURIComponent(product.attributes.title)}&productImage=${encodeURIComponent(imageUrl)}&productDescription=${encodeURIComponent(product.attributes.body)}&productPrice=${encodeURIComponent(product.attributes.price)}" style="text-decoration: none; color: inherit;">
                        <h2>${product.attributes.title}</h2>
                        <p>${product.attributes.body}</p>
                        <img src="${imageUrl}" alt="${product.attributes.title}">
                        <p>Category: ${product.attributes.categories.data.length ? product.attributes.categories.data[0].attributes.social_title : 'No Category'}</p>
                    </a>
                `;
                productsContainer.appendChild(productDiv);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    await fetchProducts();

    // Initialize date and time fields
    const now = new Date();
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');

    if (dateInput) {
        dateInput.value = now.toLocaleDateString('ar-EG');
    } else {
        console.error('Element #date not found');
    }

    if (timeInput) {
        timeInput.value = now.toLocaleTimeString('ar-EG');
    } else {
        console.error('Element #time not found');
    }

    // Get product details from query parameters
    const params = new URLSearchParams(window.location.search);
    const productName = params.get('productName');
    const productImage = params.get('productImage');
    const productDescription = params.get('productDescription');
    const productPrice = params.get('productPrice');

    const productNameElement = document.getElementById('productName');
    const productImageElement = document.getElementById('productImage');
    const productDescriptionElement = document.getElementById('productDescription');
    const productPriceElement = document.getElementById('productPrice');

    if (productNameElement) {
        productNameElement.textContent = `اسم المنتج: ${productName}`;
    } else {
        console.error('Element #productName not found');
    }

    if (productImageElement) {
        productImageElement.src = productImage || 'fallback-image.jpg';
    } else {
        console.error('Element #productImage not found');
    }

    if (productDescriptionElement) {
        productDescriptionElement.textContent = `الوصف: ${productDescription}`;
    } else {
        console.error('Element #productDescription not found');
    }

    if (productPriceElement) {
        productPriceElement.textContent = `السعر: ${productPrice}`;
    } else {
        console.error('Element #productPrice not found');
    }
});

function handleSubmit(event) {
    event.preventDefault();

    const clientName = document.getElementById('clientName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const city = document.getElementById('city').value;

    document.getElementById('clientNameError').textContent = clientName ? '' : 'الاسم و اللقب مطلوب';
    document.getElementById('phoneNumberError').textContent = phoneNumber.match(/^\d{10}$/) ? '' : 'رقم الهاتف يجب أن يتكون من 10 أرقام';
    document.getElementById('cityError').textContent = city ? '' : 'الولاية مطلوب';

    if (clientName && phoneNumber.match(/^\d{10}$/) && city) {
        event.target.submit();
    }
}

function updateDeliveryCost() {
    const city = document.getElementById('city').value;
    const deliveryCost = calculateDeliveryCost(city);
    document.getElementById('deliveryCost').value = deliveryCost + " دج";
    updateTotal();
}

function updateTotal() {
    const quantity = document.getElementById('quantity').value;
    const deliveryCost = parseInt(document.getElementById('deliveryCost').value, 10) || 0;
    const totalCost = calculateTotalCost(quantity, deliveryCost);
    document.getElementById('total').value = totalCost + " دج";
}

function calculateDeliveryCost(city) {
    const deliveryCosts = {
        "الجزائر": 200,
        "وهران": 250,
        "قسنطينة": 300,
        // Add more cities with respective delivery costs
    };
    return deliveryCosts[city] || 0;
}

function calculateTotalCost(quantity, deliveryCost) {
    const pricePerItem = 1000; // Assume a fixed price per item
    return quantity * pricePerItem + deliveryCost;
}
