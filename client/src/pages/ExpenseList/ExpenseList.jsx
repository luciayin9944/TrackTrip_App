// ExpenseList.jsx
import { useEffect, useState, useMemo } from "react"; 
import { Link } from "react-router-dom";
import { Wrapper, Title, ExpenseCard, EditForm } from "./style";
import { Box, Button } from "../../styles";
import Pagination from "../../components/Pagination";
import { useParams } from "react-router-dom";

const CATEGORY_OPTIONS = [
  "All",
  "Flight",
  "Transportation",
  "Accommodation",
  "Food",
  "Tickets",
  "Shopping",
  "Other",
];

function ExpenseList() {
  const { trip_id } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    expense_item: "",
    category: "Other", // default value
    amount: "",
    date: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // category filter
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("trip_id", trip_id);
    queryParams.set("page", currentPage);
    queryParams.set("per_page", 5);

    setLoading(true); //
    fetch(`/expenses?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed to fetch")))
      .then((data) => {
        setExpenses(data.expenses || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setExpenses([]);
      })
      .finally(() => setLoading(false)); 
  }, [trip_id, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  const [tripInfo, setTripInfo] = useState(null);

  useEffect(() => {
    fetch(`/trips/${trip_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed to fetch trip info")))
      .then((data) => {
        setTripInfo(data);
      })
      .catch((err) => {
        console.error("Trip info fetch error:", err);
      });
  }, [trip_id]);

  function handleEdit(expense) {
    setEditingId(expense.id);
    setEditFormData({
      expense_item: expense.expense_item,
      category: expense.category ?? "Other",
      amount: String(expense.amount ?? ""),
      date: (expense.date || "").slice(0, 10),
    });
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  }

  function handleEditSubmit(id) {
    fetch(`/expenses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...editFormData,
        amount: Number(editFormData.amount), 
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject("Update failed")))
      .then((updated) => {
        setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
        setEditingId(null);
      })
      .catch((err) => alert(err));
  }

  function handleDelete(id) {
    fetch(`/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((r) => {
      if (r.ok) setExpenses((prev) => prev.filter((e) => e.id !== id));
    });
  }

  const filteredCurrentPage = useMemo(() => {
    if (categoryFilter === "All") return expenses;
    return expenses.filter((e) => e.category === categoryFilter);
  }, [expenses, categoryFilter]);

  return (
    <div>
      {tripInfo ? (
        <>
          <Title>Expenses in {tripInfo.destination}</Title>
          <p style={{ textAlign: "center", marginBottom: "2rem" }}>
            📅 {new Date(tripInfo.start_date).toLocaleDateString()} - {new Date(tripInfo.end_date).toLocaleDateString()}
          </p>
        </>
      ) : (
        <Title>Loading trip info...</Title>
      )}

      <div style={{ textAlign: "center", display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        <Button as={Link} to={`/trips/${trip_id}/summary`} variant="outline">
          View Summary
        </Button>
        <Button as={Link} to={`/trips/${trip_id}/new_expense`}>
          New Expense
        </Button>
      </div>


      <Wrapper>
        {/*  category filter */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "5rem", marginBottom: "2rem" }}>
          <label>Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            disabled={loading}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* {categoryFilter !== "All" && (
            <Button variant="outline" onClick={() => setCategoryFilter("All")} disabled={loading}>
              Clear
            </Button>
          )} */}
        </div>

        {filteredCurrentPage.length > 0 ? ( 
          filteredCurrentPage.map((expense) => (
            <ExpenseCard key={expense.id}>
              <Box>
                {editingId === expense.id ? (
                  <EditForm>
                    <input
                      name="expense_item" //
                      value={editFormData.expense_item}
                      onChange={handleEditFormChange}
                    />
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditFormChange}
                    >
                      {CATEGORY_OPTIONS.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      name="amount"
                      type="number"
                      step="0.01"
                      value={editFormData.amount}
                      onChange={handleEditFormChange}
                    />
                    <input
                      name="date"
                      type="date"
                      value={editFormData.date}
                      onChange={handleEditFormChange}
                    />
                    <Button onClick={() => handleEditSubmit(expense.id)}>Save</Button>
                    <Button onClick={() => setEditingId(null)}>Cancel</Button>
                  </EditForm>
                ) : (
                  <>
                    <h2>{expense.expense_item}</h2>
                    <p>
                      📂 {expense.category} <br />
                      💵 ${Number(expense.amount).toFixed(2)} <br />
                      📅 {new Date(expense.date).toLocaleDateString()} <br />
                    </p>
                    <Button onClick={() => handleEdit(expense)}>Edit</Button>
                    <Button onClick={() => handleDelete(expense.id)}>Delete</Button>
                  </>
                )}
              </Box>
            </ExpenseCard>
          ))
        ) : (
          <>
            <h3>No Expense Records Found</h3>
            <p style={{ opacity: 0.8 }}>Try another category or clear the filter.</p>
            <Button as={Link} to={`/trips/${trip_id}/new_expense`}>Add a New Expense</Button>
          </>
        )}
      </Wrapper>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(pageNum) => setCurrentPage(pageNum)}
      />
    </div>
  );
}

export default ExpenseList;





// // ExpenseList.jsx
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Wrapper, Title, ExpenseCard, EditForm } from "./style";
// import { Box, Button } from "../../styles";
// import Pagination from "../../components/Pagination";
// import { useParams } from "react-router-dom";

// function ExpenseList() {
//   const { trip_id } = useParams();
//   const [expenses, setExpenses] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     expense_item: "",
//     category: "",
//     amount: "",
//     date: ""
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);


//   useEffect(() => {
//     // ?key=value&key2=value2  /trips?trip_id=3&page=2&per_page=5
//     const queryParams = new URLSearchParams();
//     queryParams.set("trip_id", trip_id);
//     queryParams.set("page", currentPage);
//     queryParams.set("per_page", 5);

//     fetch(`/expenses?${queryParams.toString()}`, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//     })
//         .then((r) => r.ok ? r.json() : Promise.reject("Failed to fetch"))
//         .then((data) => {
//             setExpenses(data.expenses || []);
//             setTotalPages(data.total_pages || 1);
//         })
//         .catch((err) => {
//             console.error("Fetch error:", err);
//             setExpenses([]);
//         });
//     }, [trip_id, currentPage]);


//     const [tripInfo, setTripInfo] = useState(null);

//     useEffect(() => {
//         fetch(`/trips/${trip_id}`, {
//             headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         })
//             .then((r) => r.ok ? r.json() : Promise.reject("Failed to fetch trip info"))
//             .then((data) => {
//             setTripInfo(data);
//             })
//             .catch((err) => {
//             console.error("Trip info fetch error:", err);
//             });
//     }, [trip_id]);



//   function handleEdit(expense) {
//     setEditingId(expense.id);
//     setEditFormData({
//       expense_item: expense.expense_item,
//       category: expense.category,
//       amount: expense.amount,
//       date: expense.date.slice(0, 10),
//     });
//   }

//   function handleEditFormChange(e) {
//     const { name, value } = e.target;
//     setEditFormData({ ...editFormData, [name]: value });
//   }

//   function handleEditSubmit(id) {
//     fetch(`/expenses/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify(editFormData),
//     })
//       .then((r) => r.ok ? r.json() : Promise.reject("Update failed"))
//       .then((updated) => {
//         setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
//         setEditingId(null);
//       })
//       .catch((err) => alert(err));
//   }

//   function handleDelete(id) {
//     fetch(`/expenses/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }).then((r) => {
//       if (r.ok) setExpenses((prev) => prev.filter((e) => e.id !== id));
//     });
//   }

//   return (
//     <div>
//       {tripInfo ? (
//         <>
//             <Title>Expenses in {tripInfo.destination}</Title>
//             <p style={{ textAlign: "center", marginBottom: "2rem" }}>
//                 📅 {new Date(tripInfo.start_date).toLocaleDateString()} - {new Date(tripInfo.end_date).toLocaleDateString()}
//             </p>
//         </>
//         ) : (
//         <Title>Loading trip info...</Title>
//       )}

//       <div style={{ textAlign: "center" }}>
//         <Button as={Link} to={`/trips/${trip_id}/summary`} variant="outline">
//           View Summary
//         </Button>
//         <Button as={Link} to={`/trips/${trip_id}/new_expense`} >
//           New Expense
//         </Button>
//       </div>

//       <Wrapper>
//         {expenses.length > 0 ? ( 
//           expenses.map((expense) => (
//             <ExpenseCard key={expense.id}>
//               <Box>
//                 {editingId === expense.id ? (
//                   <EditForm>
//                     <input
//                       name="purchase_item"
//                       value={editFormData.expense_item}
//                       onChange={handleEditFormChange}
//                     />
//                     <select
//                       name="category"
//                       value={editFormData.category}
//                       onChange={handleEditFormChange}
//                     >
//                       {['Flight', 'Transportation', 'Accommodation', 'Food', 'Tickets', 'Shopping', 'Other'].map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       name="amount"
//                       type="number"
//                       value={editFormData.amount}
//                       onChange={handleEditFormChange}
//                     />
//                     <input
//                       name="date"
//                       type="date"
//                       value={editFormData.date}
//                       onChange={handleEditFormChange}
//                     />
//                     <Button onClick={() => handleEditSubmit(expense.id)}>Save</Button>
//                     <Button onClick={() => setEditingId(null)}>Cancel</Button>
//                   </EditForm>
//                 ) : (
//                   <>
//                     <h2>{expense.expense_item}</h2>
//                     <p>
//                       📂 {expense.category} <br />
//                       💵 ${expense.amount} <br />
//                       📅 {new Date(expense.date).toLocaleDateString()} <br />
//                     </p>
//                     <Button onClick={() => handleEdit(expense)}>Edit</Button>
//                     <Button onClick={() => handleDelete(expense.id)}>Delete</Button>
//                   </>
//                 )}
//               </Box>
//             </ExpenseCard>
//           ))
//         ) : (
//           <>
//             <h3>No Expense Records Found</h3>
//             <Button as={Link} to={`/trips/${trip_id}/new_expense`}>Add a New Expense</Button>
//           </>
//         )}
//       </Wrapper>
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={(pageNum) => setCurrentPage(pageNum)}
//       />
//     </div>
//   );
// }

// export default ExpenseList;



