import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { auth, db, storage } from "../firebase/firebase";
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { showAlert } from '../features/alert/AlertSlice';

export default function AssignmentView() {
  const params = useParams();
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.profile);
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);

  const timestamp = (time) => {
    const fireBaseTime = new Date(time.seconds * 1000 + time.nanoseconds / 1000000,);
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();
    return date + " - " + atTime;
  }

  const onFileSelected = (e) => {
    setFile(e.target.files[0]);
  }

  const uploadAssignment = (e) => {
    e.preventDefault();

    if (file === null) {
      dispatch(showAlert({
        message: "Please Select the Assignment PDF.",
        type: "warning"
      }));
      return;
    }

    const storageRef = ref(storage, `assignment/${params.id}/${auth.currentUser.uid}.pdf`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then(async (url) => {

        const compeletedDoc = doc(db, "department", userProfile.branch, "assignments", params.id, "completed", auth.currentUser.uid);
        const completedSnap = await getDoc(compeletedDoc);

        if (completedSnap.exists()) {

          updateDoc(compeletedDoc, {
            name: userProfile.name,
            rollno: userProfile.rollno,
            file: url,
            uid: auth.currentUser.uid
          }).then(() => {
            dispatch(showAlert({
              message: "Assignment Completed.",
              type: "success"
            }));
            return;
          });

        } else {

          setDoc(compeletedDoc, {
            name: userProfile.name,
            rollno: userProfile.rollno,
            file: url,
            uid: auth.currentUser.uid
          }).then(() => {
            dispatch(showAlert({
              message: "Assignment Completed.",
              type: "success"
            }));
            return;
          });

        }

      });
    });
  }

  useEffect(() => {
    const fetchAssignment = async () => {
      const assignmentRef = doc(db, "department", userProfile.branch, "assignments", params.id);
      const assignmentSnap = await getDoc(assignmentRef);
      if (assignmentSnap.exists()) {
        setAssignment(assignmentSnap.data());
      }
    }

    if (userProfile !== null && assignment === null) {
      fetchAssignment();
    }
  }, [assignment, setAssignment, params.id, userProfile]);

  return (
    <>
      {
        userProfile === null && <Loading />
      }
      {
        userProfile
        &&
        <>
          {
            assignment === null && <Loading />
          }
          {
            assignment !== null
            &&
            <>
              <div className='container mt-5'>
                <h4>Assignment | {assignment.subject}</h4>
                <span>{assignment.message}</span>
                <br />
                <br />
                <span>Assigned on - {timestamp(assignment.onDate)}</span>
                <br />
                <span>Submit on &nbsp;&nbsp;&nbsp;- {timestamp(assignment.outDate)}</span>

                <div className="input-group mt-5">
                  <input type="file" className="form-control" aria-describedby="assignment-choose" aria-label="Upload" onChange={onFileSelected} />
                </div>

                <span>Select and upload the given assignment.</span>
              </div>
              <div className='container mt-5 d-flex justify-content-end'>
                <button className="btn btn-success" type="button" onClick={uploadAssignment}>Mark as Done</button>
              </div>
            </>
          }
        </>
      }
    </>
  )
}
