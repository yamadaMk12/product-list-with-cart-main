window.onload = async function loadCards() {
    const container = document.querySelector(".desert-articles");
    const { default: data } = await import("./data.js");
    const reversedData = data.reverse();
    reversedData.forEach(item => {
        container.insertAdjacentHTML("afterbegin", getCardHtml(item.image.desktop, item.name, item.category, item.price));
    });
    const confirm = document.getElementById("confirm-btn");
    const newPage = document.getElementById("newPage");
    newPage.addEventListener("click", () => window.location.reload());
    confirm.addEventListener("click", showAlert);
    startCardEvents();
};

function startCardEvents() {
    const cards = document.querySelectorAll(".card-item");
    const totalNumber = document.getElementById("total-number");

    cards.forEach(card => {
        const plusBtn = card.querySelector("#plus");
        const minusBtn = card.querySelector("#minus");
        const name = card.querySelector(".card-footer p:nth-child(2)").textContent;
        const price = parseFloat(card.querySelector(".card-footer p:nth-child(3)").textContent.replace("$", ""));
        const quantity = card.querySelector("#custom-input");
        const cartButton = card.querySelector(".add-item-content");
        const cartController = card.querySelector(".increase-decrease-items");
        plusBtn.addEventListener("click", () => increase(quantity, totalNumber, name, price));
        minusBtn.addEventListener("click", () => decrease(quantity, cartController, totalNumber, name, price));
        cartButton.addEventListener("click", () => addItemForFirstTime(cartController, totalNumber, name, price, card));
    });
}

function showAlert() {
    const items = Array.from(document.querySelector(".body-card-section").querySelectorAll(".item-to-buy"));
    const alert = document.querySelector(".custom-alert");
    const body = document.querySelector(".alert-body")
    console.log(items)
    if (items.length > 0) {
        items.forEach(async (e) => {
            const name = e.querySelector(".item-info-head > p").innerText;
            const { default: data } = await import("./data.js");
            const img = (data.find((item) => item.name == name))?.image?.thumbnail;
            const quantity = e.querySelector("#item-quantity").innerText
            const price = e.querySelector(".item-info-body p:nth-child(2)").innerText.replace("@ $", "")
            const total = e.querySelector("#total-price-item").innerText
            body.insertAdjacentHTML("afterbegin", getAlertItem(img, name, quantity, price, total))
        })
        alert.style.display = "block";
    }
}

function getItemHtml(name, price) {
    return `
    <div class="item-to-buy">
        <div class="item-info">
            <div class="item-info-head">
                <p>${name}</p>
            </div>
            <div class="item-info-body">
                <p><span id="item-quantity">1</span>x</p>
                <p>@ $${price.toFixed(2)}</p>
                <p>$<span id="total-price-item">${price.toFixed(2)}</span></p>
            </div>
        </div>
        <div class="icon-cancel">
            <img src="assets/images/icon-remove-item.svg" alt="icon-remove-item" id="remove-btn">
        </div>
    </div>`;
}

function getCardHtml(image, name, category, price) {
    return `
    <div class="card-item">
        <div class="img-container">
            <img src="${image}" alt="${name}">
            <div class="add-item-content">
                <img src="assets/images/icon-add-to-cart.svg" alt="icon-add-to-cart">
                <p>Add to Cart</p>
            </div>
            <div class="increase-decrease-items" id="custom-input-container">
                <img src="assets/images/icon-decrement-quantity.svg" alt="icon-decrement-quantity" id="minus">
                <p id="custom-input">1</p>
                <img src="assets/images/icon-increment-quantity.svg" alt="icon-increment-quantity" id="plus">
            </div>
        </div>
        <div class="card-footer">
            <p>${category}</p>
            <p>${name}</p>
            <p>$${price}</p>
        </div>
    </div>`;
}

function getAlertItem(image, name, quantity, price, total) {
    return `<div class="alert-item">
        <div class="alert-item-info">
          <img src="${image}" alt="${name}">
          <div class="alert-item-info-small">
            <div class="info-small-head">
              <p>${name}</p>
            </div>
            <div class="info-small-body">
              <p><span id="alert-item-quantity">${quantity}</span>x</p>
              <p>@ $${price}</p>
            </div>
          </div>
        </div>
        <div class="alert-item-total">
          <p>$<span id="alert-item-total-price">${total}</span></p>
        </div>
    </div>`
}

function addItemForFirstTime(cartController, totalNumber, name, price, card) {

    const cartList = document.querySelector(".empty-container");
    const totalSection = document.querySelector(".total-order");
    const carbonNotice = document.querySelector(".carbon-notice");
    const confirmButton = document.getElementById("confirm-btn");

    cartController.style.display = "flex";
    cartList.style.display = "none";
    totalSection.style.display = "flex";
    carbonNotice.style.display = "flex";
    confirmButton.style.display = "block";

    cartList.insertAdjacentHTML("afterend", getItemHtml(name, price));
    updateTotalNumber(totalNumber, 1);

    const currentAdded = cartList.nextElementSibling;
    currentAdded.querySelector("#remove-btn").addEventListener("click", () => {
        removeAndFix(currentAdded, totalNumber, card, cartController);
    });

    updateTotalPrice(price);
}

function increase(quantityEl, totalNumber, itemName, price) {
    quantityEl.innerText = Number(quantityEl.innerText) + 1;
    updateTotalNumber(totalNumber, 1);

    const item = findCartItemByName(itemName);
    if (item) {
        const iqn = item.querySelector("#item-quantity");
        const totalPriceItem = item.querySelector("#total-price-item");
        iqn.innerText = Number(iqn.innerText) + 1;
        totalPriceItem.innerText = (parseFloat(totalPriceItem.innerText) + price).toFixed(2);
        updateTotalPrice(price);
    }
}

function decrease(quantityEl, cartController, totalNumber, itemName, price) {
    const current = Number(quantityEl.innerText);

    if (current === 1) {
        cartController.style.display = "none";
        updateTotalNumber(totalNumber, -1);

        const item = findCartItemByName(itemName);
        if (item) {
            item.remove();
            updateTotalPrice(-price);
            checkCartStatus();
        }
    } else {
        quantityEl.innerText = current - 1;
        updateTotalNumber(totalNumber, -1);

        const item = findCartItemByName(itemName);
        if (item) {
            const qty = item.querySelector("#item-quantity");
            const totalPriceEl = item.querySelector("#total-price-item");
            qty.innerText = Number(qty.innerText) - 1;
            totalPriceEl.innerText = (parseFloat(totalPriceEl.innerText) - price).toFixed(2);
            updateTotalPrice(-price);
        }
    }
}

function removeAndFix(itemEl, totalNumber, card, cartController) {
    const quantity = parseInt(itemEl.querySelector("#item-quantity").innerText);
    const price = parseFloat(itemEl.querySelector("#total-price-item").innerText);

    itemEl.remove();
    updateTotalPrice(-price);
    updateTotalNumber(totalNumber, -quantity);

    cartController.style.display = "none";
    card.querySelector("#custom-input").innerText = "1";

    checkCartStatus();
}

function checkCartStatus() {
    const hasItems = document.querySelector(".body-card-section").querySelector(".item-to-buy");
    const defaultCart = document.querySelector(".empty-container");
    const totalSection = document.querySelector(".total-order");
    const carbonNotice = document.querySelector(".carbon-notice");
    const confirmButton = document.getElementById("confirm-btn");

    if (!hasItems) {
        defaultCart.style.display = "flex";
        totalSection.style.display = "none";
        carbonNotice.style.display = "none";
        confirmButton.style.display = "none";
        document.getElementById("total").innerText = "0";
    }
}

function updateTotalPrice(amount) {
    const total = Array.from(document.querySelectorAll("#total"));
    total.forEach((item) => {
        item.innerText = (parseFloat(item.innerText) + amount).toFixed(2);
    })
}

function updateTotalNumber(element, num) {
    element.innerText = parseInt(element.innerText) + num;
}

function findCartItemByName(name) {
    return Array.from(document.querySelectorAll(".item-to-buy")).find(item => item.querySelector(".item-info-head p").innerText === name);
}