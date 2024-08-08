const express = require('express')
const loginroute=require('./routes/loginroute')
const app = express()
const port = 8000
app.use(express.json())
require('./config/db')
require('./models/loginUser')

app.use("",loginroute)


app.listen(port,()=>{
    console.log(`listening to the port ${port}`);
})