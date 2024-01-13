const Coin = ({ id }) => {
    return (
      <div className="coin">
        <img src={`coin_${id}.png`} alt={`Coin ${id}`} />
      </div>
    );
  };

  export default Coin;