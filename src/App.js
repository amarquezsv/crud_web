import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowProviders from './components/ShowProviders'
import ShowProducts from './components/ShowProducts'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<ShowProviders></ShowProviders>}></Route>
      </Routes>
      <Routes>
        <Route path="" element={<ShowProducts></ShowProducts>}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
