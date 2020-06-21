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
      const paymentList = await Payment.find({}).sort({createAt: -1}).populate('poster').populate('products').populate('buyer')
      return res.json(paymentList)
    } catch (error) {
      throw error
    }
  }
})

router.delete('/:id', auth, async (req, res) => {
  // const isAdmin = req.user.role === 0 ? false : true
  const itemPayment = await Payment.findById(req.params.id)
  await Payment.deleteOne(itemPayment)
  const buyer = await User.findById(itemPayment.buyer)
  const indexHistory = buyer.history.indexOf(itemPayment.id)
  buyer.history.splice(indexHistory, 1) 
  await User.findOneAndUpdate(
    { _id: itemPayment.buyer },
    { $set: { history: buyer.history } },
    { new: true }
  )
  const poster = await User.findById(itemPayment.poster)
  const indexPaymentList = poster.paymentList.indexOf(itemPayment.id)
  poster.paymentList.splice(indexPaymentList, 1) 
  await User.findByIdAndUpdate(
    { _id: itemPayment.poster },
    { $set: { paymentList: poster.paymentList } },
    { new: true }
  )
  const products = await Product.find({ '_id': { $in: itemPayment.products } })
  products.forEach(async product => {
    let indexProduct = product.buyer.indexOf(buyer.id)
    product.buyer.splice(indexPaymentList, 1)
    await Product.findOneAndUpdate(
      { _id: product.id },
      { $set: { buyer: product.buyer } }
    )
  })

  return res.json({ msg: 'Delete success' })
}
)

router.get('/:id', auth, async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('poster').populate('products').populate('buyer')
  if (!payment) return res.json({ error: "error" })
  return res.json(payment)
})

router.get('/updateStatus/:id', auth, async (req,res) => {
  const payment = await Payment.findById(req.params.id)
  if(req.user.id == payment.poster){
    await Payment.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status: "Delivering" } },
      { new: true }
    )
  }else if(req.user.id == payment.buyer){
    await Payment.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status: "Received" } },
      { new: true }
    )
  }
  return res.json(payment)
})

module.exports = router;