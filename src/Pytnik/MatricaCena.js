import React from "react";

const MatricaCena = ({ cenaMatrix }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Identifikacija</th>
          {cenaMatrix[0].map((_, index) => (
            <th key={index}>Zlatnik {index}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cenaMatrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td>Zlatnik {rowIndex}</td>
            {row.map((cena, columnIndex) => (
              <td key={columnIndex}>{cena}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MatricaCena;
