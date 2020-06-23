import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { register } from '../actions/userActions'
import { clearErrors } from '../actions/errorActions'

import { Form, Button, Grid, Segment, Header, Message } from 'semantic-ui-react';

const Register = props => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { errors } = props.error.msg
  const { isAuthenticated } = props.user
  if (isAuthenticated) {
    props.history.push('/')
  }
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const onSubmit = event => {
    event.preventDefault()
    props.register(values)
    props.clearErrors()
  }
  useEffect(()=>{
    props.clearErrors()
  }, [setValues])
  return (
    <div>
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
          <Header as='h2' color='red' textAlign='center'>
            Sign-up to your account
          </Header>
          <Form size='large' onSubmit={onSubmit}>
            <Segment stacked>
              <Form.Group widths='equal'>
                <Form.Input
                  fluid
                  name='firstName'
                  icon='address card'
                  iconPosition='left'
                  type='text'
                  placeholder='Enter your first name'
                  value={values.firstName}
                  onChange={onChange}
                />
                <Form.Input
                  fluid
                  name='lastName'
                  icon='address card'
                  iconPosition='left'
                  type='text'
                  placeholder='Enter your last name'
                  value={values.lastName}
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Input
                fluid
                name='phone'
                icon='mobile alternate'
                iconPosition='left'
                type='text'
                placeholder='Enter your Phone'
                value={values.phone}
                onChange={onChange}
                error={errors && errors.phone ? true : false}
              />
              <Form.Input
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                type='email'
                placeholder='Enter your Email'
                value={values.email}
                onChange={onChange}
                error={errors && errors.email ? true : false}
              />
              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                type='password'
                placeholder='Enter your password'
                value={values.password}
                onChange={onChange}
                error={errors && errors.password ? true : false}
              />
              <Form.Input
                fluid
                name='confirmPassword'
                icon='lock'
                iconPosition='left'
                type='password'
                placeholder='Confirm your password'
                value={values.confirmPassword}
                onChange={onChange}
                error={errors && errors.password ? true : false}
              />
              <Button type='submit' color='red' fluid size='large'>Submit</Button>
            </Segment>
            <Message>
              Already have Account? <Link to='/login'>Sign In</Link>
            </Message>
          </Form>
        </Grid.Column>
      </Grid>

    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  error: state.error
})

export default connect(mapStateToProps, { register, clearErrors })(Register)