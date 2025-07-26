// Pagination.jsx

import { PageButton } from "../styles";


function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <PageButton
          key={num}
          $active={currentPage === num}
          onClick={() => onPageChange(num)}
        >
          {num}
        </PageButton>
      ))}
    </div>
  );
}


export default Pagination;