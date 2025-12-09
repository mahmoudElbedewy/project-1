import { allProducts, displayProducts } from "./mainPage.js";

const mainHeader = document.querySelector(".main-header");
const searchIcon = document.querySelector(".header-icons .fa-search");
const searchContainer = document.querySelector(".search-container");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Sticky Header Opacity
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    mainHeader.style.opacity = "0.9";
  } else {
    mainHeader.style.opacity = "1";
  }
});

// Toggle Search Bar
if (searchIcon) {
  searchIcon.addEventListener("click", () => {
    searchContainer.classList.toggle("active");
    if (searchContainer.classList.contains("active")) {
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    } else {
      searchInput.value = "";
      searchResults.style.display = "none";
    }
  });
}

// Live Search Logic
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    let value = e.target.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (value.length > 0) {
      // Use the shared allProducts array
      let filteredProducts = allProducts.filter((product) =>
        product.title.toLowerCase().includes(value)
      );

      if (filteredProducts.length > 0) {
        searchResults.style.display = "block";
        filteredProducts.forEach((product) => {
          let li = document.createElement("li");
          li.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <span>${product.title}</span>
        `;
          li.addEventListener("click", () => {
            displayProducts([product]);
            searchResults.style.display = "none";
            searchInput.value = product.title;
          });
          searchResults.appendChild(li);
        });
      } else {
        searchResults.style.display = "block";
        searchResults.innerHTML =
          '<li style="justify-content:center;">No results found</li>';
      }
    } else {
      searchResults.style.display = "none";
    }
  });
}
const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach(link => {
    link.addEventListener("click", function() {
        document.querySelector(".main-nav a.active")?.classList.remove("active");
        
        this.classList.add("active");
    });
});
// --- Responsive Menu & Cart Logic ---

const menuBtn = document.querySelector("#menu-btn");
const navbar = document.querySelector(".main-nav");
const cartIconBtn = document.querySelector(".cart-icon");
const cartDrawer = document.querySelector(".cart-drawer");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navbar.classList.toggle("active");
        cartDrawer?.classList.remove("active");
        menuBtn.classList.toggle("fa-times");
    });
}

if (cartIconBtn) {
    cartIconBtn.addEventListener("click", (e) => {
        if (window.innerWidth <= 991) {
            e.stopPropagation(); 
            cartDrawer.classList.toggle("active");
            navbar?.classList.remove("active");
            menuBtn?.classList.remove("fa-times");
        }
    });
}

document.addEventListener("click", (e) => {
    // Close Navbar if click is outside
    if (navbar && menuBtn && !navbar.contains(e.target) && !menuBtn.contains(e.target)) {
        navbar.classList.remove("active");
        menuBtn.classList.remove("fa-times");
    }

    if (window.innerWidth <= 991 && cartDrawer && !cartDrawer.contains(e.target) && !cartIconBtn.contains(e.target)) {
        cartDrawer.classList.remove("active");
    }
});

if (cartDrawer) {
    cartDrawer.addEventListener("click", (e) => {
        if (e.offsetY < 40 && e.offsetX > cartDrawer.offsetWidth - 40) {
            cartDrawer.classList.remove("active");
        }
    });
}

const themeToggleBtn = document.getElementById("theme-toggle");
const bodyElement = document.body;

function applyTheme(theme) {
    if (theme === "dark") {
        bodyElement.setAttribute("data-theme", "dark");
        themeToggleBtn.classList.remove("fa-moon");
        themeToggleBtn.classList.add("fa-sun");
        themeToggleBtn.style.color = "#f6e05e";
    } else {
        bodyElement.removeAttribute("data-theme");
        themeToggleBtn.classList.remove("fa-sun");
        themeToggleBtn.classList.add("fa-moon"); 
        themeToggleBtn.style.color = "";
    }
}

const savedTheme = localStorage.getItem("siteTheme");
if (savedTheme) {
    applyTheme(savedTheme);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        if (bodyElement.getAttribute("data-theme") === "dark") {
            applyTheme("light");
            localStorage.setItem("siteTheme", "light");
        } else {
            applyTheme("dark");
            localStorage.setItem("siteTheme", "dark");
        }
    });
}
// --- User Authentication Logic ---

const userBtn = document.getElementById("user-btn");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("usernameInput");

if (userBtn) {
    userBtn.addEventListener("click", () => {
        const currentUser = localStorage.getItem("username");
        if (currentUser) {
            if (confirm(`هل تود تسجيل الخروج يا ${currentUser}؟`)) {
                localStorage.removeItem("username");
                window.location.reload(); 
            }
        } else {
            loginModal.style.display = "flex";
        }
    });
}

window.closeLoginModal = function() {
    if(loginModal) loginModal.style.display = "none";
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const name = usernameInput.value.trim();
        
        if (name) {
            localStorage.setItem("username", name); 
            checkUserLogin(); 
            closeLoginModal(); 
        }
    });
}

function checkUserLogin() {
    const savedName = localStorage.getItem("username");
    if (savedName && userBtn) {
        userBtn.classList.remove("fa-user"); 
        userBtn.innerHTML = `<span class="user-welcome">مرحباً، ${savedName}</span>`;
        userBtn.style.fontFamily = "inherit";
    }
}

checkUserLogin();