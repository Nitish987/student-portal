import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNewData } from '../features/bundle/bundleSlice';

const DetailCard = ({ sno, name, section, rollno, file, date, outDate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateBundleData = (e) => {
    dispatch(setNewData({ data: file }));
    navigate('/pdf');
  }

  return (
    <>
      <tr>
        <th scope="row">{sno}</th>
        <td>{name}</td>
        <td>{rollno}</td>
        <td>{section}</td>
        <td><span className={`text-${outDate.toMillis() > date.toMillis() ? "success" : "danger"}`}>Done</span></td>
        <td><span className='text-primary' style={{cursor: 'pointer'}} onClick={updateBundleData}>Attachment</span></td>
      </tr>
    </>
  )
}

export default DetailCard;
