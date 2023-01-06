const jwt = require('jsonwebtoken')


const authentication = async function (req, res, next) {
    try {
        let bearerToken = req.headers["authorization"]//.split(" ") //token is saved as Bearer + Token
        if (!bearerToken) {
            return res.status(404).send({ status: false, msg: "Token must be present" })
        }
        let token = bearerToken.split(" ")[1] //.split(" ")=>token is saved as Bearer + Token , [1]=> fetching token
        jwt.verify(token, "Hi-pal", (error, decodedToken) => {
            if (error) {
                return res.status(401).send({ status: false, msg: error.message })
            }
            req.UserId = decodedToken.userId
            next()
        })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = { authentication }