const nodemailer = require("nodemailer")
exports.sendEmail=async(req,res)=>{
    try {
        const transport= nodemailer.createTransport({
            service:"gmail",
            host:"smtp.gmail.com",
            port:465,
            auth:{
                user:"voteonclick@gmail.com",
                pass:"qkax wqop umei nnvm"
            }
        })
        const data= {
            from:"voteonclick@gmail.com",
            to:req.body.email,
            subject:req.subject,
            text: req.text
        }
        transport.sendMail(data, (error,info)=>{
            if(error){
                console.log(error);
                res.status(400).json({message:"Email Delivery Error"})
            }else{
                console.log(info);
                res.status(201).json({message:"sucess"})
            }
        })
    } catch (error) {
        
    }
}