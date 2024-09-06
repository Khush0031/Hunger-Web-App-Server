const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.Port ||  8080;

const SWIGGY_API_URL = "https://www.swiggy.com/dapi/restaurants/list/v5";
const SWIGGY_Menu_API_URL = "https://www.swiggy.com/dapi/menu/pl";
// const SWIGGY_API_UPDATE_URL = 'https://www.swiggy.com/dapi/restaurants/list/update';

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

//Server Welcome Route
app.get("/", async (req, res) => {
  const Heading = `<h1>Welcome To Hunger Food RestApi</h1>`;
  res.send(Heading);
});

// Proxy route to handle GET RESTAURANTs API requests
app.get("/api/restaurants", async (req, res) => {
  try {
    const { lat, lng, is_seo_homepage_enabled, page_type } = req.query;
    // Log the incoming request
    console.log("Incoming request for restaurant:", req.query);

    const apiResponse = await axios.get(SWIGGY_API_URL, {
      params: {
        lat,
        lng,
        "is-seo-homepage-enabled": is_seo_homepage_enabled,
        page_type: page_type,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        Accept: "application/json",
        // Include any other headers required by the Swiggy API here
      },
    });

    // Log the API response
    // console.log('API response:', apiResponse.data);

    res.status(apiResponse.status).json(apiResponse.data);
  } catch (error) {
    console.error("Error fetching data from Swiggy API:", error.message);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send("Error fetching data from Swiggy API");
    }
  }
});

//Proxy route to handle GET RESTAURANTs MENU API requests
app.get('/api/menu', async (req, res) => {
  try {
      // Extract query parameters from the incoming request
      const { lat, lng, 'restaurantId': restaurantId, 'page-type': pageType, 'complete-menu': completeMenu } = req.query;

      // Make a request to the Swiggy Menu API
      const apiResponse = await axios.get(SWIGGY_Menu_API_URL, {
          params: {
              'page-type': pageType || 'REGULAR_MENU',
              'complete-menu': completeMenu || true,
              lat,
              lng,
              restaurantId,
              catalog_qa: 'undefined',
              submitAction: 'ENTER'
          },
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
              'Accept': 'application/json'
          }
      });

      // Log the request and response for debugging
      console.log('Request to Swiggy Menu API:', req.query);
      console.log('Response from Swiggy Menu API:', apiResponse.data);

      // Send the API response back to the client
      res.status(apiResponse.status).json(apiResponse.data);
  } catch (error) {
      console.error('Error fetching data from Swiggy API:', error.message);
      if (error.response) {
          res.status(error.response.status).send(error.response.data);
      } else {
          res.status(500).send('Error fetching data from Swiggy API');
      }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
