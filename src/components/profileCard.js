import '../styles/profileCard.css';
import React from "react";

export default function ProfileCard() {
    return (
        <React.Fragment>
        <div className="conta">
        <section className="bio">
          <div className="profile-photo">
            <img src="https://c.ndtvimg.com/2021-03/mjvj8moo_kiara-instagram_625x300_17_March_21.jpg" alt="profile-photo.png" />
          </div>
          <div className="profile-info">
            <p className="username">meri darling <br /><span className="st">(ekno)</span></p>
            <br></br>
            <ul className="contali">
              <li>Course <br /><span className="st2">(B.Tech)</span></li>
              <li>Branch <br /><span className="st2">(IOT)</span></li>
              <li>Sec <br /><span className="st2">(B)</span></li>
              <li>Roll_No <br /><span className="st2 st3"> 2000331550106 </span></li>
            </ul>
          </div>
        </section>
      </div>
      </React.Fragment>
    )
}