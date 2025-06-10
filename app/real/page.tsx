'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import Upload from '../components/Upload';
import Upload1 from '../components/Upload1';
import Upload2 from '../components/Upload2';
import Upload3 from '../components/Upload3';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';





const AmenitiesDropdown = ({
  selectedAmenities,
  onChange,
}: {
  selectedAmenities: string[];
  onChange: (newAmenities: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      onChange(selectedAmenities.filter(a => a !== amenity));
    } else {
      onChange([...selectedAmenities, amenity]);
    }
  };

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border p-2 text-left rounded"
      >
        {selectedAmenities.length > 0
          ? `Selected (${selectedAmenities.length})`
          : 'Select Amenities'}
        <span className="float-right">▾</span>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto border bg-white rounded shadow-lg">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center px-3 py-1 cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="mr-2"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};














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
  bro: string;
  plan: string;
  inv: string;
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
  bro: '',
  plan: '',
  inv: '',
};

const categories = [
  "Apartments For Sale","Villas For Sale", "Commercials For Sale", "Lands for Sale",
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
  "Complimentary guest suites",
  "Clubhouse",
  "Infinity outdoor pool",
  "Cutting edge fitness center",
  "Game room and chillout area",
  "Communications space with a private cinema",
  "Platinum Elite status by Marriott Bonvoy for two years",
  "Promenades",
  "Children Play Area",
  "Children Swimming Pool",
  "Cliff Edge Infinity Pool",
  "Plazas, Cafes & Restaurants",
  "Outdoor Landscapes",
  "Premium Fitness Center",
  "24/7 Security",
  "Terrace with a dining area and a walk track",
  "Offices with coworking space and meeting rooms",
  "Pool bar",
  "Multipurpose Hall",
  "Spa",
  "Infinity Pool",
  "Indoor Cinema",
  "Yoga Lawn",
  "Viewing Deck",
  "Running Trail",
  "Hiking Trail",
  "State-of-the-art gym",
  "Changing facilities",
  "Mountain Bike Trail",
  "Luxury Retail",
  "24hrs Reception Desk",
  "Landscaped community courtyard with sea views",
  "Concierge Services",
  "Retail",
  "Grand Entrance",
  "Cutting-edge gym",
  "Covered Parking",
  "Rooftop pool area",
  "24/7 concierge service",
  "Modern gym",
  "Lounges and lobby areas: furniture designed and selected by Elie Saab",
  "4 personal elevators, inclusive of a service elevator to all floors",
  "Parking for all units",
  "Luxury Hotels",
  "Trump International Golf Club, Oman",
  "Wellness Centers",
  "Community & Retail Centre",
  "Landscaped Podium",
  "Sky Garden",
  "Gated community",
  "Premium 24/7 security services",
  "Each villa within Tierra Viva comes with its own built private pool",
  "10 min walk to West Ealing Crossrail Station",
  "6 Parks within walking distance",
  "Wide variety of Restaurants and Cafes",
  "Shopping",
  "Schools and Nurseries",
  "Golf Clubs",
  "Fitness Centers",
  "Local Markets",
  "Art Galleries",
  "Theater and Cinema",
  "Children Splash Area",
  "Tennis Court",
  "Community Garden",
  "Tennis and Padel Courts",
  "Fine Dining",
  "Retail Shops and Supermarkets",
  "Golf Proshops",
  "Kids Pool",
  "Arcade and Playground",
  "Community Events and Sports Tournaments",
  "World-Class Championship Golf Courses",
  "SPA Services",
  "Resort-Style Swimming Pools",
  "SPA & Wellness Centre",
  "Signature Bar",
  "Gym",
  "Private Dining Area",
  "Cafe",
  "Restaurant",
  "Golf Simulator Suite",
  "Cigar Lounge",
  "Pool",
  "Meeting Room",
  "Private Lounge",
  "Yoga Studio"
];


const ageOptions = ["1 year - 5 years", "5 years - 10 years", "10+ years"];

const ManageArticles = () => {
  const [formData, setFormData] = useState<Article>(defaultFormData);
  const [editFormData, setEditFormData] = useState<Article>({ ...defaultFormData });
  const [articles, setArticles] = useState<Article[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  
const [amenitiesFilter, setAmenitiesFilter] = useState('');

const filteredAmenities = amenitiesList.filter((amenity) =>
  amenity.toLowerCase().includes(amenitiesFilter.toLowerCase())
);
  
  

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

  const handleBroChange = (uploadedFileName: string) => {
    editMode
      ? setEditFormData(prev => ({ ...prev, bro: uploadedFileName }))
      : setFormData(prev => ({ ...prev, bro: uploadedFileName }));
  };

  const handleInvChange = (uploadedFileName: string) => {
    editMode
      ? setEditFormData(prev => ({ ...prev, inv: uploadedFileName }))
      : setFormData(prev => ({ ...prev, inv: uploadedFileName }));
  };

  const handlePayChange = (uploadedFileName: string) => {
    editMode
      ? setEditFormData(prev => ({ ...prev, plan: uploadedFileName }))
      : setFormData(prev => ({ ...prev, plan: uploadedFileName }));
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

    {/* Filter input */}
    <input
      type="text"
      placeholder="Search amenities..."
      value={amenitiesFilter}
      onChange={(e) => setAmenitiesFilter(e.target.value)}
      className="border p-2 mb-2 w-full"
    />

    {/* Amenities list as checkboxes */}
    <div className="max-h-48 overflow-auto border rounded p-2">
      {filteredAmenities.length === 0 && (
        <p className="text-sm text-gray-500">No amenities found.</p>
      )}
      {filteredAmenities.map((amenity) => {
        const selected = currentData.amenities.includes(amenity);

        const toggleAmenity = () => {
          const newAmenities = selected
            ? currentData.amenities.filter((a) => a !== amenity)
            : [...currentData.amenities, amenity];

          if (editMode) {
            setEditFormData((prev) => ({ ...prev, amenities: newAmenities }));
          } else {
            setFormData((prev) => ({ ...prev, amenities: newAmenities }));
          }
        };

        return (
          <label key={amenity} className="flex items-center space-x-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selected}
              onChange={toggleAmenity}
              className="w-4 h-4"
            />
            <span className="text-sm">{amenity}</span>
          </label>
        );
      })}
    </div>
  </div>



        <Upload onFilesUpload={handleImgChange} />

        <label htmlFor="bro" className="block mb-1">Brochure</label>
        <Upload1 onFileUpload={handleBroChange} />

        <label htmlFor="PaymentPlan" className="block mb-1">Payment Plan</label>
        <Upload2 onFileUpload={handlePayChange} />

        <label htmlFor="Why invest" className="block mb-1">Why invest</label>
        <Upload3 onFileUpload={handleInvChange} />


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
