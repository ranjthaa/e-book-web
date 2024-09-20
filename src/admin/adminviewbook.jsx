import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Core styles
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const Adminviewbook = () => {
  const { book_id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(""); // For handling both demo and full book PDFs

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

      const response = await axios.post(
        `http://localhost:2000/admin/get_single_book${queryString}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.status === 200) {
        setBookDetails(response.data.data);
      } else {
        console.error("Error fetching book details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  // For reading demo book
  const handleReadDemoClick = () => {
    setPdfUrl(bookDetails.demo_book); // Set the demo book PDF URL
    setShowPdf(true); // Show the PDF viewer
  };

  // For reading full book
  const handleReadFullBookClick = () => {
    setPdfUrl(bookDetails.book_pdf); // Set the full book PDF URL
    setShowPdf(true); // Show the PDF viewer
  };

  // Close the PDF viewer
  const handleClosePdf = () => {
    setShowPdf(false);
  };

  return (
    <section className="user-view-sect">
      <div className="container">
        {bookDetails ? (
          <div className="row nology">
            <div className="col-4">
              <img
                width={300}
                src={bookDetails.book_cover_image}
                alt={bookDetails.book_cover_image}
              />
            </div>
            <div className="col-8">
              <h3 className="cology">{bookDetails.auther_name}</h3>
              <h5>
                Author Name: <span>{bookDetails.auther_name}</span>
              </h5>
              <h5>
                Price: <span>{bookDetails.price}</span>
              </h5>
              <p>{bookDetails.book_description}</p>
              <h5>
                Year of the Book: <span>{bookDetails.year_of_the_book}</span>
              </h5>
              <h5>
                Publisher Name: <span>{bookDetails.publisher_name}</span>
              </h5>
              <button className="omed" onClick={handleReadDemoClick}>
                Read Demo
              </button>
              <button className="omed" onClick={handleReadFullBookClick}>
                Read Book
              </button>
            </div>
          </div>
        ) : (
          <p>Loading book details...</p>
        )}
      </div>

      {showPdf && (
        <div className="pdf-viewer-overlay">
          <div className="pdf-viewer-content">
            <button className="close-btn" onClick={handleClosePdf}>
              Close
            </button>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl} // Use the pdfUrl state to show either demo or full book PDF
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        </div>
      )}
    </section>
  );
};

export default Adminviewbook;
