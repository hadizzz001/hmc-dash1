'use client';

import { useState, useEffect } from 'react';  
import Upload from '../components/Upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; 

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const ManageArticles = () => {
  const [formData, setFormData] = useState({ title: '', description: '', img: [] });
  const [editFormData, setEditFormData] = useState({ id: '', title: '', description: '', img: [] });
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]); 
  const [editMode, setEditMode] = useState(false);
 
  // Fetch all articles
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/const', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        console.error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle image uploads
  const handleImgChange = (uploadedImages) => {
    if (editMode) {
      setEditFormData({ ...editFormData, img: uploadedImages });
    } else {
      setFormData({ ...formData, img: uploadedImages });
    }
  };

  // Add article
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/const', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('added successfully!');
      setFormData({ title: '', description: '', img: [] });
      fetchArticles();
      window.location.href = "/const";
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  // Edit article
  const handleEdit = (article) => {
    setEditMode(true);
    setEditFormData({
      id: article.id,
      title: article.title,
      description: article.description,
      img: article.img,
    }); 
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/const/${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFormData.title,
          description: editFormData.description,
          img: editFormData.img,
        }),
      });

      if (res.ok) {
        setEditFormData({ id: '', title: '', description: '', img: [] });
        setEditMode(false);
        fetchArticles();
        window.location.href = "/const";
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`); 
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating.'); 
    }
  };

  // Delete article
  const handleDelete = async (id) => {
    if (confirm(`Are you sure you want to delete this?`)) {
      try {
        const res = await fetch(`/api/const/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setMessage('deleted successfully!');
          fetchArticles();
        } else {
          const errorData = await res.json();
          setMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit' : 'Add'}</h1>
      
      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={editMode ? editFormData.title : formData.title}
            onChange={(e) =>
              editMode
                ? setEditFormData({ ...editFormData, title: e.target.value })
                : setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div>
  <label className="block mb-1">descriptionription</label>
  <ReactQuill
    theme="snow"
    value={editMode ? editFormData.description : formData.description}
    onChange={(value) =>
      editMode
        ? setEditFormData({ ...editFormData, description: value })
        : setFormData({ ...formData, description: value })
    }
    className="bg-white"
  />
</div>


        <div>
        
          <Upload onFilesUpload={handleImgChange} />
    
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {editMode ? 'Update' : 'Add'}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mt-8">All Data</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Title</th> 
            <th className="border border-gray-300 p-2">Images</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr key={article.id}>
                <td className="border border-gray-300 p-2">{article.title}</td> 
                <td className="border border-gray-300 p-2">
                  <div className="flex space-x-2">
                    {article.img.map((imgUrl, index) => (
                      <img key={index} src={imgUrl} alt="Article Image" className="w-16 h-16 object-cover border" />
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEdit(article)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border border-gray-300 p-2 text-center">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
