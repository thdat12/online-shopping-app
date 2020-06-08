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
  UPLOAD_PRODUCT_FAILED
} from './types'
import axios from 'axios'
import { configToken } from './userActions'
import { returnErrors } from './errorActions'

export const getProducts = (variables) => dispatch => {
  dispatch(productsLoading())
  axios
    .post('http://localhost:5000/api/product/getProducts', variables)
    .then(res => {
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data.products,
        popSize: res.data.popSize
      })
    })
}

export const getProduct = (productId) => dispatch => {
  axios.get(`http://localhost:5000/api/product/product_by_id?id=${productId}&type=single`)
    .then(res => {
      dispatch({
        type: PRODUCT_DETAIL,
        payload: res.data[0],
      })
    })
}

export const searchProducts = (variables) => dispatch => {

  axios
    .post('http://localhost:5000/api/product/getProducts', variables)
    .then(res => {
      dispatch({
        type: SEARCH_PRODUCTS,
        payload: res.data.products,
        popSize: res.data.popSize,
        searchTerm: res.data.searchTerm
      })
    })

}

export const loadMoreProducts = (variables) => dispatch => {
  axios
    .post('http://localhost:5000/api/product/getProducts', variables)
    .then(res => {
      dispatch({
        type: LOAD_MORE_PRODUCTS,
        payload: res.data.products,
        popSize: res.data.popSize
      })
    })
}

export const filterProducts = (variables) => dispatch => {
  axios
    .post('http://localhost:5000/api/product/getProducts', variables)
    .then(res => {
      dispatch({
        type: FILTER_PRODUCTS,
        payload: res.data.products,
        popSize: res.data.popSize
      })
    })
}

export const productsLoading = () => {
  return {
    type: PRODUCTS_LOADING
  }
}

export const addProduct = (varibles) => (dispatch, getState) => {
  const config = configToken(getState)
  axios
    .post('http://localhost:5000/api/product/uploadProduct', varibles, config)
    .then(res => {
      dispatch({
        type: ADD_PRODUCT,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'UPLOAD_PRODUCT_FAIL'))
      dispatch({
        type: UPLOAD_PRODUCT_FAILED
      })
    })
}

export const deleteProduct = id => (dispatch, getState) => {
  const config = configToken(getState)
  axios
    .delete(`http://localhost:5000/api/product/${id}`, config)
    .then(res => {
      dispatch({
        type: DELETE_PRODUCT,
        payload: id
      })
    })
}

export const increasePrice = () => {
  return {
    type: INCREASE_PRICE
  }
}

export const descreasePrice = () => {
  return {
    type: DESCREASE_PRICE
  }
}

export const updateProduct = (id, values) => (dispatch, getState) => {
  const config = configToken(getState)
  axios
    .post(`http://localhost:5000/api/product/update/${id}`, values, config)
    .then(res => {
      dispatch({
        type: UPDATE_PRODUCT,
        payload: res.data
      })
    })
}
