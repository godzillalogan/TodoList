const express = require('express')
const exphbs = require('express-handlebars') //引用express-handlebars，並命名為exphbs
const bodyParser = require('body-parser')  //拉進body-parser
const methodOverride = require('method-override') //// 載入 method-override

const routes = require('./routes') // 引用路由器
const app = express()
const port = 3000

require('./config/mongoose')

//建立一個名為hbs的樣板引擎，並傳入exphbs與相關參數
app.engine('hbs',exphbs({
	defaultLayout:'main',
	extname: '.hbs'  //是指定副檔名為.hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名。
}))  

//啟用樣版引擎hbs
app.set('view engine','hbs')

app.use(bodyParser.urlencoded({ extended:true}))
app.use(methodOverride('_method'))  // 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(routes)  // app.js要使用定義好的路由器

app.listen(port,() =>{
	console.log(`App is running on http://localhost:${port}`)
})