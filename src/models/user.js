const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true
    },
    role: {
        type: String,
        default: 'user'
    },
}, {
    timestamps: true
})


userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    return userObject
}


// hashea la contraseña antes de guardar el documento
userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = User