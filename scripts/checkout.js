import { getCartQuantity } from "../data/cart.js";
import { loadProducts } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

async function loadPage() {
  try {
    await loadProducts();
    renderOrderSummary();
    renderPaymentSummary();
    updateCheckoutHeader();
  } catch (error) {
    document.querySelector(".js-order-summary").innerHTML = `
      <div class="cart-item-container">
        We could not load checkout. Please try again later.
      </div>
    `;
  }
}

export function updateCheckoutHeader() {
  const cartQuantity = getCartQuantity();
  const itemText = cartQuantity === 1 ? "item" : "items";

  document.querySelector(".js-return-to-home-link").innerHTML =
    `${cartQuantity} ${itemText}`;
}

loadPage();
