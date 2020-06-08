import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getHistory } from '../actions/userActions'
import { Button, Table, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
const History = props => {
  const { history } = props.user
  useEffect(() => {
    props.getHistory()
  }, [])

  // const isoTime = new Date().toISOString()
  
  return (

    <Container>
      {
        history && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>TotalPrice</Table.HeaderCell>
                <Table.HeaderCell>Poster</Table.HeaderCell>
                <Table.HeaderCell>Cancel Order</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                history.map(payment => (
                  <tr key={payment._id}>
                    <Table.Cell>
                      {payment.products &&
                        payment.products.map(product => (
                          <Link to={`/product/product_by_id/${product._id}`} key={product._id}>
                            <ul
                              style={{
                                textDecoration: 'underline',
                                marginBottom: '10px',
                                paddingLeft: '10px'
                              }}>
                              <li
                              >{product.title}</li>
                            </ul>
                          </Link>
                        ))}
                    </Table.Cell>
                    <Table.Cell>{payment.data.totalPrice}$</Table.Cell>
                    <Table.Cell>{payment.poster && payment.poster.email}</Table.Cell>
                    <Table.Cell>
                      {/* {payment.createAt && Date.parse(isoTime ) > Date.parse(payment.createAt) + 1000*60*2 ? (
                        <Button>No</Button>) : (<Button>Cancel</Button>)
                      } */}
                    </Table.Cell>
                  </tr>
                ))
              }
            </Table.Body>
          </Table>
        )
      }
    </Container >
  )
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { getHistory })(History)