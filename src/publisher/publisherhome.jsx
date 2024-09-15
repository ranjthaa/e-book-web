import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Publisherhome = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("data"));

    if (storedUserData) {
      const payload = { publisher_id: storedUserData.id };

      axios.post(`http://localhost:2000/publisher/get_book`, payload)
        .then(response => {
          if (response.data && Array.isArray(response.data.data)) {
            setBooks(response.data.data);
          } else {
            console.error("Books data is not in expected format:", response.data);
          }
        })
        .catch(error => {
          console.error("Error fetching books:", error);
        });
    } else {
      console.error("No publisher data found in localStorage.");
    }
  }, []);

  return (
    <section>
      <div className="container">
        <center><h3 className="section-cate-front">Published Books</h3></center>
        <div className="row">
          {books.length > 0 ? (
            books.map((book, index) => {
              console.log("Book Object:", book);
              console.log("Book ID:", book.book_id); // Check if book.id is valid
              return (
                <div className="col-4 layout-hei" key={index}>
                  <div className="bookfront-layout">
                    <center>
                      <Link className="publis-lin-can" to={`/book/${book.book_id}`}>
                        <img
                          className="bookfront-img"
                          src={book.book_cover_image || "path/to/fallback-image.jpg"}
                          alt={book.book_description || "No description available"}
                        />
                        <h4 className="chaitary">{book.book_description || "No Title Available"}</h4>
                      </Link>
                    </center>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No books found for this publisher.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Publisherhome;
