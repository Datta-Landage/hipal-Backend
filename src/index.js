const express = require('express');
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());//makes sure data present in req.body is in JSON format,application level middleware

mongoose.connect("mongodb+srv://vandana:7CJBNDDwPorDTTrX@cluster0.crrs6th.mongodb.net/Hipal")
    .then(() => console.log("MongoDb is connected"),
        err => console.log(err))

app.use('/', route);


app.listen(5000, function () {
    console.log('Express app running on port 5000')
});


//https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/