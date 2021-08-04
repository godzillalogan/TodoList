const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new mongoose.Schema({
  name:{
		type: String,
		require: true
	},
	isDone:{
		type:Boolean,
		default: false
	},
	userId: {  // 加入關聯設定
		type: Schema.Types.ObjectId,
		ref: 'User',
		index: true,
		required: true
	}
})


module.exports = mongoose.model('Todo', todoSchema)