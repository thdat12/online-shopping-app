import React, { useState, useEffect } from 'react'
import { Form, Container, Button, Message, Segment } from 'semantic-ui-react'
import { updateUserInfor } from '../actions/userActions'
import { clearErrors } from '../actions/errorActions'
import { connect } from 'react-redux'
import { set } from 'mongoose'
const UpdateUserProfile = props => {
  const { user, msg } = props.user
  const { errors } = props.error.msg
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
    try {
      const varibles = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
      }
      props.updateUserInfor(varibles)
      // const confirm = window.confirm('You have updated Infor')
      // if (confirm)
      //   props.history.push('/user/infor')
      props.clearErrors()
    } catch{
      window.alert("Update Failed")
    }
  }

  const oncancel = () => {
    props.history.push('/user/infor')
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
        <Message success>{msg}</Message>
      )}
      {
        errors && (
          Object.keys(errors).length > 0 && (
            <Message negative
              list={Object.values(errors).map((value) => (
                <Message negative key={value}>{value}</Message>
              ))}
            >
            </Message>
          )
        )
      }
      <Segment color='teal'>
        <div
          style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            marginBottom: '1rem'
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
        <Button color='red' floated='right' onClick={oncancel}>Back</Button>
      </Segment>
    </Container>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  error: state.error
})

export default connect(mapStateToProps, { updateUserInfor, clearErrors })(UpdateUserProfile)