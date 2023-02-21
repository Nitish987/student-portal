import "./App.css";
import Alert from "./components/Alert";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Login from "./components/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { setUserProfileData } from "./features/user/userSlice";
import AssignmentView from "./components/AssignmentView";
import AssignedView from "./components/AssignedView";
import PdfViewer from "./components/PdfViewer";

function App() {
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.profile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);

        const profileRef = doc(db, "user", auth.currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          dispatch(setUserProfileData({ profile: profileSnap.data() }));
        }
        
      } else {
        setIsLoggedIn(false);
        
        dispatch(setUserProfileData({ profile: null }));
      }
    });
  }, [userProfile, dispatch])

  return (
    <>
      <Alert />
      <BrowserRouter>
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/assignment/:id" element={<AssignmentView />} />
          <Route path="/assigned/:id" element={<AssignedView />} />
          <Route path="/pdf" element={<PdfViewer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
