const Sauce = require('../models/Sauce');
const fs = require('fs'); // utilisation du systeme de fichier (file system)

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.updateLike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      let updateObject = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: sauce.likes,
        dislikes: sauce.dislikes,
      }
      switch (req.body.like) {

        case 1 : // if user like the sauce
          if (!sauce.usersLiked.includes(req.body.userId)) {
            updateObject.usersLiked.push(req.body.userId)
          }
          updateObject.likes = updateObject.usersLiked.length
        break;
  
        case -1 : // if user dislike the sauce
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            updateObject.usersDisliked.push(req.body.userId)
          }
          updateObject.dislikes = updateObject.usersDisliked.length
        break;
  
        case 0 : // if user unlike or undislike the sauce
          updateObject.usersDisliked = updateObject.usersDisliked.filter(userId => userId !== req.body.userId)
          updateObject.usersLiked = updateObject.usersLiked.filter(userId => userId !== req.body.userId)
          updateObject.likes = updateObject.usersLiked.length
          updateObject.dislikes = updateObject.usersDisliked.length
        break;
  
      }
      Sauce.updateOne({ _id: req.params.id }, { ...updateObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
    }).catch(error => res.status(404).json({ error }));
};
