const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3005,
        dbURL: 'mongodb://localhost:27017/movieList',
        origin: ['http://localhost:5555', 'http://localhost:3000']
    },
    production: {
        port: process.env.PORT || 3005,
        dbURL: process.env.DB_URL_CREDENTIALS,
        origin: []
    }
};

module.exports = config[env];
