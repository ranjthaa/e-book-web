import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import image from "../Images/image 5.png";

const Adminpublishedauthor = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.post("http://localhost:2000/admin/get_publisher");
        setAuthors(response.data.data || []);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchAuthors();
  }, []);
  console.log(authors);

  return (
    <section>
      <div className="container">
        <div className="row">
          <center><h4 className="pub-auth">Published Author</h4></center>
          {authors.length > 0 ? (
            authors.map((author) => (
              <div key={author.id} className="col-4">
                <Link className="publish-link" to={`/adminpublisherbook/${author.id}`}>
                  <div className="pub-auth-pho">
                    <img src={author.profile_image || image} alt={author.publisher_name} />
                  </div>
                  <div>
                    <h4>{author.name}</h4>
                    <p>Books Published <span>{author.books_published}</span></p>
                  </div>
                </Link> 
              </div>
            ))
          ) : (
            <p>No authors found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Adminpublishedauthor;


// http://localhost:2000/publisher/get_book?publisher_id=:1