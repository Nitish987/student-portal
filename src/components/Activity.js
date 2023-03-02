import React, { useEffect, useRef, useState } from 'react';
import { showAlert } from "../features/alert/AlertSlice";
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDocs, limit, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db, storage } from '../firebase/firebase';
import Post from './Post';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function Activity() {
  const userProfile = useSelector(state => state.user.profile);
  const dispatch = useDispatch();
  const [activity, setActivity] = useState({ message: '', attachment: null });
  const activityModalCloseBtn = useRef(null);
  const [allActivities, setAllActivities] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [onPostBtnClick, setOnPostBtnClick] = useState(false);

  const onActivity = (e) => {
    if (e.target.name === 'attachment') {
      setActivity({ ...activity, [e.target.name]: e.target.files[0] });
      return;
    }
    setActivity({ ...activity, [e.target.name]: e.target.value });
  }

  const createActivityDoc = (id, url) => {
    const activityData = {
      id: id,
      name: userProfile.name,
      rollno: userProfile.rollno,
      section: userProfile.section,
      year: userProfile.year,
      message: activity.message,
      attachment: url,
      date: Timestamp.now(),
      uid: auth.currentUser.uid
    }

    const activityRef = doc(db, "department", userProfile.branch, "activity", id);
    setDoc(activityRef, activityData).then(() => {

      const profileDoc = doc(db, "user", auth.currentUser.uid);
      updateDoc(profileDoc, {
        activity: {
          id: activityData.id,
          message: activityData.message,
          attachment: activityData.attachment
        }
      });

      activityModalCloseBtn.current.click();
      setOnPostBtnClick(false);
      window.location.reload();

    }).catch((e) => {
      dispatch(showAlert({
        message: "Unable to post.",
        type: "danger"
      }));
      setOnPostBtnClick(false);
    });
  }

  const postActivity = (e) => {
    if (activity.message === '') {
      activityModalCloseBtn.current.click();
      dispatch(showAlert({
        message: "Message is required.",
        type: "warning"
      }));
      return;
    }

    const id = `activity${parseInt(Math.random() * 1000)}${parseInt(Math.random() * 1000)}`;

    setOnPostBtnClick(true);

    if (activity.attachment !== null) {
      const storageRef = ref(storage, `activity/${id}/${activity.attachment.name}`);
      uploadBytes(storageRef, activity.attachment).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
          createActivityDoc(id, url)
        }).catch(() => {
          activityModalCloseBtn.current.click();
          dispatch(showAlert({
            message: "Unable to Post.",
            type: "danger"
          }));
          setOnPostBtnClick(false);
        });
      }).catch(() => {
        activityModalCloseBtn.current.click();
        dispatch(showAlert({
          message: "Unable to Post.",
          type: "danger"
        }));
        setOnPostBtnClick(false);
      });
    } else {
      createActivityDoc(id, null);
    }
  }

  useEffect(() => {
    const fetchNActivities = async () => {
      const activityRef = collection(db, "department", userProfile.branch, "activity");
      let activityQuery = null;
      if (userProfile.role === 'student') {
        activityQuery = query(activityRef, orderBy("date", "desc"), where("section", "==", userProfile.section), where("year", "==", userProfile.year), limit(100));
      } else {
        activityQuery = query(activityRef, orderBy("date", "desc"), limit(100));
      }
      const activitySnap = await getDocs(activityQuery);
      const activities = [];
      activitySnap.forEach((doc) => {
        activities.push(doc.data());
      });
      setAllActivities(activities);
    }

    if (userProfile && allActivities === null && !isLoaded) {
      fetchNActivities();
      setIsLoaded(true);
    }
  }, [allActivities, userProfile, isLoaded]);

  return (
    <div className='container-fluid mt-4'>
      <div className='container mt-3 mb-3'>
        <h1 className='mb-3'>Activity</h1>
        {
          userProfile && userProfile.role === 'student' &&
          <div className='card p-3 my-3' style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#ActvityModal">
            <span>Write whats your new activity.....</span>
          </div>
        }

        <div>
          {
            allActivities && allActivities.map(e => {
              return <Post key={e.id} id={e.id} uid={e.uid} name={e.name} year={e.year} section={e.section} message={e.message} attachment={e.attachment} date={e.date} />
            })
          }
        </div>

        <div className="modal fade" id="ActvityModal" tabIndex="-1" aria-labelledby="activityModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="activityModalLabel">Your Activity</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id='message' name='message' rows="3" style={{ resize: "none" }} onChange={onActivity}></textarea>
                </div>
                <span>Attachment</span>
                <div className="input-group mt-2">
                  <input type="file" className="form-control" aria-describedby="attachment-choose" aria-label="Upload" name='attachment' onChange={onActivity} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={activityModalCloseBtn}>Close</button>
                {
                  onPostBtnClick ? <span className='text-success'>Posting...</span> : <button type="button" className="btn btn-primary" onClick={postActivity}>Post</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
