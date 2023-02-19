import React, { useEffect } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import HodDashboard from './HodDashboard';
import Loading from './Loading';
import { useSelector } from 'react-redux';

export default function Dashboard() {
    const navigate = useNavigate();
    const userProfile = useSelector(state => state.user.profile);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');
            }
        });
    }, [navigate]);

    return (
        <>
            {
                userProfile === null
                ?
                <Loading/>
                :
                <>
                    {
                        userProfile.role === 'student' && <StudentDashboard />
                    }
                    {
                        userProfile.role === 'teacher' && <TeacherDashboard />
                    }
                    {
                        userProfile.role === 'hod' && <HodDashboard />
                    }
                </>
            }
        </>
    )
}
