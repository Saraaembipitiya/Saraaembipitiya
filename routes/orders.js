const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/orderItem');
const { del } = require('express/lib/application');
const router = express.Router();

//get all orders
router.get(`/`, async (req, res) =>{
    
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    const sort = req.query.sort || '-dateOrdered'
    
    const orderList = await Order.find().populate('user', 'name').populate({path:'orderItems', populate:{path:'product' , populate:'category'}})
    res.status(200).send(orderList)

    
   
    
   
})

//update single order
router.put('/:id', (req,res)=>{
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    Order.findByIdAndUpdate(req.params.id, {status:req.body.status}, {new:true}).then((order)=>res.json(order).catch((err)=>res.send(err)))
})

router.delete('/:id', async (req, res)=>{

    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
   const order = await Order.findByIdAndRemove(req.params.id)
   console.log(order)
   order.orderItems.map(async (order) =>{
       await OrderItem.findByIdAndRemove(order) 
       console.log("Item deleted")
   })
   res.send(order)
})
    



//add a order
router.post('/', async (req,res)=>{
    
    const itemId = Promise.all( req.body.orderItems.map(async(item)=>{
        //console.log(item.quantity)
        const oderItem = await OrderItem.create({quantity:item.quantity, product:item.product})
        //console.log(oderItem)

        return oderItem._id
    }))
    
    const itemIds = await itemId;
    
    
    const totPrice = Promise.all(itemIds.map(async(id)=>{
       const item =  await OrderItem.findById(id).populate('product')
       price = item.product.price

       total = price * item.quantity
       return total
    }))

    const totalPrice = await totPrice 
    console.log(totalPrice)
    const totalPrices = totalPrice.reduce((a,b)=> a + b, 0  
    )
    console.log(totalPrices)
    
    
  const order = await Order.create({  orderItems:itemIds,
    shippingAddress1:req.body.shippingAddress1,
    shippingAddress2:req.body.shippingAddress2,
    city:req.body.city,
    zip:req.body.zip,
    country:req.body.country,
    phone:req.body.phone,
    status:req.body.status,
    totalPrice:totalPrices,
    user:req.user.id,
    dateOrdered:req.body.dateOrdered
})

res.status(200).json(order)


})
//get total sales

router.get('/total/sales', async (req,res)=>{
    console.log(req.user.isAdmin)
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    const totalPrices = await Order.aggregate([
        {$group:{_id:null, totalSales:{$sum: "$totalPrice"}}}
    ])
    console.log(totalPrices)
    res.status(200).send(totalPrices)

})
//get users orders
router.get('/get/user/orders/:id', async (req,res)=>{
    if(!req.user.isAdmin){
        throw new Error('Your not a admin')
    }
    const orders = await Order.find({user:req.params.id}).populate({'path':'orderItems', 'populate':'product'})
    res.status(200).send(orders)
})

module.exports =router;