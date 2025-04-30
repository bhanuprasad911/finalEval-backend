const mongoose = require('mongoose')

const dbConnection = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
            console.log('Successfully connected to db');
            return true;
            } catch (error) {
                console.log('Error while connecting to db:', error);
                return false;
                }
}

module.exports = dbConnection