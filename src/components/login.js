import "../styles/Login.css";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../features/alert/AlertSlice";
import { setLoggedIn } from "../features/auth/authSlice";

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

    signInWithEmailAndPassword (auth, user.email, user.password).then((userCredential) => {
      dispatch(setLoggedIn({ uid: userCredential.uid }));
      navigate('/');
    }).catch((error) => {
      dispatch(showAlert({
        message: "Invalid Credentials.",
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
        <h1>RKGITSP LOGIN</h1>
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
        </form>
      </div>
    </div>
  )
};