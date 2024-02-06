const express = require("express")
const router = express.Router()
const axios = require("axios")
const GameProvider = require("../../models/GameProviderModel")
const ProviderGameList = require("../../models/ProviderGameListModel")
const GamePlatform = require("../../models/GamePlatformsModel")

router.post('/breddas/game-url', async (req, res) => {
  try {
    const { game, user_id, token } = req.query;

    const ProviderGame = await ProviderGameList.findOne({
      where: {
        game_code: game
      }
    });

    const game_name = ProviderGame.dataValues.game_name;
    const game_type = ProviderGame.dataValues.game_type;
    const provider_id = ProviderGame.dataValues.game_provider_id;

    const ProviderName = await GameProvider.findOne({
      where: {
        game_provider_id: provider_id
      },
      attributes: ['game_provider_name', 'provider_api_key']
    });

    const provider_name = ProviderName.dataValues.game_provider_name;
    const api_key = ProviderName.dataValues.provider_api_key;

    // Set cookies
    res.cookie('game_name', game_name);
    res.cookie('game_type', game_type);
    res.cookie('provider_name', provider_name);

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