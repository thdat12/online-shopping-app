const { Schema, model } = require('mongoose')

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  poster: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  images: {
    type: Array,
    default: []
  },
  type: {
    type: Number,
    default: 1
  },
  quantity: {
    type: Number,
    default: 1
  },
  viewer: {
    type: Number,
    default: 0
  },
  buyer: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true })

productSchema.index({
  title: 'text',
  description: 'text'
}, {
  weights: {
    title: 1,
    description: 5
  }
})

module.exports = model('Product', productSchema)
