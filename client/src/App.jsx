// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
// import NavBar from "./components/NavBar.jsx";
import Login from "./pages/Login/Login.jsx";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then((r) => {
        if (r.ok) return r.json()
      }) .then((user) => setUser(user))
        .catch((err) => console.log(err));
    }
  }, []);

  const onLogin = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  if (!user) return <Login onLogin={onLogin} />;

  return (
    <>
      <Routes>
        <Route path="/" element={<div>Welcome, {user.username}</div>} />
      </Routes>
    </>
  );
}

export default App;






// // App.jsx
// import { useEffect, useState } from 'react'

// function App() {


//   const [message, setMessage] = useState('')

//   useEffect(() => {
//     fetch('/')
//       .then(res => res.json())
//       .then(data => setMessage(data.message))
//       .catch(console.error)
//   }, [])

//   return (
//     <div>
//       <p>{message}</p>
//     </div>
//   )
// }

// export default App
