const form = require("../model/form");
exports.addForm=async (req,res,next) =>{
    req.subject = "Registration sucessfull",
    req.text = "Sucessfully registered to this site. now you will see trojan horse virus and it will access all of your unwanted data!!!!"

     next()

    try {
        const { Name,mobile_no,email,message,intrest } = req.body;
        const _form = new form(req.body);
        await _form.save()
            return res.status(201).json({message:"Sucessfully submitted"})
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Error"})
    }
 

    // console.log(eUser);
       

}