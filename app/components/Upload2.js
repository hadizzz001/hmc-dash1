"use client";

import { useState } from "react";

const Upload = ({ onFileUpload }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your actual preset

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dv8x3kn8r/raw/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Upload failed");
        return;
      }

      const data = await res.json();
      setPdfUrl(data.secure_url);
      if (onFileUpload) onFileUpload(data.secure_url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    setLoading(false);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-bold">Upload PDF</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="border p-2 w-full"
      />
      {loading && <p>Uploading...</p>}
      {pdfUrl && (
        <div className="mt-2">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View Uploaded PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default Upload;
