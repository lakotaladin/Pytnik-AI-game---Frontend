import React from 'react'

const Field = (props) => {
    const {imgsrc} = props
  return (
    <div className='imgfield'>
        <img src={imgsrc} alt='field'></img>
    </div>
  )
}

export default Field
