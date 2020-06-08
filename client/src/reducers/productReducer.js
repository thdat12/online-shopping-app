import {
  GET_PRODUCTS,
  PRODUCTS_LOADING,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  LOAD_MORE_PRODUCTS,
  FILTER_PRODUCTS,
  SEARCH_PRODUCTS,
  PRODUCT_DETAIL,
  INCREASE_PRICE,
  DESCREASE_PRICE,
  UPDATE_PRODUCT,
  UPLOAD_PRODUCT_FAILED,

} from '../actions/types'

const initialState = {
  products: [],
  isLoading: false,
  popSize: null,
  searchTerm: '',
  detailProduct: {},
  msg: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        isLoading: false,
        popSize: action.popSize,
        detailProduct: {}
      }
    case PRODUCTS_LOADING:
      return {
        ...state,
        isLoading: true,
      }
    case ADD_PRODUCT:
      return {
        ...state,
        products: [action.payload, ...state.products],
      }
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload)
      }
    case LOAD_MORE_PRODUCTS:
      return {
        ...state,
        products: [...state.products, ...action.payload],
        popSize: action.popSize
      }
    case FILTER_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        popSize: action.popSize
      }
    case SEARCH_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        popSize: action.popSize,
        searchTerm: action.searchTerm
      }
    case PRODUCT_DETAIL:
      return {
        ...state,
        isLoading: false,
        detailProduct: action.payload
      }
    case INCREASE_PRICE:
      return {
        ...state,
        products: state.products.sort((a, b) => {
          return a.price - b.price
        })
      }
    case DESCREASE_PRICE:
      return {
        ...state,
        products: state.products.sort((a, b) => {
          return b.price - a.price
        })
      }
    case UPDATE_PRODUCT:
      return {
        ...state,
        msg: action.payload
      }
    case UPLOAD_PRODUCT_FAILED:
      return {
        ...state,
        products: [],
        isLoading: false,
        popSize: null,
        searchTerm: '',
        detailProduct: {},
        msg: ''
      }
    default:
      return state
  }
}