const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

const User = require('../models/User')
const Product = require('../models/Product')
const Payment = require('../models/Payment')
const { SECRET_KEY, GMAIL, GMPW } = require('../config')
const auth = require('../middlewares/check-auth')
const { validatorLogin, validatorRegister, validatorUpdateUserInfor } = require('../utils/validator')

const router = express.Router()

// Log in Section
router.post('/login', async (req, res) => {
  // Check user input data
  const { email, password } = req.body
  const { valid, errors } = validatorLogin(email, password)
  if (!valid) {
    return res.status(400).json({ errors })
  }
  // Check user exist
  const user = await User.findOne({ email })
  if (!user) {
    errors.email = 'User does not exist'
    return res.status(400).json({ errors })
  }
  // compare password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    errors.password = 'Wrong credential, password is incorrect'
    return res.status(400).json({ errors })
  }
  // login succeessfully, take token
  const token = jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role
  }, SECRET_KEY, { expiresIn: '1h' })

  return res.status(200).json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      cart: user.cart,
      isAdmin: user.role === 0 ? false : true,
      ownProduct: user.ownProduct,
      history: user.history
    }
  })
})

// Register section

router.post('/register', async (req, res) => {
  // Check user input data
  const { firstName, lastName, email, phone, password, confirmPassword, role } = req.body
  const { valid, errors } = validatorRegister(firstName, lastName, email, phone, password, confirmPassword)
  if (!valid) {
    return res.status(400).json({ errors })
  };
  // Check user exsit
  const user = await User.findOne({ email })
  if (user) {
    errors.email = 'This email is taken'
    return res.status(400).json({ errors })
  }
  // create user
  const hashedPassword = await bcrypt.hash(password, 12)
  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    confirmPassword: hashedPassword,
    role: role || 0,
  })
  await newUser.save()

  const token = jwt.sign({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role
  }, SECRET_KEY, { expiresIn: '1h' })

  return res.status(200).json({
    token,
    user: {
      _id: newUser._id,
      email: newUser.email,
      phone: newUser.phone,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      cart: newUser.cart,
      isAdmin: newUser.role === 0 ? false : true,
      ownProduct: newUser.ownProduct,
      history: newUser.history
    }
  })
})

// Get user's information

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password -confirmPassword')
    .populate('history')
    .populate('ownProduct')
    .populate('paymentList')
  return res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      cart: user.cart,
      isAdmin: user.role === 0 ? false : true,
      ownProduct: user.ownProduct,
      history: user.history,
      paymentList: user.paymentList
    }
  })
})

// Add to cart section

router.get('/addToCart', auth, async (req, res) => {
  let duplicate = false
  const user = await User.findOne({ _id: req.user.id })
  if (user) {
    user.cart.forEach(cartInfo => {
      if (cartInfo.id === req.query.productId) {
        duplicate = true
      }
    })
  }

  if (duplicate) {
    const userInfor = await User.findOneAndUpdate(
      { _id: req.user.id, "cart.id": req.query.productId },
      { $inc: { 'cart.$.quantity': 1 } },
      { new: true }
    )
    return res.json(userInfor.cart)
  } else {
    const userInfor = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $push: {
          cart: {
            id: req.query.productId,
            quantity: 1,
            date: Date.now()
          }
        }
      },
      { new: true }
    )
    return res.json(userInfor.cart)
  }
})

// remove product from cart

router.get('/removeFromCart', auth, async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      '$pull':
        { 'cart': { 'id': req.query._id } }
    },
    { new: true },
  )
  await user.save()
  let cart = user.cart
  let array = cart.map(product => product.id)
  const cartDetail = await Product.find({ '_id': { $in: array } }).populate('poster')
  return res.status(200).json({
    cartDetail: cartDetail,
    cart: cart
  })
})

// get Own Product

router.get('/ownProducts', auth, async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('ownProduct')
  return res.json(user)
})

//@ Get product is bought
router.get('/history', auth, async (req, res) => {
  const user = await User.findById(req.user.id)
  const history = await Payment.find({ '_id': { $in: user.history } },).sort({ createAt: -1 }).populate('poster').populate('buyer').populate('products')
  return res.json(history)
})

// Pay ment section

router.post('/payment', auth, async (req, res) => {
  let history = []
  let itemIsBuy = []
  let products = []
  req.body.userCart.forEach(item => {
    itemIsBuy.push(item._id)
  }
  )
  const product = await Product.findOneAndUpdate(
    { _id: { $in: itemIsBuy } },
    { $push: { buyer: req.user.id } },
    { new: true }
  )
  await product.save()
  // req.body.userCart.forEach((item) => {
  //   history.push(item._id)
  // })
  req.body.userCart.forEach(item => products.push(item._id))
  const payment = new Payment({
    poster: product.poster,
    buyer: req.user.id,
    products: products,
    data: req.body.data
  })
  await payment.save()
  // moi vua sua o day ne //
  history.push(payment._id)
  /////////////////////////

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $push: { history: history }, $set: { cart: [] } },
    { new: true },
  )
  await user.save()
  const poster = await User.findByIdAndUpdate(
    { _id: product.poster },
    { $push: { paymentList: payment._id } },
    { new: true }
  )
  await poster.save()
  return res.json(user)
})

router.post('/update', auth, async (req, res) => {
  const { firstName, lastName, phone } = req.body
  const { valid, errors } = validatorUpdateUserInfor(firstName, lastName, phone)
  if (!valid) {
    return res.status(400).json({ errors })
  }
  const user = await User.findById(req.user.id)
  if (!user) {
    return res.json({ error: 'User does not exist' })
  }
  user.firstName = firstName
  user.lastName = lastName
  user.phone = phone
  await user.save()
  return res.json({ msg: 'Update success', user })
})

// forgot password

router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          return res.json({ error: 'User does not exsit' })
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: GMAIL,
          pass: GMPW
        }
      });
      const mailOptions = {
        to: user.email,
        from: GMAIL,
        subject: 'Password Reset',
        text:
          'This email is valid for 1 hour\n\n' +
          'Please click on the following link to reset your password\n\n' +
          'http://localhost:3000/user/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
          return res.json({ error: 'Send mail failed' })
        }
        return res.json({ msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' })
      });
    }
  ], function (err) {
    if (err) return next(err);
  });
});

//reset password

router.post('/reset/:token', async (req, res) => {
  const { password, confirm } = req.body
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) {

    return res.json({ error: 'User does not exist' })
  }
  if (password === confirm) {
    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    return res.json({ msg: 'Reset password success' })
  }
});

// decreaseProduct in user's cart

router.get('/cart/decreaseProduct', auth, async (req, res) => {
  console.log(req.query.productId)
  let duplicate = false
  const user = await User.findOne({ _id: req.user.id })
  if (user) {
    user.cart.forEach(cartInfo => {
      if (cartInfo.id === req.query.productId) {
        duplicate = true
      }
    })
  }

  if (duplicate) {
    const userInfor = await User.findOneAndUpdate(
      { _id: req.user.id, "cart.id": req.query.productId },
      { $inc: { 'cart.$.quantity': -1 } },
      { new: true }
    )
    return res.json(userInfor.cart)
  }
})

// get own payment list
router.get('/paymentList', auth, async (req, res) => {
  const user = await User.findById(req.user.id)
  const paymentList = await Payment.find({ '_id': { $in: user.paymentList } },).sort({ createAt: -1 }).populate('poster').populate('buyer').populate('products')
  return res.json(paymentList)
})

/////////////////////
/// ADMIN SECTION ///
/////////////////////


//@ GET ALL 

router.get('/allUsers', auth, async (req, res) => {
  const isAdmin = req.user.role === 0 ? false : true
  if (isAdmin) {
    const allUsers = await User.find()
    return res.json(allUsers)
  } else {
    return res.json({ msg: 'You are not admin' })
  }
})

//@ DELETE USER 

router.delete('/:id', auth, async (req, res) => {
  const role = req.user.role
  try {
    if (role) {
      const user = await User.findById(req.params.id)
      await User.deleteOne(user)
    }
    return res.json({ msg: 'Remove success' })
  } catch (error) {
    return res.json({ error })
  }
})

//@ FIND USER by Id

router.get('/:id', auth, async (req, res) => {
  const role = req.user.role
  try {
    if (role) {
      const user = await User.findById(req.params.id).populate('ownProduct')
      return res.json(user)
    }
  } catch (error) {
    return res.json(error)
  }
})

module.exports = router