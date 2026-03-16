import mongoose from "mongoose"
// mongoose.connect("mongodb://127.0.0.1:27017/lms").then(()=>console.log("connected")
// ).catch(()=>console.log("not connected")
// )

let user=mongoose.Schema({
    "username":{
        type:"string",
        unique:true
    },
    "email":{
        type:"string"
    },
    "password":{
        type:"string"
    },
    "role":{
        type:"string",
        enum:["student","admin"],
        default:"student"
    }
})

export let User=mongoose.model("user",user)
