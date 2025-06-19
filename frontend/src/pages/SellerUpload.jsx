import React, { useState } from 'react';

export default function SellerUpload({ onAddProduct }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !imageFile) {
      alert('Please fill all fields and select an image');
      return;
    }
    onAddProduct({
      id: Date.now(),
      name,
      price,
      image: preview,
    });
    setName('');
    setPrice('');
    setImageFile(null);
    setPreview(null);
  };

  return (
    <div className="seller-upload">
      <h2>Seller Upload</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br/>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        /><br/>
        <input type="file" accept="image/*" onChange={handleImageChange} /><br/>
        {preview && <img src={preview} alt="Preview" style={{ width: '120px', marginTop: '10px' }} />}
        <br/>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
