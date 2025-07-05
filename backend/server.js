import express from  'express'
import cors from 'cors'
import connectDb from './config/mongodb.js';
import userRouter from './routes/userRoute.js';


const app = express();

app.use(cors());
app.use(express.json())
connectDb();


app.get('/',(req,res)=>{
    res.send("Drawsarous Project")
})

app.use('/user',userRouter);
app.listen(8000,()=>{
    console.log("Server is running");

})