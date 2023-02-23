import React from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../res/img/rkgitlogo.png';
import profile_svg from '../res/svg/profile.svg';

export default function Navbar() {
  const navigate = useNavigate();

  const toProfile = (e) => navigate('/profile');

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary bg-dark" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand text-light" href="/">
          <img src={logo} alt="Logo" width="29" height="29" className="d-inline-block align-text-top me-2" />
          RKGITSP
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 96 960 960" width="30" fill='#ffffff'><path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" /></svg>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active text-light" aria-current="page" href="/">Home</a>
            </li>
          </ul>
          <div className="d-flex" role="search">
            <button className="btn btn-success" onClick={toProfile}>
              <img src={profile_svg} alt="profile" width="29" height="29" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
