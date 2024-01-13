import React from 'react';

const Map = ({ mapa }) => {
  // Renderovanje mape
  const renderMap = () => {
    return mapa.map((red, rowIndex) => (
      <div key={rowIndex} className="map-row">
        {red.map((vrednost, colIndex) => (
          <div key={colIndex} className={`map-cell ${vrednost === 1 ? 'zlatnik' : ''}`}></div>
        ))}
      </div>
    ));
  };

  return <div className="map">{renderMap()}</div>;
};

export default Map;
