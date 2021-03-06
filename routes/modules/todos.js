const express = require('express')


const router = express.Router()

// 引用 Todo model
const Todo = require('../../models/todo')

//new,叫 view 引擎去拿 new 樣板
router.get('/new',(req,res) =>{
	return res.render('new')
})

//new
router.post('/', (req, res) => {
	const userId = req.user._id
	const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
	//做法一 直接操作Todo
	return Todo.create({ name, userId })
		.then(() => res.redirect('/'))
		.catch(error => console.log(error))

	//做法二 先產生物件實例，再把實例存入Todo
	// const todo = new Todo({ name })  //從Todo產生一個實例
	// return todo.save()   //將該實例存入資料庫
	// 	.then(() => res.redirect('/'))
	// 	.catch(error => console.log(error))
})

router.get('/:id',(req,res) => {
	const userId = req.user._id
	const _id = req.params.id
	return Todo.findOne({_id , userId}) //從資料庫查找出資料
		.lean()   //把資料轉換成單純的JS物件
		.then((todo) => res.render('detail', { todo }))  //把資料送給前端樣板
		.catch(error => console.log(error))  //如果發生意外，執行錯誤處理
})

router.get('/:id/edit',(req,res) => {
	const userId = req.user._id
	const _id = req.params.id  //用 req.params.id 把網址上的 id 截取出來
	return Todo.findById({ _id, userId})
		.lean()
		.then(todo => res.render('edit',{ todo }))
		.catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
	const userId = req.user._id
	const _id = req.params.id
	//原本的寫法，甚麼鳥
	// const name = req.body.name
	// const isDone = req.body.isDone
	const {name, isDone} = req.body   //解構賦值 (destructuring assignment),就是潮
	return Todo.findOne({ _id, userId})
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
		.then(() => res.redirect(`/todos/${_id}`))
		.catch(error => console.log(error))
})

router.delete('/:id',(req, res) =>{
	const userId = req.user._id
	const _id = req.params.id  //透過 req.params.id 取得網址上的識別碼，用來查詢使用者想刪除的 To-do。
	return Todo.findOne({ _id, userId})  //使用 Todo.findById 查詢資料，資料庫查詢成功以後，會把資料放進 todo
		.then(todo => todo.remove()) //用 todo.remove() 刪除這筆資料
		.then(() => res.redirect('/')) //成功刪除以後，使用 redirect 重新呼叫首頁
		.catch(error => console.log(error))
})




// 匯出路由模組
module.exports = router