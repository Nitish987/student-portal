import React from 'react'
import dp from '../no.jpg'

const DetailCard = () => {

    const rad = {
        borderRadius: '15px',
    }
    
    const wd ={
        width : '85px',
    }
  return (
    <>
            <div className="container py-2 ">
                    <div className="w-50">
                        <div className="card card-body text-black bg-secondary" style={rad}>
                            <div className="d-flex ">

                                {/*  Photo */}
                                <img src={dp}
                                alt="Generic placeholder image" className="img-fluid rounded-circle border border-dark border-3 " style={wd} />
                                 
                                 {/* Name */}
                                <div className=" ms-3">
                                    <p className="mb-0 me-2">Name</p>
                                    
                                 {/* Message */}
                                    <p> Message : Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas expedita  </p>

                                </div>
                            </div>
                        </div>
                    </div>
              </div>
              
    </>
  )
}

export default DetailCard;
