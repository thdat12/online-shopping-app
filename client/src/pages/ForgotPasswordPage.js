import React, { useState } from 'react'
import { connect } from 'react-redux'

import { forgotPassword } from '../actions/userActions'

import { Form, Container, Button, Message } from 'semantic-ui-react'

const ForgotPasswordPage = props => {
  const [values, setValues] = useState({
    email: '',
  })
  const { msg } = props.user
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const onSubmit = event => {
    event.preventDefault()
    props.forgotPassword(values)
  }

  return (
    <Container>
      <div style={{
        textAlign: 'center',
        fontSize: '1.5rem',
        color: 'Red',
        marginBottom: '1rem'
      }}>Find Your Password</div>
      {msg && msg.error && (
        <Message negative>{msg.error}</Message>
      )}
      {msg && msg.msg && (
        <Message>{msg.msg}</Message>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Input
          name='email'
          labe='Your Email'
          placeholder='Enter your Email'
          value={values.email}
          onChange={onChange}
        />
        <Button>Submit</Button>
      </Form>
    </Container>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { forgotPassword })(ForgotPasswordPage)