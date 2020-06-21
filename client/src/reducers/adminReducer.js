import { GET_PAYMENT_LIST, GET_ALL_USERS, GET_USER, DELETE_USER, DELETE_PAYMENT_ITEM, ADMIN_GET_PAYMENT_LIST_BY_ID } from '../actions/types'

const initialState = {
  userList: [],
  paymentList: [],
  userProduct: [],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PAYMENT_LIST:
      return {
        paymentList: action.payload
      }
    case GET_ALL_USERS: {
      return {
        ...state,
        userList: action.payload
      }
    }
    case GET_USER:
      return {
        ...state,
        userList: state.userList.filter(user => user._id === action.payload._id),
        userProduct: action.payload.ownProduct
      }
    case DELETE_USER: {
      return {
        ...state,
        userList: state.userList.filter(user => user._id !== action.payload)
      }
    }
    case DELETE_PAYMENT_ITEM:
      return {
        ...state,
        paymentList: state.paymentList.filter(item => item._id !== action.payload)
      }
    case ADMIN_GET_PAYMENT_LIST_BY_ID:
      return {
        ...state,
        paymentList: [action.payload]
      }
    default:
      return state
  }
}