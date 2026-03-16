import { User } from "../model/usermodel.js"
import bcrypt from 'bcrypt'
export let register=(req,res)=>{
    return res.render("register")
}

export let login=(req,res)=>{
    return res.render("login",{"name":"vivek"})
}

export let addUser=async(req,res)=>{
    let {username,email,password}=req.body
    let hashpassword=await bcrypt.hash(password,10)
    await User.create({username,email,password:hashpassword})
    return res.redirect("/login")
}

export let chcekLogin=async(req,res)=>{
    let{username,password}=req.body;
    let u=await User.findOne({"username":username})
    console.log(u);
    
    if(!u){
        return res.redirect("/login")
    }
    let hpassword=await bcrypt.compare(password,u.password)
    console.log(hpassword);
    
    if(!hpassword){
        return res.redirect("/login")
    }
    res.cookie("user",username)
    res.cookie("email",u.email)
    res.cookie("role", u.role);
    return res.redirect("/")
}

export let logout=(req,res)=>{
    res.clearCookie('user');
    // ------
    res.clearCookie('role');
    res.clearCookie('email');
    res.clearCookie('msg');
    res.cookie("msg","logout successfully")
    return res.redirect("/login")
}