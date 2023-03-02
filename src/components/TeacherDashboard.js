import '../styles/Dashboard.css';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { auth, db, storage } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Assignment from './Assignment';
import Announcement from './Announcement';
import { showAlert } from "../features/alert/AlertSlice";

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.profile);
  const [department, setDepartment] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [assignmentAssign, setAssignmentAssign] = useState({ subject: '', message: '', year: '2', type: "ANMT", attachment: null, attachmentType: null, outDate: '' });
  const [section, setSection] = useState([]);
  const assignAssignmentCloseBtn = useRef(null);
  const assignmentForm = useRef(null);
  const [onAssignmentBtnClick, setOnAssignmentBtnClick] = useState(false);
  const [isDepartmentLoaded, setIsDepartmentLoaded] = useState(false);
  const [isAssignmentsLoaded, setIsAssignmentsLoaded] = useState(false);

  const onAssignmentAssign = (e) => {
    if (e.target.name === 'attachment') {
      setAssignmentAssign({ ...assignmentAssign, attachment: e.target.files[0] });
      return;
    }
    setAssignmentAssign({ ...assignmentAssign, [e.target.name]: e.target.value });
  }

  const onSection = (e) => {
    const s = e.target.value;
    if (section.includes(s)) {
      const newSection = section.filter((e) => e !== s);
      setSection(newSection);
    } else {
      section.push(s);
      setSection(section);
    }
  }

  const createAssignmentDoc = (id, url, fileType) => {
    const assignmentData = {
      id: id,
      assignedBy: auth.currentUser.uid,
      subject: assignmentAssign.subject,
      message: assignmentAssign.message,
      attachment: url,
      attachmentType: fileType,
      branch: userProfile.branch,
      type: assignmentAssign.type,
      onDate: Timestamp.now(),
      outDate: Timestamp.fromDate(new Date(assignmentAssign.outDate)),
      section: section,
      year: parseInt(assignmentAssign.year)
    }
    const documentRef = doc(db, "department", userProfile.branch, "assignments", id);
    setDoc(documentRef, assignmentData).then(() => {
      assignAssignmentCloseBtn.current.click();
      dispatch(showAlert({
        message: "Assignment assigned successfully.",
        type: "primary"
      }));
      setOnAssignmentBtnClick(false);
    }).catch(() => {
      dispatch(showAlert({
        message: "Unable to Assign Assignment.",
        type: "danger"
      }));
      setOnAssignmentBtnClick(false);
    }).finally(() => {
      assignmentForm.current.reset();
      setAssignmentAssign({ subject: '', message: '', year: '2', type: "ANMT", attachment: null, attachmentType: null, outDate: '' });
      setSection([]);
      setAssignment([assignmentData].concat(assignment));
    });
  }

  const assignAssignment = (e) => {
    if (assignmentAssign.subject === '' || assignmentAssign.message === '' || assignmentAssign.outDate === '') {
      assignAssignmentCloseBtn.current.click();
      dispatch(showAlert({
        message: "Please fill the required field.",
        type: "warning"
      }));
      return;
    }

    const id = `assign${parseInt(Math.random() * 1000)}${parseInt(Math.random() * 1000)}`;

    setOnAssignmentBtnClick(true);

    if (assignmentAssign.attachment === null) {
      createAssignmentDoc(id, null, null);
    } else {
      let fileType = null;
      let storageRef = null;

      if (assignmentAssign.attachmentType === 'image/*') {
        fileType = "img";
        storageRef = ref(storage, `assignment/${id}/${auth.currentUser.uid}.png`);
      } else {
        fileType = "pdf";
        storageRef = ref(storage, `assignment/${id}/${auth.currentUser.uid}.pdf`);
      }

      uploadBytes(storageRef, assignmentAssign.attachment).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
          createAssignmentDoc(id, url, fileType);
        }).catch(() => {
          setOnAssignmentBtnClick(false);
          dispatch(showAlert({
            message: "Unable to Assign Assignment.",
            type: "danger"
          }));
        });
      }).catch(() => {
        setOnAssignmentBtnClick(false);
        dispatch(showAlert({
          message: "Unable to Assign Assignment.",
          type: "danger"
        }));
      });
    }
  }

  useEffect(() => {
    const fetchDepartment = async () => {
      const departmentRef = doc(db, "department", userProfile.branch);
      const departmentSnap = await getDoc(departmentRef);
      if (departmentSnap.exists()) {
        setDepartment(departmentSnap.data());
      }
    }

    const fetchAssignments = async () => {
      const assignmentRef = collection(db, "department", userProfile.branch, "assignments");
      const assignmentQuery = query(assignmentRef, orderBy("onDate", "desc"), where("assignedBy", "==", auth.currentUser.uid), limit(100));
      const assigmentSnap = await getDocs(assignmentQuery);
      const assignments = [];
      assigmentSnap.forEach((doc) => assignments.push(doc.data()));
      setAssignment(assignments);
    }

    if (department === null && !isDepartmentLoaded) {
      fetchDepartment();
      setIsDepartmentLoaded(true);
    }
    if (assignment === null && !isAssignmentsLoaded) {
      fetchAssignments();
      setIsAssignmentsLoaded(true);
    }
  }, [department, setDepartment, userProfile.branch, setAssignment, userProfile.section, userProfile.year, assignment, isAssignmentsLoaded, isDepartmentLoaded]);

  return (
    <>
      <div className="container-fluid d-flex justify-content-center mt-4">
        <div className="dash-cont mt-2 d-flex w-75 flex-column">
          <div className="dashboard-content backgorund-img d-flex rounded-5 w-100 ">
            <div className="department d-flex align-items-end ms-4 mb-3 fs-1">
              <span id="dep-name">{department && department.name}</span>
            </div>
          </div>
          <div className="dash-data-cont d-flex w-100">

            <div className="upcoming rounded-2 border w-25 m-3 p-3 fs-3 mt-4">
              <span>Upcoming...</span>
              <p className="fw-light fs-6 mt-2">{department && (department.upcoming === '' ? 'No event now...' : department.upcoming)}</p>
              <div className="d-flex w-100 flex-row-reverse">
                <span className="fs-6">Regards</span>
              </div>
            </div>

            <div id='assignment-bar' className="assignment-cont d-flex flex-column rounded-4 p-3 w-75">

              <div className='upcoming-card card p-3'>
                <h6>Upcoming...</h6>
                <span>{department && (department.upcoming === '' ? 'No event now...' : department.upcoming)}</span>
              </div>

              <Announcement dataBsTarget="#announce-assignment" />

              {
                (assignment === null || assignment.length === 0) &&
                <div className='d-flex justify-content-center mt-5'>
                  <h6>No Assignments are assigned.</h6>
                </div>
              }
              {
                assignment !== null && assignment.map(e => {
                  return <Assignment key={e.id} data={e} />
                })
              }
            </div>

          </div>
        </div>
      </div>

      <div className="modal fade" id="announce-assignment" tabIndex="-1" aria-labelledby="announce-assignment-label" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="announce-assignment-label">Announce something</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <form method='POST' ref={assignmentForm}>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input type="text" className="form-control" name='subject' id="subject" onChange={onAssignmentAssign} />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id='message' name='message' rows="3" style={{ resize: "none" }} onChange={onAssignmentAssign}></textarea>
                </div>

                <select className="form-select mb-3" aria-label=".form-select-lg" name='year' onChange={onAssignmentAssign}>
                  <option value="2">Year - 2</option>
                  <option value="3">Year - 3</option>
                  <option value="4">Year - 4</option>
                </select>

                <span>Section</span>
                <div className='d-flex mb-3' style={{ gap: "17px" }}>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="A" onChange={onSection} checked={section.includes('A')}/>
                    <label className="form-check-label" htmlFor="defaultCheckA">A</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="B" onChange={onSection} checked={section.includes('B')}/>
                    <label className="form-check-label" htmlFor="defaultCheckB">B</label>
                  </div>
                </div>

                <span>Announcement Type</span>
                <select className="form-select mb-3" aria-label=".form-select-lg" name='type' onChange={onAssignmentAssign}>
                  <option value="ANMT">Announcement</option>
                  <option value="ASMT">Assignment</option>
                  <option value="UNTT">Unit Test</option>
                  <option value="NOTS">Notes</option>
                </select>

                <span>Attachment</span>
                <div>
                  <div className="form-check form-check-inline mb-2">
                    <input className="form-check-input" type="radio" name="attachmentType" id='image-file' value="image/*" onChange={onAssignmentAssign} />
                    <label className="form-check-label" htmlFor="image-file">Image</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="attachmentType" id='pdf-file' value="application/pdf" onChange={onAssignmentAssign} />
                    <label className="form-check-label" htmlFor="pdf-file">Pdf</label>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input type="file" className="form-control" name='attachment' aria-describedby="attachment" aria-label="Upload" accept={assignmentAssign.attachmentType} onChange={onAssignmentAssign} />
                </div>

                <div className='mb-3'>
                  <label htmlFor="outDate" className="form-label">Submit on</label>
                  <input type="date" className="form-control" name="outDate" value={assignmentAssign.outDate} onChange={onAssignmentAssign} />
                </div>
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={assignAssignmentCloseBtn}>Close</button>
              {
               onAssignmentBtnClick ? <span className='text-success'>Assigning...</span> : <button type="button" className="btn btn-primary" onClick={assignAssignment}>Assign</button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
