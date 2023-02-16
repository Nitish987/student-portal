import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Alert from "./components/Alert";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Alert />
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard/>}/>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
