import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'

import './FileUpload.css'
import { Icon } from 'semantic-ui-react'

function FileUpload(props) {
  const [images, setImages] = useState([])
  const onDrop = file => {
    const formData = new FormData()
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    const { token } = props.user
    if(token){
      config.headers['Authorization'] = token
    }
    formData.append('file', file[0])
    axios
      .post('http://localhost:5000/api/product/uploadImage', formData, config)
      .then(res => {
        if (res.data.success) {
          setImages([...images, res.data.image])
          props.refreshFuntion([...images, res.data.image])
        } else {
          alert('Failed to save Images')
        }
      })
  }
  const onDelete = image => {
    const currentImage = images.indexOf(image)
    let newImage = [...images]
    newImage.splice(currentImage, 1)
    setImages(newImage)
    props.refreshFuntion(newImage)
  }

  return (
    <div className='image-upload'>
      <Dropzone
        onDrop={onDrop}
        multiple={false}
        maxSize={800000000}
      >
        {({ getRootProps, getInputProps }) => (
          <div style={{
            width: '300px',
            height: '240px',
            border: '1px solid lightgray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon name='file image' style={{
              fontSize: '5rem'
            }} />
          </div>
        )}
      </Dropzone>
      <div style={{
        display: 'flex',
        maxWidth: '400px',
        width: '350px',
        height: '240px',
        overflowY: 'scroll',
        border: '1px solid teal'
      }}>
        {images.map((image, index) => (
          <div
            onClick={() => onDelete(image)}
            key={index}
          >
            <img src={`http://localhost:5000/${image.split('\\').join('/')}`} alt={`${image}`}
              style={{
                minWidth: '300px',
                width: '300px',
                height: '240px'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(FileUpload)
