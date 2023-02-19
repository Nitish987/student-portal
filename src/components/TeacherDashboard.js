import '../styles/Dashboard.css';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { db } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import Assignment from './Assignment';

export default function TeacherDashboard() {
  const userProfile = useSelector(state => state.user.profile);
  const [department, setDepartment] = useState(null);
  const [assignment, setAssignment] = useState(null);

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
      const assignmentQuery = query(assignmentRef, orderBy("onDate", "desc"), where("section", "==", userProfile.section), where("year", "==", userProfile.year), limit(100));
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
              <button className="fw-bold fs-6 btn btn-primary">{`Regards ${department && department.hod}`}</button>
            </div>
          </div>

          <div id='assignment-bar' className="assignment-cont d-flex flex-column rounded-4 p-3 w-75">
            {
              (assignment === null || assignment.length === 0) &&
              <div className='d-flex justify-content-center mt-5'>
                <h6>No Assignments are assigned.</h6>
              </div>
            }
            {
              assignment !== null && assignment.map(e => {
                return <Assignment key={e.id} data={e}/>
              })
            }
          </div>

        </div>
      </div>
    </div>
  )
}
