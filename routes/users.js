const {User} = require('../models/user');
const express = require('express');
const res = require('express/lib/response');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authJwt = require('../helpers/jwt');

router.get(`/`,authJwt, async (req, res) =>{
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    console.log('this is a admin')
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.get('/:id',authJwt, async (req,res)=>{
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    const user = await User.findById(req.params.id)
    res.status(200).json(user).select(-password) 
})

router.post('/login', async(req,res)=>{
    const user = await User.findOne({email:req.body.email})
    console.log(user)
    if(!user){
        throw new Error({err:'Authentication failed'})
    }
    if(bcrypt.compare(user.password, req.body.password)){
        const token = user.genToken()
        res.cookie('auth',token)
        console.log(res.cookie)
        res.status(200).json({authenticated:"true",token:token})
    }else{
        res.json({err:"auth failed"})
    }

    //res.status(200).json(user)
})

router.post('/register', async (req,res)=>{

    const user = await User.create(req.body);
    
    res.status(200).json(user) 


})

router.get('/get/count', authJwt, async (req,res)=>{
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    const userC = await User.find().length
    console.log(userC)
    res.json(userC)
})

router.delete('/:id', authJwt, (req,res)=>{
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    User.findByIdAndDelete(req.params.id).then((user)=>res.status(200).send(user)).catch((err)=>res.status(404).send(err))
})

module.exports =router;