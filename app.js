const express = require('express'); // framework for nodeJs
const bodyParser = require('body-parser'); // export JSON objects from POST request
const mongoose = require('mongoose'); // plugin to connect to Mongo Db (data base)
const path = require('path'); // plugin to use path for file (images)
const helmet = require('helmet'); // plugin for security
const rateLimit = require("express-rate-limit");

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per 15 minutes
});

require('dotenv').config(); 

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wzbxw.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();
  app.use(helmet());
  app.use(limiter);


  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
  app.use(express.json());

  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use('/api/sauces', sauceRoutes);
  app.use('/api/auth', userRoutes);

module.exports = app;