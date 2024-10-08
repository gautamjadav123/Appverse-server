const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
const API_KEY = process.env.API_KEY || 'bmNJenRjYzRIUTY3QldDdGFlaVh6RWVKbXpvNHRYZ0FVV1JiSERmaQ==';
const API_BASE_URL = 'https://api.countrystatecity.in/v1';

// Route to get all countries
router.get('/countries', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/countries`, {
      headers: { 'X-CSCAPI-KEY': API_KEY }
    });
    res.json(response.data); // Return the country data to the frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries', error: error.message });
  }
});

// Route to get states by country ISO2 code
router.get('/states/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/countries/${countryCode}/states`, {
      headers: { 'X-CSCAPI-KEY': API_KEY }
    });
    res.json(response.data); // Return the states data to the frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching states', error: error.message });
  }
});

// Route to get cities by state ISO2 code and country ISO2 code
router.get('/cities/:countryCode/:stateCode', async (req, res) => {
  const { countryCode, stateCode } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`, {
      headers: { 'X-CSCAPI-KEY': API_KEY }
    });
    res.json(response.data); // Return the cities data to the frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error: error.message });
  }
});

module.exports = router;
