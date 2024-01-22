//index.js middleware
const jwt = require("jsonwebtoken")
const {check,validationResult} = require("express-validator")
exports.verifyToken =(req,res,next)=>{
   try {
    const token=req.headers.authorization
    console.log(token);
    if(token){
        const data=jwt.verify(token,"MYSECRETKEY@")
        const {id}=data;
        req.id= id;
        next();
    }
    else{
        return res.status(401).json({message:"Token is missing"})
    }
   } catch (err) {
    return res.status(401).json({err})
   }
}
exports.validateForm =[
 check("Name").notEmpty().withMessage("please enter name"),
 check("email").isEmail().withMessage("please enter email"),
 check("mobile_no").isMobilePhone().withMessage("please enter valid number"),
 check("message").notEmpty().withMessage("please enter message"),
 check("intrest").notEmpty().withMessage("please enter intrest")
]
exports.isValidated = (req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        res.status(400).json({
           message:errors.array()[0]
        })
    }
}