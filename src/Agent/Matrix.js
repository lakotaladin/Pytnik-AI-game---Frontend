import React from 'react';
import './/agent.css';


const Matrix = () => {
  const costMatrix = [
    [0, 25, 17, 12, 31, 12, 22,0, 25,9],
    [25, 0, 30, 22, 0, 17,22,0, 25,12],
    [17, 30, 0, 31, 17, 25, 17,0, 25,12],
    [12, 22, 31, 0, 25,12, 31,0, 25,12]

  ];

  return (
    <div className="matrix">
      {costMatrix.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cost, cellIndex) => (
            <div key={cellIndex} className="cell">
              {cost}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Matrix;
