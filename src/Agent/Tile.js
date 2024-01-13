
const Tile = (props) => {
  let clickFunction = props.onClick;
    return (
        <div className='tilee'>
      
          <div className='name'>
            <h5 style={{marginBottom:"2rem"}}>{props.name}</h5>
          </div>
        </div>
      );
}
 
export default Tile;