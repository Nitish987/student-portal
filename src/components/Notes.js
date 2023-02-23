import React, { useRef, useState, useEffect } from 'react'
import NotesView from './NotesView'
import { showAlert } from "../features/alert/AlertSlice";
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDocs, limit, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

export default function Notes() {
  const userProfile = useSelector(state => state.user.profile);
  const dispatch = useDispatch();
  const [note, setNote] = useState({ subject: '', semester: '1' });
  const [isLoaded, setIsLoaded] = useState(false);
  const [allNotes, setAllNotes] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [files, setFiles] = useState({ ppt: null, pdf: null, doc: null });
  const uploadBtn = useRef(null);
  const uploadFileForm = useRef(null);
  const uploadFileModalCloseBtn = useRef(null);
  const addSubjectModalCloseBtn = useRef(null);

  const onSubjectNotes = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  }

  const onFileChoose = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  }

  const addSubject = (e) => {
    if (note.subject === '') {
      addSubjectModalCloseBtn.current.click();
      dispatch(showAlert({
        message: "Enter the Subject Name",
        type: "warning"
      }));
      return;
    }

    const id = `notes${parseInt(Math.random() * 1000)}${parseInt(Math.random() * 1000)}`;

    const noteData = {
      id: id,
      subject: note.subject,
      semester: parseInt(note.semester),
      units: [
        {
          ppt: null,
          pdf: null,
          doc: null,
        },
        {
          ppt: null,
          pdf: null,
          doc: null,
        },
        {
          ppt: null,
          pdf: null,
          doc: null,
        },
        {
          ppt: null,
          pdf: null,
          doc: null,
        },
        {
          ppt: null,
          pdf: null,
          doc: null,
        }
      ]
    }
    const noteRef = doc(db, "department", userProfile.branch, "notes", id);
    setDoc(noteRef, noteData).then(() => {
      addSubjectModalCloseBtn.current.click();
      window.location.reload();
    }).catch(() => {
      dispatch(showAlert({
        message: "Unable to add subject.",
        type: "danger"
      }));
    });
  }

  const onUploadOption = (select) => {
    setSelectedSubject(select);
    uploadBtn.current.click();
  }

  const modifyNoteDoc = (type, url) => {
    console.log(selectedSubject);
    const units = selectedSubject.units;
    if (type === 'ppt') units[selectedSubject.unit - 1].ppt = url;
    else if (type === 'pdf') units[selectedSubject.unit - 1].pdf = url;
    else units[selectedSubject.unit - 1].doc = url;

    const notesDoc = doc(db, "department", userProfile.branch, "notes", selectedSubject.id);
    updateDoc(notesDoc, {
      units: units
    }).then(() => {
      allNotes[selectedSubject.sem][selectedSubject.si].units = units;
      setAllNotes(allNotes);
      dispatch(showAlert({
        message: "Uploaded Successfully.",
        type: "success"
      }));
    });
  }

  const uploadUnit = (e) => {
    if (files.ppt !== null) {
      const storageRef = ref(storage, `note/${selectedSubject.id}/${files.ppt.name}`);
      uploadBytes(storageRef, files.ppt).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
          modifyNoteDoc("ppt", url);
        }).catch(() => {
          dispatch(showAlert({
            message: "Unable to Upload PPT.",
            type: "danger"
          }));
        });
      }).catch(() => {
        dispatch(showAlert({
          message: "Unable to Upload PPT.",
          type: "danger"
        }));
      });
    }
    if (files.pdf !== null) {
      const storageRef = ref(storage, `note/${selectedSubject.id}/${files.pdf.name}`);
      uploadBytes(storageRef, files.pdf).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
          modifyNoteDoc("pdf", url);
        }).catch(() => {
          dispatch(showAlert({
            message: "Unable to Upload PDF.",
            type: "danger"
          }));
        });
      }).catch(() => {
        dispatch(showAlert({
          message: "Unable to Upload PDF.",
          type: "danger"
        }));
      });
    }
    if (files.doc !== null) {
      const storageRef = ref(storage, `note/${selectedSubject.id}/${files.doc.name}`);
      uploadBytes(storageRef, files.doc).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
          modifyNoteDoc("doc", url);
        }).catch(() => {
          dispatch(showAlert({
            message: "Unable to Upload DOC.",
            type: "danger"
          }));
        });
      }).catch(() => {
        dispatch(showAlert({
          message: "Unable to Upload DOC.",
          type: "danger"
        }));
      });
    }
    uploadFileForm.current.reset();
    uploadFileModalCloseBtn.current.click();
  }

  useEffect(() => {
    const fetchNotes = async () => {
      const notesRef = collection(db, "department", userProfile.branch, "notes");
      const notesQuery = query(notesRef, orderBy("semester", "asc"), limit(100));
      const notesSnap = await getDocs(notesQuery);
      const notes = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] }
      notesSnap.forEach((doc) => {
        notes[doc.data().semester].push(doc.data());
      });
      setAllNotes(notes);
    }

    if (userProfile !== null && allNotes === null && !isLoaded) {
      fetchNotes();
      setIsLoaded(true);
    }
  }, [userProfile, setAllNotes, allNotes, isLoaded]);

  return (
    <div className='container-fluid mt-4'>
      <div className='container mt-3'>
        <h1>Notes</h1>
        <div className='d-flex mt-4 mb-4' style={{ gap: "10" }}>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-subject">Add Subject</button>
        </div>
        {
          allNotes &&
          <>
            {
              [1, 2, 3, 4, 5, 6, 7, 8].map(e => {
                return (
                  <NotesView key={e} title={`Semester ${e}`} data={allNotes[e]} upload={onUploadOption} />
                );
              })
            }
          </>
        }
      </div>

      <div className="modal fade" id="add-subject" tabIndex="-1" aria-labelledby="addSubjectModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addSubjectModalLabel">Add Subject</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input type="text" className="form-control" name='subject' id="subject" onChange={onSubjectNotes} />
              </div>
              <select className="form-select mb-3" aria-label=".form-select-lg" name='semester' onChange={onSubjectNotes}>
                <option value="1">Semester - 1</option>
                <option value="2">Semester - 2</option>
                <option value="3">Semester - 3</option>
                <option value="4">Semester - 4</option>
                <option value="5">Semester - 5</option>
                <option value="6">Semester - 6</option>
                <option value="7">Semester - 7</option>
                <option value="8">Semester - 8</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={addSubjectModalCloseBtn}>Close</button>
              <button type="button" className="btn btn-primary" onClick={addSubject}>Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <button ref={uploadBtn} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#upload-unit" style={{ display: "none" }}></button>

      <div className="modal fade" id="upload-unit" tabIndex="-1" aria-labelledby="uploadUnitModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="uploadUnitModalLabel">{selectedSubject && `${selectedSubject.name} Unit - ${selectedSubject.unit}`}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form ref={uploadFileForm} method='POST'>
                <span>PPT</span>
                <div className="input-group mb-3">
                  <input type="file" className="form-control" aria-describedby="ppt-choose" aria-label="Upload" name='ppt' accept="application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={onFileChoose} />
                </div>
                <span>PDF</span>
                <div className="input-group mb-3">
                  <input type="file" className="form-control" aria-describedby="pdf-choose" aria-label="Upload" name='pdf' accept="application/pdf" onChange={onFileChoose} />
                </div>
                <span>DOCS</span>
                <div className="input-group mb-3">
                  <input type="file" className="form-control" aria-describedby="docs-choose" aria-label="Upload" name='doc' accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFileChoose} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={uploadFileModalCloseBtn}>Close</button>
              <button type="button" className="btn btn-primary" onClick={uploadUnit}>Save changes</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
