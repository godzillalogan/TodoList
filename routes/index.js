const express = require('express')

const router = express.Router()

const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')  
const { authenticator } = require('../middleware/auth')  // 掛載 middleware


router.use('/todos', authenticator, todos)
router.use('/users', users)  // add this

module.exports = router

router.use('/', authenticator, home)  //需要引到清單最下方，避免無限循環