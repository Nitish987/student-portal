import '../styles/ProfileCard.css';
import React, { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase/firebase';
import profile_svg from '../res/svg/profile.svg';
import female_svg from '../res/svg/female.svg';
import male_svg from '../res/svg/male.svg';

export default function ProfileCard({ userProfile, setUserProfile }) {
  const getProfilePic = () => {
    if(userProfile === null) {
      return profile_svg;
    } else if(userProfile.photo !== null) {
      return userProfile.photo;
    }
    if(userProfile.gender === 'M') {
      return male_svg;
    }
    if(userProfile.gender === 'F') {
      return female_svg;
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const profileRef = doc(db, "user", auth.currentUser.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setUserProfile(profileSnap.data());
      }
    }
    if(userProfile === null) {
      fetchProfile();
    }
  }, [userProfile]);

  return (
    <React.Fragment>
      <div className="conta">
        <section className="bio">
          <div className="profile-photo">
            <img src={getProfilePic()} alt="profile" />
          </div>
          <div className="profile-info">
            <p className="username">{userProfile !== null ? userProfile.name: 'Your Name'} <br /><span className="st">{auth.currentUser.email}</span></p>
            <br></br>
            <ul className="contali">
              <li><b>Course</b> <br /><span className="st2">{userProfile !== null ? userProfile.course: 'N/A'}</span></li>
              <li><b>Branch</b> <br /><span className="st2">{userProfile !== null ? userProfile.branch: 'N/A'}</span></li>
              <li><b>Section</b> <br /><span className="st2">{userProfile !== null ? userProfile.section: 'N/A'}</span></li>
              <li><b>Roll No.</b> <br /><span className="st2 st3">{userProfile !== null ? userProfile.rollno: 'N/A'}</span></li>
            </ul>
          </div>
        </section>
      </div>
    </React.Fragment>
  )
}