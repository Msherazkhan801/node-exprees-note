

export const verifyToken=(req,res,next)=>{
const bareerHeader=req.headers["authorization"]
console.log(bareerHeader);
if(typeof bareerHeader !== "undefined"){
const bearer =bareerHeader.split(" ")
 const token=bearer[1]
req.token=token
next()
}else{
    res.send({message:"token invalid"})
}
}