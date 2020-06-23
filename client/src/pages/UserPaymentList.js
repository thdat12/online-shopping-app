import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getOwnPaymentList, getPaymentListById, deletePaymentItem, updateStatusPayment } from '../actions/userActions'

import { Container, Table, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const UserPaymentList = props => {
  const { paymentList } = props.user
  useEffect(() => {
    props.getOwnPaymentList()
  }, [props.user.paymentList])
  const onDeletePayment = id => {
    const confirm = window.confirm("Delete This Payment ?")
    if (confirm) {
      props.deletePaymentItem(id)
      window.alert("Delete Successfully")
    }
  }
  const onClickConfirm = id => {
    props.updateStatusPayment(id)
  }
  
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
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
                    <Table.Cell>{formatter.format(payment.data.totalPrice)}$</Table.Cell>
                    <Table.Cell>{payment.buyer && payment.buyer.email}</Table.Cell>
                    <Table.Cell>{new Date(payment.createAt).toLocaleString()}</Table.Cell>
                    <Table.Cell>{payment.status}
                      {payment.status === "Ordering" ? (
                        <Button onClick={onClickConfirm.bind(this, payment._id)}>
                          Confirm</Button>
                      ) : (<Button disabled>Confirm</Button>)}
                    </Table.Cell>
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
    </Container >
  )
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { getOwnPaymentList, getPaymentListById, deletePaymentItem, updateStatusPayment })(UserPaymentList)