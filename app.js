const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars') //引用express-handlebars，並命名為exphbs

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


app.get('/',(req,res)=>{
  res.render('index')
})

app.listen(port,() =>{
	console.log(`App is running on port localhost:${port}`)
})