import React from 'react'
import { useSelector } from 'react-redux'
import Loading from './Loading';

export default function PdfViewer() {
  const file = useSelector(state => state.bundle.data);
  return (
    <>
      {
        file ?
          <iframe title='PDF' src={file} className="w-100 vh-100"></iframe> : <Loading message="No Pdf Found." />
      }
    </>
  )
}
