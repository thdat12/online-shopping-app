const express = require('express')
const multer = require('multer')

const { validatorUploadProduct } = require('../utils/validator')
const Product = require('../models/Product')
const User = require('../models/User')
const auth = require('../middlewares/check-auth')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' || ext !== '.png' || ext !== '.mp4') {
      return cb(res.status(400).end('only jpg, png, mp4 are allowed'), false)
    }
    cb(null, true)
  }
})

const upload = multer({ storage: storage }).single('file')

router.post('/uploadImage', auth, (req, res) => {
  upload(req, res, err => {
    if (err) return res.json(err)
    return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.fieldname })
  })
})

router.post('/uploadProduct', auth, async (req, res) => {
  const {title, price, quantity} = req.body
  console.log(req.body)
  const { errors, valid } = validatorUploadProduct(title, price, quantity)
  if (!valid) {
    return res.status(400).json({ errors })
  }
  try {
    const product = new Product({ ...req.body, poster: req.user.id })
    const user = await User.findOneAndUpdate(
      {'_id': req.user.id},
      {
        '$push': { 'ownProduct': product._id }
      },
      { new: true }) 
    await user.save()   
    await product.save()
    return res.json(product)
  } catch (error) {
    return res.json(error)
  }
})

router.post('/getProducts', async (req, res) => {
  try {
    let order = req.body.order ? req.body.order : "desc"
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"
    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)
    let term = req.body.searchTerm
    let findArgs = {}
    for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
        if (key === 'price') {
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1]
          }
        } else {
          findArgs[key] = req.body.filters[key]
        }
      }
    }

    if (term) {
      let newTerm = term.trim()
      const products = await Product.find(findArgs)
        .find({ title: { $regex: new RegExp(newTerm), $options: 'i' } })
        .sort([[sortBy, order]])
        .skip(skip).limit(limit)
        .populate('buyer')
        .populate('poster')
      return res.json({ products, popSize: products.length, searchTerm: term })
    } else {
      const products = await Product.find(findArgs)
        .sort([[sortBy, order]])
        .skip(skip).limit(limit)
        .populate('buyer')
        .populate('poster')
      return res.json({ products, popSize: products.length })
    }

  } catch (error) {
    return res.json({ error })
  }
})

router.delete('/:id', auth, async (req, res) => {
  req.user = auth
  try {
    const product = await Product.findById(req.params.id)
    await Product.deleteOne(product)
    return res.json({ msg: 'Remove success' })
  } catch (error) {
    return res.json({ error })
  }
})

router.get('/product_by_id', async (req, res) => {
  let type = req.query.type
  let productIds = req.query.id
  if(type === 'single'){
    await Product.findOneAndUpdate(
      { '_id': productIds },
      { $inc: { 'viewer': 1 } },
      { new: true }
    )
  }
  try {
    if (type === 'array') {
      let ids = req.query.id.split(',')
      productIds = []
      productIds = ids.map(item => {
        return item
      })
    }
    const product = await Product.find(
      { '_id': { $in: productIds } },
    )
      .populate('poster')
    return res.send(product)
  } catch (error) {
    return res.json(error)
  }
})

router.post('/update/:id', auth, async (req, res) => {
  req.user = auth
  try {
    const product = await Product.findById(req.params.id)
    if(!product) return res.json({error: "Product does not exist"})
    product.price = req.body.price
    product.quantity = req.body.quantity
    product.description = req.body.description
    product.images = req.body.images
    await product.save()
    return res.json({ msg: 'Update success' })
  } catch (error) {
    return res.json({ error })
  }
})


module.exports = router
