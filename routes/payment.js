const express = require('express')

const auth = require('../middlewares/check-auth')
const Payment = require('../models/Payment')
const User = require('../models/User')
const Product = require('../models/Product')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  const isAdmin = req.user.role === 0 ? false : true
  if (isAdmin) {
    try {
      const paymentList = await Payment.find().populate('poster').populate('products').populate('buyer')
      return res.json(paymentList)
    } catch (error) {
      throw error
    }
  }
})

router.delete('/:id', auth, async (req, res) => {
  const isAdmin = req.user.role === 0 ? false : true
  if (isAdmin) {
    const itemPayment = await Payment.findById(req.params.id)
    await Payment.deleteOne(itemPayment)
    const buyer = await User.findById(itemPayment.buyer)
    const indexHistory = buyer.history.indexOf(itemPayment.id)
    await User.findOneAndUpdate(
      { _id: itemPayment.buyer },
      { $set: { history: indexHistory === 0 ? [] : buyer.history.splice(indexHistory, 1) } },
      { new: true }
    )
    const poster = await User.findById(itemPayment.poster)
    const indexPaymentList = poster.paymentList.indexOf(itemPayment.id)
    await User.findByIdAndUpdate(
      { _id: itemPayment.poster },
      { $set: { paymentList: indexPaymentList === 0 ? [] : poster.paymentList.splice(indexPaymentList, 1) } },
      { new: true }
    )
    const products = await Product.find({ '_id': { $in: itemPayment.products } })
    products.forEach(async product => {
      let indexProduct = product.buyer.indexOf(buyer.id)
      await Product.findOneAndUpdate(
        {_id: product.id},
        {$set: {buyer: indexProduct === 0 ? [] : product.buyer.splice(indexPaymentList, 1)}}
      )
    })

    return res.json({ msg: 'Delete success' })
  }
})

router.get('/:id', auth, async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('poster').populate('products').populate('buyer')
  if(!payment) return res.json({error: "error"})
  return res.json(payment)
})

module.exports = router;