import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import female_svg from '../res/svg/female.svg';
import male_svg from '../res/svg/male.svg';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Assignment({ data }) {
  const userProfile = useSelector(state => state.user.profile);
  const [pic, setPic] = useState(null);
  const [gender, setGender] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const timestamp = (time) => {
    const fireBaseTime = new Date(time.seconds * 1000 + time.nanoseconds / 1000000,);
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();
    return date + " - " + atTime;
  }

  const getProfilePic = () => {
    if (pic === null) {
      if (gender === 'M') {
        return male_svg;
      }
      if (gender === 'F') {
        return female_svg;
      }
    }
    return pic;
  }

  useEffect(() => {
    if (gender === null && !isLoaded) {
      const profileRef = doc(db, "user", data.assignedBy);
      getDoc(profileRef).then(profileSnap => {
        if (profileSnap.exists()) {
          setPic(profileSnap.data().photo);
          setGender(profileSnap.data().gender);
        }
      });
      setIsLoaded(true);
    }
  }, [pic, gender, setPic, setGender, data.assignedBy, isLoaded]);

  return (
    <>
      <div className="assignment d-flex w-100 rounded-4 p-3 border align-items-center mt-2">
        <div className="asgn-pic pic-cont rounded-circle me-3">
          <img className="w-100 h-100" src={getProfilePic()} style={{borderRadius: "100%"}} alt="user" />
        </div>
        <div className="d-flex w-100">
          <div className="w-75 d-flex flex-column">
            <span className="asgn-info fw-bold">{data.subject} : {data.message}</span>
            <span className="fw-light">{timestamp(data.onDate)}</span>
          </div>
          <div className="w-25 d-flex flex-row-reverse align-items-center">
            {
              userProfile.role === 'student' && <Link className="btn btn-light" to={`/assignment/${data.id}`}>Open</Link>
            }
            {
              (userProfile.role === 'hod' || userProfile.role === 'teacher') && <Link className="btn btn-light" to={`/assigned/${data.id}`}>View</Link>
            }
          </div>
        </div>
      </div>
    </>
  )
}
