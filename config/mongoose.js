const mongoose = require('mongoose') // 載入 mongoose

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongoDB connected')
})

module.exports = db