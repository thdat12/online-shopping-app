import React, { useState } from 'react'
import { addProduct } from '../actions/productActions'

import { connect } from 'react-redux'
import { Form, Button, Container, Segment, Message } from 'semantic-ui-react'

import FileUpload from '../components/FileUpload'
import { clearErrors } from '../actions/errorActions'
const types = [
  { key: 1, value: 1, text: 'Phone' },
  { key: 2, value: 2, text: 'Laptop' },
  { key: 3, value: 3, text: 'Ipad' },
  { key: 4, value: 4, text: 'Camera' },
  { key: 5, value: 5, text: 'Book' },
  { key: 6, value: 6, text: 'TV' },
  { key: 7, value: 7, text: 'Others' }
]

const UploadProduct = props => {
  const [values, setValues] = useState({
    title: '',
    price: 0,
    description: '',
    type: "1",
    quantity: 1
  })
  const { errors } = props.error.msg
  const [images, setImages] = useState([])
  const updateImages = newImages => {
    setImages(newImages)
  }
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const onSubmit = event => {
    event.preventDefault()
    const varibles = {
      title: values.title,
      price: values.price,
      description: values.description,
      type: values.type,
      images: images,
      quantity: values.quantity
    }
    try {
      props.addProduct(varibles)
      props.clearErrors()
      props.history.push('/')
    } catch (error) {
      alert('Fail to add Product')
    }
  }
  return (
    <Container>
      {
        errors && (
          Object.keys(errors).length > 0 && (
            <Message negative
              list={Object.values(errors).map((value) => (
                <Message negative key={value}>{value}</Message>
              ))}
            >
            </Message>
          )
        )
      }
      <Segment>
        <Form onSubmit={onSubmit}>
          <Form.Input
            name='title'
            label='Title'
            type='text'
            placeholder='Enter your Title'
            value={values.title}
            onChange={onChange}
          />
          <Form.Group widths='equal'>
            <Form.Input
              name='price'
              label='Price'
              type='number'
              placeholder='Enter your Price'
              value={values.price}
              onChange={onChange}
            />
            <Form.Input
              name='quantity'
              label='Quantity'
              type='number'
              placeholder='Enter your Quantity'
              value={values.quantity}
              onChange={onChange}
            />
            <Form.Field
              label='Type'
              name='type'
              type='number'
              control='select'
              onChange={onChange}
            >
              {
                types.map(type => (
                  <option key={type.key} value={type.key}>{type.text}</option>
                ))
              }
            </Form.Field>
          </Form.Group>
          <Form.TextArea
            name='description'
            label='Description'
            type='textarea'
            placeholder='Enter your Description'
            value={values.description}
            onChange={onChange}
          />
          <FileUpload refreshFuntion={updateImages} />
          <Button
            color='teal'
            style={{
              marginTop: '1rem',
              marginBottom: '1rem'
            }}
          >Submit</Button>
        </Form>
      </Segment>
    </Container>
  )
}

const mapPropsToState = state => ({
  user: state.user,
  products: state.products,
  error: state.error
})

export default connect(mapPropsToState, { addProduct, clearErrors })(UploadProduct)