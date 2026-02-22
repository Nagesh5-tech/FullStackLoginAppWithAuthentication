import React, { useState } from 'react';
import "./assets/styles.css";
import { apiLogin } from "./api";

function Login({ setUser, onNewUser }){
    const [username,setUsername ]=useState("");
    const  [password,setPassword]=useState("");
    const [error, setError]=useState("");
    const [loading, setLoading]=useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const { ok, status, data } = await apiLogin(username, password);

            if (ok) {
                if (data.status === "otp_sent" || data.status === "success") {
                    setUser(username);
                } else {
                    setError(data.message || "Invalid user");
                }
            } else {
                setError(data.message || `Login failed (status ${status}).`);
            }
        } catch(err) {
            const msg = err.message || "Unknown error";
            setError(msg.includes("Failed to fetch") || msg.includes("AbortError")
                ? "Server is waking up. Please wait a moment and try again."
                : "Something went wrong. Please try again. " + msg);
        } finally {
            setLoading(false);
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
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Connecting..." : "Login"}
                    </button>
                    
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