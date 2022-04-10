
const jwt = require("jsonwebtoken");


//authentication middleware
const authJwt = (req,res,next) =>{
    

    
   //check the cookie is set
        if(!req.cookies.auth){
            throw new Error('No token provided')
        }

        

        
    
    const token = req.cookies.auth
    try {
        user = jwt.verify(token, process.env.SECRET);
        req.user = {id:user.userId, isAdmin:user.isAdmin}
        
        next()
        
    } catch (error) {
        
        
        console.log(error)
        throw new Error(error)
        
        
    }
}

module.exports =  authJwt