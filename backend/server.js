const express = require('express')
const cors = require('cors')
const loginroute=require('./routes/ksfeRoute')
const app = express()
const port = 8000

require('./config/db')
app.use(cors({
    "orgin":"*"
}))
 
app.use(express.json())

app.use("",loginroute)


app.listen(port,()=>{
    console.log(`listening to the port ${port}`);
})