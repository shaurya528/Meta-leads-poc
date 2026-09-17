import express from 'express'

const app=express();
const PORT=3003;
app.get('/',(req,res)=>{
    console.log("server running")
})
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})