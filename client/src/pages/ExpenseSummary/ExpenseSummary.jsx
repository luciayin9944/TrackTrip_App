 // ExpenseSummary.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Title, FlexWrapper, ChartBox, SummaryBox } from "./style";


const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658",
  "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c"
];


function ExpenseSummary() {

    const { trip_id } = useParams();
    const [tripInfo, setTripInfo] = useState(null);
    const [data, setData] = useState([]);
    const totalSpending = data.reduce((sum, item) => sum + item.total, 0);
    
    useEffect(() => {
        fetch(`/trips/${trip_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((r) => r.ok ? r.json() : Promise.reject("Failed to fetch trip info"))
            .then((data) => {
            setTripInfo(data);
            })
            .catch((err) => {
            console.error("Trip info fetch error:", err);
            });
    }, [trip_id]);


    useEffect(()=>{
        fetch(`/trips/${trip_id}/summary`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((r) => r.json())
        .then((data) => {
            const processed = data.map((item)=> ({
                ...item,
                name: item.category
            }));
            setData(processed)
        });
    }, [trip_id])

    if (!tripInfo) {
        return <Title>Loading trip info...</Title>;
    }


    return (
        <>
            <Title>Expenses in {tripInfo.destination}</Title>
            <p style={{ textAlign: "center", marginBottom: "2rem" }}>
                📅 {new Date(tripInfo.start_date).toLocaleDateString()} - {new Date(tripInfo.end_date).toLocaleDateString()}
            </p>

            {data.length === 0 ? (
                <p style={{ textAlign: "center" }}>No data available</p>
            ) : (
                <FlexWrapper>
                  <ChartBox>
                    <PieChart width={800} height={400}>
                        <Pie
                            dataKey="total"
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(1)}%`
                            }
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                  </ChartBox>
                  <SummaryBox>
                     <h2 className="summary-title">Spending Summary</h2>

                     <div className="category-breakdown">
                       {data.map((item, index) => (
                        <div key={index} className="category-row">
                            <span className="category-name" style={{ color: COLORS[index % COLORS.length] }}>
                                {item.name}
                            </span>
                            <span className="category-amount">${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <hr className="divider" />

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Total Budget</span>
                            <span>${tripInfo.budget.toFixed(2)}</span>
                        </div>
                        <div className="summary-row bold">
                            <span>Total Spending</span>
                            <span>${totalSpending.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Remaining</span>
                            <span>${(tripInfo.budget - totalSpending).toFixed(2)}</span>
                        </div>
                    </div>
                  </SummaryBox>
                </FlexWrapper>
            )}
        </>
    )
}

export default ExpenseSummary;

