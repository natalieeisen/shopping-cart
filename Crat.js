
let totalPrice = 0;
let data;
let totalProdAmount = 0;

/**
* OnReady function, initial data and set functionality
* @param {String} url - API url.
*/
const onReady = async (url) => {
    // check if data is save in storage, if so, get it from the storage
    // if not, use the API.
    if (!localStorage.getItem('data')) {
        const response = await fetch(url);
        data = await response.json();
    } else data = JSON.parse(localStorage.getItem('data'));

    console.log('data: ', data);
    buildTable();
    updateTotalPrice(totalPrice);
    removeItem();
    console.log('total: ', totalProdAmount);

}

/**
* Build the table rows with the current data. 
*/
const buildTable = () => {
    let specific_tbody = document.getElementById('table-data');
    for (const [index, iterator] of data.entries()) {

        iterator.amount = iterator?.amount ? iterator.amount : 1;
        totalProdAmount += iterator.amount;
        const row = specific_tbody.insertRow(index);

        let title = row.insertCell(0);
        let image = row.insertCell(1);
        let price = row.insertCell(2);
        let pricequantitySelector = row.insertCell(3);
        let removeBtn = row.insertCell(4);
        title.innerHTML = iterator.title;

        image.innerHTML = `<div class="image-date">
        <img  src="${iterator.image}" width="100" height="100" alt="Cinque Terre">
        <span class="tooltiptext">${iterator.description}</span>
        </div>`;
        price.innerHTML = iterator.price;
        pricequantitySelector.innerHTML = `<div style="width:100px">
        <input type="button" onclick="decrementValue(${iterator.id},${iterator.price})" value="-" />
        <input type="text" name="quantity" value=${iterator.amount} maxlength="2" max="10" size="1" id="${iterator.id}" />
        <input type="button" onclick="incrementValue(${iterator.id},${iterator.price})" value="+" />
        </div>`;
        removeBtn.classList.add('remove');

        removeBtn.innerHTML = `<button name="${iterator.id}" value="${iterator.price}" style="border: none;color:White;border-radius:4px;background-color:red;" >Remove</button>`;
        totalPrice += iterator.price * iterator.amount;
    }
    handelItemsAmont();
};

/**
* Remove item for the shopping cart and handel total price amount.
*/
const removeItem = () => {
    const removeBtn = document.getElementsByClassName('remove');

    for (let index = 0; index < removeBtn.length; index++) {
        removeBtn[index].addEventListener('click', (event) => {
            event.target.parentElement.parentElement.remove();
            let foundIndex = data.findIndex(item => item.id === parseInt(event.target.name));
            let amountToRemove = data[foundIndex].amount;
            data = data.filter(item => item.id !== parseInt(event.target.name));
            localStorage.setItem('data', JSON.stringify(data));

            totalPrice -= parseFloat(event.target.value) * amountToRemove;
            totalProdAmount -= 1;
            updateTotalPrice(totalPrice);
            handelItemsAmont();
        });
    }
    console.log('total: ', totalProdAmount);
};

/**
* Handel the total price amount after removing/decrement/increment item 
*/
const updateTotalPrice = (totalPrice) => {
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.innerHTML = `Total Price: ${totalPrice.toFixed(2)}`;
};

/**
* Handel the total price of shipping.
* if there is lest then product the shipping price is 5$, if more, the price increased by 10% fro the amount
* of products.
*/
const handelItemsAmont = () => {
    const shipping = document.getElementById('shipping');
    if (totalProdAmount > 4) {
        const amount = totalProdAmount / 10;
        shipping.innerHTML = `Shipping Value: ${totalProdAmount + amount}$`;
    } else shipping.innerHTML = `Shipping Value: ${5}$`;
};

/**
* Decrement item handler.
*/
const decrementValue = (id, price) => {

    var value = parseInt(document.getElementById(id).value, 10);
    value = isNaN(value) ? 0 : value;
    if (value > 1) {
        value--;
        document.getElementById(id).value = value;
        let foundIndex = data.findIndex(item => item.id === id);
        data[foundIndex].amount = value;
        totalPrice -= price;
        localStorage.setItem('data', JSON.stringify(data));
        totalProdAmount -= 1;
        updateTotalPrice(totalPrice);
        handelItemsAmont();
        console.log('total: ', totalProdAmount);
    }
};

/**
* Increment item handler.
*/
const incrementValue = (id, price) => {
    var value = parseInt(document.getElementById(id).value, 10);
    value = isNaN(value) ? 0 : value;
    if (value < 10) {
        value++;
        document.getElementById(id).value = value;
    }
    let foundIndex = data.findIndex(item => item.id === id);
    data[foundIndex].amount = value;
    localStorage.setItem('data', JSON.stringify(data));
    totalPrice += price;
    totalProdAmount += 1;
    updateTotalPrice(totalPrice);
    handelItemsAmont();
    console.log('total: ', totalProdAmount);
}


onReady('https://fakestoreapi.com/products');
