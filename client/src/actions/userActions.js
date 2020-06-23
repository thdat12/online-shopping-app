import axios from 'axios'
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT_SUCESS,
  ADD_TO_CART,
  GET_CART_ITEMS,
  REMOVE_ITEM_FROM_CART,
  GET_ALL_USERS,
  DELETE_USER,
  USER_DETAIL,
  GET_OWN_PRODUCTS,
  GET_USER,
  PAYMENT,
  GET_HISTORY,
  GET_PAYMENT_LIST,
  UPDATE_USER_INFOR,
  DECREASE_PRODUCT_QUANTITY,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  DELETE_PAYMENT_ITEM,
  CLEAR_ERRORS,
  GET_OWN_PAYMENT_LIST,
  GET_PAYMENT_LIST_BY_ID,
  ADMIN_GET_PAYMENT_LIST_BY_ID,
  UPDATE_STATUS_PAYMENT,
  UPDATE_USER_FAIL
} from './types'
import { returnErrors } from './errorActions'

// admin get all user

export const getAllUsers = () => (dispatch, getState) => {
  const config = configToken(getState)
  axios.get('http://localhost:5000/api/user/allUsers', config)
    .then(res => {
      dispatch({
        type: GET_ALL_USERS,
        payload: res.data
      })
    })
}

// admin delete user 

export const deleteUser = id => (dispatch, getState) => {
  const config = configToken(getState)
  axios.delete(`http://localhost:5000/api/user/${id}`, config)
    .then(res => {
      dispatch({
        type: DELETE_USER,
        payload: id
      })
    })
}

// admin get payment list
export const getPaymentList = () => (dispatch, getState) => {
  const config = configToken(getState)
  axios.get('http://localhost:5000/api/payment', config)
    .then(res => {
      dispatch({
        type: GET_PAYMENT_LIST,
        payload: res.data
      })
    })
}

export const deletePaymentItem = (id) => (dispatch, getState) => {
  const config = configToken(getState)
  axios.delete(`http://localhost:5000/api/payment/${id}`, config)
    .then(res => {
      dispatch({
        type: DELETE_PAYMENT_ITEM,
        payload: id
      })
    })
}

// load user when render page

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING })
  const token = getState().user.token
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (token) {
    config.headers['Authorization'] = token
  }
  axios
    .get('http://localhost:5000/api/user', config)
    .then(res => dispatch({
      type: USER_LOADED,
      payload: res.data.user
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status))
      dispatch({ type: AUTH_ERROR })
    })
}

// register action

export const register = ({ firstName, lastName, email, phone, password, confirmPassword }) => dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  }

  const body = JSON.stringify({ firstName, lastName, email, phone, password, confirmPassword })
  axios
    .post('http://localhost:5000/api/user/register', body, config)
    .then(res => dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
      dispatch({
        type: REGISTER_FAIL
      })
    })
}

// login action

export const login = ({ email, password }) => dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password })

  axios
    .post('http://localhost:5000/api/user/login', body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    }
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'))
      dispatch({
        type: LOGIN_FAIL
      })
    })
}

// logout action

export const logout = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS })
  dispatch({ type: LOGOUT_SUCESS })
}

// add product to cart

export const addToCart = (id) => (dispatch, getState) => {
  const config = configToken(getState)
  axios
    .get(`http://localhost:5000/api/user/addToCart?productId=${id}`, config)
    .then(res => {
      dispatch({
        type: ADD_TO_CART,
        payload: res.data
      })
    })
}

// get all product from cart

export const getCartItems = (cartItems, userCart) => dispatch => {
  axios.get(`http://localhost:5000/api/product/product_by_id?id=${cartItems}&type=array`)
    .then(res => {
      userCart.forEach(cartItem => {
        res.data.forEach((productDetail, i) => {
          if (cartItem.id === productDetail._id) {
            res.data[i].quantity = cartItem.quantity
            return res.data
          }
        })
      })
      dispatch({
        type: GET_CART_ITEMS,
        payload: res.data
      })
    })
}

// payment action

export const payment = (userCart, data) => (dispatch, getState) => {
  const config = configToken(getState)
  const dataForPayment = {
    userCart,
    data
  }
  const body = JSON.stringify(dataForPayment)
  axios.post(`http://localhost:5000/api/user/payment`, body, config)
    .then(res => {
      console.log(res.data)
      dispatch({
        type: PAYMENT,
        payload: res.data
      })
    })
}

// remove product from cart

export const removeCartItem = (id) => (dispatch, getState) => {
  const config = configToken(getState)
  axios.get(`http://localhost:5000/api/user/removeFromCart?_id=${id}`, config)
    .then(res => {
      res.data.cart.forEach(product => {
        res.data.cartDetail.forEach((k, i) => {
          if (product.id === k._id) {
            res.data.cartDetail[i].quantity = product.quantity
          }
        })
        return res.data
      })
      dispatch({
        type: REMOVE_ITEM_FROM_CART,
        payload: res.data
      })
    })
}

// review user information

export const userDetail = () => {
  return {
    type: USER_DETAIL
  }
}

// get user by id

export const getUser = (id) => (dispatch, getState) => {
  const config = configToken(getState)
  axios
    .get(`http://localhost:5000/api/user/${id}`, config)
    .then(res => {
      console.log(res.data)
      dispatch({
        type: GET_USER,
        payload: res.data
      })
    })
}

export const updateUserInfor = ({ firstName, lastName, phone }) => (dispatch, getState) => {
  const config = configToken(getState)
  const body = JSON.stringify({ firstName, lastName, phone })
  axios
    .post(`http://localhost:5000/api/user/update`, body, config)
    .then(res => {
      dispatch({
        type: UPDATE_USER_INFOR,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_USER_FAIL'))
      dispatch({
        type: UPDATE_USER_FAIL
      })
    })
}

// get your products

export const getOwnProducts = () => (dispatch, getState) => {
  const config = configToken(getState)
  axios.get(`http://localhost:5000/api/user/ownProducts`, config)
    .then(res => {
      dispatch({
        type: GET_OWN_PRODUCTS,
        payload: res.data.ownProduct
      })
    })
}

// Review Product is bought

export const getHistory = () => (dispatch, getState) => {
  const config = configToken(getState)
  axios.get(`http://localhost:5000/api/user/history`, config)
    .then(res => {
      dispatch({
        type: GET_HISTORY,
        payload: res.data
      })
    })
}

export const getOwnPaymentList = () => (dispatch, getState) => {
  const config = configToken(getState)
  axios.get(`http://localhost:5000/api/user/paymentList`, config)
    .then(res => {
      dispatch({
        type: GET_OWN_PAYMENT_LIST,
        payload: res.data
      }
      )
    })
}

export const decreaseProductQuantity = (id) => (dispatch, getState) => {
  const token = getState().user.token
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (token) {
    config.headers['Authorization'] = token
  }
  axios
    .get(`http://localhost:5000/api/user/cart/decreaseProduct?productId=${id}`, config)
    .then(res => {
      dispatch({
        type: DECREASE_PRODUCT_QUANTITY,
        payload: res.data
      })
    })
}

export const forgotPassword = (values) => dispatch => {
  axios
    .post(`http://localhost:5000/api/user/forgot`, values)
    .then(res => {
      dispatch({
        type: FORGOT_PASSWORD,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'FORGOT_PASSWORD_FAIL'))
    })
}

export const resetPassword = (values, token) => dispatch => {
  axios
    .post(`http://localhost:5000/api/user/reset/${token}`, values)
    .then(res => {
      dispatch({
        type: RESET_PASSWORD,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'FORGOT_PASSWORD_FAIL'))
    })
}

export const getPaymentListById = (id) => (dispatch, getState) => {
  const config = configToken(getState)
  axios
    .get(`http://localhost:5000/api/payment/${id}`, config)
    .then(res => {
      console.log(res.data)
      dispatch({
        type: GET_PAYMENT_LIST_BY_ID,
        payload: res.data
      })
    })
}

export const adminGetPaymentListById = (id) => (dispatch, getState) => {
  const config = configToken(getState)
  axios
    .get(`http://localhost:5000/api/payment/${id}`, config)
    .then(res => {
      dispatch({
        type: ADMIN_GET_PAYMENT_LIST_BY_ID,
        payload: res.data
      })
    })
}

export const updateStatusPayment = id => (dispatch, getState) => {
  const config = configToken(getState)
  axios
    .get(`http://localhost:5000/api/payment/updateStatus/${id}`, config)
    .then(res => {
      dispatch({
        type: UPDATE_STATUS_PAYMENT,
        payload: res.data
      })
    }
    )
}

export const configToken = (getState) => {
  const token = getState().user.token
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}