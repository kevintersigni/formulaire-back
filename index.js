const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

const app = express();

app.use(formidable());
app.use(cors());

require("dotenv").config();

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur mon serveur dédié au formulaire" });
});

app.post("/form", (req, res) => {
  console.log(req.fields);

  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: "kevin.tersigni@me.com",
    subject: `${req.fields.subject}`,
    text: `${req.fields.message}`,
  };

  mailgun.messages().send(data, (error, body) => {
    console.log(body);
    console.log(error);
    if (!error) {
      res.json({ message: "Formulaire bien envoyé" });
    } else {
      res.status(400).json(error);
    }
  });
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
