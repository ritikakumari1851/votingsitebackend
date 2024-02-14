const nodemailer = require("nodemailer")
exports.sendEmail=async(req,res)=>{
    try {
        const transport= nodemailer.createTransport({
            service:"gmail",
            host:"smtp.gmail.com",
            port:465,
            auth:
               { 
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
               }
        })
        const data= {
            from:process.env.EMAIL_USER,
            to:req.body.email,
            subject:req.subject,
            text: req.text
        }
        transport.sendMail(data, (error, info) => {
            if (error) {
                // Log the error details
                console.error(error);
        
                // Check if the error has a response from the SMTP server
                if (error.response) {
                    console.error("SMTP Error:", error.response);
                }
        
                // Respond with an error message
                res.status(400).json({ message: "Email Delivery Error", error: error.message });
            } else {
                // Log the info object if the email was sent successfully
                console.log(info);
                res.status(200).json({ message: "Success" });
            }
        });
        
    } catch (error) {
        
    }
}