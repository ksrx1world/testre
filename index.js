const express = require('express');
const cors = require('cors');

const app = express()
const port = 3000
app.use(cors());
app.use(express.json());

const iprouter= require('./routes/ip.routes') 
app.use("/", iprouter);

app.use((req,res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
})

app.use((error, req,res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    })
})

app.listen(port, () => console.log(`ipserver is connected   `))