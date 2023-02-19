import React from 'react'

export default function Loading(props) {
  return (
    <div className='container-fluid d-flex justify-content-center mt-5'>
      <h4>{props.message === undefined ? 'Loading...' : props.message}</h4>
    </div>
  )
}
