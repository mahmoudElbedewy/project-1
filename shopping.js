import { allProducts } from "./mainPage.js";

let cart = [];

const cartCountElement = document.querySelector(".cart-count");
const cartItemsContainer = document.querySelector(".cart-items");
const total = document.querySelector(".total");
const totalMoney = document.querySelector(".totalMoney");
const clearAllBtn = document.getElementById("allTrashItems")?.parentElement;

if (clearAllBtn) clearAllBtn.style.display = "none";
if (total) total.style.display = "none";

export function loadCart() {
  let storedData = sessionStorage.getItem("myShoppingCart");
  if (storedData) {
    cart = JSON.parse(storedData);
    renderCart();
  }
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  let totalPrice = 0;
  let totalCount = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>سلتك فارغة.</p>";
    if (total) total.style.display = "none";
    if (clearAllBtn) clearAllBtn.style.display = "none";
    if (cartCountElement) cartCountElement.innerHTML = "0";
    if (totalMoney) totalMoney.innerHTML = "0";
    return;
  }

  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;
    totalCount += item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
          <img src="${item.thumbnail}" class="cart-item-img">
          <div class="cart-item-info">
              <h4 class="cart-item-name">${item.title}</h4>
              <p class="cart-item-price">$${item.price}</p>
              
              <div class="quantity-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span class="qty-number">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
              </div>
          </div>
          
          <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
              <i class="fas fa-trash"></i>
          </button>
      </div>
    `;
  });

  if (total) total.style.display = "flex";
  if (clearAllBtn) clearAllBtn.style.display = "inline-block";
  if (totalMoney) totalMoney.innerHTML = `${Number(totalPrice.toFixed(2))}$`;
  if (cartCountElement) cartCountElement.innerHTML = `${totalCount}`;

  sessionStorage.setItem("myShoppingCart", JSON.stringify(cart));
}

window.addToCart = function (id) {
  const cartIconWrapper = document.querySelector(".cart-icon");
  let existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const product = allProducts.find((p) => p.id === id);
    if (product) {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      });
    }
  }

  renderCart();

  if (cartIconWrapper) {
    cartIconWrapper.classList.remove("animation");
    void cartIconWrapper.offsetWidth;
    cartIconWrapper.classList.add("animation");
    setTimeout(() => {
      cartIconWrapper.classList.remove("animation");
    }, 500);
  }
};

window.changeQty = function (id, change) {
  let item = cart.find((p) => p.id === id);
  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      cart = cart.filter((p) => p.id !== id);
    }

    renderCart();
  }
};

window.removeFromCart = function (id) {
  cart = cart.filter((p) => p.id !== id);
  renderCart();

  let icon = document.querySelector(`.cart-icon`);
  if (icon) {
    icon.classList.remove("animation");
    void icon.offsetWidth;
    icon.classList.add("animation");
    setTimeout(() => {
      icon.classList.remove("animation");
    }, 500);
  }
};

window.clearAllCart = function () {
  if (cart.length === 0) return;

  cart = [];
  renderCart();

  let icon = document.querySelector(`.cart-icon`);
  if (icon) {
    icon.classList.remove("animation");
    void icon.offsetWidth;
    icon.classList.add("animation");
    setTimeout(() => {
      icon.classList.remove("animation");
    }, 500);
  }
};

window.details = function (id) {
  const modal = document.getElementById("detailsModal");
  const content = document.getElementById("modalDetailsContent");
  const product = allProducts.find((p) => p.id === id);

  if (product) {
    let thumbnailsHTML = "";
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgSrc) => {
        thumbnailsHTML += `
            <img src="${imgSrc}" class="thumb-img" onclick="changeModalImage('${imgSrc}')">
         `;
      });
    }

    // 2. رسم المودال
    content.innerHTML = `
        <div class="modal-body-flex">
            
            <div class="gallery-wrapper">
                <img id="mainModalImage" src="${
                  product.thumbnail
                }" class="details-main-img">
                
                <div class="thumbnails-container">
                    ${thumbnailsHTML}
                </div>
            </div>

            <div class="modal-info">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p><strong>الماركة:</strong> ${product.brand || "غير محدد"}</p>
                <p><strong>المخزون:</strong> ${product.stock} قطعة</p>
                <p><strong>التقييم:</strong> ${
                  product.rating
                } <i class="fas fa-star" style="color:gold"></i></p>
                <div class="modal-price">$${product.price}</div>
                
                <button class="add-to-cart-btn" onclick="addToCart(${
                  product.id
                }); showToast('تمت الإضافة للسلة ✅'); closeDetails()">
                    أضف للسلة الآن <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `;
    modal.style.display = "flex";
  }
};

window.changeModalImage = function (src) {
  const mainImg = document.getElementById("mainModalImage");
  if (mainImg) {
    mainImg.src = src;
  }
};

window.closeDetails = function () {
  document.getElementById("detailsModal").style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById("detailsModal");
  if (event.target === modal) {
    closeDetails();
  }
};

let wishlistArray = [];

export function loadWishlist() {
  let items = localStorage.getItem(`myWishlist`);
  if (items) {
    wishlistArray = JSON.parse(items);
  }
}

export function isItemInWishlist(id) {
  return wishlistArray.includes(id);
}

window.toggleWishlist = function (buttonElement, id) {
  let icon = buttonElement.querySelector(`i`);
  const index = wishlistArray.indexOf(id);

  if (index > -1) {
    wishlistArray.splice(index, 1);
    icon.classList.remove("active-heart");
  } else {
    wishlistArray.push(id);
    icon.classList.add("active-heart");
  }

  localStorage.setItem(`myWishlist`, JSON.stringify(wishlistArray));
};

window.openWishlistModal = function () {
  const modal = document.getElementById("wishlistModal");
  const grid = document.getElementById("wishlistGridItems");

  grid.innerHTML = "";

  if (wishlistArray.length === 0) {
    grid.innerHTML =
      "<p style='text-align:center; width:100%; grid-column: 1/-1;'>لا توجد منتجات في المفضلة 💔</p>";
    modal.style.display = "flex";
    return;
  }

  wishlistArray.forEach((id) => {
    const product = allProducts.find((p) => p.id === id);
    if (product) {
      grid.innerHTML += `
                <div class="wishlist-card" id="wish-card-${product.id}">
                    <button class="remove-wish-btn" onclick="removeFromWishlistUI(${product.id})" title="حذف">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h4>${product.title}</h4>
                    <div class="price">$${product.price}</div>
                    <button class="details" onclick="closeWishlist(); details(${product.id})" style="font-size:12px; margin:5px 0;">
                    تفاصيل
                    </button>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}); showToast('تمت إضافة المنتج للسلة بنجاح')" style="width:100%; font-size:12px;">
                        نقل للسلة <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            `;
    }
  });

  modal.style.display = "flex";
};

window.closeWishlist = function () {
  document.getElementById("wishlistModal").style.display = "none";
  document.querySelector(`.wishlist a`).classList.remove(`active`);
  document.querySelector(`.main`).classList.add(`active`);
};

window.removeFromWishlistUI = function (id) {
  const index = wishlistArray.indexOf(id);
  if (index > -1) {
    wishlistArray.splice(index, 1);
    localStorage.setItem(`myWishlist`, JSON.stringify(wishlistArray));
  }

  const card = document.getElementById(`wish-card-${id}`);
  if (card) card.remove();

  const mainBtn = document.querySelector(
    `button[onclick*="toggleWishlist"][onclick*="${id}"] i`
  );
  if (mainBtn) mainBtn.classList.remove("active-heart");

  const grid = document.getElementById("wishlistGridItems");
  if (wishlistArray.length === 0) {
    grid.innerHTML =
      "<p style='text-align:center; width:100%; grid-column: 1/-1;'>لا توجد منتجات في المفضلة 💔</p>";
  }
};
window.showToast = function (message) {
  // 1. إنشاء العنصر
  const toast = document.createElement("div");
  toast.classList.add("toast-notification");
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};
// --- Checkout Logic (إتمام الشراء) ---

const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");

window.openCheckoutModal = function() {
    if (cart.length === 0) {
        showToast("السلة فارغة! أضف منتجات أولاً 🛒");
        return;
    }
    
    const totalElement = document.querySelector(".totalMoney");
    const checkoutTotal = document.querySelector(".totalMoneyCheckout");
    if (totalElement && checkoutTotal) {
        checkoutTotal.innerText = totalElement.innerText;
    }

    checkoutModal.style.display = "flex";
}

window.closeCheckoutModal = function() {
    if(checkoutModal) checkoutModal.style.display = "none";
}

if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        const btn = checkoutForm.querySelector("button");
        const originalText = btn.innerText;
        btn.innerText = "جاري المعالجة...";
        btn.disabled = true;

        setTimeout(() => {
            clearAllCart(); 
            
            closeCheckoutModal();
            
            showToast("تم استلام طلبك بنجاح! ");
            
            btn.innerText = originalText;
            btn.disabled = false;
            checkoutForm.reset(); 
            
            document.querySelector(".cart-drawer")?.classList.remove("active");
            
        }, 1500); 
    });
}