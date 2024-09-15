import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

const Adminhome = () => {
  const [activeTab, setActiveTab] = useState('NEW');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchBooks = async (status) => {
    setLoading(true);
    try {
      let url = '';
      if (status === 'NEW') {
        url = 'http://localhost:2000/admin/get_books?book_approval=NEW';
      } else if (status === 'APPROVED') {
        url = 'http://localhost:2000/admin/get_books?book_approval=APPROVED';
      } else if (status === 'CANCELLED') {
        url = 'http://localhost:2000/admin/get_books?book_approval=CANCELLED';
      }

      const response = await axios.post(url);
      console.log('API Response:', response.data);
      setBooks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(activeTab);
  }, [activeTab]);

  const handleApprove = async (bookId, publisherId) => {
    if (!publisherId || publisherId <= 0) {
      alert('Invalid Publisher ID');
      return;
    }
    try {
      const response = await axios.post('http://localhost:2000/admin/approve_book', {
        book_id: bookId,
        publisher_id: publisherId,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        alert('Book approved successfully');
        fetchBooks(activeTab); // Refresh the book list after approval
      } else {
        alert('Error approving book');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error approving book:', error.response.data);
        alert('Error approving book: ' + (error.response.data.message || 'Unknown error'));
      } else if (error.request) {
        console.error('Error approving book: No response received', error.request);
        alert('Error approving book: No response received');
      } else {
        console.error('Error approving book:', error.message);
        alert('Error approving book: ' + error.message);
      }
    }
  };

  const handleCancel = async (bookId, publisherId) => {
    if (!publisherId || publisherId <= 0) {
      alert('Invalid Publisher ID');
      return;
    }
    const cancelMsg = prompt("Please enter the reason for cancellation:");
    if (cancelMsg) {
      try {
        const response = await axios.post('http://localhost:2000/admin/cancel_book', {
          book_id: bookId,
          publisher_id: publisherId,
          cancelMsg: cancelMsg,
        });
        if (response.status === 200) {
          alert('Book cancelled successfully');
          fetchBooks(activeTab); // Refresh the book list after cancellation
        } else {
          alert('Error cancelling book');
        }
      } catch (error) {
        console.error('Error cancelling book:', error);
        alert('Error cancelling book');
      }
    }
  };

  return (
    <div className="container mt-5">
      <center><h3 className="aprov-bok">Approving Books</h3></center>
      {/* Nav tabs */}
      <ul className="nav nav-tabs tab-ull" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`tab-sty ${activeTab === 'NEW' ? 'active' : ''}`}
            id="new-tab"
            data-bs-toggle="tab"
            type="button"
            role="tab"
            aria-controls="new"
            aria-selected={activeTab === 'NEW'}
            onClick={() => handleTabClick('NEW')}
          >
            New
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`tab-sty ${activeTab === 'APPROVED' ? 'active' : ''}`}
            id="approved-tab"
            data-bs-toggle="tab"
            type="button"
            role="tab"
            aria-controls="approved"
            aria-selected={activeTab === 'APPROVED'}
            onClick={() => handleTabClick('APPROVED')}
          >
            Approved
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`tab-sty ${activeTab === 'CANCELLED' ? 'active' : ''}`}
            id="cancelled-tab"
            data-bs-toggle="tab"
            type="button"
            role="tab"
            aria-controls="cancelled"
            aria-selected={activeTab === 'CANCELLED'}
            onClick={() => handleTabClick('CANCELLED')}
          >
            Rejected
          </button>
        </li>
      </ul>

      {/* Tab panes */}
      <div className="tab-content" id="myTabContent">
        {loading ? <p>Loading...</p> : (
          books.length > 0 ? books.map((book) => (
            <div key={book.book_id} className="row tab-conn">
              <div className="col-1"></div>
              <div className="col-3">
                <img width={200} src={book.book_cover_image} alt={book.book_title} />
                <h3 className="thesia">{book.book_title}</h3>
              </div>
              <div className="col-7">
                <h4>{book.auther_name}</h4> {/* Ensure the correct key names */}
                <p>{book.book_description}</p>
                <Link to={`/adminviewbook/${book.book_id}`} className="tab-read">Read more</Link>
                <div className="apr-ject">
                  {activeTab === 'NEW' && (
                    <>
                      <div><button className="approve-butt" onClick={() => handleApprove(book.book_id, book.publisher_id)}>Approve</button></div>
                      <div><button className="reject-butt" onClick={() => handleCancel(book.book_id, book.publisher_id)}>Reject</button></div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-1"></div>
            </div>
          )) : <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Adminhome;
