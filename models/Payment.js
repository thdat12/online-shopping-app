const { Schema, model } = require('mongoose')

const paymentSchema = new Schema({
  poster: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  data: {
    receiver: String,
    location: String,
    phoneNumber: String,
    totalPrice: Number
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = model('Payment', paymentSchema)