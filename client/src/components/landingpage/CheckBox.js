import React, { useState } from 'react'
import { Checkbox, Icon } from 'semantic-ui-react'

import { types } from './Data'

const CheckBox = props => {
  const [Checked, setChecked] = useState([])
  const handleToggle = value => {
    const currentIndex = Checked.indexOf(value)
    const newChecked = [...Checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
    props.handleFilters(newChecked)
  }
  return (
    <div style={{
      display: 'flex',
      alignContent: 'flex-start',
    }}>
      {
        types.map((value, index) => (
          <Checkbox
            key={index}
            label={<label
              style={{
                zoom: '150%'
              }}
            ><Icon name={value.icon}></Icon>{value.name}</label>}
            onChange={() => handleToggle(value._id)}
            checked={Checked.indexOf(value._id) === -1 ? false : true}
            style={{
              margin: 'auto',
              padding: 'auto',
              width: 'auto'
            }}
          ></Checkbox>
        ))
      }
    </div>
  )
}

export default CheckBox