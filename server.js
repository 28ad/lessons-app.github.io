const express = require("express");
const app = express();
const path = require('path');


app.use(express.json());

// Static File Middleware
const imagesPath = path.resolve(__dirname, 'images');
app.use('/images', express.static(imagesPath));
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// GET route for retrieving all lessons
app.get('/lessons', (req, res) => {
  res.json();
});

// POST route for saving a new order to the "order" collection
app.post('/orders', (req, res) => {

  const newOrder = req.body;

  // Process the new order and save it to the "order" collection 


  // Update the number of available spaces in the "lesson" collection



});

// PUT route for updating the number of available spaces in the "lesson" collection
app.put('/lessons/:location', (req, res) => {
  
});

// Routes GET requests to / to the request handler
app.get("/", function(request, response) {
 response.send("Welcome to homepage!");
});

// Starts the server on port 3000
app.listen(3001);