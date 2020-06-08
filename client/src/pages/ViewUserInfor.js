import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getAllUsers, deleteUser, getUser } from '../actions/userActions'

import PageViewUser from '../components/PageViewUser'

const DashBoard = props => {
  const { userList, userProduct } = props.admin
  const isAdmin = localStorage.getItem('isAdmin')
  if(!isAdmin){
    props.history.push('/')
  }  
  const path = window.location.pathname.substr(9)
  useEffect(() => {
    props.getUser(path)
  }, [])
  return (
    <div>
        <PageViewUser userList={userList} userProduct={userProduct} />
    </div>
  )
}

const mapStateToProps = state => ({
  admin: state.admin
})

export default connect(mapStateToProps, { getAllUsers, deleteUser, getUser })(DashBoard)