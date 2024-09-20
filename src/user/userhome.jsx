import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Userhome = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post("http://localhost:2000/publisher/get_category");
        console.log(response);
        
        console.log("API Response:", response.data);  // Log the response to check the structure
        
        if (response.status === 200 && response.data.data) {
          setCategories(response.data.data); // Set the categories in state
        } else {
          console.error("Failed to fetch categories: ", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Call the function to fetch categories
  }, []);

  // Handle the click when a category is selected
  const handleCategoryClick = (category_name) => {
    navigate(`/category/${category_name}`); // Navigate to the category page
  };

  return (
    <section>
      <div className="container">
        <h3 className="bros-bok">Browse by Categories</h3>
        <div className="row">
          {/* Button to show all books */}
          <div className="col-12">
            <button 
              className="btn btn-primary mb-3"
              onClick={() => handleCategoryClick("ALL")}
            >
              View All Books
            </button>
          </div>

          {/* Display category cards */}
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.category_id} className="col-4 layout-hei">
                <div className="bookfront-layout" onClick={() => handleCategoryClick(category.category_name)}>
                  <center>
                    <img className="bookfront-img" src={category.category_image} alt={category.category_name} />
                  </center>
                  <center>
                    <h4 className="chaitary">{category.category_name}</h4>
                  </center>
                </div>
              </div>
            ))
          ) : (
            <p>No categories found</p> // Show message if categories array is empty
          )}
        </div>
      </div>
    </section>
  );
};

export default Userhome;
