import React from 'react'
import ".//Tile.css";

const Tile = (props) => {
    let clickfunction = props.onClick;
  return (
    <div className='tilee'>

    <div className='image' onClick={clickfunction}>
   <img src={props.image} alt='tile'></img>
    </div>
    <div className='name'>
    <h5 style={{marginBottom:"2rem"}}>{props.name}</h5>
    </div>
      
    </div>
  )
}

export default Tile
