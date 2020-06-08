import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getOwnPaymentList } from '../actions/userActions'

import { Container, Table, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const UserPaymentList = props => {
  const { paymentList } = props.user
  useEffect(() => {
    props.getOwnPaymentList()
  }, [])
  return (

    <Container>
      {
        paymentList && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>TotalPrice</Table.HeaderCell>
                <Table.HeaderCell>Buyer</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                paymentList.map(payment => (
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
                    <Table.Cell>{payment.buyer && payment.buyer.email}</Table.Cell>
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

export default connect(mapStateToProps, { getOwnPaymentList })(UserPaymentList)