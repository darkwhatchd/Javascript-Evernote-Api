const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

// Função do mongoose para carregar um script antes ou depois
// de fazer alterações no banco de dados.
// Nesse caso vamos transformar o password em um hash
userSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    // O bcrypt serve para transformar a senha em um hash aleatorio
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      if (err) {
        next(err)
      } else {
        this.password = hashedPassword
        next()
      }
    })
  }
})

userSchema.methods.isCorrectPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, same) {
    if (err) {
      callback(err)
    } else {
      callback(err, same)
    }
  })
}

module.exports = mongoose.model('User', userSchema)