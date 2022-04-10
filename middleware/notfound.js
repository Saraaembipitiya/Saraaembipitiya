const notFound = (req,res,next) =>{
    res.write("<h1>Page Not Found</h1>")
    res.write("<h2>Login:/api/v1/users/login</h2>")
    res.write("<h4 style='color:blue'>Please provide email and password for login </h4>")
    res.write("<h2>Register:/api/v1/users/register</h2>")
    res.write("<h4 style='color:blue'>Please use name,email,password,street,apartment,zip,city,country,phone to register</h4>")
    res.write("<h2>:Get-All-Products:/api/v1/products/</h2>")
    res.write("<h2>:Get-Single-Product:/api/v1/products/:id</h2>")
    res.write("<h2>:Get-Featured-Product:/api/v1/products/featured</h2>")
    res.write("<h4 style='color:red'>Please use API tester for tesing,  Admin routes are not in there, All the product updating and deleting is done by admin</h4>")
    
    
    res.send()

}


module.exports = notFound