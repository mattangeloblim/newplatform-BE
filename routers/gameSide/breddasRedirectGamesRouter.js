const express = require("express")
const router = express.Router()
const axios = require("axios")

router.post('/breddas/game-url', async (req, res) => {
    try {
      const { game, user_id, api_key, token } = req.query;
  
      // Construct the URL
      const apiUrl = `https://stagingapi2.888bingo.ph/api/game-url?game=${game}&user_id=${user_id}&api_key=${api_key}&token=${token}`;
      const response = await axios.post(apiUrl, req.body);
  
      // Send the response from the game API to the client
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router