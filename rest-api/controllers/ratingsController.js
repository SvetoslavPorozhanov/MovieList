const { userModel } = require('../models');

// function getAllPets(req, res, next) {
//     const petName = req.query.petName;
//     var condition = petName ? { fullName: { $regex: new RegExp(petName), $options: "i" } } : {};

//     petModel.find(condition)
//         .sort({ appointmentTime: 1 })
//         .populate('ownerId')
//         .then(pets => {
//             res.status(200).json(pets)
//         })
//         .catch(next);
// }

function getRating(req, res, next) {
    const { movieTitle } = req.params;
    const { _id: userId } = req.user;

    userModel.findOne({ _id: userId })
        .populate({
            path: 'favouriteMovies'
        })
        .aggregate([
            { $match: { _id: userId } },
            { $unwind: { favouriteMovies: 1 } },
            { $match: { "favouriteMovies.title": movieTitle } },
            { $project: { _id: 0, favouriteMovies: { $project: { rating: 1 }}}}
        ])
        .then(movieRating => res.status(200).json(movieRating))
        .catch(next);
}

function createRating(req, res, next) {
    const { _id: userId } = req.user;
    const { ratingNumber } = req.body;
    const { movieTitle } = req.params;

    userModel.findOneAndUpdate({ _id: userId })
        .populate({
            path: 'favouriteMovies'
        })
        .aggregate([
            { $match: { _id: userId } },
            { $unwind: { favouriteMovies: 1 } },
            { $match: { "favouriteMovies.title": movieTitle }},
            { $set: { favouriteMovies: { rating: ratingNumber }}},
            { $project: { _id: 0, favouriteMovies: { $project: { rating: 1 }}}}
        ])
        .then(movieRating => res.status(200).json(movieRating))
        .catch(next);
}

// function editPet(req, res, next) {
//     const { petId } = req.params;
//     const { fullName, kind, imageUrl, ownerId, appointmentTime } = req.body;

//     if (ownerId === "") {
//         Promise.all([
//             petModel.findOneAndUpdate({ _id: petId }, { fullName, kind, imageUrl, ownerId: null, appointmentTime }, { new: true }),
//             ownerModel.findOneAndUpdate({ pets: petId }, { $pull: { pets: petId } }),
//         ])
//         .then(updatedPet => {
//             res.status(200).json(updatedPet);
//         })
//         .catch(next);
//     } else {
//         Promise.all([
//             petModel.findOneAndUpdate({ _id: petId }, { fullName, kind, imageUrl, ownerId, appointmentTime }, { new: true }),
//             owner = ownerModel.findOneAndUpdate({ pets: petId },  { $pull: { pets: petId } }),
//             owner = ownerModel.findOneAndUpdate({ _id: ownerId },  { $push: { pets: petId } }),
//         ])
//         .then(updatedPet => {
//             res.status(200).json(updatedPet);
//         })
//         .catch(next);
//     }
// }

function deleteRating(req, res, next) {
    const { _id: userId } = req.user;
    const { ratingNumber } = req.body;
    const { movieTitle } = req.params;

    userModel.findOneAndUpdate({ _id: userId })
        .populate({
            path: 'favouriteMovies'
        })
        .aggregate([
            { $match: { _id: userId } },
            { $unwind: { favouriteMovies: 1 } },
            { $match: { "favouriteMovies.title": movieTitle }},
            { $set: { favouriteMovies: { rating: undefined }}},
            { $project: { _id: 0, favouriteMovies: { $project: { rating: 1 }}}}
        ])
        .then(movieRating => res.status(200).json(movieRating))
        .catch(next);
}

module.exports = {
    // getAllPets,
    getRating,
    createRating,
    // editPet,
    deleteRating,
}
