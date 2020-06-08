import { combineReducers } from 'redux'

import userReducer from './userReducer'
import errorReducer from './errorReducer'
import productReducer from './productReducer'
import adminReducer from './adminReducer'

export default combineReducers({
  user: userReducer,
  products: productReducer,
  error: errorReducer,
  admin: adminReducer
})