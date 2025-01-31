import React from "react";
import "./Pagination.css";

const Pagination = ({
  formEntries,
  itemsPerPage = 4,
  onPageChange,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(formEntries.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-wrapper">
      <div className="pagination">
        {currentPage > 2 && <span>...</span>}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}

        {currentPage < pageNumbers.length - 1 && <span>...</span>}
      </div>
    </div>
  );
};

export default Pagination;
