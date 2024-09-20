import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ebookpublishing from "../Images/ebookpublishing.webp";

const Publishebook = () => {
  const [formData, setFormData] = useState({
    publisher_id: '',
    publisher_name: '',
    book_titile: '',
    book_description: '',
    auther_name: '',
    year_of_the_book: '',
    category_name: '',
    book_price: ''
  });

  const [files, setFiles] = useState({
    cover_image: null,
    book: null,
    demo_file: null
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("data"));
    if (storedData) {
      setFormData({
        ...formData,
        publisher_id: storedData.id,
        publisher_name: storedData.name
      });
    }

    // Fetch categories from the backend
    fetchCategories();
  }, []);

  // Fetch categories from the backend API
  const fetchCategories = async () => {
    try {
      const response = await axios.post('http://localhost:2000/publisher/get_category');
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles({
      ...files,
      [name]: fileList[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('publisher_id', formData.publisher_id);
    formDataToSend.append('publisher_name', formData.publisher_name);
    formDataToSend.append('book_titile', formData.book_titile);
    formDataToSend.append('book_description', formData.book_description);
    formDataToSend.append('auther_name', formData.auther_name);
    formDataToSend.append('year_of_the_book', formData.year_of_the_book);
    formDataToSend.append('category_name', formData.category_name);
    formDataToSend.append('book_price', formData.book_price);

    // Append files
    formDataToSend.append('cover_image', files.cover_image);
    formDataToSend.append('book', files.book);
    formDataToSend.append('demo_file', files.demo_file);

    try {
      const response = await axios.post('http://localhost:2000/publisher/add_books', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert('Book published successfully');
        window.location.reload();
      } else {
        alert('Failed to publish book');
      }
    } catch (error) {
      console.error("Error publishing book:", error);
      alert('Error publishing book. Please try again.');
    }
  };

  return (
    <> 
      <section className="contact_section layout_padding">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="heading_container">
                <h2>Publish E-Book</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Book Image</label>
                  <input type="file" name="cover_image" accept="image/*" onChange={handleFileChange} />
                </div>
                <div>
                  <input type="text" name="book_titile" placeholder="Book Title" value={formData.book_titile} onChange={handleChange} />
                </div>
                <div>
                  <textarea className='book-pub-add' name="book_description" placeholder="Book Description" value={formData.book_description} onChange={handleChange} />
                </div>
                <div>
                  <label>Upload PDF</label>
                  <input type="file" name="book" accept="application/pdf" onChange={handleFileChange} />
                </div>
                <div>
                  <label>Demo Book</label>
                  <input type="file" name="demo_file" accept="application/pdf" onChange={handleFileChange} />
                </div>
                <div>
                  <input type="text" name="auther_name" placeholder="Author Name" value={formData.auther_name} onChange={handleChange} />
                </div>
                <div>
                  <input type="text" name="publisher_name" placeholder="Publisher Name" value={formData.publisher_name} onChange={handleChange} />
                </div>
                <div>
                  <input type="number" name="year_of_the_book" placeholder="Year" value={formData.year_of_the_book} onChange={handleChange} />
                </div>
                <div>
                  {/* <label>Category</label> <br></br> */}
                  <select className='cate-lesec' name="category_name" value={formData.category_name} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.category_id} value={category.category_name}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input type="number" name="book_price" placeholder="Price" value={formData.book_price} onChange={handleChange} />
                </div>
                <div className="btn-box">
                  <button type="submit">Publish</button>
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <div className="img-box">
                <img className="bok-rea-register" src={ebookpublishing} alt="E-book Publishing" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Publishebook;
