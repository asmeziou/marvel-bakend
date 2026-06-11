require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const api_key = process.env.YOUR_API_KEY;

// import et utilisation des routes :
const userRoutes = require("./routes/user");
app.use(userRoutes);

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur l'API Marvel!!");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    console.log(req.query);

    const { name, limit, page } = req.query;
    let filters = "";
    // si on recoit une query name :
    if (name) {
      filters += `&name=${name}`;
    }
    // on considère que par defaut, la page demandée sera la première, dans ce cas, aucun résultat n'est "skip" :
    if (page) {
      filters += `&skip=${(page - 1) * limit}`;
    }
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${api_key}${filters}`,
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    const { title, limit, page } = req.query;
    let filters = "";
    // si on recoit une query title :
    if (title) {
      filters += `&title=${title}`;
    }
    // on considère que par defaut, la page demandée sera la première, dans ce cas, aucun résultat n'est "skip" :
    if (page) {
      filters += `&skip=${(page - 1) * limit}`;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${api_key}${filters}`,
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.get("/comics/:characterId", async (req, res) => {
  try {
    const { characterId } = req.params;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${api_key}`,
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all(/.*/, (req, res) => {
  return res.status(404).json("Not found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started");
});
