import { formatCurrency } from "../scripts/utils/money.js";

class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return "";
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size chart
      </a>
    `;
  }
}

export let products = [];

export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

export async function loadProducts() {
  const response = await fetch("backend/products.json");

  if (!response.ok) {
    throw new Error("Unable to load products.");
  }

  const productsData = await response.json();
  products = productsData.map((productDetails) => {
    if (productDetails.type === "clothing") {
      return new Clothing(productDetails);
    }

    return new Product(productDetails);
  });
}

export const loadProductsFetch = loadProducts;
