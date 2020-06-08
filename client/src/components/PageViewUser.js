import React from 'react'
import { Image, Table, Segment, Container, Icon, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const PageViewUser = props => {
  const userList = props.userList
  const userProduct = props.userProduct

  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0]
      return `http://localhost:5000/${image}`
    }
  }

  return (
    <Container>
      <h3 style={{
        color: 'teal'
      }}>User Information</h3>
      {
        userList[0] && (
          <React.Fragment>
            <Segment.Group style={{ width: '50%' }}>
              <Segment><Icon name='user' />Name:&nbsp;
            <span style={{ color: 'teal' }}>
                  {userList[0].firstName}&nbsp;{userList[0].lastName}
                </span>
              </Segment>
              <Segment><Icon name='mail' />Email:
            <span style={{ color: 'teal' }}>
                  &nbsp; {userList[0].email}
                </span>
              </Segment>
              <Segment><Icon name='phone' />Phone:
            <span style={{ color: 'teal' }}>
                  &nbsp;{userList[0].phone}
                </span>
              </Segment>
            </Segment.Group>
          </React.Fragment>
        )
      }
      <br />
      <h3 style={{
        color: 'teal'
      }}>Poduct Upload</h3>
      <Table>
        <Table.Header>
          <tr>
            <Table.HeaderCell>Product Image</Table.HeaderCell>
            <Table.HeaderCell>Product Title</Table.HeaderCell>
            <Table.HeaderCell>Product Price</Table.HeaderCell>
            <Table.HeaderCell>Delete</Table.HeaderCell>
          </tr>
        </Table.Header>
        <Table.Body>
          {
            userProduct && userProduct.map(product => (
              <tr key={product._id}>
                <Table.Cell>
                  <Link to={`/product/product_by_id/${product._id}`}>
                    <Image src={renderCartImage(product.images)}
                      style={{ width: '70px' }} alt="product"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>{product.title}</Table.Cell>
                <Table.Cell>$ {product.price} </Table.Cell>
                <Table.Cell>
                  <Button
                    icon
                    color='red'
                  ><Icon name='trash' /></Button></Table.Cell>
              </tr>))
          }
        </Table.Body>
      </Table>
    </Container>
  )
}

export default PageViewUser