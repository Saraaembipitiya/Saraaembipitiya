const errHandler = (err,req,res,next) =>{
    console.log(err)
    res.json(err)
    

}

module.exports = errHandler