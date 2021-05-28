const mongoose = require('mongoose');

var validate = require('mongoose-validator');

var sauceValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, // Regex pour restreindre le type de symboles utilisables
    message: 'Name should contain alpha-numeric characters only',
  }),
]

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, validate: sauceValidator },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false, default : 0 },
  dislikes: { type: Number, required: false, default : 0 },
  usersLiked: [{ type: String, required: false }],
  usersDisliked: [{ type: String, required: false }]
});


module.exports = mongoose.model('Sauce', sauceSchema);