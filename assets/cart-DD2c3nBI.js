import{u as l,S as o,a as d}from"./storage-Bxw3izFL.js";import{i as p,a as g}from"./common-hH9c6r7-.js";class v{cartItemsContainer;cartSummaryContainer;constructor(){this.cartItemsContainer=document.getElementById("cartItems"),this.cartSummaryContainer=document.getElementById("cartSummary"),this.init()}init(){this.initBurgerMenu(),this.renderCart(),l(o.getCartItemCount())}initBurgerMenu(){const t=document.querySelector(".burger-icon"),e=document.querySelector(".burger-menu"),a=document.querySelectorAll(".burger-link");t&&t.addEventListener("click",()=>{t.classList.toggle("active"),e.classList.toggle("active"),document.body.classList.toggle("burger-open")}),a&&a.forEach(s=>{s.addEventListener("click",()=>{t.classList.remove("active"),e.classList.remove("active"),document.body.classList.remove("burger-open")})})}renderCart(){const t=o.getCart(),e=o.isUserLoggedIn(),a=o.getUser();if(!this.cartItemsContainer||!this.cartSummaryContainer)return;if(t.items.length===0){this.renderEmptyCart();return}this.cartItemsContainer.innerHTML="",t.items.forEach((n,i)=>{const c=this.createCartItemElement(n,i);this.cartItemsContainer.appendChild(c)}),this.cartSummaryContainer.innerHTML="";const s=document.createElement("div");s.className="cart-summary-content";let r=t.totalPrice;e&&t.totalDiscount>0&&(r=t.totalPrice-t.totalDiscount),e?(s.innerHTML=`
        <div class="cart-total-row">
          <span class="cart-total-label">Total:</span>
          <span class="cart-total-value">${t.totalDiscount>0?`<span class="price-original">$${t.totalPrice.toFixed(2)}</span> `:""}$${r.toFixed(2)}</span>
        </div>
        <div class="cart-info-row">
          <span class="cart-info-label">Address:</span>
          <span class="cart-info-value">${a.city}, ${a.street}, ${a.houseNumber}</span>
        </div>
        <div class="cart-info-row">
          <span class="cart-info-label">Pay by:</span>
          <span class="cart-info-value">${a.paymentMethod==="cash"?"Cash":"Card"}</span>
        </div>
        <button class="btn cart-confirm-btn" id="confirmOrderBtn">Confirm</button>
      `,setTimeout(()=>{const n=document.getElementById("confirmOrderBtn");n&&n.addEventListener("click",()=>this.confirmOrder())},0)):s.innerHTML=`
        <div class="cart-total-row">
          <span class="cart-total-label">Total:</span>
          <span class="cart-total-value">${e&&t.totalDiscount>0?`<span class="price-original">$${t.totalPrice.toFixed(2)}</span> `:""}$${r.toFixed(2)}</span>
        </div>
        <div class="cart-auth-section">
          <p class="cart-auth-message">Please sign in to complete your order</p>
          <div class="cart-auth-buttons">
            <a href="signin.html" class="btn cart-auth-btn">Sign In</a>
            <a href="registration.html" class="btn cart-auth-btn cart-auth-btn-secondary">Register</a>
          </div>
        </div>
      `,this.cartSummaryContainer.appendChild(s)}createCartItemElement(t,e){const a=o.isUserLoggedIn();let s=t.price+t.sizePrice;const r=t.additives.length*.5;s+=r;let n=s;a&&t.discountPrice!==void 0&&(n=t.discountPrice+t.sizePrice+r);const i=document.createElement("div");i.className="cart-item";const c=t.category==="dessert"?"g":"ml",m=t.size==="S"?t.category==="dessert"?"50":"200":t.size==="M"?t.category==="dessert"?"100":"300":t.category==="dessert"?"200":"400",u=t.additives.length>0?`, ${t.additives.join(", ")}`:"",h=a&&t.discountPrice!==void 0?`<span class="price-original">$${s.toFixed(2)}</span> <span class="price-discounted">$${n.toFixed(2)}</span>`:`$${s.toFixed(2)}`;return i.innerHTML=`
      <button class="cart-item-remove" data-index="${e}" aria-label="Remove item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <img src="${t.image}" alt="${t.productName}" class="cart-item-img">
      <div class="cart-item-info">
        <h3 class="cart-item-name">${t.productName}</h3>
        <p class="cart-item-details">${m}${c}${u}</p>
      </div>
      <p class="cart-item-price">${h}</p>
    `,i.querySelector(".cart-item-remove")?.addEventListener("click",()=>this.removeItem(e)),i}renderEmptyCart(){!this.cartItemsContainer||!this.cartSummaryContainer||(this.cartItemsContainer.innerHTML=`
      <div class="cart-empty">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M37.5 8.333L29.167 29.167M29.167 29.167H12.5M29.167 29.167L25 91.667H75L70.833 29.167M70.833 29.167H87.5M70.833 29.167L62.5 8.333M41.667 45.833V70.833M58.333 45.833V70.833" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="cart-empty-title">Your cart is empty</h2>
        <p class="cart-empty-text">Add some delicious items to your cart!</p>
        <a href="menu.html" class="btn cart-empty-btn">Browse Menu</a>
      </div>
    `,this.cartSummaryContainer.innerHTML="")}removeItem(t){o.removeFromCart(t),this.renderCart(),l(o.getCartItemCount()),d("Item removed from cart","success")}async confirmOrder(){const t=o.getCart();if(t.items.length===0)return;const e=document.getElementById("confirmOrderBtn");if(!e)return;e.disabled=!0,e.innerHTML=`
      <div class="loader-spinner loader-spinner-small"></div>
      Processing...
    `;const a=new Map;t.items.forEach(r=>{const n=`${r.productId}-${r.size}-${r.additives.sort().join(",")}`,i=a.get(n);i?i.quantity+=1:a.set(n,{productId:r.productId,size:r.size.toLowerCase(),additives:r.additives,quantity:1})});const s={items:Array.from(a.values()),totalPrice:t.totalPrice-t.totalDiscount};try{const r=await g.placeOrder(s);r.error?(d(r.error||"Something went wrong. Please, try again","error"),e.disabled=!1,e.textContent="Confirm Order"):(o.clearCart(),this.cartItemsContainer&&(this.cartItemsContainer.innerHTML=`
            <div class="cart-success">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="#4CAF50" stroke-width="4"/>
                <path d="M30 50L45 65L70 35" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h2 class="cart-success-title">Thank you for your order!</h2>
              <p class="cart-success-text">Our manager will contact you shortly.</p>
              <a href="menu.html" class="btn cart-success-btn">Continue Shopping</a>
            </div>
          `),this.cartSummaryContainer&&(this.cartSummaryContainer.innerHTML=""),l(0))}catch{d("Something went wrong. Please, try again","error"),e.disabled=!1,e.textContent="Confirm Order"}}}document.addEventListener("DOMContentLoaded",()=>{new v,p()});
