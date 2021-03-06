import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getPaymentList, deletePaymentItem } from '../actions/userActions'
import { Table, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const PaymentListPage = props => {
  useEffect(() => {
    props.getPaymentList()
  }, [])
  const { user } = props.user
  const { paymentList } = props.admin
  if (user && !user.isAdmin) {
    props.history.push('/')
  }
  const onDeletePayment = id => {
    const confirm = window.confirm("Delete This Payment ?")
    if (confirm) {
      props.deletePaymentItem(id)
    }
  }
  
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return (
    <div>
      {
        paymentList.length > 0 && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Poster</Table.HeaderCell>
                <Table.HeaderCell>Buyer</Table.HeaderCell>
                <Table.HeaderCell>Products</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>View</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                paymentList.map(payment => (
                  <tr key={payment._id}>
                    <Table.Cell>{payment.poster && payment.poster.email}</Table.Cell>
                    <Table.Cell>{payment.buyer && payment.buyer.email}</Table.Cell>
                    <Table.Cell>
                      {payment.products &&
                        payment.products.map(product => (
                          <Link to={`/product/product_by_id/${product._id}`} key={product._id}>
                            <ul
                              style={{
                                textDecoration: 'underline',
                                marginBottom: '10px',
                                margin: '0px',
                                padding: '0px'
                              }}>
                              <li
                              >{product.title}</li>
                            </ul>
                          </Link>
                        ))}
                    </Table.Cell>
                    <Table.Cell>{formatter.format(payment.data.totalPrice)}$</Table.Cell>
                    <Table.Cell>{new Date(payment.createAt).toLocaleString()}</Table.Cell>
                    <Table.Cell>{payment.status}</Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/payment/${payment._id}`}
                      >
                        <Button icon>
                          <Icon name='eye' />
                        </Button>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Button icon color='red' onClick={onDeletePayment.bind(this, payment._id)}>
                        <Icon name='trash' />
                      </Button>
                    </Table.Cell>
                  </tr>
                ))
              }
            </Table.Body>
          </Table>
        )
      }
    </div>
  )
}


const mapStateToProps = state => ({
  user: state.user,
  admin: state.admin
})

export default connect(mapStateToProps, { getPaymentList, deletePaymentItem })(PaymentListPage)