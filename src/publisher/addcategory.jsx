import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManagement = () => {
  const [category_name, setCategoryName] = useState('');
  const [category_image, setCategoryImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch categories from the backend when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.post('http://localhost:2000/publisher/get_category');
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  // Add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_name", category_name);
    formData.append("category_image", category_image);

    try {
      const response = await axios.post("http://localhost:2000/publisher/add_category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setCategoryName(''); // Reset category name
      setCategoryImage(null); // Reset image
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage('Error adding category');
    }
  };

  // Update a category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_name", category_name);
    formData.append("category_id", selectedCategoryId);
    if (category_image) {
      formData.append("category_image", category_image);
    }

    try {
      const response = await axios.post("http://localhost:2000/publisher/update_category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setCategoryName(''); // Reset category name
      setCategoryImage(null); // Reset image
      setSelectedCategoryId(null); // Reset selected category
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage('Error updating category');
    }
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.post("http://localhost:2000/publisher/delete_category", null, {
        params: {
          category_id: categoryId,
        },
      });

      setMessage(response.data.message);
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage('Error deleting category');
    }
  };

  // Select category for updating
  const handleEditCategory = (category) => {
    setCategoryName(category.category_name);
    setSelectedCategoryId(category.category_id);
  };

  return (

    <section className='cate-sec'>
        <div className="container">
            <div className="row">
            <div className="category-management">
      <h2>Category Management</h2>
      
      <form onSubmit={selectedCategoryId ? handleUpdateCategory : handleAddCategory}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            id="categoryName"
            className='cate-inp'
            value={category_name}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryImage">Category Image</label>
          <input
            type="file"
            id="categoryImage"
            className='cate-inp'
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-primary cate-sb-btn">
          {selectedCategoryId ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h3>Category List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.category_id}>
              <td>{category.category_id}</td>
              <td>{category.category_name}</td>
              <td>
                <img src={category.category_image} alt={category.category_name} width="50" />
              </td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEditCategory(category)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteCategory(category.category_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
            </div>
        </div>
    </section>


  );
};

export default CategoryManagement;
