const businessForm =
  document.getElementById("businessForm");

const businessesContainer =
  document.getElementById("businessesContainer");

const businessCount =
  document.getElementById("businessCount");


let businesses = [

  {
    id: 1,
    name: "Matthew Fashion",
    category: "Fashion",
    location: "Lagos, Nigeria",
    phone: "+2348012345678",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
    description:
      "Fashion designer creating modern clothes and custom outfits."
  },

  {
    id: 2,
    name: "Heisjuly Tech",
    category: "Technology",
    location: "Warri, Nigeria",
    phone: "+2348098765432",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    description:
      "Website development, software and technology services."
  }

];


/* DISPLAY BUSINESSES */

function displayBusinesses() {

  businessesContainer.innerHTML = "";

  businessCount.textContent =
    `${businesses.length} active businesses`;


  businesses.forEach(business => {

    const card =
      document.createElement("div");

    card.className = "business-card";


    card.innerHTML = `

      <img
        src="${business.image}"
        alt="${business.name}"
      >

      <div class="business-content">

        <h3>
          ${business.name}
        </h3>

        <span class="business-category">
          ${business.category}
        </span>

        <div class="business-location">
          📍 ${business.location}
        </div>

        <p class="business-description">
          ${business.description}
        </p>

        <a
          class="contact-business"
          href="tel:${business.phone}"
        >
          Contact Business
        </a>

      </div>

    `;


    businessesContainer.appendChild(card);

  });

}


/* POST BUSINESS */

businessForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const business = {

      id: Date.now(),

      name:
        document.getElementById(
          "businessName"
        ).value,

      category:
        document.getElementById(
          "businessCategory"
        ).value,

      location:
        document.getElementById(
          "businessLocation"
        ).value,

      phone:
        document.getElementById(
          "businessPhone"
        ).value,

      image:
        document.getElementById(
          "businessImage"
        ).value,

      description:
        document.getElementById(
          "businessDescription"
        ).value

    };


    businesses.unshift(business);

    displayBusinesses();

    businessForm.reset();

    alert(
      "Your business has been published!"
    );

    document
      .getElementById("businessSection")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


/* START */

displayBusinesses();
