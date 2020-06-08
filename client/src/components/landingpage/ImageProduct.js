import React from 'react'
import { Image } from 'semantic-ui-react'

import './ImageProduct.css'

const ImageProduct = props => {
  return(
    <div className='slideshow'>
      <div className='slide-wrapper'>
      {
        props.images.map((image, index) => (
            <Image src={`http://localhost:5000/${image}` } className='slide'/>
            ))
          }
          </div>
    </div>
  )
}

export default ImageProduct