import "./App.css";
import Alert from "./components/Alert";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Login from "./components/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { auth } from "./firebase/firebase";
import { setLoggedIn } from "./features/auth/authSlice";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setLoggedIn({ uid: user.uid }));
      }
    });
  }, [dispatch]);

  return (
    <>
      <Alert />
      {isLoggedIn && <Navbar />}
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
