import "../styles/Login.css";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../features/alert/AlertSlice";
import { setUserProfileData } from "../features/user/userSlice"
import logo from '../res/img/rkgitlogo.png';

export default function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const login = (e) => {
    e.preventDefault();

    if (user.email === '' || user.password === '') {
      dispatch(showAlert({
        message: "Required email and password to login.",
        type: "warning"
      }));
      return;
    }

    signInWithEmailAndPassword(auth, user.email, user.password).then(async (userCredential) => {
      const profileRef = doc(db, "user", auth.currentUser.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        dispatch(setUserProfileData({ profile: profileSnap.data() }));
      }
      navigate('/');
    }).catch((error) => {
      dispatch(showAlert({
        message: "Invalid Credentials.",
        type: "danger"
      }));
    });
  }

  const forgetPasswordLink = (e) => {
    e.preventDefault();

    if (user.email === '') {
      dispatch(showAlert({
        message: "Enter the Email and then click on forget password to get reset password link.",
        type: "warning"
      }));
      return;
    }

    sendPasswordResetEmail(auth, user.email).then(() => {
      dispatch(showAlert({
        message: "You got an Email to reset password. Click on the given link and reset your password.",
        type: "success"
      }));
    }).catch(() => {
      dispatch(showAlert({
        message: "Something went wrong while sending reser password link.",
        type: "danger"
      }));
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className="login-bg w-100 h-100">
      <div className="cont">
        <div className="container d-flex justify-content-center">
          <img src={logo} alt="rkgit_logo" style={{width: "120px", height: "120px"}}/>
        </div>
        <h6>RKGIT STUDENT PORTAL LOGIN</h6>
        <form className="login-form" method="post">
          <div className="input-group mb-3 mt-4">
            <span className="input-group-text" id="basic-email">@</span>
            <input type="text" className="form-control" name="email" placeholder="Email" aria-label="Username" aria-describedby="basic-email" onChange={onUserChange} />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-password">**</span>
            <input type="password" className="form-control" name="password" placeholder="Password" aria-label="Password" aria-describedby="basic-password" onChange={onUserChange} />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary mb-3 w-100" onClick={login}>Login</button>
          </div>
          <div className="d-flex justify-content-end">
            <span className="mb-3" style={{cursor: 'pointer'}} onClick={forgetPasswordLink}>Forget Password</span>
          </div>
          <div className="d-flex justify-content-center">
            <span className="mb-3">RKGITSP CSE-IOT Department &copy; 2023</span>
          </div>
        </form>
      </div>
    </div>
  )
};