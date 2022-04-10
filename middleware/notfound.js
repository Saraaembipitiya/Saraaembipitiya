const notFound = (req,res,next) =>{
    

    
    res.sendFile(`${__dirname}doc.html`)

}


module.exports = notFound