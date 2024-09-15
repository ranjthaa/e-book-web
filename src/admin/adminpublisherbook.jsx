import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Adminpublisherbook = () => {
    const [books, setBooks] = useState([]);
    const { publisherId } = useParams(); // Assuming you're passing publisherId via route parameters

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.post(`http://localhost:2000/publisher/get_book`, { publisher_id: publisherId });

                console.log("API Response:", response.data); // Debug: Check what the API returns

                // Extract the array of books from the response
                const fetchedBooks = response.data.data; // Since the books are in response.data.data
                
                setBooks(fetchedBooks || []); // Set books, defaulting to an empty array if response.data.data is not an array
            } catch (error) {
                console.error("Error fetching books", error);
            }
        };

        fetchBooks();
    }, [publisherId]);

    // If books is not an array, we should return null or an empty div to prevent errors
    if (!Array.isArray(books)) {
        return <div>No books available</div>;
    }

    return (
        <section>
            <div className="container">
                <div className="row">
                <center><h2 className="author-pub-nam">Published books</h2></center>
                    {/* <center><h4 className="author-publed">Published books</h4></center> */}
                    {books.map((book) => (
                        <div key={book.book_id} className="col-4 layout-hei">
                            <Link className="crinology" to={`/adminviewbook/${book.book_id}`}>
                                <div className="bookfront-layout">
                                    <center><img className="bookfront-img" src={book.book_cover_image} alt={book.book_name} /></center>
                                    <center><h4 className="chaitary">{book.book_name}</h4></center>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Adminpublisherbook;
