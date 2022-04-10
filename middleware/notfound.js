const notFound = (req,res,next) =>{
    res.write("<h1 style=''color:red>Page Not Found</h1>")
   

    
    res.send()

}


module.exports = notFound