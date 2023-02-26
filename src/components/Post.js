import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { db, auth } from '../firebase/firebase';
import female_svg from '../res/svg/female.svg';
import male_svg from '../res/svg/male.svg';
import delete_svg from '../res/svg/delete.svg';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from "../features/alert/AlertSlice";

export default function Post({ id, uid, name, year, section, message, attachment, date }) {
  const dispatch = useDispatch();
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

  const deleteActivity = (e) => {
    const documentRef = doc(db, "department", userProfile.branch, "activity", id);
    deleteDoc(documentRef).then(() => {

      if (userProfile && userProfile.activity && userProfile.activity.id === id) {
        const profileDoc = doc(db, "user", auth.currentUser.uid);
        updateDoc(profileDoc, {
          activity: null
        });
      }

      window.location.reload();

    }).catch(() => {
      dispatch(showAlert({
        message: "Unable to delete this post.",
        type: "danger"
      }));
    });
  }

  useEffect(() => {
    if (gender === null && !isLoaded) {
      const profileRef = doc(db, "user", uid);
      getDoc(profileRef).then(profileSnap => {
        if (profileSnap.exists()) {
          setPic(profileSnap.data().photo);
          setGender(profileSnap.data().gender);
        }
      });
      setIsLoaded(true);
    }
  }, [pic, gender, setPic, setGender, uid, isLoaded]);

  return (
    <div className="card mb-3">
      <div className="card-body d-flex flex-column">
        <div className="d-flex ">
          <div className="pic-cont rounded-circle">
            <img className="h-100 w-100 rounded-circle" src={getProfilePic()} alt="user" />
          </div>
          <div className="w-100 ms-3">
            <h5 className="h4 mb-0">{name}</h5>
            <div className="fw-light fs-6">{year} Year CSE(IOT)-{section}</div>
          </div>
          {
            uid === auth.currentUser.uid &&
            <button className='btn' onClick={deleteActivity}>
              <img src={delete_svg} height='20' width='20' alt="delete" />
            </button>
          }
        </div>
        <p className="card-text p-2 mb-1">{message}</p>
        {
          attachment && <a href={attachment} className='btn btn-outline-primary align-self-end mb-2'>Download Attachment</a>
        }
        <span className="align-self-end">{timestamp(date)}</span>
      </div>
    </div>
  )
}
