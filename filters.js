const mainLayoutWrapper = document.querySelector(".main-layout-wrapper");
const toggleFilterBtn = document.getElementById("toggleFilterBtn");
const [inputmin, inputmax] = document.querySelectorAll("p input");
const allitems = document.querySelector(`.allitems`);
const sectionItems = document.querySelectorAll(`.sectionItems li`);

if (toggleFilterBtn && mainLayoutWrapper) {
  toggleFilterBtn.addEventListener("click", () => {
    mainLayoutWrapper.classList.toggle("filters-hidden");

    if (mainLayoutWrapper.classList.contains("filters-hidden")) {
      toggleFilterBtn.innerHTML = `<i class="fas fa-filter"></i> اظهار الفلاتر`;
    } else {
      toggleFilterBtn.innerHTML = `<i class="fas fa-filter"></i> اخفاء الفلاتر`;
    }
  });
}
import { allProducts, displayProducts } from "./mainPage.js";
import { loadCart } from "./shopping.js";

const filterLinks = document.querySelectorAll(".sidebar ul li a");
const sliderLinkes = document.querySelectorAll(`.btn-primary`);
let currentCategory = "";

filterLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    currentCategory = e.target.href;
    console.log("تم اختيار :", currentCategory);

    fetchingFilters(currentCategory);
  });
});
sectionItems.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    currentCategory = e.target.classList;
    console.log("تم اختيار :", currentCategory);

    fetchingFilters(currentCategory);
  });
});
sliderLinkes.forEach((slide) => {
  slide.addEventListener("click", (e) => {
    currentCategory = e.target.id;
    console.log("تم اختيار :", currentCategory);

    fetchingFilters(currentCategory);
  });
});

async function fetchingFilters(currentCategory) {
  try {
    const [data] = await Promise.all([
      fetch(`${currentCategory}`).then((res) => res.json()),
    ]);

    allProducts.length = 0;
    allProducts.push(...data.products.slice(0, 10));

    console.log("Data loaded successfully");
    displayProducts(allProducts);

    loadCart();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function filterPrices() {
  let min = parseFloat(inputmin.value.trim()) || 0;
  let max = parseFloat(inputmax.value.trim()) || Infinity;

  let productcards = document.querySelectorAll(`.product-card`);

  productcards.forEach((element) => {
    let product = element.querySelector(`.product-price`);
    let price = parseFloat(product.textContent.replace(/[^0-9.]/g, ``));

    if (price >= min && price <= max) {
      element.style.display = `flex`;
    } else {
      element.style.display = `none`;
    }
  });
}

let timeout;
function debounceFilter() {
  clearTimeout(timeout);
  timeout = setTimeout(filterPrices, 500);
}
inputmin.addEventListener("input", debounceFilter);
inputmax.addEventListener("input", debounceFilter);

import { fetching } from "./mainPage.js";
allitems.addEventListener("click", () => {
  fetching();
  inputmin.value = ``;
  inputmax.value = ``;
});
let catogeryBtn = document.querySelector(`.sections`);
let categoriesMenu = document.querySelector(`.sectionItems`);

catogeryBtn.addEventListener(`click`, (e) => {
  e.stopPropagation;
  e.preventDefault;
  categoriesMenu.classList.toggle(`show`);
  if (!categoriesMenu.classList.contains(`show`)) {
    document.querySelector(".main-nav a.active")?.classList.remove("active");
    document.querySelector(`.main`).classList.add(`active`);
  }
});
document.addEventListener("click", function (e) {
  if (!e.target.closest(".sections")) {
    if (categoriesMenu && categoriesMenu.classList.contains("show")) {
      categoriesMenu.classList.remove("show");
      document.querySelector(".main-nav a.active")?.classList.remove("active");
      document.querySelector(`.main`).classList.add(`active`);
    }
  }
});
const sortSelector = document.getElementById("sortSelector");

function sortProducts(criteria) {
  
  if (criteria === "price-asc") {
    allProducts.sort((a, b) => a.price - b.price);
  } else if (criteria === "price-desc") {
  } else if (criteria === "rating-desc") {
    allProducts.sort((a, b) => b.rating - a.rating);
  } else if (criteria === "rating-asc") {
    allProducts.sort((a, b) => a.rating - b.rating);
  } else if (criteria === "default") {
     allProducts.sort((a, b) => a.id - b.id);
  }

  displayProducts(allProducts);
}

if (sortSelector) {
  sortSelector.addEventListener("change", (e) => {
    sortProducts(e.target.value);
  });
}