import React, { useState } from "react";
import terrainImage from "../images/terrain.png"; // Zamijenite sa stvarnom slikom terena
import aki from "../images/Aki.png";
import jocke from "../images/Jocke.png";
import uki from "../images/Uki.png";
import micko from "../images/Micko.png";
import novcic from "../images/coin.png";

const MatrixWithImage = ({ rows, columns }) => {
  const [agentPosition, setAgentPosition] = useState({ x: 0, y: 0 });
  const [goldPositions, setGoldPositions] = useState([
    { x: 3, y: 2 },
    { x: 5, y: 5 },
    { x: 8, y: 1 },
    { x: 9, y: 9 },
  ]);

  const [agent, setAgent] = useState(1);

  const placeAgent = (x, y) => {
    setAgentPosition({ x, y });
  };

  const placeGold = (x, y) => {
    // Dodajte novu poziciju za zlatnik u niz
    setGoldPositions([...goldPositions, { x, y }]);
  };

  const agents = [
    { image: aki, name: "aki", id: 1 },
    { image: jocke, name: "jocke", id: 2 },
    { image: uki, name: "uki", id: 3 },
    { image: micko, name: "micko", id: 4 },
  ];
  const terrainMatrix = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => terrainImage)
  );

  // Postavite agenta na matricu
  const { x: agentX, y: agentY } = agentPosition;
  terrainMatrix[agentX][agentY] = agents[agent - 1].image;

  // Postavite zlatnike na matricu
  goldPositions.forEach((position, index) => {
    const { x, y } = position;
    terrainMatrix[x][y] = novcic;
  });

  return (
    <div className="matrix-container">
      {terrainMatrix.map((row, rowIndex) =>
        row.map((terrain, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="matrix-cell">
            <img
              src={terrain}
              alt={`Terrain at (${rowIndex}, ${colIndex})`}
              className="matrix-image"
            />
          </div>
        ))
      )}
    </div>
  );
};
export default MatrixWithImage;
