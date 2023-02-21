import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import profile_svg from '../res/svg/profile_black.svg';
import { setNewData } from '../features/bundle/bundleSlice';

const DetailCard = ({ name, rollno, file }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateBundleData = (e) => {
    dispatch(setNewData({ data: file }));
    navigate('/pdf');
  }

  return (
    <>
      <div className="container mt-3" onClick={updateBundleData} style={{cursor: "pointer"}}>
        <div className="w-100">
          <div className="card card-body text-black" style={{borderRadius: "15px"}}>
            <div className="d-flex align-items-center">
              <img src={profile_svg} alt="profile-pic" className="img-fluid rounded-circle " style={{ width: '50px', height: '50px' }} />
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
