const API_URL = "http://localhost:5000";

/* =========================
   LOCAL DATA
========================= */

let products = [];
let businesses = [
  {
    id: 1,
    name: "Heisjuly Fashion",
    category: "Fashion",
    location: "Lagos, Nigeria",
    phone: "+2348012345678",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
    description: "Modern fashion and custom clothing."
  }
];

let cart = [];


/* =========================
   NAVIGATION
========================= */

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    showSection(link.dataset.section);
  });
});


function showSection(sectionId) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active-page");
  });

  const section = document.getElementById(sectionId);

  if (section) {
    section.classList.add("active-page");
  }

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.section === sectionId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   FORMAT PRICE
========================= */

function formatPrice(price) {
  return "₦" + Number(price).toLocaleString();
}


/* =========================
   LOAD PRODUCTS FROM SERVER
========================= */

async function loadProducts() {

  try {

    const response = await fetch(
      `${API_URL}/products`
    );

    if (!response.ok) {
      throw new Error("Could not load products");
    }

    products = await response.json();

    renderProducts();
    renderFeatured();

  } catch (error) {

    console.error(error);

    const productsContainer =
      document.getElementById("productsContainer");

    if (productsContainer) {
      productsContainer.innerHTML = `
        <p class="error-message">
          Could not connect to Heisjuly Marketplace server.
        </p>
      `;
    }

  }
}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  const container =
    document.getElementById("productsContainer");

  if (!container) return;

  const searchInput =
    document.getElementById("searchInput");

  const search =
    searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

  const categoryFilter =
    document.getElementById("categoryFilter");

  const category =
    categoryFilter
      ? categoryFilter.value
      : "all";


  const filteredProducts =
    products.filter(product => {

      const productName =
        String(product.name || "").toLowerCase();

      const productDescription =
        String(product.description || "").toLowerCase();

      const matchesSearch =
        productName.includes(search) ||
        productDescription.includes(search);

      const matchesCategory =
        category === "all" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });


  container.innerHTML = "";


  if (filteredProducts.length === 0) {

    container.innerHTML = `
      <div class="empty-message">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    `;

    return;
  }


  filteredProducts.forEach(product => {

    const card =
      document.createElement("div");

    card.className = "product-card";


    card.innerHTML = `

      <img
        src="${product.image || "https://via.placeholder.com/500"}"
        alt="${escapeHTML(product.name)}"
      >

      <div class="product-info">

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <div class="product-price">
          ${formatPrice(product.price)}
        </div>

        <p>
          ${escapeHTML(product.description)}
        </p>

        <button
          class="buy-btn"
          onclick="addToCart('${product._id || product.id}')"
        >
          Add to Cart
        </button>

      </div>

    `;

    container.appendChild(card);

  });
}


/* =========================
   FEATURED PRODUCTS
========================= */

function renderFeatured() {

  const container =
    document.getElementById("featuredProducts");

  if (!container) return;

  container.innerHTML = "";


  products.slice(0, 4).forEach(product => {

    const card =
      document.createElement("div");

    card.className = "product-card";


    card.innerHTML = `

      <img
        src="${product.image || "https://via.placeholder.com/500"}"
        alt="${escapeHTML(product.name)}"
      >

      <div class="product-info">

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <div class="product-price">
          ${formatPrice(product.price)}
        </div>

        <button
          class="buy-btn"
          onclick="addToCart('${product._id || product.id}')"
        >
          Add to Cart
        </button>

      </div>

    `;

    container.appendChild(card);

  });
}


/* =========================
   SEARCH
========================= */

const searchInput =
  document.getElementById("searchInput");

if (searchInput) {

  searchInput.addEventListener(
    "input",
    renderProducts
  );

}


/* =========================
   CATEGORY FILTER
========================= */

const categoryFilter =
  document.getElementById("categoryFilter");

if (categoryFilter) {

  categoryFilter.addEventListener(
    "change",
    renderProducts
  );

}


/* =========================
   CATEGORY BUTTONS
========================= */

function filterCategory(category) {

  showSection("products");

  if (categoryFilter) {

    categoryFilter.value = category;

  }

  renderProducts();
}


/* =========================
   POST PRODUCT
========================= */

const sellForm =
  document.getElementById("sellForm");


if (sellForm) {

  sellForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const product = {

        name:
          document.getElementById(
            "productName"
          ).value.trim(),

        price:
          Number(
            document.getElementById(
              "productPrice"
            ).value
          ),

        category:
          document.getElementById(
            "productCategory"
          ).value,

        image:
          document.getElementById(
            "productImage"
          ).value.trim(),

        description:
          document.getElementById(
            "productDescription"
          ).value.trim(),

        seller: "Heisjuly Seller"

      };


      if (
        !product.name ||
        !product.price ||
        !product.category ||
        !product.description
      ) {

        alert(
          "Please fill in all required fields."
        );

        return;

      }


      try {

        const response =
          await fetch(
            `${API_URL}/products`,
            {

              method: "POST",

              headers: {
                "Content-Type": "application/json"
              },

              body: JSON.stringify(product)

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          alert(
            data.message ||
            "Could not post product."
          );

          return;

        }


        alert(
          "Product posted successfully!"
        );


        sellForm.reset();


        await loadProducts();


        showSection("products");


      } catch (error) {

        console.error(error);

        alert(
          "Could not connect to the server. Make sure server.js is running."
        );

      }

    }
  );

}


/* =========================
   CART
========================= */

function addToCart(productId) {

  const product =
    products.find(
      item =>
        String(item._id || item.id) ===
        String(productId)
    );


  if (!product) {

    alert("Product not found.");

    return;

  }


  cart.push(product);

  updateCart();

  alert(
    `${product.name} added to cart.`
  );

}


function updateCart() {

  const cartCount =
    document.getElementById("cartCount");

  if (cartCount) {

    cartCount.textContent =
      cart.length;

  }


  const cartItems =
    document.getElementById("cartItems");

  const cartTotal =
    document.getElementById("cartTotal");


  if (!cartItems || !cartTotal) {
    return;
  }


  cartItems.innerHTML = "";


  let total = 0;


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <p>
        Your cart is empty.
      </p>
    `;

  }


  cart.forEach((item, index) => {

    total += Number(item.price);


    const div =
      document.createElement("div");

    div.className = "cart-item";


    div.innerHTML = `

      <div>

        <strong>
          ${escapeHTML(item.name)}
        </strong>

        <br>

        ${formatPrice(item.price)}

      </div>

      <button
        class="remove-btn"
        onclick="removeCartItem(${index})"
      >
        Remove
      </button>

    `;


    cartItems.appendChild(div);

  });


  cartTotal.textContent =
    formatPrice(total);

}


function removeCartItem(index) {

  cart.splice(index, 1);

  updateCart();

}


const cartBtn =
  document.getElementById("cartBtn");


if (cartBtn) {

  cartBtn.addEventListener(
    "click",
    () => {

      const cartModal =
        document.getElementById("cartModal");

      if (cartModal) {
        cartModal.style.display = "block";
      }

    }
  );

}


function closeCart() {

  const cartModal =
    document.getElementById("cartModal");

  if (cartModal) {

    cartModal.style.display =
      "none";

  }

}


function checkout() {

  if (cart.length === 0) {

    alert("Your cart is empty.");

    return;

  }


  alert(
    "Payment will be connected later."
  );

}


/* =========================
   BUSINESSES
========================= */

function renderBusinesses() {

  const container =
    document.getElementById(
      "businessContainer"
    );

  if (!container) return;

  container.innerHTML = "";


  businesses.forEach(business => {

    const card =
      document.createElement("div");

    card.className = "business-card";


    card.innerHTML = `

      <img
        src="${business.image}"
        alt="${escapeHTML(business.name)}"
      >

      <div class="business-content">

        <h3>
          ${escapeHTML(business.name)}
        </h3>

        <span class="business-category">
          ${escapeHTML(business.category)}
        </span>

        <div class="business-location">
          📍 ${escapeHTML(business.location)}
        </div>

        <p>
          ${escapeHTML(business.description)}
        </p>

        <a
          href="tel:${business.phone}"
          class="contact-btn"
        >
          Contact Business
        </a>

      </div>

    `;


    container.appendChild(card);

  });

}


/* =========================
   BUSINESS MODAL
========================= */

function openBusinessForm() {

  const modal =
    document.getElementById(
      "businessModal"
    );

  if (modal) {

    modal.style.display = "block";

  }

}


function closeBusinessForm() {

  const modal =
    document.getElementById(
      "businessModal"
    );

  if (modal) {

    modal.style.display = "none";

  }

}


const businessForm =
  document.getElementById(
    "businessForm"
  );


if (businessForm) {

  businessForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const business = {

        id: Date.now(),

        name:
          document.getElementById(
            "businessName"
          ).value.trim(),

        category:
          document.getElementById(
            "businessCategory"
          ).value,

        location:
          document.getElementById(
            "businessLocation"
          ).value.trim(),

        phone:
          document.getElementById(
            "businessPhone"
          ).value.trim(),

        image:
          document.getElementById(
            "businessImage"
          ).value.trim(),

        description:
          document.getElementById(
            "businessDescription"
          ).value.trim()

      };


      businesses.unshift(business);

      renderBusinesses();

      businessForm.reset();

      closeBusinessForm();

      alert(
        "Business published successfully!"
      );

    }
  );

}


/* =========================
   LOGIN / SIGNUP UI
========================= */

const authModal =
  document.getElementById(
    "authModal"
  );

const authContent =
  document.getElementById(
    "authContent"
  );


const signupBtn =
  document.getElementById(
    "signupBtn"
  );


const loginBtn =
  document.getElementById(
    "loginBtn"
  );


if (signupBtn) {

  signupBtn.addEventListener(
    "click",
    showSignup
  );

}


if (loginBtn) {

  loginBtn.addEventListener(
    "click",
    showLogin
  );

}


function showSignup() {

  if (!authModal || !authContent) {
    return;
  }


  authModal.style.display =
    "block";


  authContent.innerHTML = `

    <span class="small-title">
      HEISJULY ACCOUNT
    </span>

    <h2 class="auth-title">
      Create Account
    </h2>

    <form
      onsubmit="signup(event)"
    >

      <label>
        Full Name
      </label>

      <input
        type="text"
        id="signupName"
        required
        placeholder="Your name"
      >

      <label>
        Email
      </label>

      <input
        type="email"
        id="signupEmail"
        required
        placeholder="you@example.com"
      >

      <label>
        Password
      </label>

      <input
        type="password"
        id="signupPassword"
        required
        minlength="6"
        placeholder="Create password"
      >

      <button
        class="primary-btn"
        type="submit"
      >
        Create Account
      </button>

    </form>

    <div class="auth-switch">

      Already have an account?

      <button onclick="showLogin()">
        Login
      </button>

    </div>

  `;

}


function showLogin() {

  if (!authModal || !authContent) {
    return;
  }


  authModal.style.display =
    "block";


  authContent.innerHTML = `

    <span class="small-title">
      HEISJULY ACCOUNT
    </span>

    <h2 class="auth-title">
      Welcome Back
    </h2>

    <form
      onsubmit="login(event)"
    >

      <label>
        Email
      </label>

      <input
        type="email"
        id="loginEmail"
        required
        placeholder="you@example.com"
      >

      <label>
        Password
      </label>

      <input
        type="password"
        id="loginPassword"
        required
        placeholder="Your password"
      >

      <button
        class="primary-btn"
        type="submit"
      >
        Login
      </button>

    </form>

    <div class="auth-switch">

      Don't have an account?

      <button onclick="showSignup()">
        Sign Up
      </button>

    </div>

  `;

}


function closeAuth() {

  if (authModal) {

    authModal.style.display =
      "none";

  }

}


/* =========================
   SIGNUP
========================= */

async function signup(event) {

  event.preventDefault();


  const name =
    document.getElementById(
      "signupName"
    ).value.trim();


  const email =
    document.getElementById(
      "signupEmail"
    ).value.trim();


  const password =
    document.getElementById(
      "signupPassword"
    ).value;


  try {

    const response =
      await fetch(
        `${API_URL}/api/auth/signup`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.message ||
        "Signup failed."
      );

      return;

    }


    localStorage.setItem(
      "heisjulyToken",
      data.token
    );


    localStorage.setItem(
      "heisjulyUser",
      JSON.stringify(data.user)
    );


    alert(
      "Account created successfully!"
    );


    closeAuth();

  } catch (error) {

    console.error(error);

    alert(
      "Could not connect to the server."
    );

  }

}


/* =========================
   LOGIN
========================= */

async function login(event) {

  event.preventDefault();


  const email =
    document.getElementById(
      "loginEmail"
    ).value.trim();


  const password =
    document.getElementById(
      "loginPassword"
    ).value;


  try {

    const response =
      await fetch(
        `${API_URL}/api/auth/login`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.message ||
        "Login failed."
      );

      return;

    }


    localStorage.setItem(
      "heisjulyToken",
      data.token
    );


    localStorage.setItem(
      "heisjulyUser",
      JSON.stringify(data.user)
    );


    alert(
      "Login successful!"
    );


    closeAuth();

  } catch (error) {

    console.error(error);

    alert(
      "Could not connect to the server."
    );

  }

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================
   CLOSE MODALS
========================= */

window.addEventListener(
  "click",
  event => {

    const cartModal =
      document.getElementById(
        "cartModal"
      );

    const businessModal =
      document.getElementById(
        "businessModal"
      );

    const authModal =
      document.getElementById(
        "authModal"
      );


    if (
      event.target === cartModal
    ) {
      closeCart();
    }


    if (
      event.target === businessModal
    ) {
      closeBusinessForm();
    }


    if (
      event.target === authModal
    ) {
      closeAuth();
    }

  }
);


/* =========================
   START APP
========================= */

loadProducts();

renderBusinesses();

updateCart();
