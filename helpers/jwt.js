// const expressJwt = require('express-jwt')

const jwt = require("jsonwebtoken");

// function authJwt (){
//     return expressJwt({
//         secret:process.env.SECRET,
//         algorithms:['HS256'],
//         isRevoked: isRevoked
//     }).unless({
        
//         path:[
//             {url:/\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
//             {url:/\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
//             {url:/\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS']},
//             '/api/v1/users/login',
//             '/api/v1/users/register'
//         ]
//     })
// }

// async function isRevoked(req,payload, done){
//     if(!payload.isAdmin){
//         return done(null, true)
//     }
//     return done()
    
// }

// module.exports = authJwt


//authentication middleware
const authJwt = (req,res,next) =>{
    

    
   
        if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
            throw new Error('Invalid token')
        }

        

        
    
    const token = req.headers.authorization.split(' ')[1]
    try {
        user = jwt.verify(token, process.env.SECRET);
        req.user = {id:user.userId, isAdmin:user.isAdmin}
        
        next()
        
    } catch (error) {
        throw new Error(error)
        
        
    }
}

module.exports =  authJwt