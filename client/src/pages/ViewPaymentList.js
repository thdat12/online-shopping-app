import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getPaymentListById, payment } from '../actions/userActions'

import { Container, Image, Segment, Grid, GridColumn, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const ViewPaymentList = props => {
  const { paymentList } = props.user
  const paymentId = props.match.params.id
  useEffect(() => {
    props.getPaymentListById(paymentId)
  }, [])
  console.log(paymentList)
  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0]
      return `http://localhost:5000/${image}`
    }
  }
  return (
    <Container style={{ marginTop: '2rem' }}>
      {
        paymentList && (
          <Grid columns={3} divided celled>
            <GridColumn>
              <Segment.Group>
                <Segment style={{fontSize: '1.5rem'}}>Products is buyed</Segment>
                {paymentList[0] && paymentList[0].products.map(product => (
                  <Card>
                    <Card.Content>
                      <Image src={renderCartImage(product.images)}
                        style={{ width: '70px' }} alt="product" />
                      <Card.Header>{product.title}</Card.Header>
                      <Card.Description>Price: {product.price} $</Card.Description>
                    </Card.Content>
                  </Card>
                ))}
              </Segment.Group>
            </GridColumn>
            <GridColumn>
              <Segment.Group>
                <Segment style={{fontSize: '1.5rem'}}>Buyer Infor</Segment>
                <Card>
                  <Card.Content>
                    <Card.Header>{paymentList[0].buyer.firstName}&nbsp;{paymentList[0].buyer.lastName}</Card.Header>
                    <Card.Description>{paymentList[0].buyer.email}</Card.Description>
                    <Card.Description>{paymentList[0].buyer.phone}</Card.Description>
                  </Card.Content>
                </Card>
              </Segment.Group>
              <Segment.Group>
                <Segment style={{fontSize: '1.5rem'}}>Buyer Data</Segment>
                <Segment>Receiver: {paymentList[0].data.receiver}<br />
                Phone Number: {paymentList[0].data.phoneNumber}<br />
                Location: {paymentList[0].data.location}</Segment>
              </Segment.Group>
            </GridColumn>
            <GridColumn>
              <Segment.Group>
                <Segment style={{fontSize: '1.5rem'}}>Poster Infor</Segment>
                <Card>
                  <Card.Content>
                    <Card.Header>{paymentList[0].poster.firstName}&nbsp;{paymentList[0].poster.lastName}</Card.Header>
                    <Card.Description>{paymentList[0].poster.email}</Card.Description>
                    <Card.Description>{paymentList[0].poster.phone}</Card.Description>
                  </Card.Content>
                </Card>
              </Segment.Group>
            </GridColumn>
          </Grid>
        )
      }
    </Container >
  )
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { getPaymentListById })(ViewPaymentList)