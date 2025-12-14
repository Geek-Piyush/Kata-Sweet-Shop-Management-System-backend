import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import sweetsService from "../services/sweets.service";
import config from "../config";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetsService.getAllSweets();
      setSweets(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch sweets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      description: "",
    });
    setPhotoFile(null);
    setEditingSweet(null);
    setShowAddForm(false);
  };

  const handleAddSweet = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        description: formData.description,
      };

      const response = await sweetsService.createSweet(sweetData);
      const newSweet = response.sweet; // Extract sweet from response

      // Upload photo if provided
      if (photoFile && newSweet._id) {
        try {
          await sweetsService.uploadSweetPhoto(newSweet._id, photoFile);
        } catch (photoErr) {
          console.error("Photo upload failed:", photoErr);
          alert(
            "Sweet added but photo upload failed. You can edit to add photo later."
          );
        }
      }

      if (!photoFile || newSweet._id) {
        alert("Sweet added successfully!");
      }
      resetForm();
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add sweet");
      console.error(err);
      // Still refresh the list in case sweet was created
      fetchSweets();
    } finally {
      setUploading(false);
    }
  };

  const handleEditSweet = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        description: formData.description,
      };

      await sweetsService.updateSweet(editingSweet._id, sweetData);

      // Upload photo if provided
      if (photoFile) {
        try {
          await sweetsService.uploadSweetPhoto(editingSweet._id, photoFile);
        } catch (photoErr) {
          console.error("Photo upload failed:", photoErr);
          alert("Sweet updated but photo upload failed. Please try again.");
        }
      }

      if (!photoFile) {
        alert("Sweet updated successfully!");
      }
      resetForm();
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update sweet");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSweet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) {
      return;
    }

    try {
      await sweetsService.deleteSweet(id);
      alert("Sweet deleted successfully!");
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete sweet");
      console.error(err);
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt("Enter quantity to add:");
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      return;
    }

    try {
      await sweetsService.restockSweet(id, Number(quantity));
      alert("Sweet restocked successfully!");
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to restock sweet");
      console.error(err);
    }
  };

  const startEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || "",
    });
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <Navbar />
        <div className="admin-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            {showAddForm ? "Cancel" : "Add New Sweet"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showAddForm && (
          <div className="sweet-form">
            <h2>{editingSweet ? "Edit Sweet" : "Add New Sweet"}</h2>
            <form onSubmit={editingSweet ? handleEditSweet : handleAddSweet}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                  >
                    <option value="">Select category</option>
                    <option value="Indian">Indian</option>
                    <option value="Western">Western</option>
                    <option value="Bengali">Bengali</option>
                    <option value="South Indian">South Indian</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (₹) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={uploading}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo">Photo</label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={uploading}
                >
                  {uploading
                    ? "Saving..."
                    : editingSweet
                    ? "Update Sweet"
                    : "Add Sweet"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="sweets-table">
          <h2>All Sweets ({sweets.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => {
                const imageUrl = sweet.photo
                  ? `${config.API_URL.replace("/api", "")}${sweet.photo}`
                  : "https://via.placeholder.com/60x60?text=No+Image";

                return (
                  <tr key={sweet._id}>
                    <td>
                      <img
                        src={imageUrl}
                        alt={sweet.name}
                        className="table-image"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/60x60?text=No+Image";
                        }}
                      />
                    </td>
                    <td>{sweet.name}</td>
                    <td>{sweet.category}</td>
                    <td>₹{sweet.price}</td>
                    <td>
                      <span
                        className={
                          sweet.quantity === 0 ? "stock-zero" : "stock-ok"
                        }
                      >
                        {sweet.quantity}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => startEdit(sweet)}
                          className="btn-action btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRestock(sweet._id)}
                          className="btn-action btn-restock"
                        >
                          Restock
                        </button>
                        <button
                          onClick={() => handleDeleteSweet(sweet._id)}
                          className="btn-action btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {sweets.length === 0 && (
            <div className="no-sweets">
              <p>No sweets found. Add your first sweet!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
