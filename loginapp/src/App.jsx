import { useState } from 'react'
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";
import VerifyOtp from "./VerifyOtp";

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  return (
    <div>
      {user ? (
        <Dashboard username={user} />
      ) : showOtp ? (
        <VerifyOtp 
          onVerified={(username) => {
            setUser(username);
            setShowOtp(false);
          }} 
        />
      ) : showRegister ? (
        <Register onBackToLogin={() => setShowRegister(false)} />
      ) : (
        <Login 
          onOtpSent={() => setShowOtp(true)}
          onNewUser={() => setShowRegister(true)} 
        />
      )}
    </div>
  )
}

export default App;