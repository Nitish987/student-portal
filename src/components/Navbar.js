import React from 'react'
import logo from '../logo.svg';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary bg-dark">
      <div className="container-fluid">
        <a class="navbar-brand text-light" href="/">
          <img src={logo} alt="Logo" width="29" height="29" class="d-inline-block align-text-top" />
          RKGITSP
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active text-light" aria-current="page" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="/">Link</a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  )
}
