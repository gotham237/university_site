const express = require('express');
const app = express();
const signupSignin = require('./routes/signupSignin');
require('dotenv').config();

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.use("/api/v1", signupSignin);


app.listen(process.env.PORT, () => {
    console.log("Server is working on port: ", process.env.PORT);
})