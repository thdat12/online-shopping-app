import React, { useState } from 'react'
import { connect } from 'react-redux'

import { login } from '../actions/userActions'
import { clearErrors } from '../actions/errorActions'

import { Button, Form, Grid, Header, Message, Segment, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Login = props => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })
  const { errors } = props.error.msg
  const {isAuthenticated} = props.user
  if(isAuthenticated){
    props.history.push('/')
  }
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const onSubmit = event => {
    event.preventDefault()
    props.login(values)
    props.clearErrors()
  }

  return (
    <Container>
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
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='yellow' textAlign='center'>
            Log-in to your account
          </Header>
          <Form size='large' onSubmit={onSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name='email'
                icon='user'
                iconPosition='left'
                placeholder='E-mail address'
                value={values.email}
                onChange={onChange}
                error={errors&&errors.email?true:false}
              />
              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                value={values.password}
                onChange={onChange}
                error={errors&&errors.password?true:false}
              />
              <Button type='submit' color='yellow' fluid size='large'>Submit</Button>
            </Segment>
            <Message>
              Forgot your password?<Link to='/user/forgot'>Find password</Link>
            </Message>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  error: state.error
})

export default connect(mapStateToProps, { login, clearErrors })(Login)