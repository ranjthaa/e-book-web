import React, { useState, useEffect } from "react";
import axios from "axios";
import image from "../Images/anaesthesia 1.png"; // Use default image if book cover is not available

const Adminpurchased = () => {
  const [books, setBooks] = useState([]);

  // Fetch purchased books from API
  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        const response = await axios.post("http://localhost:2000/admin/get_all_purchesed_books");
        setBooks(response.data.data || []); // Set books data
      } catch (error) {
        console.error("Error fetching purchased books:", error);
      }
    };

    fetchPurchasedBooks();
  }, []);
console.log(books);

  return (
    <section>
      <div className="container">
        <h3 className="pured">Purchased</h3>
        {books.length > 0 ? (
          books.map((book) => (
            <div className="row tab-conn" key={book.book_id}>
              <div className="col-1"></div>
              <div className="col-3">
                <img width={200} src={book.book_cover_image || image} alt={book.book_name} />
                <h3 className="thesia">{book.book_titile}</h3>
              </div>
              <div className="col-7">
                <h4>{book.book_publisher_name}</h4>
                <p>{book.book_description}</p>
                <p className="pricese">Price: <span>{book.book_price}</span></p>
              </div> 
              <div className="col-1"></div>
            </div>
          ))
        ) : (
          <p>No purchased books found.</p>
        )}
      </div>
    </section>
  );
};

export default Adminpurchased;
