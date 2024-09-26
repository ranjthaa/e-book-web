import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Userbuyedbooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch user_id from localStorage
    const storedUserData = JSON.parse(localStorage.getItem("data"));
    const userId = storedUserData.id; // Assuming user_id is stored in "_id"
console.log(userId);

    if (userId) {
      // Fetch books from the API
      const fetchBooks = async () => {
        try {
          const response = await axios.post(`http://localhost:2000/user/get_user_purchesed_books?user_id=${userId}`);
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
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []); // Empty dependency array ensures this runs once when component mounts

  return (
    <section>
      <div className="container">
        <h3 className="bros-bok">User Buyed Books</h3>
        <div className="row">
          {books.map((book) => (
            <div key={book.book_id} className="col-4 layout-hei">
              <Link className="chaiartart" to={`/userbuyedviewbook/${book.book_id}`}>
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
