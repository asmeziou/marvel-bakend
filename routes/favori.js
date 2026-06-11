const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/favoris/character/add", async (req, res) => {
  try {
    console.log(req.body);
    const { token, character_id } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    if (!user.favoritesCharacters.includes(character_id)) {
      user.favoritesCharacters.push(character_id);
      await user.save();
    }

    res.status(201).json(user.favoritesCharacters);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/favoris/comic/add", async (req, res) => {
  try {
    console.log(req.body);
    const { token, comic_id } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    if (!user.favoritesComics.includes(comic_id)) {
      user.favoritesComics.push(comic_id);
      await user.save();
    }

    res.status(201).json(user.favoritesComics);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/favoris", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.replace("Bearer ", "");

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({
        message: "Utilisateur non trouvé",
      });
    }

    return res.status(200).json({
      favoritesCharacters: user.favoritesCharacters,
      favoritesComics: user.favoritesComics,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;
