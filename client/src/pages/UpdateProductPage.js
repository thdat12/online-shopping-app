import React, { useState, useEffect } from 'react'
import { Form, Container, Button, Message } from 'semantic-ui-react'
import { updateProduct, getProduct } from '../actions/productActions'
import { connect } from 'react-redux'
const UpdateProductPage = props => {
  const productId = window.location.pathname.substr(16)
  const [values, setValues] = useState({
    price: 0,
    description: '',
    quantity: 1
  })
  const { detailProduct, msg } = props.products
  const { user } = props.user
  useEffect(() => {
    props.getProduct(productId)
  }, [])
  useEffect(() => {
    if (detailProduct) {
      setValues({
        price: detailProduct.price,
        description: detailProduct.description,
        quantity: detailProduct.quantity,
      })
    }
  }, [detailProduct])
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const onSubmit = event => {
    event.preventDefault()
    props.updateProduct(productId, values)
  }
  return (
    <Container>
      {msg && (
        <Message success>{msg.msg}</Message>
      )}
      {(detailProduct.poster && user) && detailProduct.poster._id === user._id && (
        <Form onSubmit={onSubmit}>
          <Form.Input
            name='title'
            label='Tile'
            type='text'
            value={detailProduct.title}
            readOnly
          />
          <Form.Input
            name='price'
            label='Price'
            type='number'
            value={values.price}
            onChange={onChange}
          />
          <Form.Input
            name='quantity'
            label='Quantity'
            type='number'
            value={values.quantity}
            onChange={onChange}
          />
          <Form.TextArea
            name='description'
            label='Description'
            type='textarea'
            value={values.description}
            readOnly
          />
          <div style={{
            display: 'flex',
            width: '400px',
            height: '300px',
            overflowY: 'scroll',

          }}>
            {detailProduct.images.map((image, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid teal',
                  margin: '10px'
                }}
              >
                <img src={`http://localhost:5000/${image.split('\\').join('/')}`} alt={`${image}`}
                  style={{
                    minWidth: '300px',
                    width: '300px',
                    height: '240px',

                  }}
                />
              </div>
            ))}
          </div>
          <Button color='teal' floated='right'>Update</Button>
        </Form>
      )
      }
    </Container >
  )
}

const mapStateToProps = state => ({
  products: state.products,
  user: state.user
})

export default connect(mapStateToProps, { updateProduct, getProduct })(UpdateProductPage)