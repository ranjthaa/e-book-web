import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Userbuyedbooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books from the API
    const fetchBooks = async () => {
      try {
        const response = await axios.post("http://localhost:2000/user/get_books?category_name=ALL");
        console.log(response);
        
        if (response.status === 200) {
          setBooks(response.data.data); // Set the books in state
        } else {
          console.error("Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks(); // Call the function to fetch books
  }, []); // Empty dependency array ensures this runs once when component mounts

  return (
    <section>
      <div className="container">
        <h3 className="bros-bok">Browse your Books</h3>
        <div className="row">
          {books.map((book) => (
            <div key={book.book_id} className="col-4 layout-hei">
              <Link className="chaiartart" to={`/userviewbook/${book.book_id}`}>
                <div className="bookfront-layout">
                  <center>
                    <img className="bookfront-img" src={book.book_cover_image} alt={book.auther_name} />
                  </center>
                  <center>
                    <h4 className="chaitary">{book.book_titile}</h4>
                  </center>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Userbuyedbooks;
