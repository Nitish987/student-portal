import React from 'react';
import profile_svg from '../res/svg/profile_black.svg';

const DetailCard = ({ name, rollno }) => {
  return (
    <>
      <div className="container mt-3">
        <div className="w-100">
          <div className="card card-body text-black" style={{borderRadius: "15px"}}>
            <div className="d-flex align-items-center">
              <img src={profile_svg} alt="Generic placeholder image" className="img-fluid rounded-circle " style={{ width: '50px', height: '50px' }} />
              <div className=" ms-3">
                <p className="mb-0 me-1">{name}</p>
                <p className='text-success mb-0 me-1'>{rollno} - COMPLETED</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default DetailCard;
