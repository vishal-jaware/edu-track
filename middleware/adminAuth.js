export const adminAuth = (req,res,next)=>{

    let role = req.cookies.role;

    if(role){
        next();
    }else{
        return res.redirect("/login");
    }
}