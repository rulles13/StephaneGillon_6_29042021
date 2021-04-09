const express = require('express');

const app = express();

/* middleware number 1*/
app.use((req, res, next) => { // (request, response, méthode next)
  console.log('Requête reçue !');
  next(); //go to next middleware
});
/* */
app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});

module.exports = app;