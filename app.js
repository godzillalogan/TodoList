const express = require('express')
const exphbs = require('express-handlebars') //引用express-handlebars，並命名為exphbs
const bodyParser = require('body-parser')  //拉進body-parser
const methodOverride = require('method-override') //// 載入 method-override
const session = require('express-session')
const flash = require('connect-flash')

if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}



const usePassport = require('./config/passport')

const routes = require('./routes') // 引用路由器
const app = express()
// 如果在 Heroku 環境則使用 process.env.PORT， 否則為本地環境，使用 3000 
const PORT = process.env.PORT

require('./config/mongoose')

//建立一個名為hbs的樣板引擎，並傳入exphbs與相關參數
app.engine('hbs',exphbs({
	defaultLayout:'main',
	extname: '.hbs'  //是指定副檔名為.hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名。
}))  

//啟用樣版引擎hbs
app.set('view engine','hbs')


app.use(session({
	secret: process.env.SESSION_SECRECT,
	resave : false,
	saveUninitialized : true
}))
app.use(flash())
app.use(bodyParser.urlencoded({ extended:true}))
app.use(methodOverride('_method'))  // 設定每一筆請求都會透過 methodOverride 進行前置處理
usePassport(app)

//設定本地變數 res.locals，放在usePassport(app) 之後、app.use(routes) 之前
app.use(( req, res, next)=> {
	console.log(req.user)
	res.locals.isAuthenticated = req.isAuthenticated
	res.locals.user = req.user
	res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
	next()
})

app.use(routes)  // app.js要使用定義好的路由器

app.listen(PORT,() =>{
	console.log(`App is running on http://localhost:${PORT}`)
})