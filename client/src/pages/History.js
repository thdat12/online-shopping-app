import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getHistory, updateStatusPayment, deletePaymentItem } from '../actions/userActions'
import { Button, Table, Container, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
const History = props => {
  const { history } = props.user
  useEffect(() => {
    props.getHistory()
  }, [props.user.history])

  const onClickConfirm = id => {
    props.updateStatusPayment(id)
  }
  // const onDeletePayment = id => {
  //   const confirm = window.confirm("Cancel This Order ?")
  //   if (confirm) {
  //     props.deletePaymentItem(id)
  //     window.alert("Cancel successfully")
  //   }
  // }
  
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return (

    <Container>
      {
        history && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Total Price</Table.HeaderCell>
                <Table.HeaderCell>Poster</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>View</Table.HeaderCell>
                <Table.HeaderCell>Cancel/Receive Order</Table.HeaderCell>
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
                    <Table.Cell>{formatter.format(payment.data.totalPrice)}$</Table.Cell>
                    <Table.Cell>{payment.poster && payment.poster.email}</Table.Cell>
                    <Table.Cell>{payment.status}</Table.Cell>
                    <Table.Cell>{new Date(payment.createAt).toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/payment/${payment._id}`}
                      >
                        <Button icon>
                          <Icon name='eye' />
                        </Button>
                      </Link>
                    </Table.Cell>                    <Table.Cell>
                      {
                        payment.status === 'Ordering' ? (
                          <Button onClick={onClickConfirm.bind(this, payment._id)}>Cancel</Button>
                        ) : payment.status === 'Cancel' ? <Button disabled>Canceled</Button> : payment.status === "Delivering" ? (<Button onClick={onClickConfirm.bind(this, payment._id)}>Receive
                        </Button>) : (<Button disabled>Received</Button>)
                      }
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

export default connect(mapStateToProps, { getHistory, updateStatusPayment, deletePaymentItem })(History)