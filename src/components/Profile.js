import '../styles/Profile.css';
import React, { useEffect, useState } from 'react'
import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, updatePassword, signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebase";
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { showAlert } from "../features/alert/AlertSlice";
import ProfileCard from './ProfileCard';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [userPassword, setUserPassword] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const onUserPasswordChange = (e) => {
    setUserPassword({ ...userPassword, [e.target.name]: e.target.value });
  }

  const onProfilePicChoosen = async (e) => {
    setProfilePic(e.target.files[0]);
  }

  const changePassword = (e) => {
    e.preventDefault();

    if (userPassword.oldPassword === '' || userPassword.newPassword === '') {
      dispatch(showAlert({
        message: "Password field are required.",
        type: "warning"
      }));
      return;
    }

    if (userPassword.newPassword !== userPassword.confirmPassword) {
      dispatch(showAlert({
        message: "Password doesn't matched. Try again.",
        type: "warning"
      }));
      return;
    }

    const credential = EmailAuthProvider.credential(auth.currentUser.email, userPassword.oldPassword);
    reauthenticateWithCredential(auth.currentUser, credential).then(() => {
      updatePassword(auth.currentUser, userPassword.confirmPassword).then(() => {
        dispatch(showAlert({
          message: "Password updated successfully.",
          type: "primary"
        }));
      }).catch((error) => {
        dispatch(showAlert({
          message: "Unable to update password.",
          type: "warning"
        }));
      });
    }).catch((error) => {
      dispatch(showAlert({
        message: "Invalid Credentials.",
        type: "danger"
      }));
    });
  }

  const changeProfilePic = (e) => {
    e.preventDefault();

    if (profilePic === null) {
      dispatch(showAlert({
        message: "Please Select the Profile Photo.",
        type: "warning"
      }));
      return;
    }

    const storageRef = ref(storage, `profile/${auth.currentUser.uid}.png`);
    uploadBytes(storageRef, profilePic).then((snapshot) => {
      getDownloadURL(storageRef).then((url) => {
        const profileDoc = doc(db, "user", auth.currentUser.uid);
        updateDoc(profileDoc, {
          photo: url
        }).then(() => {
          setUserProfile({ ...userProfile, photo: url});
        });
      });
    });
  }

  const logout = (e) => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      dispatch(showAlert({
        message: "Unable to logout.",
        type: "danger"
      }));
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <>
      <ProfileCard userProfile={userProfile} setUserProfile={setUserProfile} />
      <div className="container">
        <div className="row profile-container-row">
          <div className="col">
            <div className='container-sm mt-5'>
              <h5>Profile Settings</h5>
              <div className="input-group">
                <input type="file" className="form-control" id="inputGroupFile04" aria-describedby="profile-pic-choose" aria-label="Upload" onChange={onProfilePicChoosen} accept="image/*" />
                <button className="btn btn-outline-primary" type="button" id="profile-pic-choose" onClick={changeProfilePic}>Change Pic</button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className='container-sm mt-5'>
              <h5>Change Password</h5>
              <form className="mt-2" method="post">
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-password">**</span>
                  <input type="password" className="form-control" name="oldPassword" placeholder="Old Password" aria-label="Password" aria-describedby="basic-password" onChange={onUserPasswordChange} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-password">**</span>
                  <input type="password" className="form-control" name="newPassword" placeholder="New Password" aria-label="Password" aria-describedby="basic-password" onChange={onUserPasswordChange} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-password">**</span>
                  <input type="password" className="form-control" name="confirmPassword" placeholder="Confirm Password" aria-label="Password" aria-describedby="basic-password" onChange={onUserPasswordChange} />
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary mb-3 w-100" onClick={changePassword}>Change Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="d-flex justify-content-end">
          <h5>Account Settings</h5>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-dark mb-3" onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  )
}
