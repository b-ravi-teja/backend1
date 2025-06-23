const express = require('express')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
require('dotenv').config()
const JWT_SECRET = process.env.JWT;
mongoose.connect('mongodb+srv://ravibalguri9:Tl6I0P1hIlTb3ubQ@cluster0.ce9z6rv.mongodb.net/')

const app = express()
app.use(express.json)

app.get('/',(req,res)=>{
    res.status(400).json({
        message:'server is working'
    })
})

app.post('/api/auth/singnup',async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    if(password.length<6 && password){
        res.status(400).json({
            message:'is too short'
        })
    }
    const hasedPassword = await bcrypt.hash(password, 10);

    await User.create({
        email:email,
        password:hasedPassword
    })
    res.json({
        message:"you are signed up"
    })
})

app.post('/api/auth/signin',async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({
        email:email
    })
    const passwordVerfiy = bcrypt.compare(password,user.password)
    if(user && passwordVerfiy){
        const token = jwt.sign({
            id:user._id.toString()
        },JWT_SECRET)
      res.json({
        token
      })
    } else{
        res.status(403).json({
            message:"Incorrect"
        })
    }
})

app.get('/api/return_sha256_hash',(req,res)=>{
    const message = req.body.message
    function sha(mess){
        crypto.createHash('sha256').update(mess).digest('hex')
    }
    const hashvalue =sha(message)
    res.status(400).json({
        message:hash
    })
})

app.post('/api/uploadtoIPFS',(req,res)=>{
    
})