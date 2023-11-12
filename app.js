// new Vue instance binding to the main div element
let vueapp = new Vue({
    el: '#main-app',
    data: {
        showProductsPage: true,
        titleSort: "Default",
        locationSort: "Location",
        availabilitySort: "Spaces",
        priceSort: "Price",
        subjects: [     // array containing all different lessons and their properties
            {
                product_id: 1,
                name: "Maths Lesson",
                location: "Mill Hill",
                price: 200,
                img: "/mathslesson.png",
                text: "Maths icon",
                invQuantity: 5
            },
            {
                product_id: 2,
                name: "English Lesson",
                location: "Hendon",
                price: 120,
                img: "/englishlesson.png",
                text: "English icon",
                invQuantity: 5
            },
            {
                product_id: 3,
                name: "Chemistry Lesson",
                location: "Mill Hill",
                price: 150,
                img: "/chemistry.png",
                text: "Chemistry icon",
                invQuantity: 5
            },
            {
                product_id: 4,
                name: "Biology Lesson",
                location: "Colindale",
                price: 120,
                img: "/biology.png",
                text: "Biology icon",
                invQuantity: 5
            },
            {
                product_id: 5,
                name: "Physics Lesson",
                location: "Colindale",
                price: 150,
                img: "/physics.png",
                text: "Physics icon",
                invQuantity: 5
            },
            {
                product_id: 6,
                name: "Geography Lesson",
                location: "Colindale",
                price: 90,
                img: "/geography.png",
                text: "Geography icon",
                invQuantity: 5
            },
            {
                product_id: 7,
                name: "History Lesson",
                location: "Cricklewood",
                price: 99,
                img: "/history.png",
                text: "History icon",
                invQuantity: 5
            },
            {
                product_id: 8,
                name: "German Lesson",
                location: "Watford",
                price: 125,
                img: "/german.png",
                text: "German icon",
                invQuantity: 5
            },
            {
                product_id: 9,
                name: "Japanese Lesson",
                location: "Borehamwood",
                price: 165,
                img: "/japanese.png",
                text: "Japanese icon",
                invQuantity: 5
            },
            {
                product_id: 10,
                name: "Programming Lesson",
                location: "London",
                price: 150,
                img: "/programming.png",
                text: "Programming icon",
                invQuantity: 5
            }
        ],

        // cart array initiated currently empty
        cart: []
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
            if(this.cart.length === 0) {
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
        }

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

// function to place order

function submitOrder() {
    alert("Order has been placed. Thank you !")
}
