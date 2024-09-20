import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Core styles
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css'; // Default layout styles

const Userviewbook = () => {
  const { book_id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
        const storedUserData = JSON.parse(localStorage.getItem("data"));
        const user_id = storedUserData?.id;
        if (user_id) {
          const favQuery = `?book_id=${book_id}&user_id=${user_id}`;
          const favResponse = await axios.post(`http://localhost:2000/user/check_favorite${favQuery}`);
          if (favResponse.data && favResponse.data.isFavorite) {
            setIsFavorite(true);
          }
        }
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
          const storedUserData = JSON.parse(localStorage.getItem("data"));
          const user_id = storedUserData?.id;

          const paymentDetails = {
            user_id: user_id,
            publisher_id: bookDetails.publisher_id,
            book_id: book_id,
            price: bookDetails.price,
            transaction_id: response.razorpay_payment_id
          };

          const verifyUrl = "http://localhost:2000/user/buy_book";
          const verifyResponse = await axios.post(verifyUrl, paymentDetails, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

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

  const handleRemoveFromFavorites = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("data"));
      const user_id = storedUserData?.id;

      const queryString = `?book_id=${book_id}&user_id=${user_id}`;
      const response = await axios.post(`http://localhost:2000/user/remove_saved_book${queryString}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setIsFavorite(false);
        alert("Book removed from favourites successfully!");
      } else {
        console.log("Response error:", response.data);
        alert("Failed to remove book from favourites.");
      }
    } catch (error) {
      console.error("Error removing book from favourites:", error);
      alert("Failed to remove book from favourites.");
    }
  };

  const handleReadDemoClick = () => {
    setShowPdf(true);
  };

  const handleClosePdf = () => {
    setShowPdf(false);
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

              <button className="omed" onClick={handleReadDemoClick}>
                Read Demo
              </button>

              {isFavorite ? (
                <button className="omed" onClick={handleRemoveFromFavorites}>
                  Remove from Favourites
                </button>
              ) : (
                <button className="omed" onClick={handleAddToFavorites}>
                  Add to Favourites
                </button>
              )}
              <button className="omed" onClick={initPayment}>
                Buy Now
              </button>
            </div>
          </div>
        ) : (
          <p>Loading book details...</p>
        )}
      </div>

      {/* Conditionally Render the PDF Viewer */}
      {showPdf && (
        <div className="pdf-viewer-overlay">
          <div className="pdf-viewer-content">
            <button className="close-btn" onClick={handleClosePdf}>Close</button>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={bookDetails.demo_book}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        </div>
      )}
    </section>
  );
};

export default Userviewbook;
