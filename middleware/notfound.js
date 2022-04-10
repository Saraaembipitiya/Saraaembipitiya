const notFound = (req,res,next) =>{
    res.write("<h1>Page Not Found</h1>")
    res.write("<h2>Login:users/login</h2>")
    res.write("<h2>Register:users/register</h2>")
    res.send()

}


module.exports = notFound