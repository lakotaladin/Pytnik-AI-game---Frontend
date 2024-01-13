import React, { useCallback, useEffect, useState } from 'react';
import { VscDebugRestart, VscDebugStart } from "react-icons/vsc";
import aki from "../images/Aki.png";
import jocke from "../images/Jocke.png";
import uki from "../images/Uki.png";
import micko from "../images/Micko.png";
import Agent from '../Agent/agent';
import novcic from "../images/coin.png";
import skloninovcic from "../images/collected_coin.png"
import '../App.css'
import axios from 'axios';

const agents = [
  { image: aki, name: 'Aki', id: 1, info: 'Agent Aki: Agent koristi strategiju pohlepne pretrage po dubini tako što prilikom izbora narednog zlatnika za sakupljanje bira onaj do kog je cena puta najmanja. Ukoliko postoje dva ili više takvih zlatnika, kao sledeći se bira onaj sa manjom vrednošću identifikacione oznake.' },
  { image: jocke, name: 'Jocke', id: 2, info: 'Agent Jocke: Agent koristi brute-force strategiju tako što generiše sve moguće putanje i od svih bira onu sa najmanjom cenom.' },
  { image: uki, name: 'Uki', id: 3, info: 'Agent Uki: Agent koristi strategiju grananja i ograničavanja. Ukoliko postoje dve ili više parcijalnih putanja istih cena, agent bira onu sa više sakupljenih zlatnika na putanji, a u slučaju dve ili više takvih parcijalnih putanja bira onu koja dovodi do zlatnika sa manjom vrednošću identifikacione oznake.' },
  { image: micko, name: 'Mićko', id: 4, info: 'Agent Mićko:  Agent koristi A* strategiju pretraživanja, pri čemu se za heurističku funkciju koristi minimalno obuhvatno stablo. Ukoliko postoje dve ili više parcijalnih putanja istih vrednosti funkcije procene, agent bira onu sa više sakupljenih zlatnika na putanji, a u slučaju dve ili više takvih parcijalnih putanja bira onu koja dovodi do zlatnika sa manjom vrednošću identifikacione oznake.' },
];
const novcici = [
  {image: novcic, name:'prvi', id:1},
  {image: novcic, name:'drugi', id:2},
  {image: novcic, name:'treci', id:3},
  {image: novcic, name:'cetvrti', id:4},

]



const Pytnik = () => {
  
  const[width, setWidth] = useState(10);
  const[height, setHeight] = useState(11);

  const[tiles, setTiles] = useState([1,2,1,3,4,2,2,5,3,2,2, 3,1,4,2,2,5,1,3,5,4,5, 2,1,2,5,3,4,3,0,1,2,6, 3,4,5,5,1,1,2,3,1,1,5 ,1,2,1,2,3,4,5,1,2,3,5, 4,2,1,1,5,1,2,3,2,2,5,  4,2,1,1,5,1,2,3,2,2,6,  4,2,1,1,5,1,2,3,2,2,4 , 4,2,1,1,5,1,2,3,2,2,4,   4,2,1,1,5,1,2,3,2,2,2, 4,2,1,1,5,1,2,3,2,2,4]);
  const[playerX, setPlayerX] = useState(0);
  const[playerY, setPlayerY] = useState(0);

  const[destX, setDestX] = useState(0);
  const[destY, setDestY] = useState(0);

  const[editorMode, setEditorMode] = useState(true);
  const[selectedTile, setSelectedTile] = useState(null);
  const[pathAgain, setPathAgain] = useState([])

  const[agent, setAgent] = useState(1);

  const[path, setPath] = useState([
    {x: 0, y:0}
  ]);
  



const [goldPositions, setGoldPositions] = useState(0);
const [goldPositions2, setGoldPositions2] = useState(0);

const [goldPositionsCombined, setGoldPositionsCombined] = useState([]);

const [selectedAgentId, setSelectedAgentId] = useState(null);
const handleAgentClickk = (agentId) => {
  setSelectedAgentId(agentId);
};
const [isGameReset, setIsGameReset] = useState(false);

useEffect(() => {
  if (isGameReset) {
    setTiles([1,2,1,3,4,2,2,5,3,2,2, 3,1,4,2,2,5,1,3,5,4,5, 2,1,2,5,3,4,3,0,1,2,6, 3,4,5,5,1,1,2,3,1,1,5 ,1,2,1,2,3,4,5,1,2,3,5, 4,2,1,1,5,1,2,3,2,2,5,  4,2,1,1,5,1,2,3,2,2,6,  4,2,1,1,5,1,2,3,2,2,4 , 4,2,1,1,5,1,2,3,2,2,4,   4,2,1,1,5,1,2,3,2,2,2, 4,2,1,1,5,1,2,3,2,2,4]);
    setPlayerX(0);
    setPlayerY(0);
    setDestX(0);
    setDestY(0);
    setEditorMode(true);
    setSelectedTile(null);
    setPathAgain([]);
    setAgent(1);
    setPath([{x: 0, y: 0}]);
    setGoldPositions(0);
    setGoldPositions2(0);
    setGoldPositionsCombined([]);
    setSelectedAgentId(null);
    setIsGameReset(false);
  }
}, [isGameReset]);



const placeGold = (x, y) => {
  setGoldPositions(x);
  setGoldPositions2(y);
  setGoldPositionsCombined(oldArray => [...oldArray, [x, y]]);
  
};
const [isPlacingCoins, setIsPlacingCoins] = useState(false);

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        setEditorMode(e => !e)
        console.log("I pressed");
      }
    },
    [setEditorMode]
  );

  useEffect(() => {
    document.addEventListener("keypress", keyPress);
    
  }, [keyPress]);
    
  
  const [selectedAgent, setSelectedAgent] = useState(null);
  const handleAgentClick = (agentId) => {
    setAgent(agentId);
    setSelectedAgent(agentId);
  };
  const [selectedBottomAgent, setSelectedBottomAgent] = useState(null);



  function selectTile(idx)
  {
    if(!editorMode) return
    if(selectedTile === idx)
    {
      setSelectedTile(null)
    }
    else
    {
      setSelectedTile(idx)
    }
  }


  const handleSvgClick = (e) => {
    if (isPlacingCoins) {
      // Pribavite referencu na SVG element
      const svg = e.currentTarget;
  
      // Kreirajte SVGPoint
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
  
      // Pretvorite koordinate u odnosu na SVG
      const cursorPoint = point.matrixTransform(svg.getScreenCTM().inverse());
  
      // Izračunajte indekse matrice
      const xIndex = Math.floor((cursorPoint.x / 1000) * width);
      const yIndex = Math.floor((cursorPoint.y / 600) * height);
  
      // Postavite novčić na odabrane indekse matrice
      if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
        placeGold(xIndex, yIndex);

        const newTiles = [...tiles];
        const index = xIndex + yIndex * width;
        newTiles[index] = 8; // 7 označava novčić na toj poziciji
        setTiles(newTiles);
      }
      
    }
    
  };


// Connected with BACKEND
  const fetchPathFromBackend = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/pytnik', {
        tiles: tiles,  
        playerx: playerX,
        playery: playerY,
      
        
        player_type: agents[agent-1].name,
        gold_positions:goldPositionsCombined

      });
  
      setPath(response.data.path); 
      setPathAgain(response.data.path);

      setEditorMode(e => !e)
      console.log(response.data.path, "ovo je path")
    } catch (error) {
      console.error('Greška pri dohvaćanju putanje s backenda', error);
      console.log(error);
    }
  };
 
  useEffect(() => {
    if (editorMode === true) return;
  
    let pathIdx = 0;
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (!path[pathIdx] || !path[pathIdx][stepIdx]) {
        console.log('No more steps in path');
        clearInterval(interval);
        return;
      }
  
      const [x, y] = path[pathIdx][stepIdx];
      console.log(`Moving to: x=${x}, y=${y}`);
      setPlayerX(y);
      setPlayerY(x);
      stepIdx++;
  
      if (stepIdx === path[pathIdx].length) {
        pathIdx++;
        stepIdx = 0;
      }
    }, 280);
  
    return () => clearInterval(interval);
  }, [editorMode === true]);

  useEffect(() => {
    console.log(goldPositionsCombined, "ovo je gold positions combined");
  }, [goldPositionsCombined]);
 
  useEffect(() => {
    console.log(playerX, playerY);
  }, [playerX, playerY]);
  
  useEffect(() => {
    // Prođi kroz sve novčiće
    for (let i = 0; i < goldPositionsCombined.length; i++) {
      // Proveri da li su koordinate igrača jednake koordinatama novčića
      if (playerX === goldPositionsCombined[i][1] && playerY === goldPositionsCombined[i][0]) {
        // Ažuriraj novčić da je pokupljen
        setGoldPositionsCombined(oldArray => oldArray.map((item, index) => index === i ? {...item, collected: true} : item));
  
        // Prekini petlju
        break;
      }
    }
  }, [playerX, playerY]);

  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchPathFromBackend();
    }
  };

  return (
    <>
    <div className='w-100 m-0 p-0 d-flex'>
    <div style={{ height: "100vh", margin: "auto", fontWeight: "bold", fontSize: "18px" }}>
    <div className='choose-avatar-container'>
    <p className='p-0 m-0'>Izaberite avatara</p>
      <div className='w-100 p-0 m-0 d-flex justify-content-between'>
      {agents.map((agent, index) => (
                <div key={agent.id} className='choose-avatar'>
                  <img
                    className="coin-image"
                    src={agent.image}
                    alt={agent.name}
                    style={{ width: "65px", cursor: "pointer", border: selectedAgent === agent.id ? '2px solid gold' : 'none' }}
                    onClick={() => handleAgentClick(agent.id)}
                  />
                </div>
              ))}
      </div>
      <div className='d-flex text-white'>
                  {selectedAgent && (
                      <div className="additional-info d-flex flex-row gap-2 m-0 w-100" style={{ textAlign: "center" }}>
                        <p className='p-0 m-0'>Izabrali ste:</p>
                        <p className='p-0 m-0'>{agents[selectedAgent - 1].name} {agents[selectedAgent - 1].additionalInfo}</p>
                      </div>
                      )}            
                      
                      </div>      
    </div>
  
      <div className="container mt-0 d-flex flex-column">
      <div className="button-group p-0 m-0 justify-content-start">
        <button className={`finish ${isPlacingCoins ? 'finish' : ''}`} onClick={() => setIsPlacingCoins(!isPlacingCoins)}>
          {isPlacingCoins ? 'Završi' : 'Postavi novčiće'}
        </button>
        <button className='btn' onClick={fetchPathFromBackend} onKeyPress={handleKeyPress} disabled={isPlacingCoins || goldPositionsCombined.length === 0}><VscDebugStart style={{width: "40px", height: "30px", border: "none"}} /></button>
        <button className='btn' onClick={() => setIsGameReset(true)} disabled={isPlacingCoins || goldPositionsCombined.length === 0} ><VscDebugRestart style={{width: "40px", height: "30px", border: "none"}} /></button>       
      </div>
        <svg viewBox={`0 0 ${editorMode ? 1202 : 1200} ${editorMode ? 640 : 602}`} className='slika' onClick={handleSvgClick} >
          
          {goldPositionsCombined.map((position, index) => {
            const image = position.collected ? skloninovcic : novcic;
  
            return (
              <image
                key={index}
                className="gold"
                style={{ transform: `translate(${position[0] * 1000 / width}px, ${position[1] * 600 / height}px)` }}
                x={1000 / width / 24}
                y={600 / height / 20}
                width="100"
                height="100"
                href={image}
              />
            );
          })}
  
          <image className="dest" style={{ transform: `translate(${destY * 1000 / width}px, ${destX * 600 / height}px)`, paddingLeft: "2px" }} x={1000 / width / 20} y={600 / height / 20} width="90" height="90"  />
          <image className="player" style={{ transform: `translate(${playerY * 1000 / width}px, ${playerX * 600 / height}px)` }} x={1000 / width / 24} y={600 / height / 20} width="100" height="100"  href={agents[agent-1].image}/>
        </svg>
      </div>
  
    

      {/* <div style={{ display: "flex", gap: "3rem", marginTop: "0rem", justifyContent: "center" }}>
  {agents && agents.map((agent) => (
    <div
      key={agent.id}
      className={`agent-container ${selectedAgentId === agent.id ? 'selected' : ''}`}
    >
      <div className="agent-content" onClick={() => handleAgentClickk(agent.id)}>
        <Agent image={agent.image} name={agent.name} add={''} />
        {selectedAgentId === agent.id && (
          <div className="agent-info">
            <p>{agent.info}</p>
          </div>
        )}
      </div>
    </div>
  ))}
</div> */}

      {/* {selectedBottomAgent && (
    <div className="agent-info">
        <p>{agents[selectedBottomAgent - 1].info}</p>
    </div>
)} */}
    </div>
    <div className='w-25 p-0 m-0 bg-black justify-content-between'>
      <div>
      <h3 className='text-center text-success'>========== Steps ========== </h3>
      <h1 className='text-center text-success'>steps...</h1>
      </div>
    <div>
    <h4 className='text-center text-success'>============================</h4>
      <h3 className='text-start text-success p-1'>Cost: 0</h3>
    </div>
    </div>
    </div>
    </>
    
  );
  
}


export default Pytnik;