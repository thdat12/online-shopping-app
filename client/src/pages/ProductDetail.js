import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import ImageGallery from 'react-image-gallery';
import { Container, Grid, Segment, Icon, Button } from 'semantic-ui-react'
import { getProduct, getProducts } from '../actions/productActions'
import { addToCart } from '../actions/userActions'

const ProductDetail = props => {
  const productId = props.match.params.productId
  const { detailProduct } = props.products
  const { user } = props.user
  const [Images, setImages] = useState([])
  useEffect(() => {
    if (detailProduct.images && detailProduct.images.length > 0) {
      let images = [];
      detailProduct.images && detailProduct.images.map(item => {
        images.push({
          original: `http://localhost:5000/${item}`,
          thumbnail: `http://localhost:5000/${item}`
        })
      })
      setImages(images)
    }
  }, [detailProduct])

  useEffect(() => {
    props.getProduct(productId)
  }, [])

  const onAddToCart = id => {
    props.addToCart(id);
    alert("Add to cart success")
  }
  return (
    <div>
      <Container>
        <Grid>
          <Grid.Column width={5}>
            <Segment color='teal'>
              <ImageGallery items={Images} style={{ zoom: '50%' }} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={7}>
            <Segment.Group>
              <Segment color='red'>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '1rem'
                }}>
                  {detailProduct.title}
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    color: 'red'
                  }}
                >
                  {detailProduct.price}$
                </div>
              </Segment>
              <Segment style={{
                wordWrap: 'break-word'
              }}>
                {detailProduct.description}
              </Segment>
              <Segment>
                {
                  (user && detailProduct.poster) && (
                    (detailProduct.poster._id === user._id)
                      ? (<h4>your product</h4>) : (
                        <Button onClick={onAddToCart.bind(this, detailProduct._id)} color='teal'>
                          <Icon name='cart' />BUY
                        </Button>
                      )
                  )
                }
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column width={4}>
            <Segment.Group>

              <Segment color='yellow'>
                {detailProduct.poster &&
                  (
                    <div>
                      <Icon name='user' />
                      {detailProduct.poster.firstName}&nbsp;{detailProduct.poster.lastName}
                    </div>
                  )
                }
                <div
                  style={{
                    fontSize: '1rem',
                    opacity: '0.5'
                  }}
                >Poster</div>
                <Segment style={{
                  wordWrap: 'break-word'
                }}>
                  <Icon name='phone' />
                  {detailProduct.poster && detailProduct.poster.phone}
                </Segment>
                <Segment div style={{
                  wordWrap: 'break-word'
                }}>
                  <Icon name='mail outline' />
                  {detailProduct.poster && detailProduct.poster.email}
                </Segment>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products,
  user: state.user
})

export default connect(mapStateToProps, { getProduct, getProducts, addToCart })(ProductDetail)