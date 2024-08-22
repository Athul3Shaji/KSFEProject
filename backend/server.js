const express = require('express')
const cors = require('cors')
const dotenv = require("dotenv")
dotenv.config();
const loginroute=require('./routes/ksfeRoute')
const app = express()
const port = process.env.PORT

require('./config/db')
app.use(cors({
    "orgin":"*"
}))
 
app.use(express.json())

app.use("",loginroute)


app.listen(port,()=>{
    console.log(`listening to the port ${port}`);
})