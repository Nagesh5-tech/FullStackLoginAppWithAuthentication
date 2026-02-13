import React, { useState } from 'react';
import "./assets/styles.css";
import API_BASE_URL from "./config/api";

function Login({ setUser, onNewUser }){
    const [username,setUsername ]=useState("");
    const  [password,setPassword]=useState("");

    const [error, setError]=useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");

        try{
            const response = await fetch(`${API_BASE_URL}/api/login`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Backend expects 'email' and 'password'
                body: JSON.stringify({ email: username, password }),
            });

            let data = {};
            try {
                const text = await response.text();
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            if (response.ok) {
                // Backend returns status: "otp_sent" or "failed"
                if (data.status === "otp_sent" || data.status === "success") {
                    // Valid existing user – proceed to app (or next OTP step)
                    setUser(username);
                } else {
                    // New / invalid user or wrong credentials
                    setError(data.message || "Invalid user");
                }
            } else {
                setError(data.message || `Login failed (status ${response.status}).`);
            }
        }catch(error){
            setError("Something went wrong. please try again. " + error.message);
        }
        };

        return (
            <div className="login-container">
                <h2 className="heading">Login</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="username" className="login-label">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="login-input" required/>
                    <label htmlFor="password" className="login-label">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" placeholder="Enter your password" required/>
                    <button type="submit" className="login-button">Login</button>
                    
                    <a
                        href="#"
                        className="new-user-link"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onNewUser) {
                                onNewUser();
                            }
                        }}
                    >
                        New user?
                    </a>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>

        );

}
export default Login;