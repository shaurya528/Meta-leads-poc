import express from 'express';
import 'dotenv/config';
const app=express();
const PORT=3003;
app.use(express.json())
app.get('/',(req,res)=>{
    console.log("server running")
})
app.get('/webhook',(req,res)=>{
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    console.log("running")
    if(!mode){
        console.log("unanle to get mode")
    }
    if(!token){
        console.log("unbale")
    }
    if(!challenge){
        console.log("unbale cchhh")
    }
    console.log(mode);
    console.log(token)
    console.log(challenge)
    console.log(process.env.VERIFY_TOKEN)

    try{
        if(mode==='subscribe' && token == process.env.VERIFY_TOKEN){
            res.status(200).send(challenge);
        }else{
            res.status(400).send('verification failed');
        }
    }catch(err){
        console.error(err)
        res.status(500).send('Internal Server Error');
    }
})
app.post('/webhook',(req,res)=>{
    res.status(200).send({message:"successfull"})
    console.log(req.body);
})
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})