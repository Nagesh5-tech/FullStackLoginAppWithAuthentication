import React from 'react';
import "./assets/styles.css";

function Dashboard({username}){ 
    return (
        <div className="dashboard-container">
            <h1>Welcome, {username}!</h1>
            <h2>welcome to KodNest Dashboard!</h2>
        </div>
    );
}
export default Dashboard;