const express = require('express')
const mongoose = require('mongoose')

const { DB } = require('./config')
const userRouter = require('./routes/user')
const productRouter = require('./routes/product')
const paymentRouter = require('./routes/payment')

const app = express()

app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE ,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/payment', paymentRouter)

mongoose.connect(DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => console.log('Connected MongoDB'))
  .catch(err => console.log(err))

app.listen(5000, () => console.log('Listenning...'))
