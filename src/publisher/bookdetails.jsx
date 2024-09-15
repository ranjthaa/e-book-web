import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SingleBook = () => {
    const { book_id } = useParams(); // Capture book_id from the URL
    const [bookDetails, setBookDetails] = useState(null);
    const navigate = useNavigate(); // For navigation after deletion

    useEffect(() => {
        if (book_id) {
            const queryString = `?book_id=${book_id}`;
            console.log("Query String:", queryString);

            axios.post(`http://localhost:2000/admin/get_single_book${queryString}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log("API Response:", response.data);
                if (response.data && response.data.status === 200) {
                    setBookDetails(response.data.data);
                } else {
                    console.error("Error fetching book details:", response.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching book details:", error);
            });
        } else {
            console.error("Book ID not found in the URL.");
        }
    }, [book_id]);

    const handleDeleteBook = () => {
        if (bookDetails) {
            const deleteURL = `http://localhost:2000/publisher/delete_book?book_id=${bookDetails.book_id}&publisher_id=${bookDetails.publisher_id}`;
            console.log("Delete URL:", deleteURL);

            axios.post(deleteURL)
                .then(response => {
                    if (response.status === 200) {
                        alert('Book deleted successfully');
                        navigate('/publisher/home'); // Redirect after deletion
                    } else {
                        alert('Failed to delete book');
                    }
                })
                .catch(error => {
                    console.error("Error deleting book:", error);
                    alert('Error deleting book. Please try again.');
                });
        } else {
            console.error("Book details not available.");
        }
    };

    return (
        <section>
            <div className="container">
                <h3>Book Details</h3>
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
                            <p><strong>Status:</strong> {bookDetails.status}</p>
                            <div className="ookred">
                                <div>
                                    <button className="omed">
                                        <a href={bookDetails.book_pdf} className="ancre-re-demo" target="_blank" rel="noopener noreferrer">
                                            Read Book
                                        </a>
                                    </button>
                                </div>
                                <div>
                                    <button className="bok-dele" onClick={handleDeleteBook}>
                                        Delete Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading book details...</p>
                )}
            </div>
        </section>
    );
};

export default SingleBook;
