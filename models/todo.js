const mongoose = require('mongoose')
const schema = mongoose.Schema

const todoSchema = new mongoose.Schema({
  name:{
		type: String,
		require: true
	},
	isDone:{
		type:Boolean,
		default: false
	}
})


module.exports = mongoose.model('Todo', todoSchema)