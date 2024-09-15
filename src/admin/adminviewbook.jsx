import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Adminviewbook = () => {
  const { book_id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    if (book_id) {
      fetchBookDetails();
    } else {
      console.error("Book ID not found in the URL.");
    }
  }, [book_id]);

  const fetchBookDetails = async () => {
    try {
      const queryString = `?book_id=${book_id}`;

      const response = await axios.post(`http://localhost:2000/admin/get_single_book${queryString}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.status === 200) {
        setBookDetails(response.data.data);
        // await checkIfFavorite();
      } else {
        console.error("Error fetching book details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };
  console.log(bookDetails);

  return (
    <section className="user-view-sect">
      <div className="container">
        {bookDetails ? (
          
          <div className="row nology">
            <div className="col-4">
              <img width={300} src={bookDetails.book_cover_image} alt={bookDetails.book_cover_image} />
            </div>
            <div className="col-8">
              <h3 className="cology">{bookDetails.auther_name}</h3>
              <h5>Author Name: <span>{bookDetails.auther_name}</span></h5>
              <h5>Price: <span>{bookDetails.price}</span></h5>
              <p>{bookDetails.book_description}</p>
              <h5>Year of the Book: <span>{bookDetails.year_of_the_book}</span></h5>
              <h5>Publisher Name: <span>{bookDetails.publisher_name}</span></h5>
              <button className="omed">
              <a href={bookDetails.demo_book} className="ancre-re-demo" target="_blank" rel="noopener noreferrer">
                  Read Demo
                </a>
              </button>
              <button className="omed">
                <a href={bookDetails.book_pdf} className="ancre-re-demo" target="_blank" rel="noopener noreferrer">
                  Read Book
                </a>
              </button>
            </div>
          </div>
        ) : (
          <p>Loading book details...</p>
        )}
      </div>
    </section>
  );
};

export default Adminviewbook;
