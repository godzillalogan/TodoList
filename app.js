const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology:true}) // 設定連線到 mongoDB

const db = mongoose.connection

db.on('error',()=>{
	console.log('mongodb error')
})

db.once('open',() =>{
	console.log('mongoDB connected')
})

app.engine('hbs',exphbs({
	defaultLayout:'main'
}))

app.get('/',(req,res)=>{
  res.send('hello world')
})

app.listen(port,() =>{
	console.log(`App is running on port localhost:${port}`)
})