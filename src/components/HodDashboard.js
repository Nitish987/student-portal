import '../styles/Dashboard.css';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { auth, db } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import Assignment from './Assignment';
import Announcement from './Announcement';

export default function HodDashboard() {
  const userProfile = useSelector(state => state.user.profile);
  const [department, setDepartment] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [upcomingMessage, setUpcomingMessage] = useState("");
  const upcomingModalCloseBtn = useRef(null);

  const onUpcomingMessage = (e) => {
    setUpcomingMessage(e.target.value);
  }

  const updateUpcomingMessage = (e) => {
    e.preventDefault();

    if (upcomingMessage === "") {
      setUpcomingMessage("No upcoming event");
    }

    const documentRef = doc(db, "department", userProfile.branch);
    updateDoc(documentRef, { upcoming: upcomingMessage }).then(() => {
      setDepartment({ ...department, "upcoming": upcomingMessage });
    }).finally(() => {
      upcomingModalCloseBtn.current.click();
    });
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

    if (department === null) {
      fetchDepartment();
    }
    if (assignment === null) {
      fetchAssignments();
    }
  }, [department, setDepartment, userProfile.branch, setAssignment, userProfile.section, userProfile.year, assignment]);

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
                <button className="fs-6 btn btn-light" data-bs-toggle="modal" data-bs-target="#upcoming-edits">Edit</button>
              </div>
            </div>

            <div id='assignment-bar' className="assignment-cont d-flex flex-column rounded-4 p-3 w-75">
              
              <Announcement/>
              
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

      <div className="modal fade" id="upcoming-edits" tabIndex="-1" aria-labelledby="upcomingModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="upcomingModalLabel">Upcoming...</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Enter the Message to Deliver</label>
                <textarea className="form-control" rows="3" cols="10" style={{resize: "none"}} onChange={onUpcomingMessage}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={upcomingModalCloseBtn}>Close</button>
              <button type="button" className="btn btn-primary" onClick={updateUpcomingMessage}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
