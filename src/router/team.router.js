const express= require('express')
const { getTeam } = require('../controller/team.controller')

const teamRouter= express.Router()



teamRouter.get('/', getTeam)


module.exports= teamRouter