import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Radio, Form, Button, Icon } from 'semantic-ui-react'

import { descreasePrice, increasePrice } from '../../actions/productActions'

import { price } from './Data'

const RadioBox = props => {
  const [Value, setValue] = useState(0)
  const onChange = (event, { value }) => {
    setValue(value)
    props.handleFilters(value)
  }
  const onIncreasePrice = () => {
    props.increasePrice()
  }
  const onDescreasePrice = () => {
    props.descreasePrice()
  }
  return (
    <div>
      <Form>
        <Form.Field
          style={{
            display: 'flex',
            alignContent: 'flex-start',
          }}
        >
          {
            price.map((value, index) => (
              <Radio key={index}
                name='radioGroup'
                label={<label style={{ zoom: '110%' }}>{value.name}</label>}
                value={value._id}
                checked={Value == value._id}
                onChange={onChange}
                style={{
                  margin: 'auto',
                  padding: 'auto',
                }}
              />
            ))
          }
          <Button.Group size='small' icon
          >
            <Button onClick={onIncreasePrice} color='teal'><Icon name='angle double up'></Icon></Button>
            <Button onClick={onDescreasePrice} color='teal'><Icon name='angle double down'></Icon></Button>
          </Button.Group>
        </Form.Field>
      </Form>
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps, { descreasePrice, increasePrice })(RadioBox)