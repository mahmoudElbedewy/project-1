const productGrid = document.getElementById("productGrid");
export let allProducts = []; 

import { loadCart ,isItemInWishlist,loadWishlist } from "./shopping.js";

document.addEventListener("DOMContentLoaded", () => {
  let slides = document.querySelectorAll(".slide");
  let sliderWrapper = document.querySelector(".slider-wrapper");
  let index = 0;
  let time = 3000;

  function slider() {
    index++;
    if (index >= slides.length) {
      index = 0;
    }
    if (sliderWrapper) {
      sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
    }
  }

  if (slides.length > 0) {
    setInterval(slider, time);
  }
  document.getElementById("openWishlistBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openWishlistModal(); 
});
});

async function fetching() {
  try {
    const [laptopsData, watchesData, headphonesData] = await Promise.all([
      fetch("https://dummyjson.com/products/category/laptops").then((res) => res.json()),
      fetch("https://dummyjson.com/products/category/mens-watches").then((res) => res.json()),
      fetch("https://dummyjson.com/products/search?q=headphones").then((res) => res.json())
    ]);

    allProducts.length = 0; 
    allProducts.push(
      ...laptopsData.products.slice(0, 10),
      ...watchesData.products.slice(0, 10),
      ...headphonesData.products.slice(0, 10)
    );

    console.log("Data loaded successfully");
    
    loadCart();
    loadWishlist()
    displayProducts(allProducts);
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const observer = new IntersectionObserver((intries) => {
  intries.forEach((entrie) => {
    if (entrie.isIntersecting) {
      entrie.target.classList.add("show")
      observer.unobserve(entrie.target)
    }
  })
}, {
  threshold:.1
})

function displayProducts(products) {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    const heartClass = isItemInWishlist(product.id) ? "active-heart" : "";
    card.innerHTML = `
      <div class="product-image-container">
    <button class="wishlist-btn" onclick="toggleWishlist(this , ${product.id})">
        <i class="fas fa-heart ${heartClass}"></i>
    </button> 
    <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
  </div>
      <div class="product-info">
        <h3 class="product-title" title="${product.title}">${product.title}</h3>
        <div class="product-rating">
          <i class="fas fa-star"></i> ${product.rating}
        </div>
        <div class="product-price">$${product.price}</div>
        <button class="details" onclick="details(${product.id})">تفاصيل</button>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          اضافة للسلة  <i class="fas fa-cart-plus"></i>
        </button>
      </div>
    `;
    productGrid.appendChild(card);
    observer.observe(card)
  });
}

fetching();

export { displayProducts, fetching };
