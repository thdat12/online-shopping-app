const { Schema, model } = require('mongoose')

const userSChema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: { type: Number, default: 0 },
  cart: { type: Array, default: [], },
  ownProduct: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  history: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  paymentList: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  createAt: { type: Date, default: Date.now() }
})

module.exports = model('User', userSChema)
