//auth.js
const user = require("../model/user")
const jwt = require("jsonwebtoken")
exports.register=async (req,res,next) =>{
    const { full_name , email, password, username ,Dob, gender} = req.body;
    const _user = new user({ full_name:full_name,email:email,username:username,Dob:Dob,gender: gender , password});
    const eUser = await user.findOne({ email });
    
    console.log(eUser);
    
    if (!eUser) {
        _user
            .save()
            .then(() => {
                // return res.status(201).json({newUser,message:"Sucessfully"})
               req.subject = "User Registration",
               req.text = "You have sucessfully Registered to VoteOnclick."

                next()

            })
            .catch((error) => {
                return res.status(400).json({
                    message: "Error occurred",
                    error
                });
            });
    } else {
        return res.status(409).json({
            message: "User already exists"
        });
    }
}
exports.login=async (req,res)=>{
    const { email,password }=req.body
    const eUser = await user.findOne({ email });
    if(eUser){
       if(eUser.authenticate(password)){
        const token = jwt.sign({
            id:eUser._id
        },"MYSECRETKEY@",{
            expiresIn:"1y"
        })
        res.status(200).json({token,message:"Login Succesfull"})

    }else{
        return res.status(401).json({message:"Email or password is incorrect"})
    }
    }else{
        return res.status(404).json({
            message: "User not found"
        })
    }
}

exports.findUser =async(req,res)=>{
    const user_= await user.findById(req.id)
    return res.status(200).json({user_})
}