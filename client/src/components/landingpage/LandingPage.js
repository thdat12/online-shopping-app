import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import {
  getProducts,
  deleteProduct,
  loadMoreProducts,
  filterProducts,
  searchProducts,
  increasePrice,
  descreasePrice
} from '../../actions/productActions'
import {
  addToCart, loadUser
} from '../../actions/userActions'
import CheckBox from './CheckBox'
import RadioBox from './RadioBox'
import { price } from './Data'

import {
  Card,
  Button,
  Image,
  Container,
  Grid,
  Icon,
  Segment,
  Message
} from 'semantic-ui-react'

const LandingPage = props => {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)

  const { products, popSize } = props.products
  const { user } = props.user
  const { errors } = props.error.msg

  const [Skip, setSkip] = useState(0)
  const [Limit, setLimit] = useState(8)
  const [Filters, setFilters] = useState([])
  const [SearchTerm, setSearchTerm] = useState('')

  // Render image product
  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0]
      return `http://localhost:5000/${image}`
    }
  }

  // Get all products when this page render
  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit
    }
    props.getProducts(variables)
  }, [])

  // Filter product

  const showFilteredResults = (filters) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: filters
    }
    props.filterProducts(variables)
    setSkip(0)
  }
  const hanldePrice = (value) => {
    const data = price
    let array = []
    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array
      }
    }
    return array
  }

  const handleFilters = (filters, category) => {
    const newFilter = { ...Filters }
    newFilter[category] = filters
    if (category === 'price') {
      let priceValue = hanldePrice(filters)
      newFilter[category] = priceValue
    }
    showFilteredResults(newFilter)
    setFilters(newFilter)
  }
  // const updatedSearchTerms = (newSearchTerm) => {
  //   const variables = {
  //     skip: 0,
  //     limit: Limit,
  //     searchTerm: newSearchTerm
  //   }
  //   setSkip(0)
  //   setSearchTerm(newSearchTerm.trim())
  //   props.searchProducts(variables)
  // }

  // onClick funtion

  const onClickDelete = (id) => {
    const confirm = window.confirm("Delete your product?")
    if (confirm) {
      props.deleteProduct(id)
    }
    toggle()
  }
  const onAddToCart = id => {
    try {
      props.addToCart(id)
      alert('Add product successfully')
    } catch{
      alert('Add product fail')
    }
  }
  const onLoadMore = () => {
    let skip = Skip + Limit
    let variables = {
      skip,
      limit: Limit,
      filters: Filters
    }
    setSkip(skip)
    props.loadMoreProducts(variables)
  }

  return (
    <div>
      {errors && (errors.title || errors.price || errors.quantity) && (
        <Redirect to='/product/upload' />
      )}
      {products ? (
        <Container>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <CheckBox handleFilters={filters => handleFilters(filters, 'type')} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column >
                <Segment>
                  <RadioBox handleFilters={filters => handleFilters(filters, 'price')} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          {/* Infor about product section */}
          <Card.Group itemsPerRow={4}>
            {
              products.map((product, index) => (
                <Card key={index} color='teal'>
                  <Link
                    to={`product/product_by_id/${product._id}`}
                  >
                    <Image src={renderCartImage(product.images)}
                      style={{
                        width: '120',
                        height: '150px',
                        margin: 'auto',
                        marginTop: '20px'
                      }}
                      className='product-card-image'
                    >
                    </Image>
                  </Link>
                  {
                    user ?
                      (user.isAdmin ?
                        <Card.Content
                          style={{
                            position: 'absolute',
                            padding: '0px',
                            width: '100%'
                          }}
                        >
                          <Button
                            onClick={onClickDelete.bind(this, product._id)}
                            color='red'
                            style={{
                              width: '20%',
                              float: 'right',
                              padding: '10px 0px 10px 0px',
                              margin: '0px'
                            }}
                            className='product-card-btn-delete'
                          ><Icon name='delete'
                            style={{
                              padding: '0px',
                              margin: '0px'
                            }} />
                          </Button>
                        </Card.Content>
                        : (product.poster === user._id && (
                          <Card.Content
                            style={{
                              position: 'absolute',
                              padding: '0px',
                              width: '100%'
                            }}
                          >
                            <Button onClick={onClickDelete.bind(this, product._id)}
                              color='red'
                              style={{
                                width: '20%',
                                float: 'right',
                                padding: '10px 0px 10px 0px',
                                margin: '0px'
                              }}
                              className='product-card-btn-delete'
                            ><Icon name='delete'
                              style={{
                                padding: '0px',
                                margin: '0px'
                              }}
                              /></Button>
                          </Card.Content>
                        )))
                      : (<div></div>)
                  }
                  <Card.Content >
                    <Card.Header
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '180px',
                        display: 'block',
                        wordWrap: 'break-word'
                      }}
                    >{product.title}</Card.Header>
                    <Card.Description
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '150px',
                        display: 'block',
                        wordWrap: 'break-word'
                      }}
                      className='product-card-description'
                    >{product.description}</Card.Description>
                    <Card.Description style={{
                      color: 'red'
                    }}>{product.price}$</Card.Description>
                    <Card.Meta
                      // style={{
                      //   position: 'absolute',
                      //   padding: '0px',
                      //   width: '80%'
                      // }}
                      className='product-card-view'
                    >
                      <Icon name='eye'
                        color='grey'
                        style={{
                          float: 'right'
                        }}
                      >{product.viewer}</Icon>
                    </Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    {
                      user && (product.poster === user._id ? (<div>your own product</div>) : (
                        <Button onClick={onAddToCart.bind(this, product._id)}
                          color='teal'
                        >
                          <Icon name='cart plus'
                            style={{
                              padding: '0px',
                              margin: '0px'
                            }}
                          />
                        </Button>
                      ))
                    }
                    {
                      !user && (
                        <Button onClick={onAddToCart.bind(this, product._id)}
                          color='teal'
                        >
                          <Icon name='cart plus'
                            style={{
                              padding: '0px',
                              margin: '0px'
                            }}
                          />
                        </Button>
                      )
                    }
                  </Card.Content>
                </Card>
              ))
            }
          </Card.Group>
          {
            (popSize >= Limit) ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
                className='btn-load-more'
              >
                <Button
                  className='btn-load-more'
                  onClick={onLoadMore}
                  color='teal'
                // style={{
                //   marginTop: '1rem',
                //   marginBottom: '1rem'
                // }}
                >
                  Load More
                  </Button>
              </div>
            ) : <Message
              color='teal'
              style={{
                marginBottom: '1rem'
              }}>No More Product</Message>
          }
        </Container>) : (<Message>No Product</Message>)
      }
    </div >
  )
}

const mapStateToProps = state => ({
  products: state.products,
  user: state.user,
  error: state.error
})

export default connect(mapStateToProps, {
  getProducts,
  deleteProduct,
  loadMoreProducts,
  filterProducts,
  searchProducts,
  increasePrice,
  descreasePrice,
  addToCart,
  loadUser
})(LandingPage)