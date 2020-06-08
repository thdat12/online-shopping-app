import React, { useState, useEffect } from 'react'
import { Form, Container, Button, Message, Segment } from 'semantic-ui-react'
import { updateUserInfor } from '../actions/userActions'
import { connect } from 'react-redux'
const UpdateUserProfile = props => {
  const { user, msg } = props.user
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  })
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  useEffect(() => {
    if (user)
      setValues({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      })
  }, [props.user])
  const onSubmit = event => {
    event.preventDefault()
    props.updateUserInfor(values)
  }

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '5rem',
        marginLeft: '30%',
        width: '40%',
      }}
    >
      {msg && (
        <Message success>{msg.msg}</Message>
      )}
      <Segment color='teal'>
        <div
        style={{
          textAlign:'center',
          fontSize:'1.5rem',
          marginBottom:'1rem'
        }}>
          Update your Profile
        </div>
        <Form onSubmit={onSubmit}>
          <Form.Group widths='equal'>
            <Form.Input
              name='firstName'
              label='First Name'
              value={values.firstName}
              onChange={onChange}
            />
            <Form.Input
              name='lastName'
              label='Last Name'
              value={values.lastName}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Input
            name='email'
            label='Email (Can not be change)'
            value={values.email}
            readOnly
          />
          <Form.Input
            name='phone'
            label='Phone'
            value={values.phone}
            onChange={onChange}
          />
          <Button color='teal' floated='right'>Update</Button>
        </Form>
      </Segment>
    </Container>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { updateUserInfor })(UpdateUserProfile)