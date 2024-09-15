import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Usersavedbooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("data"));

    if (storedUserData) {
      const user_id = storedUserData.id;
      const queryString = `?user_id=${user_id}`;

      axios.post(`http://localhost:2000/user/get_saved_book${queryString}`)
        .then(response => {
          if (response.data && Array.isArray(response.data.data)) {
            setBooks(response.data.data);
          } else {
            console.error("Books data is not in the expected format:", response.data);
          }
        })
        .catch(error => {
          console.error("Error fetching books:", error);
        });
    } else {
      console.error("No user data found in localStorage.");
    }
  }, []);

  return (
    <section>
      <div className="container">
        <h3 className="bros-bok">Saved Books</h3>
        <div className="row">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.book_id} className="col-4 layout-hei">
                <Link className="chaiartart" to={`/userviewbook/${book.book_id}`}>
                  <div className="bookfront-layout">
                    <center>
                      <img className="bookfront-img" src={book.book_cover_image} alt={book.auther_name} />
                    </center>
                    <center>
                      <h4 className="chaitary">{book.auther_name}</h4>
                    </center>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No saved books found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Usersavedbooks;
