// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import Login from "./pages/Login/Login.jsx";
import TripList from "./pages/TripList/TripList.jsx";
import NewTrip from "./pages/NewTrip/NewTrips.jsx";
import ExpenseList from "./pages/ExpenseList/ExpenseList.jsx";
import NewExpense from "./pages/NewExpense/NewExpense.jsx";
import ExpenseSummary from "./pages/ExpenseSummary/ExpenseSummary.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";


function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/", {
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
    navigate("/dashboard");
  };

  if (!user) return <Login onLogin={onLogin} />;

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <SideBar />

      <Routes>
        <Route path="/" element={<TripList userId={user.id} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<TripList userId={user.id} />} />
        <Route path="/newTrip" element={<NewTrip user={user} />} />
        <Route path="/trips/:trip_id/expenses" element={<ExpenseList />} />
        <Route path="/trips/:trip_id/new_expense" element={<NewExpense />} />
        <Route path="/trips/:trip_id/summary" element={<ExpenseSummary />} />
      </Routes>
    </>
  );
}

export default App;



