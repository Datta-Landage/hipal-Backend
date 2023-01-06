const userModel = require('../models/userModel');
const {isValidMail, isValidName, isValidRequestBody, isPresent, isValidNumber, isValidPassword } = require('../validator/validator')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const createUser = async function (req, res) {
    try {
        let { fname, email, phone, password } = req.body

        if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "body cannot be empty" })

        if (!isPresent(fname) || !isValidName.test(fname)) return res.status(400).send({ status: false, message: "fname is missing or invalid" })


        if (!isPresent(email) || !isValidMail.test(email)) {
            return res.status(400).send({ status: false, message: "email is missing or invalid" })
        } else {
            let repeatedEmail = await userModel.findOne({ email: email })
            if (repeatedEmail) return res.status(400).send({ status: false, message: "email is already in use" })
        }

        if (!isPresent(phone) || !isValidNumber.test(phone)) {
            return res.status(400).send({ status: false, message: "phone is missing or invalid" })
        } else {
            let repeatedPhone = await userModel.findOne({ phone: phone })
            if (repeatedPhone) return res.status(400).send({ status: false, message: "phone is already in use" })
        }
        if (!isPresent(password) || !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: "password is missing or invalid" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        let data=req.body
        data["password"]=hashedPassword

        const createUser = await userModel.create(data)

        return res.status(201).send({ status: true, message: "successsfully created", data: createUser })

    } catch (error) {
        
        return res.status(500).send({ status: false, message: error.message })
    }
}

const loginUser = async function (req, res) {
    try {

        let email = req.body.email
        let password = req.body.password;

        if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, messaeg: "body cannot be empty" })

        if (!email || !password) return res.status(400).send({ status: false, message: "Email and Password are required" })

        let findUser = await userModel.findOne({ email: email })

        if (!findUser) return res.status(404).send({ status: false, message: "User not found" })

        let checkPassword = await bcrypt.compare(password, findUser.password)

        if (!checkPassword) return res.status(400).send({ status: false, message: "Incorrect Password" })

        let token = jwt.sign(
            {
                userId: findUser._id.toString(),
            },
            "Hi-pal",
            { expiresIn: "24h" });

        let data = {
            userId: findUser._id,
            token: token
        }
        return res.status(200).send({ status: true, message: "Login Successfull", data: data });

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}








module.exports = { createUser, loginUser }