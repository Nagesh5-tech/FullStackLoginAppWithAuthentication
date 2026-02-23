import React, { useState, useEffect } from 'react';
import "./assets/styles.css";
import { apiLogin, wakeServer } from "./api";

function Login({ onNewUser, onOtpSent }) {

    const [username,setUsername ]=useState("");
    const [password,setPassword]=useState("");
    const [error, setError]=useState("");
    const [loading, setLoading]=useState(false);
    const [wakingStatus, setWakingStatus]=useState("");

    useEffect(() => { wakeServer(); }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setWakingStatus("");
        setLoading(true);

        try{
            const { ok, status, data } = await apiLogin(
                username,
                password,
                (attempt, max) => {
                    setWakingStatus(`Connecting to server... (attempt ${attempt} of ${max})`);
                }
            );

            if (ok) {
                if (data.status === "otp_sent") {
                    localStorage.setItem("pendingUser", username);
                    onOtpSent();   // ✅ switch to OTP component
                } else {
                    setError(data.message || "Invalid user");
                }
            } else {
                setError(data.message || `Login failed (status ${status}).`);
            }

        } catch(err) {
            const msg = err.message || "Unknown error";
            setError(
                msg.includes("Failed to fetch") ||
                msg.includes("AbortError") ||
                msg.includes("network")
                    ? "Server is waking up. Please wait a moment and try again."
                    : "Something went wrong. Please try again. " + msg
            );
        } finally {
            setLoading(false);
            setWakingStatus("");
        }
    };

    return (
        <div className="login-container">
            <h2 className="heading">Login</h2>

            <form onSubmit={handleSubmit} className="login-form">
                <label className="login-label">Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                    required
                />

                <label className="login-label">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    placeholder="Enter your password"
                    required
                />

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Connecting..." : "Login"}
                </button>

                <a
                    href="#"
                    className="new-user-link"
                    onClick={(e) => {
                        e.preventDefault();
                        onNewUser();
                    }}
                >
                    New user?
                </a>
            </form>

            {wakingStatus && <p className="waking-message">{wakingStatus}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default Login;