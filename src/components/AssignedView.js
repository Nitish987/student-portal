import React from 'react'
import { useParams } from 'react-router-dom'

export default function AssignedView() {
  const params = useParams();

  return (
    <div>{params.id}</div>
  )
}
