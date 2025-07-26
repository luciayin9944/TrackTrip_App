// //TripList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button } from "../../styles";
import { useNavigate } from "react-router-dom";
import { Wrapper, FilterWrapper, Title, TripCard } from "./style";

function TripList() {
    const [trips, setTrips] = useState([]);
    const navigate = useNavigate();
    const [filterYear, setFilterYear] = useState("");
    const [filterMonth, setFilterMonth] = useState("");

    useEffect(() => {
        fetch(`/trips`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((r) => {
                if (!r.ok) {
                    throw new Error("Failed to fetch trips");
                }
                return r.json();
        })
            .then((data) => {
                console.log(data);
                setTrips(data.trips || []);
        })
            .catch((error) => {
                console.error("Error fetching trips:", error);
                setTrips([]);
        });
    }, []);


    function handleFilter() {
        const queryParams = new URLSearchParams();
        if (filterYear) queryParams.append("year", filterYear);
        if (filterMonth) queryParams.append("month", filterMonth);

        fetch(`/trips?${queryParams.toString()}`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
          .then((r) => {
            if (!r.ok) throw new Error("Filter failed");
            return r.json();
            })
          .then((data) => {
            setTrips(data.trips || []);
            })
          .catch((err) => {
            console.error("Error filtering:", err);
            });
        }

    const handleViewExpenses = (tripId) => {
        navigate(`/trips/${tripId}/expenses`);
    };

    return (
        <div>
          <Wrapper>
            <Title>My Trips</Title>
            <div style={{ textAlign: "center" }}>
                <Button as={Link} to="/newTrip" >
                New Trip
                </Button>
            </div>
            
            <FilterWrapper>
                <label>
                    Year:
                    <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                        <option value="">All</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </label>
                <label>
                    Month:
                    <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                        <option value="">All</option>
                        {[...Array(12)].map((_, i) => {
                            const val = String(i + 1).padStart(2, "0");
                            return <option key={val} value={val}>{val}</option>;
                        })}
                    </select>
                </label>
                <Button variant="outline" onClick={() => handleFilter()}>Filter</Button>
            </FilterWrapper>

            {trips.length > 0 ? (
                <>
                    {trips.map((trip) => (
                        <TripCard key={trip.id}>
                            <Box>
                                <h2>{trip.destination}</h2>
                                <p>
                                    📅 {new Date(trip.start_date).toLocaleDateString()} ~ {new Date(trip.end_date).toLocaleDateString()}
                                    <br />
                                    💵 Budget: ${trip.budget}
                                </p>
                                <Button variant="outline" onClick={()=>handleViewExpenses(trip.id)}>
                                    View Expenses
                                </Button>
                                <Button variant="outline" as={Link} to={`/trips/${trip.id}/summary`}>
                                    View Summary
                                </Button>
                            </Box>
                        </TripCard>
                    ))}
                </>
            ) : (
                <>
                    <h2>No Trip Records Found</h2>
                    <Button as={Link} to="/newTrip">
                        Add a New Trip
                    </Button>
                </>
            )}
          </Wrapper>
        </div>
    );
}


export default TripList;



