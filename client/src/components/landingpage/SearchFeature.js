import React, { useState } from 'react'
import { Input, Icon } from 'semantic-ui-react'

const SearchFeature = props => {
  const [SearchTerms, setSearchTerms] = useState('')
  const onChangeSearch = event => {
    setSearchTerms(event.currentTarget.value)
    props.handleSearch(event.currentTarget.value)
  }
  return (
    <div>
      <Input
        iconPosition='left'
        style={{
          width: '100%',
          height: '34px'
        }}
        value={SearchTerms}
        onChange={onChangeSearch}
        placeholder="Search by typing..."
      >
        <Icon name='search' />
        <input />
      </Input>
    </div>
  )
}

export default SearchFeature