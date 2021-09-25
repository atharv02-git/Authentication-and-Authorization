const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty']
    }
})

// statics is where we can define multiple methods that will be added to the user class itsel to the user model and not the particular instances of a user
userSchema.statics.findAndValidate = async function(username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
    // using ternary operator: if isValid it will return foundUser else false
}

module.exports = mongoose.model('User', userSchema);