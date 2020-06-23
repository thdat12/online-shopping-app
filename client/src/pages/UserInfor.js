import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Button, Segment, Container, Icon, Message } from 'semantic-ui-react'

const UserInfor = props => {
  const { user, msg } = props.user
  const { errors } = props.error.msg

  return (
    <div>
      {errors && (errors.username || errors.phone) && (
        <Redirect to='/user/update' />
      )}

      {user && (
        <Container
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '5rem',
            marginLeft: '30%',
            width: '40%',
            color: 'teal',
          }}
        >
          {/* {msg && (
            <Message success>{msg}</Message>
          )} */}
          <Segment.Group>
            <Segment><Icon name='user' />Name:&nbsp;{user.firstName}&nbsp;{user.lastName}
            </Segment>
            <Segment><Icon name='mail' />Email:&nbsp; {user.email}
            </Segment>
            <Segment><Icon name='phone' />Phone:&nbsp;{user.phone}
            </Segment>
          </Segment.Group>
          <Button
            style={{
              width: '20%',
              marginLeft: '80%',
              marginBottom: '2rem',
              fontSize: '1rem'
            }}
            color='teal'
            as={Link}
            to='/user/update'
          >Edit your Profile</Button>
        </Container>

      )}
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  error: state.error
})

export default connect(mapStateToProps)(UserInfor)