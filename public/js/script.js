document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("phone");

    if (phoneInput) {
        // Set default value when page loads
        phoneInput.value = "+60 ";

        phoneInput.addEventListener("focus", function () {
            if (!phoneInput.value.startsWith("+60")) {
                phoneInput.value = "+60 ";
            }
        });

        phoneInput.addEventListener("input", function () {
            // Prevent deleting "+60 "
            if (!phoneInput.value.startsWith("+60")) {
                phoneInput.value = "+60 " + phoneInput.value.replace("+60 ", "");
            }
        });

        phoneInput.addEventListener("keydown", function (event) {
            // Prevent backspace/delete from removing "+60 "
            if ((event.key === "Backspace" || event.key === "Delete") && phoneInput.value.length <= 4) {
                event.preventDefault();
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include' // Needed if using cookies
            })
            .then(() => {
                window.location.href = "/"; // Redirect to home after logout
            })
            .catch(error => console.error('Logout Error:', error));
        });
    }
});

async function fetchUpdatedProfile() {
    try {
        const response = await fetch("/profile", {
            method: "GET",
            credentials: "include", // Sends cookies automatically
            cache: "no-store" // Forces fresh data
        });

        if (response.ok) {
            const user = await response.json();

            document.getElementById("email").innerText = user.email;
            document.getElementById("name").innerText = user.name;
            document.getElementById("phone").innerText = user.phone;
            document.getElementById("area").innerText = user.area;
            document.getElementById("house").innerText = user.house;
            document.getElementById("postcode").innerText = user.postcode;
            document.getElementById("address").innerText = user.address;
            document.getElementById("city").innerText = user.city;
            document.getElementById("state").innerText = user.state;
            document.getElementById("houseTypeText").innerText = user.houseType;
            document.getElementById("houseTypeDropdown").value = user.houseType;
            document.getElementById("propertySizeText").innerText = user.propertySize;
            document.getElementById("propertySizeDropdown").value = user.propertySize;
        } else {
            console.log("Failed to fetch updated profile:", await response.json());
        }
    } catch (error) {
        console.error("Error fetching updated profile:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchUpdatedProfile(); // Load user profile on page load

    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");

    editBtn.addEventListener("click", () => {
        document.querySelectorAll(".profile-box span").forEach((span) => {
            if (span.id === "houseTypeText" || span.id === "propertySizeText") {
                // Hide span & show dropdown
                document.getElementById(span.id).style.display = "none";
                document.getElementById(span.id.replace("Text", "Dropdown")).style.display = "inline";
            } else {
                // Convert span to input for text fields
                const input = document.createElement("input");
                input.value = span.innerText.trim();

                if (span.id === "phone") {
                    input.addEventListener("input", function () {
                        if (!input.value.startsWith("+60")) {
                            input.value = "+60 " + input.value.replace("+60 ", "");
                        }
                    });

                    input.addEventListener("keydown", function (event) {
                        if ((event.key === "Backspace" || event.key === "Delete") && input.value.length <= 4) {
                            event.preventDefault();
                        }
                    });
                }

                input.setAttribute("data-original-id", span.id);
                span.replaceWith(input);
            }
        });

        editBtn.style.display = "none";
        saveBtn.style.display = "inline";
    });

    saveBtn.addEventListener("click", async () => {
        const fields = document.querySelectorAll(".profile-box input, .profile-box select");
        const updatedData = {};

        fields.forEach((field) => {
            let value = field.value.trim();

            if (field.getAttribute("data-original-id") === "phone" && !value.startsWith("+60")) {
                value = "+60 " + value;
            }

            updatedData[field.getAttribute("data-original-id") || field.id.replace("Dropdown", "")] = value;
        });

        const response = await fetch("/auth/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {

            fields.forEach((field) => {
                if (field.tagName === "INPUT") {
                    const span = document.createElement("span");
                    span.id = field.getAttribute("data-original-id");
                    span.innerText = updatedData[span.id];
                    field.replaceWith(span);
                } else if (field.tagName === "SELECT") {
                    // Hide dropdown & show updated span
                    document.getElementById(field.id).style.display = "none";
                    const spanId = field.id.replace("Dropdown", "Text");
                    const span = document.getElementById(spanId);
                    span.innerText = field.value;
                    span.style.display = "inline";
                }
            });

            saveBtn.style.display = "none";
            editBtn.style.display = "inline";
        } else {
            console.error("Error updating profile:", await response.json());
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper(".swiper", {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        }
    });

    // Add event listener for "Book Now" buttons
    document.querySelectorAll(".book-now").forEach(button => {
        button.addEventListener("click", (event) => {
            const serviceCard = event.target.closest(".service-card"); // Get the clicked service card
            const serviceName = serviceCard.querySelector("h3").innerText; // Get service name
            
            // Redirect to checkout page with selected service
            window.location.href = `/checkout?service=${encodeURIComponent(serviceName)}`;
        });
    });    
      
});

document.addEventListener("DOMContentLoaded", function() {
    // Elements for time slot selection
    const timeSlotSelect = document.getElementById("timeSlot");
    const sessionPriceEl = document.getElementById("sessionPrice");
    const transportationFee = parseFloat(document.getElementById("transportationFee").innerText.replace("RM ", ""));
    const totalPriceEl = document.getElementById("totalPrice");

    // Add-On Modal Elements
    const addonModal = document.getElementById("addonModal");
    const openAddonBtn = document.getElementById("openAddon");
    const closeModalBtn = document.querySelector(".close");
    const addAddonBtn = document.getElementById("addAddon"); // "ADD" button
    const totalAddonDisplay = document.getElementById("totalAddon"); // Total add-on price in modal
    const summaryAddonDisplay = document.createElement("p"); // Summary add-on price
    summaryAddonDisplay.innerHTML = `Add-On: <span id="summaryAddonPrice">RM 0.00</span>`;
    document.getElementById("summary").insertBefore(summaryAddonDisplay, document.getElementById("totalPrice").parentNode);

    let tempAddonPrice = 0; // Temporary price inside modal
    let confirmedAddonPrice = 0; // Final price after clicking "ADD"
    let tempSelectedAddons = new Set();
    let confirmedSelectedAddons = new Set();

    // Function to update the total price (only confirmed add-ons)
    function updateTotal() {
        const sessionPrice = parseFloat(sessionPriceEl.innerText.replace("RM ", "")) || 0;
        const totalPayment = sessionPrice + transportationFee + confirmedAddonPrice;
        totalPriceEl.innerText = "RM " + totalPayment.toFixed(2);
        document.getElementById("summaryAddonPrice").textContent = `RM ${confirmedAddonPrice.toFixed(2)}`;
    }

    // Update session price when selecting a time slot
    timeSlotSelect.addEventListener("change", function() {
        const selectedOption = timeSlotSelect.options[timeSlotSelect.selectedIndex];
        const sessionPrice = parseFloat(selectedOption.dataset.price.replace("RM ", "")) || 0;
        sessionPriceEl.innerText = "RM " + sessionPrice.toFixed(2);
        updateTotal();
    });

    // Open Add-On Popup
    openAddonBtn.addEventListener("click", () => {
        addonModal.style.display = "block";
        tempAddonPrice = confirmedAddonPrice; // Reset temp to confirmed price
        tempSelectedAddons = new Set(confirmedSelectedAddons);
        updateAddonDisplay(); // Update displayed price in modal
    });

    // Close Popup without saving
    closeModalBtn.addEventListener("click", () => {
        addonModal.style.display = "none";
    });

    // Prevent "ADD" button from submitting a form
    addAddonBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Stops form submission
        event.stopPropagation(); // Stops event from bubbling up
        confirmedAddonPrice = tempAddonPrice; // Save selected add-ons
        confirmedSelectedAddons = new Set(tempSelectedAddons);
        updateTotal(); // Update total price only after clicking "ADD"
        addonModal.style.display = "none"; // Closes popup
    });

    // Close Modal if Click Outside
    window.addEventListener("click", (event) => {
        if (event.target === addonModal) {
            addonModal.style.display = "none";
        }
    });

    // Function to update the displayed add-on price inside modal
    function updateAddonDisplay() {
        totalAddonDisplay.innerText = `RM ${tempAddonPrice.toFixed(2)}`;
    }

    // Fetch add-ons from database
    fetch("/addon")
        .then(response => response.json())
        .then(addons => {
            const addonList = document.getElementById("addonList");
            addons.forEach(addon => {
                const addonDiv = document.createElement("div");
                addonDiv.classList.add("addon-item");
                addonDiv.dataset.price = addon.pricing.length === 1 ? addon.pricing[0].price : 0;
                addonDiv.dataset.id = addon._id;

                const imageElement = `<img src="${addon.image}" alt="${addon.name}">`;

                if (addon.pricing.length > 1) {
                    addonDiv.innerHTML = `
                        ${imageElement}
                        <h3>${addon.name}</h3>
                        <p>${addon.description}</p>
                        <select class="addon-option">
                            <option value="default" data-price="0">Select Package</option>
                            ${addon.pricing.map(option => 
                                `<option value="${option.size}" data-price="${option.price}">${option.size} - RM${option.price}</option>`
                            ).join("")}
                        </select>
                        <hr>
                    `;
                } else {
                    addonDiv.innerHTML = `
                        ${imageElement}
                        <h3>${addon.name}</h3>
                        <p>${addon.description}</p>
                        <div class="addon-select">RM${addon.pricing[0].price}</div>
                        <hr>
                    `;
                }

                addonList.appendChild(addonDiv);

                // Click event for selecting/deselecting fixed-price add-ons
                if (addon.pricing.length === 1) {
                    addonDiv.addEventListener("click", () => {
                        if (tempSelectedAddons.has(addon._id)) {
                            tempSelectedAddons.delete(addon._id);
                            tempAddonPrice -= addon.pricing[0].price;
                            addonDiv.classList.remove("selected-addon");
                        } else {
                            tempSelectedAddons.add(addon._id);
                            tempAddonPrice += addon.pricing[0].price;
                            addonDiv.classList.add("selected-addon");
                        }
                        updateAddonDisplay();
                    });
                }

                // Change event for dropdown options
                const dropdown = addonDiv.querySelector(".addon-option");
                if (dropdown) {
                    dropdown.addEventListener("change", (event) => {
                        const selectedOption = event.target.options[event.target.selectedIndex];
                        const price = parseFloat(selectedOption.dataset.price);

                        if (event.target.value === "default") {
                            if (tempSelectedAddons.has(addon._id)) {
                                tempSelectedAddons.delete(addon._id);
                                tempAddonPrice -= parseFloat(event.target.dataset.selectedPrice || 0);
                            }
                            addonDiv.classList.remove("selected-addon");
                        } else {
                            if (tempSelectedAddons.has(addon._id)) {
                                tempAddonPrice -= parseFloat(event.target.dataset.selectedPrice || 0);
                            }
                            tempSelectedAddons.add(addon._id);
                            tempAddonPrice += price;
                            event.target.dataset.selectedPrice = price;
                            addonDiv.classList.add("selected-addon");
                        }
                        updateAddonDisplay();
                    });
                }
            });
        })
        .catch(error => console.error("Error fetching add-ons:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    const bookingDateInput = document.getElementById("serviceDate");
    if (bookingDateInput) {
        const today = new Date();
        const minDate = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        bookingDateInput.min = minDate;
    }

    const sessionPriceEl = document.getElementById("sessionPrice");
    const transportationFee = parseFloat(document.getElementById("transportationFee").innerText.replace("RM ", "")) || 0;
    const totalPriceEl = document.getElementById("totalPrice");
    const summaryAddonPriceEl = document.getElementById("summaryAddonPrice");

    function isPastDate(dateString) {
        if (!dateString) {
            return false;
        }

        const selectedDate = new Date(`${dateString}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return selectedDate < today;
    }

    function getTotalAmount() {
        const sessionPrice = parseFloat(sessionPriceEl.innerText.replace("RM ", "")) || 0;
        const addonPrice = parseFloat(summaryAddonPriceEl.innerText.replace("RM ", "")) || 0;
        return (sessionPrice + transportationFee + addonPrice).toFixed(2);
    }

    function validateBookingForm() {
        const date = document.querySelector('[name="date"]').value;
        const timeSlot = document.querySelector('[name="timeSlot"]').value;
        const address = document.querySelector('[name="address"]');

        return date && !isPastDate(date) && timeSlot && address && address.value.trim() !== "";
    }

    let isBookingSubmitted = false;

    function submitBooking(status) {
        if (isBookingSubmitted) return; // Prevent multiple submissions
        isBookingSubmitted = true;

        const bookingData = {
            serviceDate: document.querySelector('[name="date"]').value,
            timeSlot: document.querySelector('[name="timeSlot"]').value,
            service: document.querySelector('[name="package"]').value,
            price: getTotalAmount(),
            paymentStatus: status
        };

        fetch("/booking/submit-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(` Booking ${status}! ${status === "Success" ? "ID: " + data.booking.bookingID : "Please retry payment."}`);
            } else {
                alert(" Booking failed: " + data.message);
            }
        })
        .catch(err => console.error("Error submitting booking:", err))
        .finally(() => {
            isBookingSubmitted = false; // Reset flag for next booking attempt
        });
    }

    let paypalContainer = document.getElementById("paypal-button-container");
    if(paypalContainer) {
        function renderPayPalButton() {
            paypal.Buttons({
                onInit: function (data, actions) {
                    actions.disable(); // Disable PayPal button initially

                    // Enable button when all required fields are filled
                    document.getElementById("bookingForm").addEventListener("input", function () {
                        if (validateBookingForm()) {
                            actions.enable();
                        } else {
                            actions.disable();
                        }
                    });
                },

                    createOrder: function (data, actions) {
                    if (!validateBookingForm()) {
                        alert("⚠️ Please fill in all required fields before proceeding.");
                        return;
                    }
                    return actions.order.create({
                        purchase_units: [{
                            amount: { currency_code: "MYR", value: getTotalAmount() }
                        }]
                    });
                },
                onApprove: function (data, actions) {
                    return actions.order.capture().then(function (details) {
                        alert("🎉 Transaction completed by " + details.payer.name.given_name);
                        submitBooking("Success");
                    });
                },
                onError: function (err) {
                    console.error("Error in PayPal payment:", err); // Log to inspect
                    alert("Payment failed, please try again.");
                    submitBooking("Failed");
                }            
            }).render("#paypal-button-container");
        }
    }
    
    // Fetch PayPal Client ID securely from server
    fetch("/booking/paypal-config")
        .then(response => response.json())
        .then(data => {
            if (data.clientId) {
                loadPayPalScript(data.clientId);
            } else {
                console.error("PayPal Client ID not found.");
            }
        })
        .catch(error => console.error("Error fetching PayPal config:", error));

    function loadPayPalScript(clientId) {
        if (document.querySelector('script[src^="https://www.paypal.com/sdk/js"]')) {
            renderPayPalButton();
            return;
        }

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=MYR&locale=ms_MY`;
        script.onload = renderPayPalButton;
        document.body.appendChild(script);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".service-card").forEach(card => {
        const serviceName = card.getAttribute("data-service-name");

        // Fetch reviews for the service
        fetch(`/reviews/${serviceName}`)
            .then(res => res.json())
            .then(reviews => {
                const reviewsContainer = document.getElementById(`reviews-${serviceName.replace(/\s+/g, '-')}`);
                reviewsContainer.innerHTML = "";
                reviews.forEach(review => {
                    const reviewElement = document.createElement("div");
                    reviewElement.innerHTML = `
                        <p><strong>${review.name}</strong> (${review.rating}/5)</p>
                        <p>${review.comment}</p>
                        ${review.image ? `<img src="${review.image}" width="100">` : ""}
                        <hr>
                    `;
                    reviewsContainer.appendChild(reviewElement);
                });
            });

        // Submit review for the service
        const form = card.querySelector(".review-form");
        if (form) {
            form.addEventListener("submit", async function (e) {
                e.preventDefault();
                const formData = new FormData(form);

                const res = await fetch(`/reviews/${serviceName}`, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer <%= user.token %>` // JWT Token
                    }
                });

                const data = await res.json();
                alert(data.message);
                location.reload(); // Reload page to show updated reviews
            });
        }
    });
});

// Open Modal on Button Click
document.getElementById("reachUsBtn").onclick = function () {
    document.getElementById("contactPopup").style.display = "block";
  };
  
  // Close Modal on Close Button Click
  document.getElementsByClassName("contact-close-btn")[0].onclick = function () {
    document.getElementById("contactPopup").style.display = "none";
  };
  
  // Close Modal if Clicked Outside of the Modal Content
  window.onclick = function (event) {
    if (event.target == document.getElementById("contactPopup")) {
      document.getElementById("contactPopup").style.display = "none";
    }
  };
  
  // Google Map Embed Function
  function initMap() {
    var location = { lat: 3.1714, lng: 101.7376 };
    var map = new google.maps.Map(document.getElementById("googleMap"), {
      zoom: 8,
      center: location,
    });
    var marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  }
  
  // Load Google Maps Script
  function loadScript() {
    var script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCBJCcqezofBy-zKxXbhj3xiXKzNRXglos&callback=initMap";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
  
  // Load the Google Maps script when the page is loaded
  window.onload = loadScript;
