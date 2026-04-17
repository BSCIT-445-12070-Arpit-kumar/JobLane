const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({


    name: {
        type: String,
        required: [true, "Please enter your name"]
    },

    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Enter valid email address"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Please enter a password"]
    },

    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },

    role: {
        type: String,
        enum: ["applicant", "admin", "recruiter"],
        default: "applicant"
    },

    skills: [
        {
            type: String
        }
    ],

    resume: {
        type: {
            public_id: String,
            url: String
        },
        default: null
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const User = mongoose.model('User', UserSchema)
module.exports = User