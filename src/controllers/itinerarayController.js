const userModel = require("../models/userModel")
const itineraryModel = require("../models/itinerary")
const { isValidName, isValidRequestBody, isPresent, isValidObjectId } = require('../validator/validator')
// const { use } = require("../routes/route")
const redis = require('redis')

const { promisify } = require('util')

const redisClient = redis.createClient(
    18322,
  "redis-18322.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("QVsYxq8ECTF8u86WpAN4ZpWdzujwk1yz", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});



const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);






const createItinerary = async (req, res) => {
    try {
        if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "body cannot be empty" })
        let data=req.body
        if (!isPresent(data.from) || !isValidName.test(data.from)) return res.status(400).send({ status: false, message: "Invalid Syntax" })
        if (!isPresent(data.to) || !isValidName.test(data.to)) return res.status(400).send({ status: false, message: "Invalid Syntax" })
        let result = await itineraryModel.create(data)
        return res.status(201).send({ status: true, message: "Success..", data: result })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const updateItinerary = async (req, res) => {
    try {
        let itineraryId = req.params.id
        if (!isValidObjectId(itineraryId)) return res.status(400).send({ status: false, message: "ObjectId is not valid" })
        let findData = await itineraryModel.findById(itineraryId)
        if (!findData) return res.status(404).send({ status: false, message: "itinerary Not found Given Id" })
        let data = req.body
        let updatedData = await itineraryModel.findOneAndUpdate({ _id: itineraryId }, { ...data }, { new: true })
        return res.status(200).send({ status: true, message: "Updated Success..", data: updatedData })
    } catch (error) {
       return res.status(500).send({ status: false, message: error.message });
    }
}

const getItinarary = async (req, res) => {
    try {
        let itineraryId = req.params.id
        if (!isValidObjectId(itineraryId)) return res.status(400).send({ status: false, message: "ObjectId is not valid" })
        let findData = await itineraryModel.findById(itineraryId)
        if (!findData) return res.status(404).send({ status: false, message: "itinerary Not found Given Id" })
        let result = await itineraryModel.findById(itineraryId)
      return  res.status(200).send({ status: true, message: "Success..", data: result })
    } catch (error) {
      return  res.status(500).send({ status: false, message: error.message });
    }
}

const addActivity = async (req, res) => {
    try {
        let itineraryId = req.params.id
        if (!isValidObjectId(itineraryId)) return res.status(400).send({ status: false, message: "ObjectId is not valid" })
        let findData = await itineraryModel.findById(itineraryId)
        if (!findData) return res.status(404).send({ status: false, message: "itinerary Not found Given Id" })
        
        let data = req.body
       
        let updatedData = await itineraryModel.findOneAndUpdate({_id: itineraryId }, { $push: { activities: data }, }, { new: true })
     return   res.status(200).send({ status: true, message: "Success..", data: updatedData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const addaccommodation = async (req, res) => {
    try {
        let itineraryId = req.params.id
        if (!isValidObjectId(itineraryId)) return res.status(400).send({ status: false, message: "ObjectId is not valid" })
        let findData = await itineraryModel.findById(itineraryId)
        if (!findData) return res.status(404).send({ status: false, message: "itinerary Not found Given Id" })
        
        let data = req.body
       
        let updatedData = await itineraryModel.findOneAndUpdate({_id: itineraryId }, { $push: { accommodation: data }, }, { new: true })
     return   res.status(200).send({ status: true, message: "Success..", data: updatedData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const deleteActivity = async (req, res) => {
    try {
        let itineraryId = req.params.id
        let activityId = req.params.activityId
       

        if (!isValidObjectId(itineraryId)) return res.status(400).send({ status: false, message: "ObjectId is not valid" })
        let findData = await itineraryModel.findById(itineraryId)
        if (!findData) return res.status(404).send({ status: false, message: "itinerary Not found Given Id" })
        
        let obj = await itineraryModel.findOneAndUpdate(
            {_id: itineraryId },
            {
                $pull: { activities: {_id:activityId } },
          
            },
            { new: true }
        )
       
     return   res.status(200).send({ status: true, message: "Success..", data: obj })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const deleteaccommodation = async (req, res) => {
    try {
        let itineraryId = req.params.id
        let accommodationId = req.params.accommodationId
        console.log(accommodationId);
       

        if (!isValidObjectId(itineraryId)) return res.status(400).send({ status: false, message: "ObjectId is not valid" })
        let findData = await itineraryModel.findById(itineraryId)
        if (!findData) return res.status(404).send({ status: false, message: "itinerary Not found Given Id" })
        
        let obj = await itineraryModel.findOneAndUpdate(
            {_id: itineraryId },
            {
                $pull: { accommodation: {_id:accommodationId } },
          
            },
            { new: true }
        )
       
     return   res.status(200).send({ status: true, message: "Success..", data: obj })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const getSummary = async (req, res) => {
    try {
        let userId = req.params.id
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "ObjectId is not valid" })
       let user=await userModel.findById(userId)
       if(!user) return res.status(400).send({status:false,message:"User Not found given Id"})
        let data = await itineraryModel.find({ userId:userId })
        return data.length == 0 ?  res.status(404).send({status:false,message:"No Itineraty Found !"}) :res.status(200).send({status:true,data:data})
  
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const PublicItiterary = async (req, res) => {
    try {
        let userId = req.params.id
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "ObjectId is not valid" })
       let user=await userModel.findById(userId)
       if(!user) return res.status(400).send({status:false,message:"User Not found given Id"})
       let cachedata = await GET_ASYNC(userId)
       if (cachedata) {
        cachedata = JSON.parse(cachedata)
         console.log("Send from redis cache !")
        
         return res.status(400).send({ status: false, message: "data send  from cache !", data: cachedata })
       }
       let data = await itineraryModel.find({ userId:userId })
       await SET_ASYNC(userId, JSON.stringify(data))
     
        return data.length == 0 ?  res.status(404).send({status:false,message:"No Itineraty Found !"}) :res.status(200).send({status:true,message:"Data from Db",data:data})
  
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createItinerary, updateItinerary, getItinarary, addActivity, addaccommodation,getSummary ,deleteActivity,deleteaccommodation,PublicItiterary}