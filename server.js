import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './confiq/db.js';
import authRoute from './routes/authRout.js'
import productRoute from './routes/productRout.js'
import cors from 'cors'

//configur env
dotenv.config()
const app=express()

//databaseconfig
connectDB()


//middilware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/v1/auth',authRoute)
app.use('/api/v1',productRoute)

app.get('/',(req,res)=>{
    res.send({
        message:"welcome to"
        
    })
})

  
const port=process.env.PORT||8080;
app.listen(port,()=>{
    console.log(`server runing on ${process.env.DEV_MODE} port on ${port}`);
    
})