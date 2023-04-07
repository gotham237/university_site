const express = require('express');
const router = express.Router();
const database = require('../config/db');
const bcrypt = require('bcrypt');
const User = require('../models/userModels');

const {
    validateName,
    validateEmail,
    validatePassword
} = require('../utils/validators');

database.sync().then(() => {
    console.log("DB is running");
});

router.post('/signup', async (req, res) => {
    try {
        const {username, email,  password} = req.body;
        console.log(username, email, password);
        const userExists = await User.findOne({
            where: {
                email
            }
        });
        //console.log("efjwfjwbejfw");
        if(userExists) {
            return res.status(403).send("User already exists");
        }
        // if(username.length === 0) {
        //     return res.status(400).send("Error: Enter username");
        // }
        // if(email.length === 0) {
        //     return res.status(400).send("Error: Enter email");
        // }
        // if(password.length === 0) {
        //     return res.status(400).send("Error: Enter password");
        // }
        if(!validateName(username)) {
            return res
        .status(400)
        .send(
          "Error: Invalid user name: name must be longer than two characters and must not include any numbers or special characters"
        );
        }
        if(!validateEmail(email)) {
            return res.status(400).send("Error: Invalid email");
        }
        if(!validatePassword(password)) {
            return res.status(400).send(
                "Invalid password: password must be at least 8 characters long and must include atlest one - one uppercase letter, one lowercase letter, one digit, one special character"
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username: username, email: email, password: hashedPassword});
        return res.status(200).json({newUser});
    } catch(err) {
        return res.status(500).send( `Error: ${err.message}` );
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email.length === 0) {
            return res.status(400).send("Error: enter email");
        }
        if(password.length === 0) {
            return res.status(400).send("Error: enter password");
        }
        const userExists = await User.findOne({ where: {email} });
        if(!userExists) {
            return res.status(404).send("Error: user not found");
        }
        const passwordMatched = await bcrypt.compare(password, userExists.password);
        if (!passwordMatched) {
            return res.status(403).send("Error: Incorrect password");
        }

        return res.status(200).send("You have succesfully logged in!");

    } catch(err) {
        //console.log("Unknown error");
        return res.status(500).send( `Error: ${err.message}`);
    }
});

module.exports = router;