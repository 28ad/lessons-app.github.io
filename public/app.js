// new Vue instance binding to the main div element
let vueapp = new Vue({
    el: '#main-app',
    data: {
        showProductsPage: true,
        titleSort: "Default",
        locationSort: "Location",
        availabilitySort: "Spaces",
        priceSort: "Price",
        searchTerm: '', // Add a property to store the search term
        searchResults: [], // Add a property to store the search results
        subjects: [], // array containing all different lessons and their properties

        // cart array initiated currently empty
        cart: []
    },
    // fetch to GET request for products
    mounted: function () {
        // Fetch data as soon as the homepage loads
        fetch('https://webstore-restapi.onrender.com/collections/products')
            .then(response => response.json())
            .then(data => {
                console.log('Data from MongoDB:', data);
                // Use the data in your front-end application
                this.subjects = data;
            })
            .catch(error => console.error('Error fetching data:', error));
    },
    methods: {

        // function which adds items to the cart array
        addToCart: function (subject, index) {

            // search if item is already present in the cart array
            let lessonIndex = this.cart.findIndex((ct) => ct.product_id === subject.product_id);

            // if not
            if (lessonIndex == -1) {

                // add subject properties to cart
                this.cart.push({
                    ...subject,
                    quantity: 1,
                });

            } else {

                // add to cart quantity 
                this.cart[lessonIndex].quantity++;
            }

            // subtract from the available inventory 
            this.subjects[index].invQuantity--;

            // enable cart button after item has been added
            let checkoutBtn = document.getElementById("checkoutBtn");
            if (checkoutBtn) {
                checkoutBtn.removeAttribute("disabled");
            }

        },


        // function to swap between products page and checkout page
        showCheckoutPage: function () {

            if (this.cart.length === 0) {
                // Cart is empty, disable the checkout button
                let checkoutBtn = document.getElementById("checkoutBtn");
                if (checkoutBtn) {
                    checkoutBtn.setAttribute("disabled", "disabled");
                }
            } else {
                // Cart has items, toggle between products and checkout page
                this.showProductsPage = !this.showProductsPage;
                console.log('Cart:', this.cart);
            }

        },

        // function to remove selected index from cart array
        removeCartItem: function (item) {

            // if there is only one item in cart remove from cart
            if (item.quantity === 1) {
                this.cart.splice(this.cart.indexOf(item), 1)
            }

            // if there is multiple instances of the same item decrease quantity by 1
            else {

                item.quantity--;
            }

            // find clicked item in the subjects array and increase subject inventory by 1

            const cartIndex = this.subjects.findIndex((subject) => subject.product_id === item.product_id);

            if (cartIndex !== -1) {

                this.subjects[cartIndex].invQuantity++;
            }

            // redirect user back to products page
            if (this.cart.length === 0) {
                this.showProductsPage = true;
            }
        },

        // sort subjects by title

        sortByTitle: function () {


            // sort in ascending order alphabetically
            if (this.titleSort === "Ascending") {

                this.subjects.sort((first, second) => first.name.localeCompare(second.name));

            } else if (this.titleSort === "Descending") { // sort in descending order

                this.subjects.sort((first, second) => second.name.localeCompare(first.name));

            }
        },

        // sort subjects by location

        sortByLocation: function () {


            // sort in ascending order alphabetically
            if (this.locationSort === "Ascending") {

                this.subjects.sort((first, second) => first.location.localeCompare(second.location));

            } else if (this.locationSort === "Descending") { // sort in descending order

                this.subjects.sort((first, second) => second.location.localeCompare(first.location));

            }
        },

        // sort subjects by availability

        sortByAvailability: function () {


            // sort in ascending order
            if (this.availabilitySort === "Ascending") {

                this.subjects.sort((first, second) => first.invQuantity - second.invQuantity);

            } else if (this.availabilitySort === "Descending") { // sort in descending order

                this.subjects.sort((first, second) => second.invQuantity - first.invQuantity);

            }
        },

        // sort subjects by price

        sortByPrice: function () {


            // sort in ascending order
            if (this.priceSort === "Ascending") {

                this.subjects.sort((first, second) => first.price - second.price);

            } else if (this.priceSort === "Descending") { // sort in descending order

                this.subjects.sort((first, second) => second.price - first.price);

            }
        },
        // function to place order
        submitOrderForm: function () {
          
            const fullName = document.getElementById("cName").value;
            const phoneNumber = document.getElementById("phonenumber").value;
          
            // Ensure that fullName and phoneNumber are not empty
            if (fullName.trim() === "" || phoneNumber.trim() === "") {
              alert("Please fill in all the fields in the checkout form.");
              return;
            }
          
            const orderDetails = {
              customerName: fullName,
              phoneNumber: phoneNumber,
              lessons: this.cart.reduce((result, item) => {
                result[item._id] = {
                  name: item.name,
                  quantity: item.quantity,
                };
                return result;
              }, {}),
            };
          
            // Send the order details to the server for saving
            fetch('https://webstore-restapi.onrender.com/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ orderDetails }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Order submitted successfully:', data);
          
                // If the order is submitted successfully, update lesson quantities
                this.cart.forEach(item => {
                  this.updateLessonQuantity(item._id, item.quantity);
                });
          
              })
              .catch(error => console.error('Error submitting order:', error));
          },
          
        updateLessonQuantity: function (id, quantity) {
            // Send a PUT request to update the lesson quantity
            fetch(`https://webstore-restapi.onrender.com/products/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ quantity }),
            })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  console.log(`Lesson quantity updated successfully for lesson ${id}`);
                } else {
                  console.error(`Error updating lesson quantity for lesson ${id}:`, data.error);
                }
              })
        },
        searchLessons: function () {
            // Use the searchTerm from the data property
            const searchTerm = this.searchTerm.trim();
        
            if (searchTerm === '') {
              // If the search term is empty, you might want to handle it accordingly
              console.log('Search term is empty.');
              return;
            }
        
            // Perform the search using the updated searchTerm
            fetch(`https://webstore-restapi.onrender.com/search/${searchTerm}`)
              .then(response => response.json())
              .then(data => {
                console.log('Search results:', data);
                // Update the searchResults property to reflect the search results
                this.searchResults = data;
              })
              .catch(error => console.error('Error searching lessons:', error));
          },
        },

    computed: {

        // updates cart count real time - shows empty string if cart is empty
        cartCounter: function () {

            let cartCount = 0;

            for (const item of this.cart) {
                cartCount += item.quantity;
            }

            return cartCount || "";
        },

        // Checks if there is inventory available
        checkAvailability: function () {
            return function (subject) {
                return subject.invQuantity > 0;
            }
        }
    }
});


// // function to validate user inputs

function validateForm() {

    let letters = /^[A-Za-z]+$/;
    let numbers = /^[-+]?[0-9]+$/;

    let nameInput = document.getElementById("cName").value;
    let phoneInput = document.getElementById("phonenumber").value;

    let nameInputStyle = document.getElementById("cName");
    let phoneInputStyle = document.getElementById("phonenumber");

    let submitFormBtn = document.getElementById("submitFormBtn");

    if (nameInput.trim() === "" || phoneInput.trim() === "" || !letters.test(nameInput) || !numbers.test(phoneInput)) {
        // Disable the submit button if either field is empty or doesn't meet the criteria
        submitFormBtn.setAttribute('disabled', 'disabled');
        // Set class for styling (you might want to adjust this based on your styling needs)
        nameInputStyle.setAttribute("class", "invalid-input");
        phoneInputStyle.setAttribute("class", "invalid-input");
    } else {
        // Enable the submit button if both fields meet the criteria
        submitFormBtn.removeAttribute("disabled");
        // Set class for styling (you might want to adjust this based on your styling needs)
        nameInputStyle.setAttribute("class", "valid-input");
        phoneInputStyle.setAttribute("class", "valid-input");
    }

}


