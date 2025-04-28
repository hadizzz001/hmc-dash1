'use client';

import { useState, useEffect } from 'react';  
import Upload from '../components/Upload'; 

const ManageArticles = () => {
  const [editFormData, setEditFormData] = useState({ id: '', img: [] });
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]); 
  const allowedId = '680f74096032a0368d451e14'; // The ONLY ID allowed for edit

  // Fetch the allowed article
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/bung', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter(article => article.id === allowedId);
        setArticles(filtered);
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

  const handleImgChange = (uploadedImages) => {
    setEditFormData({ ...editFormData, img: uploadedImages });
  };

  // Only allow editing the specific ID
  const handleEdit = (article) => {
    if (article.id === allowedId) {
      setEditFormData({
        id: article.id,
        img: article.img,
      });
    } else {
      setMessage('Editing not allowed for this item.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editFormData.id !== allowedId) {
      setMessage('Editing not allowed.');
      return;
    }

    try {
      const res = await fetch(`/api/bung/${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          img: editFormData.img,
        }),
      });

      if (res.ok) {
        setMessage('Updated successfully!');
        setEditFormData({ id: '', img: [] });
        fetchArticles();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`); 
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating.'); 
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit</h1>
      
      <form onSubmit={handleEditSubmit} className="space-y-4">
        <div>
          <Upload onFilesUpload={handleImgChange} />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Update
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mt-8">Article</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr> 
            <th className="border border-gray-300 p-2">Images</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr key={article.id}> 
                <td className="border border-gray-300 p-2">
                  <div className="flex space-x-2">
                   
                      <img src={article.img[0]} alt="Article Image" className="w-16 h-16 object-cover border" />
                 
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEdit(article)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                  {/* Delete button is removed */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="border border-gray-300 p-2 text-center">
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
