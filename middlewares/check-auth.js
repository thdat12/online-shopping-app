const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')

function auth (req, res, next) {
  const token = req.header('Authorization')
  if (!token) return res.status(401).json({ msg: 'No token' })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token no valid' })
  }
}

module.exports = auth
