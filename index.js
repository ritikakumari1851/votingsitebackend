const express =require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
app.post("/register", (req,res)=>{
    
})
app.listen('3000',()=>{
    console.log("server is listening on the port "+3000)
})
mongoose.connect(
    "mongodb://localhost:27017"
)
.then(data =>{
    console.log("Database is sucessfully connected")
})
.catch(error =>{
    console.log("error occured")
})