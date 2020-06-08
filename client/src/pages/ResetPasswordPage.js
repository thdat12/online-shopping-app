import React, { useState } from 'react'
import { connect } from 'react-redux'
import { resetPassword} from '../actions/userActions'

import { Form, Container, Button, Message } from 'semantic-ui-react'

const ResetPasswordPage = props => {
  const [values, setValues] = useState({
    password: '',
    confirm: ''
  })
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const token = props.match.params.token
  const {msg} = props.user
  const onSubmit = event => {
    event.preventDefault()
    props.resetPassword(values, token)
    setValues({
      password: '',
      confirm: ''
    })
  }

  return (
    <Container><div style={{
      textAlign: 'center',
      fontSize: '1.5rem',
      color: 'teal',
      marginBottom: '1rem'
    }}>Reset Your Password</div>
      {msg && msg.error && (
        <Message negative>{msg.error}</Message>
      )}
      {msg && msg.msg && (
        <Message>{msg.msg}</Message>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Input
          name='password'
          type="password"
          placeholder='Enter your Password'
          value={values.password}
          onChange={onChange}
        />
        <Form.Input
          name='confirm'
          type="password"
          placeholder='Confirm your Password'
          value={values.confirm}
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

export default connect(mapStateToProps, {resetPassword})(ResetPasswordPage)