let home=(req,res)=>{
    let username=req.cookies.user
    return res.render("index",{username})
}

export{home}