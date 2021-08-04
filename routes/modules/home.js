const express = require('express')


const router = express.Router()

// 引用 Todo model
const Todo = require('../../models/todo')

router.get('/',(req,res) => {
	const userId = req.user._id
	//拿到全部的Todo資料
	Todo.find({userId}) // 從資料庫查找出資料
		.lean()  // 把資料轉換成單純的JS物件
		.sort({_id : 'asc'}) //「根據 _id 用升冪 (ascending) 排序
		.then(todos => res.render('index', { todos }))  // 然後把資料送給前端樣板
		.catch(error => console.error(error)) // 如果發生意外，執行錯誤處理
})

// 匯出路由模組
module.exports = router