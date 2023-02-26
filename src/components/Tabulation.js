import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Loading from './Loading';

export default function Tabulation() {
  const userProfile = useSelector(state => state.user.profile);
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [filters, setFilters] = useState({ year: 1, section: 'A' });
  const [isLoaded, setIsLoaded] = useState(false);

  const onFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  const search = (e) => {
    setFilteredUsers(users.filter(e => (e.year === parseInt(filters.year) && e.section === filters.section)));
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "user");
      const usersQuery = query(usersRef, where("branch", "==", userProfile.branch), where("role", "==", "student"), limit(600));
      const usersSnap = await getDocs(usersQuery);
      const allUsers = [];
      usersSnap.forEach((doc) => {
        allUsers.push(doc.data());
      });
      setUsers(allUsers);
    }

    if (userProfile && userProfile.role === 'hod' && users === null && !isLoaded) {
      fetchUsers();
      setIsLoaded(true);
    }
  }, [users, userProfile, isLoaded]);
  return (
    <>
      {
        (userProfile && userProfile.role === 'hod') ?
        <div className='container-fluid mt-4'>
          <div className='container mt-3 mb-3'>
            <h1 className='mb-3'>Tabulation</h1>
            <div className="row g-3">
              <div className="col">
                <select className="form-select mb-3" aria-label=".form-select-lg" name='year' onChange={onFilter}>
                  <option value="1">Year - 1</option>
                  <option value="2">Year - 2</option>
                  <option value="3">Year - 3</option>
                  <option value="4">Year - 4</option>
                  <option value="5">B.Tech Completed</option>
                </select>
              </div>
              <div className="col">
                <select className="form-select mb-3" aria-label=".form-select-lg" name='section' onChange={onFilter}>
                  <option value="A">Section - A</option>
                  <option value="B">Section - B</option>
                  <option value="C">Section - C</option>
                  <option value="D">Section - D</option>
                </select>
              </div>
              <div className="col">
                <button type='button' className='btn btn-primary' onClick={search}>Search</button>
              </div>
            </div>
            {
              (filteredUsers === null || filteredUsers.length === 0) ? <Loading message="No Student Found." /> :
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Roll.no.</th>
                      <th scope="col">Name</th>
                      <th scope="col">Father's Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Activity</th>
                      <th scope="col">Activity Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filteredUsers.map((e, i) => {
                        return (
                          <React.Fragment key={i}>
                            <tr>
                              <th scope="row">{i + 1}</th>
                              <td>{e.rollno}</td>
                              <td>{e.name}</td>
                              <td>{e.fatherName}</td>
                              <td>{e.email}</td>
                              <td>{e.phone}</td>
                              <td>{e.activity ? e.activity.message : '-'}</td>
                              <td>{(e.activity && e.activity.attachment) ? <a href={e.activity.attachment} target="_blank" rel="noreferrer">Attachment</a> : '-'}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    }
                  </tbody>
                </table>
            }
          </div>
        </div>
        :
        <Loading message="Something went wrong!"/>
      }
    </>
  )
}
