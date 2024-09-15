import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Userviewbook = () => {
  const { book_id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

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
      } else {
        console.error("Error fetching book details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const initPayment = () => {
    const options = {
      key: "rzp_test_3odnVFzUBOioFh", 
      amount: bookDetails.price * 100, 
      currency: "INR",
      name: bookDetails.name,
      description: "Test Transaction",
      image: bookDetails.book_cover_image,
      handler: async (response) => {
        try {
          // Collect user details from local storage
          const storedUserData = JSON.parse(localStorage.getItem("data"));
          const user_id = storedUserData?.id;
  
          // Prepare data to be sent to backend
          const paymentDetails = {
            user_id: user_id,
            publisher_id: bookDetails.publisher_id,
            book_id: book_id,
            price: bookDetails.price,
            transaction_id: response.razorpay_payment_id
          };
  
          // Send payment details to backend
          const verifyUrl = "http://localhost:2000/user/buy_book";
          const verifyResponse = await axios.post(verifyUrl, paymentDetails, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
  console.log(verifyResponse);
  
          if (verifyResponse.data && verifyResponse.data.status === 200) {
            console.log("Payment and order recorded successfully:", verifyResponse.data);
            alert("Payment successful and order recorded!");
          } else {
            console.error("Error recording payment:", verifyResponse.data.message);
            alert("Failed to record payment.");
          }
        } catch (error) {
          console.error("Error handling payment:", error);
          alert("Payment failed.");
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
  
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  

  const handleAddToFavorites = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("data"));
      const user_id = storedUserData?.id;

      const queryString = `?book_id=${book_id}&user_id=${user_id}`;
      const response = await axios.post(`http://localhost:2000/user/save_book${queryString}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setIsFavorite(true);
        alert("Book added to favourites successfully!");
      } else {
        console.log("Response error:", response.data);
        alert("Failed to add book to favourites.");
      }
    } catch (error) {
      console.error("Error adding book to favourites:", error);
      alert("Failed to add book to favourites.");
    }
  };

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
              <button className="omed" onClick={handleAddToFavorites}>
                {isFavorite ? "Added to Favourites" : "Add to Favourites"}
              </button>
              <button className="omed" onClick={initPayment}>
                Buy Now
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

export default Userviewbook;
