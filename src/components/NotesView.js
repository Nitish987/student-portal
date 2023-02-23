import React from 'react'
import { Accordion } from 'react-bootstrap'
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useSelector } from 'react-redux';

export default function NotesView({ title, data, upload }) {
  const userProfile = useSelector(state => state.user.profile);

  const deleteSubject = (id) => {
    const noteRef = doc(db, "department", userProfile.branch, "notes", id);
    deleteDoc(noteRef).then(() => {
      window.location.reload();
    });
  }

  return (
    <div className='mb-2'>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{title}</Accordion.Header>
          <Accordion.Body>

            {
              data.length !== 0 ? data.map((n, si) => {
                return (
                  <Accordion key={`${n.id}-${si}`}>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>{n.subject}</Accordion.Header>
                      <Accordion.Body>
                        <button type="button" className="btn btn-outline-danger mb-3" onClick={(e) => deleteSubject(n.id)}>Delete Subject</button>
                        {
                          n.units.map((e, i) => {
                            return (
                              <div key={`${n.subject}-${i}`} className='mb-2'>
                                <Accordion>
                                  <Accordion.Item eventKey="0">
                                    <Accordion.Header>UNIT {i + 1}</Accordion.Header>
                                    <Accordion.Body >
                                      <div className='d-flex flex-column'>
                                        <button type="button" className="btn btn-outline-primary" onClick={(e) => upload({ id: n.id, si: si, sem: n.semester, name: n.subject, unit: i + 1, units: n.units })}>Upload</button>
                                        {
                                          e.ppt !== null &&
                                          <a type="button" className="btn btn-outline-success mt-2" href={e.ppt}>Download ppt</a>
                                        }
                                        {
                                          e.pdf !== null &&
                                          <a type="button" className="btn btn-outline-success mt-2" href={e.pdf}>Download pdf</a>
                                        }
                                        {
                                          e.doc !== null &&
                                          <a type="button" className="btn btn-outline-success mt-2" href={e.doc}>Download doc</a>
                                        }
                                      </div>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                </Accordion>
                              </div>
                            );
                          })
                        }

                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                );
              })
                :
                "No notes found."
            }

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
