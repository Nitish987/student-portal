import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Assignment({ data }) {
  const userProfile = useSelector(state => state.user.profile);

  const timestamp = (time) => {
    const fireBaseTime = new Date(time.seconds * 1000 + time.nanoseconds / 1000000,);
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();
    return date + " - " + atTime;
  }

  return (
    <>
      <div className="assignment d-flex w-100 rounded-4 p-3 border align-items-center mt-2">
        <div className="asgn-pic pic-cont rounded-circle me-3">
          <img className="w-100 h-100" src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.webp" alt="user" />
        </div>
        <div className="d-flex w-100">
          <div className="w-75 d-flex flex-column">
            <span className="asgn-info fw-bold">{data.subject} : {data.message}</span>
            <span className="fw-light">{timestamp(data.onDate)}</span>
          </div>
          <div className="w-25 d-flex flex-row-reverse align-items-center">
            {
              userProfile.role === 'student' && <Link className="btn btn-light" to={`/assignment/${data.id}`}>Open</Link>
            }
            {
              (userProfile.role === 'hod' || userProfile.role === 'teacher') && <Link className="btn btn-light" to={`/assigned/${data.id}`}>View</Link>
            }
          </div>
        </div>
      </div>
    </>
  )
}
