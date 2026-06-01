import { addToCart, getCartQuantity } from "../data/cart.js";
import { orders } from "../data/orders.js";
import { getProduct, loadProducts } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

async function loadPage() {
  try {
    await loadProducts();
    renderOrders();
    updateCartQuantity();
  } catch (error) {
    document.querySelector(".js-orders-grid").innerHTML = `
      <div class="order-container">
        Orders are currently unavailable. Please try again later.
      </div>
    `;
  }
}

function renderOrders() {
  if (orders.length === 0) {
    document.querySelector(".js-orders-grid").innerHTML = `
      <div class="order-container">
        You have not placed any orders yet.
      </div>
    `;
    return;
  }

  const ordersHTML = orders.map((order) => `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${dayjs(order.orderTime).format("MMMM D")}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${orderProductsHTML(order)}
      </div>
    </div>
  `).join("");

  document.querySelector(".js-orders-grid").innerHTML = ordersHTML;

  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;

      addToCart(productId);
      updateCartQuantity();
    });
  });
}

function orderProductsHTML(order) {
  return order.products.map((orderProduct) => {
    const product = getProduct(orderProduct.productId);

    if (!product) {
      return "";
    }

    return `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${dayjs(orderProduct.estimatedDeliveryTime).format("MMMM D")}
        </div>
        <div class="product-quantity">
          Quantity: ${orderProduct.quantity}
        </div>
        <button
          class="buy-again-button button-primary js-buy-again"
          data-product-id="${product.id}"
        >
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  }).join("");
}

function updateCartQuantity() {
  document.querySelector(".js-cart-quantity").innerHTML = getCartQuantity();
}

loadPage();
