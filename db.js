const mongoose = require('mongoose')
const schema = mongoose.Schema
const User = new schema([{
    email:{
        type:String,
        unique:true
    },
    password:String
}])

