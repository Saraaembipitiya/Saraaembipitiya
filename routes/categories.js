const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    console.log(categoryList)
    res.status(200).json([categoryList, {length:categoryList.length}]);
})

router.get('/:id', async (req,res) =>{

const category = await Category.findById(req.params.id)

res.status(200).send(category);


})


router.post('/', async (req,res)=>{
    const category = await Category.create(req.body)

    res.status(200).json(category)




})

router.delete('/:id', (req,res)=>{
    Category.findByIdAndRemove(req.params.id).then((category)=>{
        if(category){
           return res.json({success:true})
        }else{
           return res.json({success:false})
        }
    }).catch((err)=>{
      return res.json({err:err})   
    })
})

router.put('/:id', async (req,res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true
            
        }

    )

    res.status(200).json(category)
})

module.exports =router;