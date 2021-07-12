const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

const exphbs = require('express-handlebars') //引用express-handlebars，並命名為exphbs

const bodyParser = require('body-parser')  //拉進body-parser

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

app.use(bodyParser.urlencoded({ extended:true}))


app.get('/',(req,res) => {
	//拿到全部的Todo資料
	Todo.find() // 從資料庫查找出資料
		.lean()  // 把資料轉換成單純的JS物件
		.then(todos => res.render('index', { todos }))  // 然後把資料送給前端樣板
		.catch(error => console.error(error)) // 如果發生意外，執行錯誤處理
})
//new,叫 view 引擎去拿 new 樣板
app.get('/todos/new',(req,res) =>{
	return res.render('new')
})

//new
app.post('/todos', (req, res) => {
	const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
	//做法一 直接操作Todo
	return Todo.create({ name })
		.then(() => res.redirect('/'))
		.catch(error => console.log(error))

	//做法二 先產生物件實例，再把實例存入Todo
	// const todo = new Todo({ name })  //從Todo產生一個實例
	// return todo.save()   //將該實例存入資料庫
	// 	.then(() => res.redirect('/'))
	// 	.catch(error => console.log(error))
})

app.get('/todos/:id',(req,res) => {
	const id = req.params.id
	return Todo.findById(id) //從資料庫查找出資料
		.lean()   //把資料轉換成單純的JS物件
		.then((todo) => res.render('detail', { todo }))  //把資料送給前端樣板
		.catch(error => console.log(error))  //如果發生意外，執行錯誤處理
})

app.get('/todos/:id/edit',(req,res) => {
	const id = req.params.id  //用 req.params.id 把網址上的 id 截取出來
	return Todo.findById(id)
		.lean()
		.then(todo => res.render('edit',{ todo }))
		.catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
	const id = req.params.id
	//原本的寫法，甚麼鳥
	// const name = req.body.name
	// const isDone = req.body.isDone
	const {name, isDone} = req.body   //解構賦值 (destructuring assignment),就是潮
	return Todo.findById(id)
		.then(todo => {
			todo.name = name
			//原本的寫法，甚麼鬼
			// if(isDone === 'on'){
			// 	todo.isDone === true
			// }else{
			// 	todo.isDone === False
			// }
		  todo.isDone = isDone === 'on'  //這樣寫才對，讚讚
			return todo.save()
		})
		.then(() => res.redirect(`/todos/${id}`))
		.catch(error => console.log(error))
})

app.post('/todos/:id/delete',(req, res) =>{
	const id = req.params.id  //透過 req.params.id 取得網址上的識別碼，用來查詢使用者想刪除的 To-do。
	return Todo.findById(id)  //使用 Todo.findById 查詢資料，資料庫查詢成功以後，會把資料放進 todo
		.then(todo => todo.remove()) //用 todo.remove() 刪除這筆資料
		.then(() => res.redirect('/')) //成功刪除以後，使用 redirect 重新呼叫首頁
		.catch(error => console.log(error))
})





app.listen(port,() =>{
	console.log(`App is running on http://localhost:${port}`)
})