import '../styles/profileCard.css';
import React from "react";

export default function ProfileCard() {
    return (
        <div className="container-fluid d-flex justify-content-center mt-5">
            <div className="top-profile d-flex p-2">
                <div className="profile-cont"></div>
                <div className="info d-flex flex-column">
                    <div className="profile-ul ms-5 h2 mb-0">Himanshu</div>
                    <div className="profile-ul ms-5 text-muted">student</div>
                    <div className="profile-ul ms-5 d-flex justify-content-start rounded-3">
                        <div>
                            <p className="small mb-1">certificate</p>
                            <p className="mb-0">41</p>
                        </div>
                        <div className="px-3">
                            <p className="small mb-1">Followers</p>
                            <p className="mb-0">--</p>
                        </div>
                        <div>
                            <p className="small mb-1">Rating</p>
                            <p className="mb-0">--</p>
                        </div>
                    </div>
                    <div className="profile-ul d-flex pt-1 ms-5">
                        <button type="button" className="btn btn-primary btn-sm">change profile</button>
                        <button type="button" className="btn btn-primary btn-sm ms-1">change branch</button>
                    </div>
                </div>
            </div>
        </div>
    )
}