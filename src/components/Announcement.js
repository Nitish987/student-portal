import React from 'react'

export default function Announcement() {
    return (
        <div className="announcement-cont d-flex w-100 rounded-4 p-3 border align-items-center">
            <div className="user-pic pic-cont rounded-circle me-3">
                <img className="w-100 h-100" src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.webp" alt="user" />
            </div>
            <span>Announce something</span>
        </div>
    )
}
