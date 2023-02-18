import '../styles/dashboard.css';
import React, { useEffect } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
        <div className="dash-cont d-flex w-75 flex-column">
            <div className="dashboard-content backgorund-img d-flex rounded-5 w-100 ">
                <div className="department d-flex align-items-end ms-4 mb-3 fs-1">
                    <span id="dep-name">IOT-A</span>
                </div>
            </div>
            <div className="dash-data-cont d-flex w-100">
                <div className="upcoming rounded-2 border w-25 m-3 p-3 fs-3">
                    <span>Upcoming</span>
                    <p className="fw-light fs-6 mt-2">No work now...</p>
                    <div className="d-flex w-100 flex-row-reverse">
                        <a href="/" className="fw-bold text-decoration-none text-dark">view all</a>
                    </div>
                </div>
                <div className="assignment-cont d-flex flex-column rounded-4 p-3 w-75">
                    <div className="announcement-cont d-flex w-100 rounded-4 p-2 border align-items-center">
                        <div className="user-pic backgorund-img pic-cont rounded-circle me-3"></div>
                        <span>Announce something</span>
                    </div>
                    <div className="assignment d-flex w-100 rounded-4 p-2 border align-items-center mt-3">
                        <div className="asgn-pic backgorund-img pic-cont rounded-circle me-3"></div>
                        <div className="d-flex w-75">
                            <div className="w-75 d-flex flex-column">
                                <span className="asgn-info fw-bold">Sir posted this: Upload your certificate</span>
                                <span className="fw-light">Date now</span>
                            </div>
                            <div className="w-25 d-flex flex-row-reverse align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical " viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                  </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
