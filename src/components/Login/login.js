import React from "react";
import "./../Login/login.css";
export default function Login() {
    return (
        <React.Fragment>
            <div className="cont">
                <h1>Login</h1>
                <form action="" method="post">
                    <div className="form-item">
                        <input type="email" id="email" required autoComplete="off"></input>
                        <span></span>
                        <label for="email">Enter Your Email</label>
                    </div>
                    <div className="form-item">
                        <input type="password" id="email" required></input>
                        <span></span>
                        <label for="password">Enter Your Password</label>
                    </div>
                    <input type="submit" value="Login Now"></input>
                </form>
            </div>
        </React.Fragment>
    )
};