import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
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
  const [isAssignmentExists, setIsAssignmentExists] = useState(true);
  const [file, setFile] = useState(null);
  const [isCompleteDocExists, setIsCompleteDocExists] = useState(false);
  const [uploadingLoading, setUploadingLoading] = useState(false);

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

    setUploadingLoading(true);

    const storageRef = ref(storage, `assignment/${params.id}/${auth.currentUser.uid}.pdf`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then(async (url) => {

        const compeletedDoc = doc(db, "department", userProfile.branch, "assignments", params.id, "completed", auth.currentUser.uid);

        if (isCompleteDocExists) {

          updateDoc(compeletedDoc, {
            name: userProfile.name,
            rollno: userProfile.rollno,
            section: userProfile.section,
            file: url,
            uid: auth.currentUser.uid,
            date: Timestamp.now()
          }).then(() => {
            dispatch(showAlert({
              message: "Assignment Completed.",
              type: "success"
            }));
            return;
          }).finally(() => {
            setUploadingLoading(false);
            isCompleteDocExists(true);
          });

        } else {

          setDoc(compeletedDoc, {
            name: userProfile.name,
            rollno: userProfile.rollno,
            section: userProfile.section,
            file: url,
            uid: auth.currentUser.uid,
            date: Timestamp.now()
          }).then(() => {
            dispatch(showAlert({
              message: "Assignment Completed.",
              type: "success"
            }));
            return;
          }).finally(() => {
            setUploadingLoading(false);
            isCompleteDocExists(true);
          });

        }

      });
    });
  }

  useEffect(() => {
    const fetchAssignment = async () => {
      const assignmentRef = doc(db, "department", userProfile.branch, "assignments", params.id);
      const assignmentSnap = await getDoc(assignmentRef);
      if (assignmentSnap.exists() && assignmentSnap.data().section.includes(userProfile.section) && assignmentSnap.data().year === userProfile.year && assignmentSnap.data().branch === userProfile.branch) {
        setAssignment(assignmentSnap.data());
      } else {
        setIsAssignmentExists(false);
      }
    }

    const checkCompetedDocExistance = async () => {
      const compeletedDoc = doc(db, "department", userProfile.branch, "assignments", params.id, "completed", auth.currentUser.uid);
      const completedSnap = await getDoc(compeletedDoc);
      if (completedSnap.exists()) {
        setIsCompleteDocExists(true);
      }
    }

    if (userProfile !== null && assignment === null) {
      fetchAssignment();
      checkCompetedDocExistance();
    }
  }, [assignment, setAssignment, params.id, userProfile, setIsCompleteDocExists, isCompleteDocExists]);

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
            assignment === null && isAssignmentExists && <Loading />
          }
          {
            assignment === null && !isAssignmentExists && <Loading message="This Assignment is not alloted to you. Have a nice day." />
          }
          {
            assignment !== null
            &&
            <>
              <div className='container mt-5'>
                <h4>{assignment.type === "NOTS" ? "Notes" : assignment.type === "ASMT" ? "Assignment" : assignment.type === "UNTT" ? "Unit Test" : "Announcement"} | {assignment.subject}</h4>
                <span>{assignment.message}</span>
                <br />
                <br />
                <span>Assigned on - {timestamp(assignment.onDate)}</span>
                {
                  (assignment.type === "ASMT" || assignment.type === "ANMT" || assignment.type === "UNTT") &&
                  <>
                    <br />
                    <span>Submit on &nbsp;&nbsp;&nbsp;- {timestamp(assignment.outDate)}</span>
                  </>
                }
                <br />
                <br />

                {
                  assignment.attachment
                  &&
                  <>
                    <span><b>Attachment</b></span>
                    <div className="mt-3">
                      {
                        assignment.attachmentType === "img" &&
                        <img src={assignment.attachment} className="img-thumbnail" alt="attachment" />
                      }
                      {
                        assignment.attachmentType === "pdf" &&
                        <iframe title='PDF' src={assignment.attachment} className="w-100 vh-100"></iframe>
                      }
                    </div>
                  </>
                }

                {
                  (assignment.type === "ASMT" || assignment.type === "ANMT" || assignment.type === "UNTT") &&
                  <>
                    <div className="input-group mt-5">
                      <input type="file" className="form-control" aria-describedby="assignment-choose" aria-label="Upload" accept='application/pdf' onChange={onFileSelected} />
                    </div>
                    <span>Select and upload the given assignment.</span>
                  </>
                }

              </div>
              {
                (assignment.type === "ASMT" || assignment.type === "ANMT" || assignment.type === "UNTT") &&
                <div className='container mt-5 d-flex flex-column align-items-end'>
                  {
                    isCompleteDocExists && <span className='text-success'>You have already submitted this Assignment.</span>
                  }
                  {
                    uploadingLoading ? <span className='text-success mt-3 mb-5'>Uploading...</span> : <button className="btn btn-success mt-3 mb-5" type="button" onClick={uploadAssignment}>Mark as Done</button>
                  }
                </div>
              }
            </>
          }
        </>
      }
    </>
  )
}
