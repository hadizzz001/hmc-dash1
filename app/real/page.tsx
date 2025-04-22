'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Upload from '../components/Upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Article {
  id?: string;
  title: string;
  description: string;
  img: string[];
  price: string;
  location: string;
  category: string;
  type: string;
  bed: string;
  bath: string;
  size: string;
  condition: string;
  floor: string;
  amenities: string[];
  age: string;
  ref: string;
}

const defaultFormData: Article = {
  title: '',
  description: '',
  img: [],
  price: '',
  location: '',
  category: '',
  type: '',
  bed: '',
  bath: '',
  size: '',
  condition: '',
  floor: '',
  amenities: [],
  age: '',
  ref: '',
};

const categories = [
  "Apartments & Villas For Sale", "Commercials For Sale", "Lands for Sale",
  "Chalets & Cabins For Sale", "Buildings & Multiple Units"
];

const types = [
  "Apartment", "Villa", "Detached house", "Ground floor apartment",
  "Semi-detached", "Town house", "Maisonette", "Bungalow",
  "Penthouse", "Duplex", "Triplex", "Loft"
];

const bedroomOptions = ["Studio", ...Array.from({ length: 13 }, (_, i) => `${i + 1}`)];
const bathOptions = [...Array.from({ length: 14 }, (_, i) => `${i}`)];
const conditions = ["Ready to move in", "Under Construction"];
const floors = ["-3", "-2", "Basement", "Ground floor", ...Array.from({ length: 11 }, (_, i) => `${i} floor`), "Highest level"];
const amenitiesList = [
  "Balcony", "Built in Kitchen Appliances", "Built in Wardrobes", "Central A/C & heating",
  "Covered Parking", "Maids Room", "Pets Allowed", "Private Garden", "Private Gym",
  "Private Jacuzzi", "Private Pool", "Security", "Shared Gym", "Shared Pool", "Shared Spa",
  "Study Room", "Walk-in Closet", "Elevator", "Fireplace", "Playroom", "Attic/ Loft",
  "Storage room", "Terrace", "24/7 Electricity", "Concierge", "Sea view", "Mountain View", "Accessible"
];
const ageOptions = ["1 year - 5 years", "5 years - 10 years", "10+ years"];

const ManageArticles = () => {
  const [formData, setFormData] = useState<Article>(defaultFormData);
  const [editFormData, setEditFormData] = useState<Article>({ ...defaultFormData });
  const [articles, setArticles] = useState<Article[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, multiple, selectedOptions } = e.target as HTMLSelectElement;
    const newValue = multiple ? Array.from(selectedOptions, option => option.value) : value;

    if (editMode) {
      setEditFormData(prev => ({ ...prev, [name]: newValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/real');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleImgChange = (uploadedImages: string[]) => {
    editMode
      ? setEditFormData(prev => ({ ...prev, img: uploadedImages }))
      : setFormData(prev => ({ ...prev, img: uploadedImages }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/real', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Added successfully!');
      setFormData(defaultFormData);
      fetchArticles();
      window.location.href = '/real';
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  const handleEdit = (article: Article) => {
    setEditMode(true);
    setEditFormData(article);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!editFormData.id) return;

    const res = await fetch(`/api/real/${encodeURIComponent(editFormData.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData),
    });

    if (res.ok) {
      setEditFormData({ ...defaultFormData });
      setEditMode(false);
      fetchArticles();
      window.location.href = '/real';
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this?')) {
      try {
        const res = await fetch(`/api/real/${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) {
          setMessage('Deleted successfully!');
          fetchArticles();
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const currentData = editMode ? editFormData : formData;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{editMode ? 'Edit' : 'Add'} Real Estate Listing</h1>

      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
        {['title', 'price', 'location', 'size', 'ref'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              className="border w-full p-2"
              value={currentData[field as keyof Article] as string}
              onChange={handleChange}
              required={field !== 'ref'}
            />
          </div>
        ))}

        <div>
          <label className="block mb-1">Description</label>
          <ReactQuill
            theme="snow"
            value={currentData.description}
            onChange={(value) => {
              editMode
                ? setEditFormData({ ...editFormData, description: value })
                : setFormData({ ...formData, description: value });
            }}
          />
        </div>

        {[{ name: 'category', options: categories },
          { name: 'type', options: types },
          { name: 'bed', options: bedroomOptions },
          { name: 'bath', options: bathOptions },
          { name: 'condition', options: conditions },
          { name: 'floor', options: floors },
          { name: 'age', options: ageOptions }
        ].map(({ name, options }) => (
          <div key={name}>
            <label className="block mb-1 capitalize">{name}</label>
            <select
              name={name}
              className="border w-full p-2"
              value={currentData[name as keyof Article] as string}
              onChange={handleChange}
            >
              <option value="">Select {name}</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}

{/* Custom Amenities Multi-select */}
<div>
  <label className="block mb-1">Amenities</label>
  <div className="flex flex-wrap gap-2">
    {amenitiesList.map((amenity) => {
      const selected = currentData.amenities.includes(amenity);
      const toggleAmenity = () => {
        const newAmenities = selected
          ? currentData.amenities.filter(a => a !== amenity)
          : [...currentData.amenities, amenity];

        if (editMode) {
          setEditFormData(prev => ({ ...prev, amenities: newAmenities }));
        } else {
          setFormData(prev => ({ ...prev, amenities: newAmenities }));
        }
      };

      return (
        <button
          key={amenity}
          type="button"
          onClick={toggleAmenity}
          className={`border px-3 py-1 rounded-full transition-all ${
            selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black'
          }`}
        >
          {amenity} {selected && '✓'}
        </button>
      );
    })}
  </div>
</div>


        <Upload onFilesUpload={handleImgChange} />

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          {editMode ? 'Update' : 'Add'}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}

      {/* Article List Table */}
<h2 className="text-xl font-semibold mt-10 mb-4">All Listings</h2>
<div className="overflow-x-auto">
  <table className="min-w-full bg-white border border-gray-300 text-sm">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2 border">Title</th>
        <th className="p-2 border">Price</th>
        <th className="p-2 border">Location</th>
        <th className="p-2 border">Category</th>
        <th className="p-2 border">Type</th>
        <th className="p-2 border">Size</th>
        <th className="p-2 border">Beds</th>
        <th className="p-2 border">Baths</th>
        <th className="p-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {articles.map((item) => (
        <tr key={item.id} className="text-center">
          <td className="p-2 border">{item.title}</td>
          <td className="p-2 border">{item.price}</td>
          <td className="p-2 border">{item.location}</td>
          <td className="p-2 border">{item.category}</td>
          <td className="p-2 border">{item.type}</td>
          <td className="p-2 border">{item.size}</td>
          <td className="p-2 border">{item.bed}</td>
          <td className="p-2 border">{item.bath}</td>
          <td className="p-2 border space-x-2">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => handleEdit(item)}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => item.id && handleDelete(item.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default ManageArticles;
