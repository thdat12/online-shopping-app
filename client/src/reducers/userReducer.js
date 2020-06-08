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
  USER_DETAIL,
  GET_OWN_PRODUCTS,
  PAYMENT,
  GET_HISTORY,
  UPDATE_USER_INFOR,
  DECREASE_PRODUCT_QUANTITY,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  GET_OWN_PAYMENT_LIST
} from '../actions/types'

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  cartDetail: [],
  isAuthenticated: false,
  isLoading: false,
  history: [],
  paymentList: [],
  ownProduct: [],
  msg: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      }
    case USER_LOADED:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      }
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('isAdmin', action.payload.user.isAdmin)
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        initialState: false
      }
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOGOUT_SUCESS:
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        cartDetail: [],
        dashboard: []
      }
    case ADD_TO_CART:
      return {
        ...state,
        user: {
          ...state.user,
          cart: action.payload
        }
      }
    case GET_CART_ITEMS:
      return {
        ...state, cartDetail: action.payload
      }
    case REMOVE_ITEM_FROM_CART:
      return {
        ...state,
        cartDetail: action.payload.cartDetail,
        user: {
          ...state.user,
          cart: action.payload.cart
        }
      }
    case USER_DETAIL: {
      return {
        ...state
      }
    }
    case GET_OWN_PRODUCTS:
      return {
        ...state,
        ownProduct: action.payload
      }
    case PAYMENT:
      return {
        ...state,
        cartDetail: [],
        user: { ...state.user, cart: [] }
      }
    case GET_HISTORY:
      return {
        ...state,
        history: action.payload,
        user: { ...state.user, history: action.payload }
      }
    case UPDATE_USER_INFOR:
      return {
        ...state,
        msg: action.payload
      }
    case DECREASE_PRODUCT_QUANTITY:
      return {
        ...state,
        user: {
          ...state.user,
          cart: action.payload
        }
      }
    case FORGOT_PASSWORD:
      return {
        ...state,
        msg: action.payload
      }
    case RESET_PASSWORD:
      return {
        ...state,
        msg: action.payload
      }
    case GET_OWN_PAYMENT_LIST:
      return{
        ...state,
        paymentList: action.payload,
        user: { ...state.user, paymentList: action.payload }
      }  
    default:
      return state
  }
}