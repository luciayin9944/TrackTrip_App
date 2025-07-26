import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "../../styles";
import { Wrapper, TripCard } from "./style";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";


const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658",
  "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c"
];


function Dashboard() {
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/trips/latest", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch latest trip");
        return r.json();
      })
      .then((data) => {
        setTrip(data);

        // get all expense records
        return fetch(`/expenses?trip_id=${data.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch expenses");
        return r.json();
      })
      .then((data) => {
        console.log("Fetched expenses:", data);
        // total spent by category
        const grouped = data.expenses.reduce((acc, curr) => {
            const existing = acc.find((item) => item.category === curr.category);
            if (existing) {
                existing.amount += curr.amount;
            } else {
                acc.push({ category: curr.category, amount: curr.amount });
            }
            return acc;
        }, []);
        setExpenses(grouped);
    })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!trip) {
    return <p style={{ marginLeft: "40px" }}>You have no trips yet.</p>;
  }

  const { id, destination, start_date, end_date, budget } = trip;
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = budget - totalSpent;

  return (
    <div>
      <Wrapper>

        <h2>Welcome back!</h2>
        <h3>Here's your current trip summary:</h3>

        <TripCard key={trip.id}>
            <Box>
                <h2>{destination}</h2>
                <p>📅 {new Date(start_date).toLocaleDateString()} ~ {new Date(end_date).toLocaleDateString()}</p>
                <p><strong>Budget:</strong> ${budget}</p>
                <p><strong>Total Spent:</strong> ${totalSpent.toFixed(2)}</p>
                <p><strong>Remaining Budget:</strong> ${remainingBudget.toFixed(2)}</p>
                <Button onClick={() => navigate(`/trips/${id}/expenses`)} >
                    View Expense Detail
                </Button>
            </Box>
        </TripCard>

        <div style={{ marginTop: "40px", maxWidth: "600px" }}>
            <h4>Spending by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={expenses}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount">
                    {expenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </Wrapper>
    </div>
  );
}

export default Dashboard;

