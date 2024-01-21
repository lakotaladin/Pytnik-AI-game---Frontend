import React, { useCallback, useEffect, useState } from "react";
import { VscDebugRestart, VscDebugStart } from "react-icons/vsc";
import aki from "../images/Aki.png";
import { TiInfo } from "react-icons/ti";
import jocke from "../images/Jocke.png";
import uki from "../images/Uki.png";
import micko from "../images/Micko.png";
import Agent from "../Agent/agent";
import novcic from "../images/coin.png";
import skloninovcic from "../images/collected_coin.png";
import "../App.css";
import axios from "axios";
import playsound from "../Sound/coin_drop.wav";
import collect_coin from "../Sound/collected_coin.wav";

const agents = [
  {
    image: aki,
    name: "Aki",
    id: 1,
    info: "Agent Aki: Agent koristi strategiju pohlepne pretrage po dubini tako što prilikom izbora narednog zlatnika za sakupljanje bira onaj do kog je cena puta najmanja. Ukoliko postoje dva ili više takvih zlatnika, kao sledeći se bira onaj sa manjom vrednošću identifikacione oznake.",
  },
  {
    image: jocke,
    name: "Jocke",
    id: 2,
    info: "Agent Jocke: Agent koristi brute-force strategiju tako što generiše sve moguće putanje i od svih bira onu sa najmanjom cenom.",
  },
  {
    image: uki,
    name: "Uki",
    id: 3,
    info: "Agent Uki: Agent koristi strategiju grananja i ograničavanja. Ukoliko postoje dve ili više parcijalnih putanja istih cena, agent bira onu sa više sakupljenih zlatnika na putanji, a u slučaju dve ili više takvih parcijalnih putanja bira onu koja dovodi do zlatnika sa manjom vrednošću identifikacione oznake.",
  },
  {
    image: micko,
    name: "Micko",
    id: 4,
    info: "Agent Mićko:  Agent koristi A* strategiju pretraživanja, pri čemu se za heurističku funkciju koristi minimalno obuhvatno stablo. Ukoliko postoje dve ili više parcijalnih putanja istih vrednosti funkcije procene, agent bira onu sa više sakupljenih zlatnika na putanji, a u slučaju dve ili više takvih parcijalnih putanja bira onu koja dovodi do zlatnika sa manjom vrednošću identifikacione oznake.",
  },
];

const Pytnik = () => {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(11);
  const [avatarSteps, setAvatarSteps] = useState([]);
const [selectedPathCost, setSelectedPathCost] = useState(0);

  const [tiles, setTiles] = useState([
    1, 2, 1, 3, 4, 2, 2, 5, 3, 2, 2, 3, 1, 4, 2, 2, 5, 1, 3, 5, 4, 5, 2, 1, 2,
    5, 3, 4, 3, 0, 1, 2, 6, 3, 4, 5, 5, 1, 1, 2, 3, 1, 1, 5, 1, 2, 1, 2, 3, 4,
    5, 1, 2, 3, 5, 4, 2, 1, 1, 5, 1, 2, 3, 2, 2, 5, 4, 2, 1, 1, 5, 1, 2, 3, 2,
    2, 6, 4, 2, 1, 1, 5, 1, 2, 3, 2, 2, 4, 4, 2, 1, 1, 5, 1, 2, 3, 2, 2, 4, 4,
    2, 1, 1, 5, 1, 2, 3, 2, 2, 2, 4, 2, 1, 1, 5, 1, 2, 3, 2, 2, 4,
  ]);
  const [playerX, setPlayerX] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [destX, setDestX] = useState(0);
  const [destY, setDestY] = useState(0);
  const [editorMode, setEditorMode] = useState(true);
  const [selectedTile, setSelectedTile] = useState(null);
  const [pathAgain, setPathAgain] = useState([]);
  const [agent, setAgent] = useState(1);
  const [path, setPath] = useState([{ x: 0, y: 0 }]);
  const [goldPositions, setGoldPositions] = useState(0);
  const [goldPositions2, setGoldPositions2] = useState(0);
  const [goldPositionsCombined, setGoldPositionsCombined] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [isGameReset, setIsGameReset] = useState(false);




  useEffect(() => {
    if (isGameReset) {
      setTiles([
        1, 2, 1, 3, 4, 2, 2, 5, 3, 2, 2, 3, 1, 4, 2, 2, 5, 1, 3, 5, 4, 5, 2, 1,
        2, 5, 3, 4, 3, 0, 1, 2, 6, 3, 4, 5, 5, 1, 1, 2, 3, 1, 1, 5, 1, 2, 1, 2,
        3, 4, 5, 1, 2, 3, 5, 4, 2, 1, 1, 5, 1, 2, 3, 2, 2, 5, 4, 2, 1, 1, 5, 1,
        2, 3, 2, 2, 6, 4, 2, 1, 1, 5, 1, 2, 3, 2, 2, 4, 4, 2, 1, 1, 5, 1, 2, 3,
        2, 2, 4, 4, 2, 1, 1, 5, 1, 2, 3, 2, 2, 2, 4, 2, 1, 1, 5, 1, 2, 3, 2, 2,
        4,
      ]);
      setPlayerX(0);
      setPlayerY(0);
      setDestX(0);
      setDestY(0);
      setEditorMode(true);
      setSelectedTile(null);
      setPathAgain([]);
      setAgent(1);
      setPath([{ x: 0, y: 0 }]);
      setGoldPositions(0);
      setGoldPositions2(0);
      setGoldPositionsCombined([]);
      setSelectedAgentId(null);
      setIsGameReset(false);
      setAvatarSteps([]);
      setSelectedPathCost(0);
    }
  }, [isGameReset]);

  const [coinOrder, setCoinOrder] = useState([]);

  const placeGold = (x, y) => {
    setGoldPositions(x);
    setGoldPositions2(y);
    setGoldPositionsCombined((oldArray) => [...oldArray, [x, y]]);
    setCoinOrder((order) => [...order, goldPositionsCombined.length + 1]);
  };
  const [isPlacingCoins, setIsPlacingCoins] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleAgentClick = (agentId) => {
    setAgent(agentId);
    setSelectedAgent(agentId);
  };

  const handleSvgClick = (e) => {
    if (isPlacingCoins) {
      const svg = e.currentTarget;

      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;

      const cursorPoint = point.matrixTransform(svg.getScreenCTM().inverse());

      // Izračunaj indekse matrice
      const xIndex = Math.floor((cursorPoint.x / 1000) * width);
      const yIndex = Math.floor((cursorPoint.y / 600) * height);

      // Postavite novčić na odabrane indekse matrice
      if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
        placeGold(xIndex, yIndex, play());

        const newTiles = [...tiles];
        const index = xIndex + yIndex * width;
        newTiles[index] = 8; // 7 označava novčić na toj poziciji
        setTiles(newTiles);
      }
    }
  };

  // BACKEND
  const fetchPathFromBackend = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_API, {
        tiles: tiles,
        playerx: playerX,
        playery: playerY,
        player_type: agents[agent - 1].name,
        gold_positions: goldPositionsCombined,
      });
  
      setPath(response.data.path);
      setPathAgain(response.data.path);
      setEditorMode((e) => !e);
  
      // setSelectedPath(response.data.path);
      setSelectedPathCost(response.data.matrixCost);

    } catch (error) {
      console.error("Greška pri dohvaćanju putanje s backenda", error);
      console.log(error);
    }
  };

  function collect_coin_sound() {
    new Audio(collect_coin).play();
  }
  

  useEffect(() => {
    if (editorMode === true) return;

    let pathIdx = 0;
    let stepIdx = 0;
    const steps = [];

    const interval = setInterval(() => {
      if (!path[pathIdx] || !path[pathIdx][stepIdx]) {
        clearInterval(interval);
        return;
      }

      const [x, y] = path[pathIdx][stepIdx];
      steps.push({ x, y });
      setPlayerX(y);
      setPlayerY(x);
      stepIdx++;

      if (stepIdx === path[pathIdx].length) {
        pathIdx++;
        stepIdx = 0;
      }
    }, 280);

    setAvatarSteps(steps);

    return () => clearInterval(interval);
  }, [editorMode === true]);

  useEffect(() => {
    // Prođi kroz sve novčiće
    for (let i = 0; i < goldPositionsCombined.length; i++) {
      // Proveri da li su koordinate igrača jednake koordinatama novčića
      if (
        playerX === goldPositionsCombined[i][1] &&
        playerY === goldPositionsCombined[i][0]
      ) {
        // Ažuriraj novčić da je pokupljen
        setGoldPositionsCombined((oldArray) =>
          oldArray.map((item, index) =>
            index === i ? { ...item, collected: true } : item
          )
        );
        collect_coin_sound();
        // Prekini petlju
        break;
      }
    }
  }, [playerX, playerY]);

  function play() {
    new Audio(playsound).play();
  }

  return (
    <>
      <div className="w-100 m-0 p-0 d-flex">
        <div
          style={{
            height: "100vh",
            margin: "auto",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          <div className="choose-avatar-container">
            <div className="d-flex flex-row text-center align-items-center">
              <p className="p-0 m-0">Izaberite avatara</p>
              <div className="box align-items-center">
                <a className="avatar-info" href="#popup1">
                  <TiInfo
                    style={{
                      width: "70px",
                      height: "50px",
                      margin: "0px",
                      padding: "0px",
                      color: "gold",
                    }}
                  />
                </a>
              </div>

              <div id="popup1" className="overlay">
                <div className="popup">
                  <h2 className="text-black">Avatar info:</h2>
                  <a className="close" href="#">
                    &times;
                  </a>
                  <div className="content">
                    {agents &&
                      agents.map((agent) => (
                        <div
                          className="avatar-container d-flex flex-row w-100 gap-2"
                          key={agent.id}
                        >
                          <div className="agent-content d-flex flex-column">
                            <Agent
                              image={agent.image}
                              name={agent.name}
                              add={""}
                            />
                          </div>
                          <p
                            className="text-black"
                            style={{ fontSize: "15px", textAlign: "start" }}
                          >
                            {agent.info}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100 p-0 m-0 d-flex justify-content-between">
              {agents.map((agent, index) => (
                <div key={agent.id} className="choose-avatar">
                  <img
                    className="coin-image"
                    src={agent.image}
                    alt={agent.name}
                    style={{
                      width: "65px",
                      cursor: "pointer",
                      border:
                        selectedAgent === agent.id ? "2px solid gold" : "none",
                    }}
                    onClick={() => handleAgentClick(agent.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="container mt-0 d-flex flex-column">
            <div className="button-group p-0 m-0 justify-content-start">
              <button
                className={`finish ${isPlacingCoins ? "finish" : ""}`}
                onClick={() => setIsPlacingCoins(!isPlacingCoins)}
              >
                {isPlacingCoins ? "Završi" : "Postavi novčiće"}
              </button>
              <button
                className="btn"
                onClick={fetchPathFromBackend}
                disabled={isPlacingCoins || goldPositionsCombined.length === 0}
              >
                <VscDebugStart
                  style={{ width: "40px", height: "30px", border: "none" }}
                />
              </button>
              <button
                className="btn"
                onClick={() => setIsGameReset(true)}
                disabled={isPlacingCoins || goldPositionsCombined.length === 0}
              >
                <VscDebugRestart
                  style={{ width: "40px", height: "30px", border: "none" }}
                />
              </button>
            </div>
            <svg
              viewBox={`0 0 ${editorMode ? 1202 : 1200} ${
                editorMode ? 640 : 602
              }`}
              className="slika"
              onClick={handleSvgClick}
            >
              {goldPositionsCombined.map((position, index) => {
                const image = position.collected ? skloninovcic : novcic;

                return (
                  <g key={index}>
                    <image
                      className="gold"
                      style={{
                        transform: `translate(${
                          (position[0] * 1000) / width
                        }px, ${(position[1] * 600) / height}px)`,
                      }}
                      x={1000 / width / 24}
                      y={600 / height / 20 + 13}
                      width="100"
                      height="100"
                      href={image}
                    />
                    <text
                      style={{
                        transform: `translate(${
                          (position[0] * 1000) / width
                        }px, ${(position[1] * 600) / height}px)`,
                      }}
                      x={1000 / width / 24 + 50} 
                      y={600 / height / 20 + 70} 
                      textAnchor="middle" 
                      fontSize="20"
                      fill="black"
                    >
                      {coinOrder[index]}
                    </text>
                  </g>
                );
              })}

              <image
                className="dest"
                style={{
                  transform: `translate(${(destY * 1000) / width}px, ${
                    (destX * 600) / height
                  }px)`,
                  paddingLeft: "2px",
                }}
                x={1000 / width / 20}
                y={600 / height / 20}
                width="90"
                height="90"
              />
              <image
                className="player"
                style={{
                  transform: `translate(${(playerY * 1000) / width}px, ${
                    (playerX * 600) / height
                  }px)`,
                }}
                x={1000 / width / 24}
                y={600 / height / 20}
                width="100"
                height="100"
                href={agents[agent - 1].image}
              />
            </svg>
          </div>
        </div>
        <div className="stats-div w-25 p-0 m-0 bg-black justify-content-between">
          <div className="steps-container p-0 m-0 w-100">
            <h3 className="text-center text-success">
              ========== Steps =========
            </h3>
            {avatarSteps.map((step, index) => (
              <p key={index} className="text-start p-2 text-success">
                Step {index + 1}: X: {step.x}, Y: {step.y}
              </p>
            ))}
            {/* <h1 className="text-center text-success">...{goldPositionsCombined}</h1> */}
          </div>
          <div>
            <h4 className="text-center text-success">
              ============================
            </h4>
            <h4 className="text-start text-success p-1">Cost: {selectedPathCost}</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pytnik;
