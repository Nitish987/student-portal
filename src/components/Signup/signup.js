import React from "react";
import image from "./../Signup/signup.svg";
import "./../Signup/signup.css";
export default function Signup() {
    return (
        <React.Fragment>
            <div className="container">
                <div className="login-left">
                    <div className="login-header">
                        <h1>Welcome To Our Application</h1>
                    </div>
                    <form method="post" action="/login" className="login-form">
                        <div className="login-form-content">
                            <div className="form-item">
                                <label htmlFor="email">Enter Your Email</label>
                                <input type="text" id="email" required autoComplete="off"></input>
                            </div>
                            <div className="form-item">
                                <label htmlFor="email">Enter Your Roll-Number</label>
                                <input type="number" id="email" required autoComplete="off"></input>
                            </div>
                            <div className="form-item">
                                <label htmlFor="password">Enter Password</label>
                                <input type="password" id="password" required></input>
                            </div>
                            <div className="form-item">
                                <label htmlFor="password">Confirmation Password</label>
                                <input type="password" id="password" required></input>
                            </div>
                            <div className="form-item">
                                <div className="checkbox">
                                    <input type="checkbox" id="RememberMe"></input>
                                    <label htmlFor="RememberMe" className="checkboxLabel">Remember Me</label>
                                </div>
                            </div>
                            <button type="submit">Sign Up</button>
                        </div>
                        <div className="login-form-footer">
                        <a href="#">
                            <img width="30" src="https://play-lh.googleusercontent.com/6UgEjh8Xuts4nwdWzTnWH8QtLuHqRMUB7dp24JYVE2xcYzq4HA8hFfcAbU-R-PC_9uA1" alt="google.png"/>
                            Google Signup
                        </a>
                        <a href="#">
                            <img width="30" src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/640px-Facebook_f_logo_%282021%29.svg.png" alt="facebook.png"/>
                            facebook Signup
                        </a>
                        </div>
                    </form>
                </div>
                <div className="login-right">
                <img src={image} alt="singupPage"></img>
                </div>
            </div>
        </React.Fragment>
    )
};