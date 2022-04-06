const {Product} = require('../models/product');
const express = require('express');
const mongoose = require('mongoose');
const authJwt = require('../helpers/jwt');
const router = express.Router();
const multer = require('multer')

const FILE_TYPE_MAP =  {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/png':'png'

}


var storage = multer.diskStorage({
    destination: function(req,file,cb){
        let isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')
        
        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/upload')

    },
    filename: function(req,file,cb){
        const filename = file.originalname.split(' ').join('-')
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extention = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${filename}-${Date.now()}.${extention}`)
    }
})

const uploadOption =  multer({storage:storage})

router.get(`/`, async (req, res) =>{
    const {category} = req.query
    let filter = {}
    console.log(category) 
    if(category){
        
        filter =  {category:category.split(',')}
        console.log(filter)
    }
    

    

    const select = req.query.select || 'name image images description rishDescription brand price category countInStock rating isFeatured dateCreated'
    const productList = await Product.find(filter).select(select);
    

    // if(!productList) {
    //     res.status(500).json({success: false})
    // } 
    res.status(200).json([productList, {length:productList.length}]);
})



router.get(`/featured`, async (req, res) =>{
    const count = req.query.count || 10
    const select = req.query.select || 'name image images description rishDescription brand price category countInStock rating isFeatured dateCreated'
    const productList = await Product.find({isFeatured:true}).select(select).limit(+count);
    //populate('category')

    // if(!productList) {
    //     res.status(500).json({success: false})
    // } 
    res.status(200).json([productList, {length:productList.length}]);
})

router.get('/:id', async (req,res)=>{
    Product.findById(req.params.id).then((product)=>{
        res.status(200).json(product)
    }).catch((err)=>{
        next(err)})
})

router.put('/:id',authJwt,uploadOption.single('image'),async(req,res)=>{

    const product = Product.findById(req.params.id)
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    if(!product){
       // return res.send('invalid Id')
    }
    let productFile 
    if(req.file){
        const filename = req.file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
        productFile = `${basePath}${filename}`

    }else{
        
        productFile = product.image
    }

    
    if(!mongoose.isValidObjectId(req.body._id)){
        throw new Error("Id is not valid")
    }
    req.body.image = productFile
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body , {new:true ,runValidators:true})
    res.status(200).json(updatedProduct)
})

router.delete('/:id',authJwt, (req,res)=>{
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }

    Product.findByIdAndDelete(req.params.id).then((product)=>{
        return res.status(200).json(product)
    }).catch((err)=> res.json({err:err}))
})

router.post(`/`,authJwt,uploadOption.single('image'), async (req, res) =>{
    if(!req.file){
        res.send("no image in the file")

    }
    console.log(req.body)
    filename = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
    req.body.image = `${basePath}${filename}` //"http://localhost:3000/public/upload/image-2323232"
    console.log(req.protocol)
    console.log(req.get('host'))
    
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    const product = new Product(
        req.body
    )

  const products = await  product.save()
   res.status(200).json(product)

})


router.put('/galary/:id',authJwt,uploadOption.array('images', 10), async (req,res)=>{
    const files = req.files
    console.log(req.files)
    //req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
    let imagePathes = files.map((file)=>{
        return `${basePath}${file.filename}`
    })

    req.body.imagePathes = imagePathes

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images:req.body.imagePathes

        },{
            new:true
        }
     )
     res.json(product)

})

module.exports =router;