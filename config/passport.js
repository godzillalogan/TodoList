const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy  //注意和一般的引用不一樣
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' },(email, password, done) =>{
    User.findOne({ email })
    .then(user =>{
      if(!user){
        return done(null, false,{ message:'That email is not register' })
      }
      return bcrypt.compare(password, user.password).then(isMath =>{
        if(!isMath){
          console.log("是不是密碼不對")
          return done(null, false,{ message: 'Email or Password incorrect.' })
        }
        return done(null, user)
      })
    })
    .catch(err => done(err, false))
  }))
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRECT,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({email})
      .then(user => {
        if(user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password:hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err,false))
      })
  }))
  // 設定序列化與反序列化
  passport.serializeUser((user,done) => {
    // console.log(user)
    done(null,user.id)
  })
  passport.deserializeUser((id,done) =>{
    User.findById(id)
      .lean()
      .then(user => done(null,user))
      .catch(err => done(err, null))
  })
}