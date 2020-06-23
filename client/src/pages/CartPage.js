import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Image, Message, Icon, Button, Modal, Form, Table, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { getCartItems, removeCartItem, payment, addToCart, decreaseProductQuantity } from '../actions/userActions'

const CartPage = props => {
  const { cartDetail } = props.user
  const [Total, setTotal] = useState(0)
  const [ShowTotal, setShowTotal] = useState(false)
  const [ShowSuccess, setShowSuccess] = useState(false)

  // data about user payment
  const [data, setData] = useState({
    receiver: '',
    location: '',
    phoneNumber: '',
    totalPrice: 0
  })
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)

  const onChange = event => {
    setData({ ...data, [event.target.name]: event.target.value })
  }
  // Calculate total price of all product

  const calculateTotal = (cartDetail) => {
    let total = 0;
    cartDetail.map(item => {
      total += parseInt(item.price, 10) * item.quantity
    });
    setTotal(total)
    setShowTotal(true)
  }
  useEffect(() => {
    if (props.user.cartDetail && props.user.cartDetail.length > 0) {
      calculateTotal(props.user.cartDetail)
    }
  }, [props.user.cartDetail])

  useEffect(() => {
    let cartItem = []
    if (props.user.user && props.user.user.cart) {
      if (props.user.user.cart.length > 0) {
        props.user.user.cart.forEach(item => {
          cartItem.push(item.id)
        })
        props.getCartItems(cartItem, props.user.user.cart)
      }
    }
  }, [props.user.user])
  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0]
      return `http://localhost:5000/${image}`
    }
  }
  const onRemoveCartItem = (id) => {
    props.removeCartItem(id)
  }
  const onPayment = event => {
    event.preventDefault()
    data.totalPrice = Total
    console.log(data)
    props.payment(cartDetail, data)
    setShowSuccess(true)
    toggle()
  }
  const onDecreaseQuantity = (productId) => {
    props.decreaseProductQuantity(productId)
  }
  const onIncreaseQuantity = (productId) => {
    props.addToCart(productId)
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return (
    <Container>
      {
        cartDetail.length > 0 ? (
          <div>
            <Table color='teal' key='teal'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Image</Table.HeaderCell>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>Unit Price</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Remove</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  cartDetail.map(product => (
                    <tr key={product._id}>
                      <Table.Cell>
                        <Link to={`/product/product_by_id/${product._id}`}>
                          <Image src={renderCartImage(product.images)}
                            style={{ width: '70px' }} alt="product"
                            className='card-image'
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{product.title}</Table.Cell>
                      <Table.Cell>
                        {
                          (product.quantity > 1) ? (

                            <Button onClick={onDecreaseQuantity.bind(this, product._id)}
                              style={{ zoom: '70%' }}
                              icon>
                              <Icon name='minus' />
                            </Button>
                          ) : (

                              <Button onClick={onDecreaseQuantity.bind(this, product._id)}
                                style={{ zoom: '70%' }}
                                icon
                                disabled>
                                <Icon name='minus' />
                              </Button>
                            )
                        }
                        {product.quantity}
                        <Button onClick={onIncreaseQuantity.bind(this, product._id)}
                          style={{
                            zoom: '70%',
                            marginLeft: '5px'
                          }}
                          icon>
                          <Icon name='plus' />
                        </Button>
                      </Table.Cell>
                      <Table.Cell>{formatter.format(product.price)} </Table.Cell>
                      <Table.Cell>{formatter.format(product.price*product.quantity)} </Table.Cell>
                      <Table.Cell>
                        <Button onClick={onRemoveCartItem.bind(this, product._id)}
                          icon
                          color='red'
                        ><Icon name='trash' /></Button>
                      </Table.Cell>
                    </tr>
                  )
                  )
                }
              </Table.Body>
            </Table>
            {
              ShowTotal ? <h1>Total: {formatter.format(Total)}</h1> : <div></div>
            }
            <Button
              color='teal'
              style={{
                textAlign: 'center',
                width: '30%',
                marginLeft: '35%'
              }}
              className='btn-payment'
              onClick={toggle}
            ><h2><Icon name='credit card outline' />Payment</h2></Button>
            <Modal as={Form} onSubmit={onPayment} open={open} size="tiny">
              <Modal.Header>Delivery Information</Modal.Header>
              <Modal.Content>
                <Form.Input
                  fluid
                  name='receiver'
                  label='Receiver'
                  placeholder='Receiver'
                  value={data.receiver}
                  onChange={onChange}
                />
                <Form.Input
                  fluid
                  name='location'
                  label='Location'
                  placeholder='Location'
                  value={data.location}
                  onChange={onChange}
                  required
                />
                <Form.Input
                  fluid
                  name='phoneNumber'
                  label='Phone Number'
                  placeholder='Phone Number'
                  value={data.phoneNumber}
                  onChange={onChange}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button type="submit" color="green" icon="credit card outline" content="Payment" />
                <Button type="submit" color="red" icon="close" content="Close" onClick={toggle} />
              </Modal.Actions>
            </Modal>
          </div>
        ) : (<h1>No Product</h1>)
      }
      {
        ShowSuccess && (
          <div>
            <Message color='green' style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              marginTop: '1rem',
              marginLeft: '25%',
              textAlign: 'center',
              width: '50%'
            }}>
              <Icon name='check circle' style={{
                marginRight: '2rem',
                color: 'green'
              }} />
        Pay Successfully
        </Message>
          </div>
        )
      }
    </Container>
  )
}
const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps,
  {
    getCartItems, removeCartItem,
    payment,
    addToCart,
    decreaseProductQuantity
  })(CartPage)