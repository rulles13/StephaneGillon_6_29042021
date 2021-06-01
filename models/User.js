const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var pwdValidate = require('mongoose-validator');

var pwdValidator = [
  pwdValidate({
    validator: 'isLength',
    arguments: [12, 50], // lenght must be between 12 and 50 characters
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  pwdValidate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, // Regex for characters you can use
    message: 'Name should contain alpha-numeric characters only',
  }),
]

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, pwdValidate: pwdValidator }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);