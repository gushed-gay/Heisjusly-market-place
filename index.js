const API_URL = "https://market-place-backend-w4c1.onrender.com";

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
    email: "",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
    description: "Modern fashion and custom clothing."
  }
];

let cart = [];


/* =========================
   NAVIGATION
========================= */

const navLinks =
  document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

  link.addEventListener("click", () => {

    showSection(link.dataset.section);

  });

});


function showSection(sectionId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active-page");

    });


  const section =
    document.getElementById(sectionId);


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

  return "₦" +
    Number(price).toLocaleString();

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  try {

    const response =
      await fetch(`${API_URL}/products`);


    if (!response.ok) {

      throw new Error(
        "Could not load products"
      );

    }


    products =
      await response.json();


    renderProducts();

    renderFeatured();


  } catch (error) {

    console.error(
      "Load products error:",
      error
    );


    const productsContainer =
      document.getElementById(
        "productsContainer"
      );


    if (productsContainer) {

      productsContainer.innerHTML = `

        <p class="error-message">

          Could not connect to
          Heisjuly Marketplace server.

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
    document.getElementById(
      "productsContainer"
    );


  if (!container) return;


  const searchInput =
    document.getElementById(
      "searchInput"
    );


  const search =
    searchInput
      ? searchInput.value
          .toLowerCase()
          .trim()
      : "";


  const categoryFilter =
    document.getElementById(
      "categoryFilter"
    );


  const category =
    categoryFilter
      ? categoryFilter.value
      : "all";


  const filteredProducts =
    products.filter(product => {

      const productName =
        String(
          product.name || ""
        ).toLowerCase();


      const productDescription =
        String(
          product.description || ""
        ).toLowerCase();


      const matchesSearch =
        productName.includes(search) ||
        productDescription.includes(search);


      const matchesCategory =
        category === "all" ||
        product.category === category;


      return (
        matchesSearch &&
        matchesCategory
      );

    });


  container.innerHTML = "";


  if (filteredProducts.length === 0) {

    container.innerHTML = `

      <div class="empty-message">

        <h3>No products found</h3>

        <p>
          Try another search or category.
        </p>

      </div>

    `;

    return;

  }


  filteredProducts.forEach(product => {

    const card =
      document.createElement("div");


    card.className =
      "product-card";


    card.innerHTML = `

      <img
        src="${
          product.image ||
          "https://via.placeholder.com/500"
        }"
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


        <p>
          <strong>Seller:</strong>
          ${escapeHTML(product.seller || "")}
        </p>


        ${
          product.seller_phone
            ? `
              <a
                href="tel:${escapeHTML(product.seller_phone)}"
                class="contact-btn"
              >
                📞 Call Seller
              </a>
            `
            : ""
        }


        ${
          product.seller_email
            ? `
              <a
                href="mailto:${escapeHTML(product.seller_email)}"
                class="contact-btn"
              >
                ✉️ Email Seller
              </a>
            `
            : ""
        }


        <button
          class="buy-btn"
          onclick="addToCart('${
            product.id
          }')"
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
    document.getElementById(
      "featuredProducts"
    );


  if (!container) return;


  container.innerHTML = "";


  products
    .slice(0, 4)
    .forEach(product => {

      const card =
        document.createElement("div");


      card.className =
        "product-card";


      card.innerHTML = `

        <img
          src="${
            product.image ||
            "https://via.placeholder.com/500"
          }"
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
            onclick="addToCart('${product.id}')"
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
  document.getElementById(
    "searchInput"
  );


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
  document.getElementById(
    "categoryFilter"
  );


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

    categoryFilter.value =
      category;

  }


  renderProducts();

}


/* =========================
   IMAGE TO DATA URL
========================= */

function imageToDataURL(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();


      reader.onload = () => {

        resolve(
          reader.result
        );

      };


      reader.onerror = () => {

        reject(
          new Error(
            "Could not read image"
          )
        );

      };


      reader.readAsDataURL(file);

    }
  );

}


/* =========================
   POST PRODUCT
========================= */

const sellForm =
  document.getElementById(
    "sellForm"
  );


if (sellForm) {

  sellForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const imageInput =
        document.getElementById(
          "productImage"
        );


      const imageFile =
        imageInput &&
        imageInput.files
          ? imageInput.files[0]
          : null;


      if (!imageFile) {

        alert(
          "Please select a product image."
        );

        return;

      }


      if (
        !imageFile.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "Please select a valid image."
        );

        return;

      }


      if (
        imageFile.size >
        2 * 1024 * 1024
      ) {

        alert(
          "Please choose an image smaller than 2MB."
        );

        return;

      }


      try {

        const image =
          await imageToDataURL(
            imageFile
          );


        const product = {

          name:
            document
              .getElementById(
                "productName"
              )
              .value
              .trim(),


          price:
            Number(
              document
                .getElementById(
                  "productPrice"
                )
                .value
            ),


          category:
            document
              .getElementById(
                "productCategory"
              )
              .value,


          image: image,


          description:
            document
              .getElementById(
                "productDescription"
              )
              .value
              .trim(),


          seller:
            document
              .getElementById(
                "sellerName"
              )
              .value
              .trim(),


          seller_phone:
            document
              .getElementById(
                "sellerPhone"
              )
              .value
              .trim(),


          seller_email:
            document
              .getElementById(
                "sellerEmail"
              )
              .value
              .trim()

        };


        if (
          !product.name ||
          !product.price ||
          !product.category ||
          !product.description ||
          !product.seller ||
          !product.seller_phone ||
          !product.seller_email
        ) {

          alert(
            "Please fill in all required fields."
          );

          return;

        }


        const response =
          await fetch(
            `${API_URL}/products`,
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  product
                )

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          console.error(data);

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


        showSection(
          "products"
        );


      } catch (error) {

        console.error(
          "Post product error:",
          error
        );


        alert(
          "Could not connect to the server."
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
        String(item.id) ===
        String(productId)
    );


  if (!product) {

    alert(
      "Product not found."
    );

    return;

  }


  cart.push(product);


  updateCart();


  alert(
    `${product.name} added to cart.`
  );

}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

  const cartCount =
    document.getElementById(
      "cartCount"
    );


  if (cartCount) {

    cartCount.textContent =
      cart.length;

  }


  const cartItems =
    document.getElementById(
      "cartItems"
    );


  const cartTotal =
    document.getElementById(
      "cartTotal"
    );


  if (
    !cartItems ||
    !cartTotal
  ) {

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


  cart.forEach(
    (item, index) => {

      total += Number(
        item.price
      );


      const div =
        document.createElement(
          "div"
        );


      div.className =
        "cart-item";


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

    }
  );


  cartTotal.textContent =
    formatPrice(total);

}


/* =========================
   REMOVE CART ITEM
========================= */

function removeCartItem(index) {

  cart.splice(index, 1);

  updateCart();

}


/* =========================
   CART BUTTON
========================= */

const cartBtn =
  document.getElementById(
    "cartBtn"
  );


if (cartBtn) {

  cartBtn.addEventListener(
    "click",
    () => {

      const cartModal =
        document.getElementById(
          "cartModal"
        );


      if (cartModal) {

        cartModal.style.display =
          "block";

      }

    }
  );

}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

  const cartModal =
    document.getElementById(
      "cartModal"
    );


  if (cartModal) {

    cartModal.style.display =
      "none";

  }

}


/* =========================
   CHECKOUT
========================= */

function checkout() {

  if (cart.length === 0) {

    alert(
      "Your cart is empty."
    );

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


  businesses.forEach(
    business => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "business-card";


      card.innerHTML = `

        <img
          src="${
            business.image ||
            "https://via.placeholder.com/500"
          }"
          alt="${escapeHTML(
            business.name
          )}"
        >


        <div class="business-content">

          <h3>
            ${escapeHTML(
              business.name
            )}
          </h3>


          <span class="business-category">
            ${escapeHTML(
              business.category
            )}
          </span>


          <div class="business-location">
            📍
            ${escapeHTML(
              business.location
            )}
          </div>


          <p>
            ${escapeHTML(
              business.description
            )}
          </p>


          ${
            business.phone
              ? `
                <a
                  href="tel:${escapeHTML(
                    business.phone
                  )}"
                  class="contact-btn"
                >
                  📞 Call Business
                </a>
              `
              : ""
          }


          ${
            business.email
              ? `
                <a
                  href="mailto:${escapeHTML(
                    business.email
                  )}"
                  class="contact-btn"
                >
                  ✉️ Email Business
                </a>
              `
              : ""
          }

        </div>

      `;


      container.appendChild(card);

    }
  );

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

    modal.style.display =
      "block";

  }

}


function closeBusinessForm() {

  const modal =
    document.getElementById(
      "businessModal"
    );


  if (modal) {

    modal.style.display =
      "none";

  }

}


/* =========================
   BUSINESS FORM
========================= */

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
          document
            .getElementById(
              "businessName"
            )
            .value
            .trim(),


        category:
          document
            .getElementById(
              "businessCategory"
            )
            .value,


        location:
          document
            .getElementById(
              "businessLocation"
            )
            .value
            .trim(),


        phone:
          document
            .getElementById(
              "businessPhone"
            )
            .value
            .trim(),


        email:
          document
            .getElementById(
              "businessEmail"
            )
            .value
            .trim(),


        image:
          "",


        description:
          document
            .getElementById(
              "businessDescription"
            )
            .value
            .trim()

      };


      businesses.unshift(
        business
      );


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
   ESCAPE HTML
========================= */

function escapeHTML(value) {

  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

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


    if (
      event.target ===
      cartModal
    ) {

      closeCart();

    }


    if (
      event.target ===
      businessModal
    ) {

      closeBusinessForm();

    }

  }
);


/* =========================
   START APP
========================= */

loadProducts();

renderBusinesses();

updateCart();
