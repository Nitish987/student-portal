import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { dismissAlert } from '../features/alert/AlertSlice';

export default function Alert() {
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  const close = (e) => dispatch(dismissAlert());

  return (
    <>
      {
        alert.visible &&
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          <strong>Alert! </strong>
          {alert.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={close}></button>
        </div>
      }
    </>
  );
}
