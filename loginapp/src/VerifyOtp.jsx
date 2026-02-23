import React, { useState } from "react";
import API_BASE_URL from "./config/api";

function VerifyOtp({ onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("pendingUser");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);

        const username = localStorage.getItem("pendingUser");
        localStorage.removeItem("pendingUser");

        onVerified(username);  // ✅ switch to Dashboard
      } else {
        setError(data.message || "Invalid OTP");
      }

    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <p>No login session found. Please login again.</p>;
  }

  return (
    <div className="login-container">
      <h2>Verify OTP</h2>

      <form onSubmit={handleVerify} className="login-form">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default VerifyOtp;