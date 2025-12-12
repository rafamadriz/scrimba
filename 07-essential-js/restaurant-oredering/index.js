import { menuArray as menu } from "./data.js"

const createItemsHTMl = () => {
    let itemsHTML = "";
    menu.forEach((item) => {
        const { name, ingredients, id, price, emoji } = item;
        itemsHTML += `
<li>
    <p class="emoji">${emoji}</p>
    <div class="item-info">
        <div>
            <h3>${name}</h3>
            <p>${ingredients.join(", ")}</p>
            <p class="item-price">$${price}</p>
        </div>
    <button class="add-item" data-btn-id=${id}>+</button>
    </div>
</li>
`;
    });
    document.getElementById("items").innerHTML = itemsHTML
};
createItemsHTMl()

let preCheckoutListHTML = []
const handleAddBtn = (itemId) => {

    const targetItem = menu.filter(item => {
        return item.id === itemId
    })[0]

    const { name, id } = targetItem
    if (!findItemInCheckout(itemId)) {
            preCheckoutListHTML.unshift(`
                <li data-id=${id}>
                    <div class="name-checkout">
                        ${name} 
                        <button class="remove-item" data-remove-btn-id=${id}>remove</button>
                    </div> 
                    <div class="price-checkout">
                        <span class="number-of-items">
                            x
                            <span id="number-of-${name.toLowerCase()}">
                            </span>
                        </span>
                        <span id="${name.toLowerCase()}-price"></span>
                    </div>
                </li>
                `
        )
    }

    targetItem.amount++
    document.getElementById("pre-checkout-items").innerHTML =
        preCheckoutListHTML.join("");

    const addedItems = menu.filter(item => {return item.amount > 0})
    for (const item of addedItems) {

        const itemNumberSelector = `number-of-${item.name.toLowerCase()}`
        const itemNumberEl = document.getElementById(itemNumberSelector)
        itemNumberEl.textContent = item.amount

        const itemPriceSelector = `${item.name.toLowerCase()}-price`
        const itemPriceEl = document.getElementById(itemPriceSelector)
        itemPriceEl.textContent = item.amount * item.price
    }

    document.getElementById("total-amount").textContent =
        addedItems.reduce((total, current) => total + (current.amount * current.price), 0)

    preCheckoutisHidden()
    document.getElementById("order-complete").classList.add("hide")
}

const handleRemoveBtn = (itemHTML) => {
    const addedItems = menu.filter(item => {return item.amount >= 0})
    const itemObj = addedItems.filter(item => {
        return item.id === Number(itemHTML.dataset.removeBtnId)
    })[0]
    const itemLiEl = itemHTML.parentElement.parentElement

    if (!(itemObj.amount < 0)) {itemObj.amount--}
    if (itemObj.amount === 0) {
        itemLiEl.remove()
        preCheckoutListHTML = preCheckoutListHTML.filter(html => 
            !html.includes(`data-id=${itemObj.id}`)
        )
    }
    if (itemObj.amount > 0) {
        const numberOfItemInCheckoutEl = itemLiEl.querySelector(`#number-of-${itemObj.name.toLocaleLowerCase()}`)
        numberOfItemInCheckoutEl.textContent = itemObj.amount
        const itemPriceEl = itemLiEl.querySelector(`#${itemObj.name.toLowerCase()}-price`)
        itemPriceEl.textContent = itemObj.amount * itemObj.price
    }

    document.getElementById("total-amount").textContent =
        addedItems.reduce((total, current) => total + (current.amount * current.price), 0)
    preCheckoutisHidden()
}

const findItemInCheckout = (id) => {
    const addedItems = menu.filter(item => {return item.amount > 0})
    for (const item of addedItems) {
        if (item.id === id) {
            return true
        }
    }
    return false
}

function preCheckoutisHidden() {
    const preCheckoutEl = document.getElementById("pre-checkout")
    const preCheckoutItemsEl = document.getElementById("pre-checkout-items").children
    if (preCheckoutItemsEl.length > 0) preCheckoutEl.classList.remove("hide")
    if (preCheckoutItemsEl.length === 0) preCheckoutEl.classList.add("hide")
}

document.getElementById("complete-order").addEventListener("click", () => {
    document.getElementById("modal").style.display = "flex"
})

document.addEventListener("click", (e) => {
    e.target.dataset.btnId && handleAddBtn(Number(e.target.dataset.btnId))
    e.target.dataset.removeBtnId && handleRemoveBtn(e.target)
})

document.querySelector("#modal form").addEventListener("submit", (e) => {
    e.preventDefault(); // stop reload

    document.getElementById("modal").style.display = "none"
    preCheckoutListHTML = []
    document.getElementById("pre-checkout").classList.add("hide")


    const data = new FormData(e.target);         // grab form data
    const {name} = Object.fromEntries(data); // turn into plain object

    menu.forEach(item => {
        item.amount = 0
    })

    document.getElementById("order-complete").classList.remove("hide")
    document.getElementById("order-complete").innerHTML = `
<h3>Thanks, ${name}! your order is on it's way!</h3>
    `
})
