import React, { useState } from "react";
import "./assets/styles.css";
import { apiSignup } from "./api";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function Register({ onBackToLogin }) {
    const [name, setName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const dob = [day, month, year].filter(Boolean).length === 3
            ? `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, "0")}-${day.padStart(2, "0")}`
            : "";

        const payload = {
            userName: name,
            fatherName,
            dateOfBirth: dob,
            mobileNumber: mobile,
            email,
            password,
            gender,
            city,
            address,
            photo: photoFile ? photoFile.name : null,
        };

        try {
            const { ok, status, data } = await apiSignup(payload);

            if (ok) {
                setSuccess(data.message || "Registration successful. You can now log in.");
                setName("");
                setFatherName("");
                setDay("");
                setMonth("");
                setYear("");
                setMobile("");
                setEmail("");
                setPassword("");
                setGender("");
                setPhotoFile(null);
                setCity("");
                setAddress("");
            } else {
                setError(data.message || `Registration failed (status ${status}). Please try again.`);
            }
        } catch (err) {
            const msg = err.message || "Unknown error";
            setError(msg.includes("Failed to fetch") || msg.includes("AbortError")
                ? "Server is waking up. Please wait a moment and try again."
                : "Something went wrong. Please try again. " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-register-wrapper">
            <div className="student-register-container">
                <h2 className="student-register-heading">Registration Form</h2>

                <form onSubmit={handleSubmit} className="student-register-form" noValidate>
                    <div className="student-form-row">
                        <label className="student-form-label">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="student-input student-input-full"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">Father's name</label>
                        <input
                            type="text"
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            className="student-input student-input-full"
                            required
                        />
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">Date of birth</label>
                        <div className="student-form-inputs student-form-dob-group">
                            <select
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                className="student-input student-select"
                            >
                                <option value="">Day</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="student-input student-select"
                            >
                                <option value="">Month</option>
                                {MONTHS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="student-input student-select"
                            >
                                <option value="">Year</option>
                                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - 5 - i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <span className="student-form-hint">(DD-MM-YYYY)</span>
                        </div>
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">Mobile no.</label>
                        <div className="student-form-inputs student-form-mobile-group">
                            <input
                                type="text"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="student-input student-input-code"
                            />
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="student-input student-input-mobile"
                                placeholder="Phone number"
                            />
                        </div>
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">Email id</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="student-input student-input-full"
                            required
                        />
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="student-input student-input-full"
                            required
                        />
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">Gender</label>
                        <div className="student-form-inputs student-form-radio-group">
                            <label className="student-radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={gender === "Male"}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <span>Male</span>
                            </label>
                            <label className="student-radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={gender === "Female"}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <span>Female</span>
                            </label>
                        </div>
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">Photo</label>
                        <div className="student-form-file-wrap">
                            <input
                                type="file"
                                id="student-photo"
                                accept="image/*"
                                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                                className="student-file-input"
                            />
                            <label htmlFor="student-photo" className="student-file-label">
                                Choose File
                            </label>
                            <span className="student-file-name">
                                {photoFile ? photoFile.name : "No file chosen"}
                            </span>
                        </div>
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="student-input student-input-full"
                        />
                    </div>

                    <div className="student-form-row">
                        <label className="student-form-label">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="student-input student-textarea student-input-full"
                            rows={3}
                        />
                    </div>

                    <div className="student-form-actions">
                        <button type="submit" className="student-register-button" disabled={loading}>
                            {loading ? "Connecting..." : "Register"}
                        </button>
                        <a
                            href="#"
                            className="student-back-link"
                            onClick={(e) => {
                                e.preventDefault();
                                onBackToLogin?.();
                            }}
                        >
                            Back to Login
                        </a>
                    </div>
                </form>

                {error && <p className="student-form-message student-form-error">{error}</p>}
                {success && <p className="student-form-message student-form-success">{success}</p>}
            </div>
        </div>
    );
}

export default Register;
