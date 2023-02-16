import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Alert from "./components/Alert";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Login from "./components/Login/login";
import Signup from "./components/Signup/signup";


function App() {
  return (
    <>
      <Alert />
      <Navbar/>
      <Signup/>
    {/* <Login/> */}
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
