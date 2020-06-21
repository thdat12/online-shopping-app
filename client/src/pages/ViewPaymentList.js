import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getPaymentListById, adminGetPaymentListById, getOwnPaymentList } from '../actions/userActions'

import { Container, Image, Segment, Grid, GridColumn, Card } from 'semantic-ui-react'

const ViewPaymentList = props => {
  const { user } = props.user
  let currentUser = null
  if (user && user.isAdmin) {
    currentUser = props.admin
  } else {
    currentUser = props.user
  }
  const { paymentList } = currentUser
  const paymentId = props.match.params.id
  useEffect(() => {
    props.getPaymentListById(paymentId)
  }, [])
  useEffect(() => {
    props.adminGetPaymentListById(paymentId)
  }, [])
  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0]
      return `http://localhost:5000/${image}`
    }
  }
  return (
    <Container style={{ marginTop: '2rem' }}>
      {
        paymentList[0] && (
          <Grid columns={3} divided celled>
            <GridColumn>
              <Segment.Group >
                <Segment style={{ fontSize: '1.5rem' }} inverted color='teal'>Products is buyed</Segment>
                {paymentList[0] && paymentList[0].products.map(product => (
                  <Segment>
                    <Card>
                      <Card.Content>
                        <Image src={renderCartImage(product.images)}
                          style={{ width: '70px' }} alt="product" />
                        <Card.Header>{product.title}</Card.Header>
                        <Card.Description>Price: {product.price} $</Card.Description>
                      </Card.Content>
                    </Card>
                  </Segment>
                ))}
              </Segment.Group>
            </GridColumn>
            <GridColumn>
              <Segment.Group>
                <Segment style={{ fontSize: '1.5rem' }} inverted color='blue'>Buyer Infor</Segment>
                <Segment>
                  <Card>
                    <Card.Content>
                      <Card.Header>{paymentList[0].buyer.firstName}&nbsp;{paymentList[0].buyer.lastName}</Card.Header>
                      <Card.Description>{paymentList[0].buyer.email}</Card.Description>
                      <Card.Description>{paymentList[0].buyer.phone}</Card.Description>
                    </Card.Content>
                  </Card>
                </Segment>
              </Segment.Group>
              <Segment.Group>
                <Segment style={{ fontSize: '1.5rem' }} inverted color='blue'>Data</Segment>
                <Segment>Receiver: {paymentList[0].data.receiver}<br />
                Phone Number: {paymentList[0].data.phoneNumber}<br />
                Location: {paymentList[0].data.location}</Segment>
                <Segment style={{fontSize: '1.5rem'}}>Status: {paymentList[0].status}</Segment>
              </Segment.Group>
            </GridColumn>
            <GridColumn>
              <Segment.Group>
                <Segment style={{ fontSize: '1.5rem' }} inverted color='violet'>Poster Infor</Segment>
                <Segment>
                  <Card>
                    <Card.Content>
                      <Card.Header>{paymentList[0].poster.firstName}&nbsp;{paymentList[0].poster.lastName}</Card.Header>
                      <Card.Description>{paymentList[0].poster.email}</Card.Description>
                      <Card.Description>{paymentList[0].poster.phone}</Card.Description>
                    </Card.Content>
                  </Card>
                </Segment>
              </Segment.Group>
            </GridColumn>
          </Grid>
        )
      }
    </Container >
  )
}

const mapStateToProps = state => ({
  user: state.user,
  admin: state.admin
})

export default connect(mapStateToProps, { getPaymentListById, adminGetPaymentListById, getOwnPaymentList })(ViewPaymentList)