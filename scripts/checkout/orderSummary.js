import {
  cart,
  getCartQuantity,
  removeFromCart,
  updateDeliveryOption,
} from "../../data/cart.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export function renderOrderSummary() {
  if (cart.length === 0) {
    document.querySelector(".js-order-summary").innerHTML = `
      <div class="cart-item-container">
        Your cart is empty.
      </div>
    `;
    return;
  }

  const cartSummaryHTML = cart.map((cartItem) => {
    const product = getProduct(cartItem.productId);

    if (!product) {
      return "";
    }

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const deliveryDate = dayjs().add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    return `
      <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-price">
              ${product.getPrice()}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span
                class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${product.id}"
              >
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(product, cartItem)}
          </div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;

      removeFromCart(productId);
      renderOrderSummary();
      renderPaymentSummary();
      updateCheckoutHeader();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function updateCheckoutHeader() {
  const cartQuantity = getCartQuantity();
  const itemText = cartQuantity === 1 ? "item" : "items";

  document.querySelector(".js-return-to-home-link").innerHTML =
    `${cartQuantity} ${itemText}`;
}

function deliveryOptionsHTML(product, cartItem) {
  return deliveryOptions.map((deliveryOption) => {
    const deliveryDate = dayjs().add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");
    const priceString = deliveryOption.priceCents === 0
      ? "FREE"
      : `$${formatCurrency(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    return `
      <div
        class="delivery-option js-delivery-option"
        data-product-id="${product.id}"
        data-delivery-option-id="${deliveryOption.id}"
      >
        <input
          type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${product.id}"
        >
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  }).join("");
}
