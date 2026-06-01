import { getCartQuantity } from "../data/cart.js";
import { orders } from "../data/orders.js";
import { getProduct, loadProducts } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

async function loadPage() {
  try {
    await loadProducts();
    renderTracking();
    updateCartQuantity();
  } catch (error) {
    document.querySelector(".js-order-tracking").innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <div class="delivery-date">
        Tracking is currently unavailable.
      </div>
    `;
  }
}

function renderTracking() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");
  const order = orders.find((currentOrder) => currentOrder.id === orderId);
  const orderProduct = order?.products.find((product) => product.productId === productId);
  const product = getProduct(productId);

  if (!order || !orderProduct || !product) {
    document.querySelector(".js-order-tracking").innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <div class="delivery-date">
        We could not find this package.
      </div>
    `;
    return;
  }

  const deliveryTime = dayjs(orderProduct.estimatedDeliveryTime);
  const progress = calculateProgress(order.orderTime, orderProduct.estimatedDeliveryTime);
  const status = getStatus(progress);

  document.querySelector(".js-order-tracking").innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${deliveryTime.format("dddd, MMMM D")}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${orderProduct.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${status === "preparing" ? "current-status" : ""}">
        Preparing
      </div>
      <div class="progress-label ${status === "shipped" ? "current-status" : ""}">
        Shipped
      </div>
      <div class="progress-label ${status === "delivered" ? "current-status" : ""}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progress}%;"></div>
    </div>
  `;
}

function calculateProgress(orderTime, deliveryTime) {
  const currentTime = dayjs();
  const orderDate = dayjs(orderTime);
  const deliveryDate = dayjs(deliveryTime);
  const percentProgress = (
    (currentTime - orderDate) /
    (deliveryDate - orderDate)
  ) * 100;

  return Math.min(Math.max(percentProgress, 0), 100);
}

function getStatus(progress) {
  if (progress >= 100) {
    return "delivered";
  }

  if (progress >= 50) {
    return "shipped";
  }

  return "preparing";
}

function updateCartQuantity() {
  document.querySelector(".js-cart-quantity").innerHTML = getCartQuantity();
}

loadPage();
