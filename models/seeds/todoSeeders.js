const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Todo = require('../todo') // 載入 todo model
const User = require('../user')
const db = require('../../config/mongoose')

const SEED_USER = {
  name:'naruto',
  email:'naruto@example.com',
  password: "naruto"
}

db.once('open',() => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user =>{
      const userId = user._id
      return Promise.all(Array.from(
        { length: 10 }, //['','','',....10個]
        (_, i) => Todo.create({ name: 'name-' + i, userId })
      )) //[1,2,3].map
    })
    .then(() => {
      console.log('done.')
      process.exit() //「關閉這段 Node 執行程序」
    })
})
