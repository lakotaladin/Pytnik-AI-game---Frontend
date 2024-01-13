
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Pytnik from './Pytnik/Pytnik';

function App() {
  return (

    <Routes>
    <Route path="/" element={<Pytnik/>}></Route>
    <Route path='/**' element={<p>404</p>}></Route>
    </Routes>

  );
}

export default App;
