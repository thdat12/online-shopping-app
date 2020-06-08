import React, { useState, Fragment } from 'react'
import { Menu, Label, Icon, Button, Segment, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import SearchFeature from '../landingpage/SearchFeature'
import { logout } from '../../actions/userActions'
import { searchProducts } from '../../actions/productActions'

import './NavBar.css'
const NavBar = props => {
  const [Skip, setSkip] = useState(0)
  const [Limit, setLimit] = useState(8)
  const [SearchTerm, setSearchTerm] = useState('')
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const { isAuthenticated, user } = props.user
  const updatedSearchTerms = (newSearchTerm) => {
    const variables = {
      skip: 0,
      limit: Limit,
      searchTerm: newSearchTerm
    }
    setSkip(0)
    setSearchTerm(newSearchTerm.trim())
    props.searchProducts(variables)
  }
  const trigger = (
    <span
      style={{
        zoom: '120%',
        marginRight: '20%'
      }}
    >
      <Icon name='user outline' /> Account
    </span>
  )
  const logout = () => {
    props.logout()
  }
  const menuBar = isAuthenticated ? (
    <Segment.Group>
      <Segment
        inverted
        color='teal'
        style={{
          paidding: '0x',
          margin: '0px',
        }}
      >
        <Menu size='large' inverted secondary >
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to='/'
          >
            <Icon name='home' />
            Online Shop
      </Menu.Item>
          <Menu.Item
            name='infor'
            active={activeItem === 'infor'}
            onClick={handleItemClick}
            as={Link}
            to='/user/infor'
          >
            <Icon name='user' />
            {user.lastName}
          </Menu.Item>
          <Menu.Item>
            <SearchFeature handleSearch={updatedSearchTerms} />
          </Menu.Item>
          <Menu.Menu position='right'>
            {
              user.isAdmin && (
                <Fragment>
                  <Dropdown
                    text='Dashboard'
                    pointing
                    className='link item'>
                    <Dropdown.Menu>
                      <Menu.Item
                        name='userList'
                        active={activeItem === 'userList'}
                        onClick={handleItemClick}
                        as={Link}
                        to='/admin/dashboard'
                      >UserLIst</Menu.Item>
                      <Menu.Item
                        name='paymenList'
                        active={activeItem === 'paymentList'}
                        onClick={handleItemClick}
                        as={Link}
                        to='/admin/paymentList'>
                        PaymentList
                      </Menu.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Fragment>
              )
            }
            <Menu.Item
              name='cart'
              active={activeItem === 'Cart'}
              onClick={handleItemClick}
              as={Link}
              to='/user/cart'
            >
              <Icon name='shopping cart' />
              <Label color='red' floating>{user && user.cart.length}</Label>
            </Menu.Item>
            <Dropdown text='Manage My Store' pointing className='link item'>
              <Dropdown.Menu>
                <Menu.Item
                  name='yourOwnProduct'
                  active={activeItem === 'yourOwnProduct'}
                  onClick={handleItemClick}
                  as={Link}
                  to='/user/ownProduct'
                />
                <Menu.Item
                  name='uploadProduct'
                  active={activeItem === 'uploadProduct'}
                  onClick={handleItemClick}
                  as={Link}
                  to='/product/upload'
                />
                <Menu.Item
                  name='history'
                  active={activeItem == 'history'}
                  onClick={handleItemClick}
                  as={Link}
                  to='/user/history'
                />
                <Menu.Item
                  name='ownPaymentList'
                  active={activeItem == 'ownPaymentList'}
                  onClick={handleItemClick}
                  as={Link}
                  to='/user/paymentList'
                />
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item>
              <Button inverted color='grey' name='Logout'
                onClick={logout}>
                <Icon name='sign out' />Sign Out</Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Segment>
    </Segment.Group>

  ) : (
      <Segment.Group>
        <Segment
          inverted
          color='teal'
          style={{
            paidding: '0x',
            margin: '0px',
          }}
        >
          <Menu size='large' inverted secondary
          >
            <Menu.Item
              name='home'
              active={activeItem === 'home'}
              onClick={handleItemClick}
              as={Link}
              to='/'
            ><Icon name='home' /> Online Shop</Menu.Item>
            <Menu.Item>
              <SearchFeature handleSearch={updatedSearchTerms} />
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item>
                <Dropdown
                  icon={null}
                  pointing='top left'
                  trigger={trigger}
                  style={{ width: '150px' }}
                >
                  <Dropdown.Menu>
                    <Button
                      color='yellow'
                      name='login'
                      active={activeItem === 'login'}
                      onClick={handleItemClick}
                      as={Link}
                      to='/login'
                      style={{
                        width: '80%',
                        marginLeft: '10%',
                        marginTop: '1rem',
                        marginBottom: '1rem'
                      }}
                    >Login</Button>
                    <Button
                      color='red'
                      name='register'
                      active={activeItem === 'register'}
                      onClick={handleItemClick}
                      as={Link}
                      to='/register'
                      style={{
                        width: '80%',
                        marginLeft: '10%',
                        marginBottom: '1rem'
                      }}
                    >Register</Button>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>
      </Segment.Group >

    )
  return menuBar
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { logout, searchProducts })(NavBar)