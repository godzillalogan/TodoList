const express = require('express')
const router = express.Router()

const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then(user => {
    if(user){
      console.log('User already exists.')
      res.render('register',{
        name,
        email,
        password,
        confirmPassword
      })
    }else{
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
      //第二種create的方式
      // const bewUser = new User({
      //   name,
      //   email,
      //   password
      // })
      // newUser
      //   .save()
      //   .then(() => res.redirect('/'))
      //   .catch(err => console.log(err))
    }
  })
})


router.get('/logout', (req, res)=>{
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})




module.exports = router