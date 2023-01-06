const express = require('express')
const Auth= require("../middleware/auth")
const router = express.Router();
const cors = require('cors');

router.use(cors())

const userController = require("../controllers/userController")
const itineraryController = require("../controllers/itinerarayController")

//-----------------------------** User APIs**/////////////////////////////
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

// Itinarary APIs
router.post("/addItinarary", Auth.authentication, itineraryController.createItinerary)
router.put("/UpdateItinarary/:id",Auth.authentication, itineraryController.updateItinerary)
router.get("/getItinarary/:id",itineraryController.getItinarary)
router.get("/summary/:id", itineraryController.getSummary)


/////////////////**********************Add**************/

router.put("/addActivity/:id",Auth.authentication, itineraryController.addActivity)
router.put("/addaccommodation/:id",Auth.authentication, itineraryController.addaccommodation)
router.delete("/deleteActivity/:id/:activityId",Auth.authentication, itineraryController.deleteActivity)
router.delete("/deleteaccommodation/:id/:accommodationId",Auth.authentication, itineraryController.deleteaccommodation)

///****************************Public Api******************************************* */

router.get("/Publick/Ititerary/:id",itineraryController.PublicItiterary)


router.all('/*', (req, res) =>
 { 
    return res.status(400).send({ status: false, message: "Endpoint Is Incorrect" }) 
})
module.exports = router;