import { useState } from 'react'
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div>
        {user ? (
          <Dashboard username={user} />
        ) : showRegister ? (
          <Register onBackToLogin={() => setShowRegister(false)} />
        ) : (
          <Login setUser={setUser} onNewUser={() => setShowRegister(true)} />
        )}
      </div>
    </>
  )
}

export default App
