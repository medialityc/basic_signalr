const url = "http://localhost:8080";

//#region Functions
async function get(url) {
    const response = await fetch(url, {
        method: 'GET',
    });
    return response.json();
}

async function post(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    return response.json();
}

async function initializeBuyerConnection() {
    var connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:8080/hub")
        .build();

    await connection.start();
    return connection;
}

async function initializeSubscriberConnection(subscriptionId) {
    var connection = new signalR.HubConnectionBuilder()
        .withUrl(`http://localhost:8080/hub?subscriptionId=${subscriptionId}`)
        .build();

    connection.on("LoadBoughtProducts", async function (boughtProducts) {
        boughtProducts = new Map(Object.entries(boughtProducts));
        subscribePageProductsList.innerHTML = ''; // Reset Products list

        const products = await get(`${url}/products`); // Get all products

        boughtProducts.forEach((value, key) => {
        const product = products.find(product => product.id == key);
        subscribePageProductsList.innerHTML += `
            <li class="buy-page-buy-list-element" product-id=${key}>${product.name} => ${value}$</li>
            `
        });
    });

    await connection.start();
    return connection;
}
//#endregion

//#region Load global elements
// Load containers
const mainPageContainer = document.querySelector("#main-page");
const buyPageContainer = document.querySelector("#buy-page");
const subscribePageContainer = document.querySelector("#subscribe-page");
const subscribePageSubscriptionContainer = document.querySelector("#subscribe-page-subscription");
const subscribePageListContainer = document.querySelector("#subscribe-page-list");

// Load buttons
const mainPageBuyButton = document.querySelector("#main-page-buy-button");
const mainPageSubscribeButton = document.querySelector("#main-page-subscribe-button");
const buyPageBackButton = document.querySelector("#buy-page-back-button");
const subscribePageBackButton = document.querySelector("#subscribe-page-back-button");
const subscribePageSubscribeButton = document.querySelector("#subscribe-page-subscribe-button");

// Lists & Inputs/Outputs
const buyPageProductsList = document.querySelector("#buy-page-products-list");
const buyPageBuyList = document.querySelector("#buy-page-buy-list");
const subscribePageProductsList = document.querySelector("#subscribe-page-products-list");
const subscribePageSubscribeInput = document.querySelector("#subscribe-page-subscribe-input");
//#endregion
const buyPageSubscriptionId = document.querySelector("#buy-page-subscription-id");

// Hide Buy and Subscribe containers
buyPageContainer.style.display = "none";
subscribePageContainer.style.display = "none";
subscribePageListContainer.style.display = "none";

mainPageBuyButton.addEventListener("click", async () => {
    mainPageContainer.style.display = "none"; // Hide Main container
    buyPageContainer.style.display = "block"; // Show Buy container

    // Reset lists
    buyPageProductsList.innerHTML = ''; // Reset Products list
    buyPageBuyList.innerHTML = '';

    // Reset subscription id
    const subscriptionId = crypto.randomUUID();
    buyPageSubscriptionId.innerHTML = subscriptionId;

    // Load products
    const products = await get(`${url}/products`);
    const boughtProducts = new Map();
    products.forEach(product => {
        buyPageProductsList.innerHTML += `
        <li class="buy-page-products-list-element" product-id="${product.id}">${product.name} => ${product.price}$</li>
        `
    });

    const productsListElement = document.querySelectorAll(".buy-page-products-list-element");

    productsListElement.forEach(element => {
        element.addEventListener("click", async () => {
            buyPageBuyList.innerHTML = ''; // Reset Buy list
            const productId = element.getAttribute("product-id");

            if (boughtProducts.has(productId))
                boughtProducts.set(productId, boughtProducts.get(productId) + 1);
            else
                boughtProducts.set(productId, 1)

            boughtProducts.forEach((value, key) => {
                const product = products.find(product => product.id == key);
                buyPageBuyList.innerHTML += `
                <li class="buy-page-buy-list-element" product-id=${key}>${product.name} => ${value}$</li>
                `
            });

            const connection = await initializeBuyerConnection();
            // Notify server with SignalR
            connection.invoke("PublishBoughtProducts", subscriptionId, Object.fromEntries(boughtProducts));

            const buyListElement = document.querySelectorAll(".buy-page-buy-list-element");
            buyListElement.forEach(element => {
                element.addEventListener("click", () => {
                    const productId = element.getAttribute("product-id");
                    boughtProducts.delete(productId);

                    boughtProducts.forEach((value, key) => {
                        const product = products.find((product) => product.id == key);
                        buyPageBuyList.innerHTML += `
                        <li class="buy-page-buy-list-element" product-id=${key}>${product.name} => ${value}$</li>
                        `
                    });

                    // Notify server with SignalR
                    connection.invoke("PublishBoughtProducts", subscriptionId, Object.fromEntries(boughtProducts));
                });
            });
        });
    });
});

mainPageSubscribeButton.addEventListener("click", () => {
    mainPageContainer.style.display = "none"; // Hide Main container
    subscribePageContainer.style.display = "block"; // Show Buy container
    subscribePageSubscriptionContainer.style.display = "block"; // Show Buy's Subscription container

    subscribePageProductsList.innerHTML = ''; // Reset Products list
});

buyPageBackButton.addEventListener("click", () => {
    buyPageContainer.style.display = "none"; // Hide Buy container
    mainPageContainer.style.display = "block"; // Show Main container
});

subscribePageBackButton.addEventListener("click", () => {
    subscribePageContainer.style.display = "none"; // Hide Buy container
    mainPageContainer.style.display = "block"; // Show Main container
});

subscribePageSubscribeButton.addEventListener("click", async () => {
    subscribePageSubscriptionContainer.style.display = "none"; // Hide Buy's Subscription container
    subscribePageListContainer.style.display = "block"; // Show Buy's List container

    const subscriptionId = subscribePageSubscribeInput.value;
    const connection = await initializeSubscriberConnection(subscriptionId);
});
