const { userModel, favouriteMovieModel } = require('../models');

function getAllFavouriteMovies(req, res, next) {
    const { _id: userId } = req.user;

    userModel.findOne({ _id: userId })
        .populate({
            path: 'favouriteMovies'
        })
        .aggregate([
            { $match: { _id: userId } },
            { $unwind: { favouriteMovies: 1 } },
            { $project: { _id: 0, favouriteMovies: 1 } }
        ])
        .then(movies => res.status(200).json(movies))
        .catch(next);
}

function getMovie(req, res, next) {
    const { _id: userId } = req.user;
    const { movieTitle } = req.params;

    userModel.findOne({ _id: userId })
        .populate({
            path: 'favouriteMovies'
        })
        .aggregate([
            { $match: { _id: userId } },
            { $unwind: { favouriteMovies: 1 } },
            { $match: { "favouriteMovies.title": movieTitle } },
            { $project: { _id: 0, favouriteMovies: 1 } }
        ])
        .then(movie => res.status(200).json(movie))
        .catch(next);

    // favouriteMovieModel.findById(movieId)
    //     .populate('userId')
    //     .then(movie => res.status(200).json(movie))
    //     .catch(next);
}

function createMovie(req, res, next) {
    const { _id: userId } = req.user;
    const { movieTitle } = req.params;
    // const { fullName, kind, imageUrl, ownerId, appointmentTime } = req.body;

    favouriteMovieModel.create({ movieTitle })
        .then(movie => {
            Promise.all([
                userModel.updateOne({ _id: userId }, { $push: { favouriteMovies: movie._id }})
            ])
        })
        .then((addedMovie) => res.status(200).json(addedMovie))
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

function deleteMovie(req, res, next) {
    const { _id: userId } = req.user;
    const { movieId } = req.params;

    Promise.all([
        favouriteMovieModel.findOneAndDelete({ _id: movieId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { favouriteMovies: movieId } }),
    ])
        .then(([deletedOne, _]) => {
            if (deletedOne) {
                res.status(200).json(deletedOne)
            }
        })
        .catch(next);
}

module.exports = {
    getAllFavouriteMovies,
    getMovie,
    createMovie,
    // editPet,
    deleteMovie,
}
