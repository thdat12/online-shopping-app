import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { getAllUsers, deleteUser, getUser } from '../actions/userActions'

import PageViewUser from '../components/PageViewUser'

import { Container, Table, Icon, Button } from 'semantic-ui-react'

const DashBoard = props => {
  const { user } = props.user
  if (user && !user.isAdmin) {
    props.history.push('/')
  }
  const { userList, userProduct } = props.admin
  useEffect(() => {
    props.getAllUsers()
  }, [])

  const onDeleteUser = (id) => {
    const confirm = window.confirm("Delete User ?")
    if (confirm) {
      props.deleteUser(id)
      window.alert("Delete user sucessfully")
    }
  }

  return (
    <div>
      {userList && userList.length === 1 ? (
        <PageViewUser userList={userList} userProduct={userProduct} />
      ) : (
          <Container
            style={{
              marginTop: '2.5rem'
            }}
          >
            <Table color='teal' key='teal' inverted>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>First Name</Table.HeaderCell>
                  <Table.HeaderCell>Last Name</Table.HeaderCell>
                  <Table.HeaderCell>Email Adress</Table.HeaderCell>
                  <Table.HeaderCell>Phone Number</Table.HeaderCell>
                  <Table.HeaderCell>View</Table.HeaderCell>
                  <Table.HeaderCell>Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  userList && userList.map(user => (
                    <tr key={user._id}>
                      <Table.Cell>{user.firstName}</Table.Cell>
                      <Table.Cell>{user.lastName} </Table.Cell>
                      <Table.Cell>{user.email} </Table.Cell>
                      <Table.Cell>{user.phone} </Table.Cell>
                      <Table.Cell>
                        <Link to={`/viewUser/${user._id}`}>
                          <Button icon >
                            <Icon name='eye' />
                          </Button>
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Button onClick={onDeleteUser.bind(this, user._id)}
                          icon
                          color='red'
                        ><Icon name='trash' /></Button>
                      </Table.Cell>
                    </tr>))
                }
              </Table.Body>
            </Table>
          </Container>
        )
      }
    </div>
  )
}

const mapStateToProps = state => ({
  admin: state.admin,
  user: state.user
})

export default connect(mapStateToProps, { getAllUsers, deleteUser, getUser })(DashBoard)