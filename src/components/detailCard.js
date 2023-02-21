import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import female_svg from '../res/svg/female.svg';
import male_svg from '../res/svg/male.svg';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { setNewData } from '../features/bundle/bundleSlice';

const DetailCard = ({ uid, name, rollno, file, date, outDate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pic, setPic] = useState(null);
  const [gender, setGender] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const updateBundleData = (e) => {
    dispatch(setNewData({ data: file }));
    navigate('/pdf');
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
    <>
      <div className="container mt-3" onClick={updateBundleData} style={{ cursor: "pointer" }}>
        <div className="w-100">
          <div className="card card-body text-black" style={{ borderRadius: "15px" }}>
            <div className="d-flex align-items-center">
              <img src={getProfilePic()} alt="profile-pic" className="img-fluid rounded-circle " style={{ width: '50px', height: '50px' }} />
              <div className=" ms-3">
                <p className="mb-0 me-1">{name}</p>
                <p className={`text-${outDate.toMillis() > date.toMillis() ? "success" : "danger"} mb-0 me-1`}>{rollno} - COMPLETED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailCard;
