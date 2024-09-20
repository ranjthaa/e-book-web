import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const CategoryBooks = () => {
  const { category_name } = useParams(); // Get category name from the URL
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books based on category name
    const fetchBooksByCategory = async () => {
      try {
        const response = await axios.post(`http://localhost:2000/user/get_books?category_name=${category_name}`);
        
        if (response.status === 200) {
          setBooks(response.data.data); // Set the books in state
        } else {
          console.error("Failed to fetch books for category:", category_name);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooksByCategory(); // Call the function to fetch books
  }, [category_name]); // Re-run the effect when the category_name changes

  return (
    <section>
      <div className="container">
        <h3 className="bros-bok">
          {category_name === "ALL" ? "All Books" : `Books in ${category_name}`}
        </h3>
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
                      <h4 className="chaitary">{book.book_titile}</h4>
                    </center>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No books found in this category.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryBooks;
