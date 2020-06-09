import React, { useState, useEffect } from 'react'
import { Form, Container, Button, Message } from 'semantic-ui-react'
import { updateProduct, getProduct } from '../actions/productActions'
import { connect } from 'react-redux'
import FileUpload from '../components/FileUpload'

const UpdateProductPage = props => {
  const [images, setImages] = useState([])
  const updateImages = newImages => {
    setImages(images.concat(newImages))
  }
  const productId = window.location.pathname.substr(16)
  const [values, setValues] = useState({
    title: '',
    price: 0,
    description: '',
    quantity: 1,
  })
  const { detailProduct, msg } = props.products
  const { user } = props.user
  useEffect(() => {
    props.getProduct(productId)
  }, [])
  useEffect(() => {
    if (detailProduct) {
      setValues({
        title: detailProduct.title,
        price: detailProduct.price,
        description: detailProduct.description,
        quantity: detailProduct.quantity,
      })
      setImages(
        detailProduct.images
      )
    }
  }, [detailProduct.images])
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const onSubmit = event => {
    event.preventDefault()
    const varibles = {
      title: values.title,
      price: values.price,
      description: values.description,
      images: images,
      quantity: values.quantity
    }
    props.updateProduct(productId, varibles)
  }
  const onDelete = image => {
    const currentImage = images.indexOf(image)
    let newImage = [...images]
    newImage.splice(currentImage, 1)
    setImages(newImage)
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
            value={values.title}
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
            onChange={onChange}
          />
          
          <div style={{
            display: 'flex',
            maxWidth: '400px',
            width: '350px',
            height: '240px',
            overflowY: 'scroll',
            border: '1px solid teal'
          }}>

            {images && images.map((image, index) => (
              <div
                onClick={() => onDelete(image)}
                key={index}
              >
                <img src={`http://localhost:5000/${image.split('\\').join('/')}`} alt={`${image}`}
                  style={{
                    minWidth: '300px',
                    width: '300px',
                    height: '240px'
                  }}
                />

              </div>
            ))}
          </div>
          <FileUpload refreshFuntion={updateImages} />
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