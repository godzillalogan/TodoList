const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars') //引用express-handlebars，並命名為exphbs


const Todo = require('./models/todo')  // 載入 Todo model

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
//建立一個名為hbs的樣板引擎，並傳入exphbs與相關參數
app.engine('hbs',exphbs({
	defaultLayout:'main',
	extname: '.hbs'  //是指定副檔名為.hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名。
}))  


//啟用樣版引擎hbs
app.set('view engine','hbs')


app.get('/',(req,res) => {
	//拿到全部的Todo資料
	Todo.find() // 從資料庫查找出資料
		.lean()  // 把資料轉換成單純的JS物件
		.then(todos => res.render('index', { todos }))  // 然後把資料送給前端樣板
		.catch(error => console.error(error)) // 如果發生意外，執行錯誤處理
})

app.listen(port,() =>{
	console.log(`App is running on http://localhost:${port}`)
})