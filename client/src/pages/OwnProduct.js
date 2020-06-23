import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Image, Table, Container, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { getOwnProducts } from '../actions/userActions'
import { deleteProduct } from '../actions/productActions'
const OwnProduct = props => {
  const { user, ownProduct } = props.user

  const { products } = props.products
  useEffect(() => {
    props.getOwnProducts()
  }, [products])
  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0]
      return `http://localhost:5000/${image}`
    }
  }
  const onDeleteProduct = id => {
    const confirm = window.confirm("Delete?")
    if(confirm){
      props.deleteProduct(id)
    }
    window.alert("Delete product successfully")
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return (
    <Container>{
      ownProduct.length > 0 ? (
        user && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Product Image</Table.HeaderCell>
                <Table.HeaderCell>Product Title</Table.HeaderCell>
                <Table.HeaderCell>Product Price</Table.HeaderCell>
                <Table.HeaderCell>Delete/Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                ownProduct.map(product => (
                  <tr key={product._id}>
                    <Table.Cell>
                      <Link to={`/product/product_by_id/${product._id}`}>
                        <Image src={renderCartImage(product.images)}
                          style={{ width: '70px' }} alt="product"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{product.title}</Table.Cell>
                    <Table.Cell>{formatter.format(product.price)} </Table.Cell>
                    <Table.Cell>
                      <Button onClick={onDeleteProduct.bind(this, product._id)}
                        icon
                        color='red'
                      ><Icon name='trash' /></Button>
                      <Button as={Link} to={`/product/update/${product._id}`}
                        icon
                        color='green'
                      ><Icon name='edit outline' /></Button>
                    </Table.Cell>
                  </tr>))
              }
            </Table.Body>
          </Table>

        )
      ) : (<h1>No product</h1>)
    }
    <Link to='/product/upload'>
      <Button color='teal'>ADD NEW PRODUCT</Button>
    </Link>
    </Container>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  products: state.products
})

export default connect(mapStateToProps, { getOwnProducts, deleteProduct })(OwnProduct)