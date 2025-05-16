import { useState, useEffect } from "react";
import { Search, Upload, MapPin, FileText, Edit, Trash2, X, Home, Shield, LogOut, Plus } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProperty, setNewProperty] = useState({
    id: "",
    title: "",
    state: "",
    city: "",
    location: "",
    price: "",
    beds: "",
    baths: "",
    imageDesc: "",
    image: null,
  });
  const [editProperty, setEditProperty] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/properties");
        setProperties(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again.");
      }
    };
    fetchProperties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      setNewProperty((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      // Validate inputs
      if (!newProperty.title.trim()) {
        setError("Property title is required.");
        return;
      }
      if (!newProperty.state) {
        setError("State is required.");
        return;
      }
      if (!newProperty.city) {
        setError("City is required.");
        return;
      }
      if (!newProperty.location.trim()) {
        setError("Location is required.");
        return;
      }
      if (!newProperty.price || newProperty.price <= 0) {
        setError("Valid price is required.");
        return;
      }
      if (!newProperty.beds || newProperty.beds < 0) {
        setError("Valid number of bedrooms is required.");
        return;
      }
      if (!newProperty.baths || newProperty.baths < 0) {
        setError("Valid number of bathrooms is required.");
        return;
      }

      const propertyData = {
        id: newProperty.id || Date.now().toString(),
        title: newProperty.title.trim(),
        state: newProperty.state,
        city: newProperty.city,
        location: newProperty.location.trim(),
        price: parseFloat(newProperty.price),
        beds: parseInt(newProperty.beds),
        baths: parseInt(newProperty.baths),
        imageDesc: newProperty.imageDesc.trim(),
        imageUrl: previewUrl || "https://via.placeholder.com/400x300",
      };

      const response = await axios.post("http://localhost:5000/api/properties", propertyData);
      setProperties((prev) => [...prev, response.data]);
      setShowAddModal(false);
      resetForm();
      setError(null);
      setSuccess("Property added successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding property:", err);
      setError(err.response?.data?.message || "Failed to add property. Please try again.");
    }
  };

  const handleEditProperty = async (e) => {
    e.preventDefault();
    try {
      // Validate inputs
      if (!editProperty.title.trim()) {
        setError("Property title is required.");
        return;
      }
      if (!editProperty.state) {
        setError("State is required.");
        return;
      }
      if (!editProperty.city) {
        setError("City is required.");
        return;
      }
      if (!editProperty.location.trim()) {
        setError("Location is required.");
        return;
      }
      if (!editProperty.price || editProperty.price <= 0) {
        setError("Valid price is required.");
        return;
      }
      if (!editProperty.beds || editProperty.beds < 0) {
        setError("Valid number of bedrooms is required.");
        return;
      }
      if (!editProperty.baths || editProperty.baths < 0) {
        setError("Valid number of bathrooms is required.");
        return;
      }

      const propertyData = {
        title: editProperty.title.trim(),
        state: editProperty.state,
        city: editProperty.city,
        location: editProperty.location.trim(),
        price: parseFloat(editProperty.price),
        beds: parseInt(editProperty.beds),
        baths: parseInt(editProperty.baths),
        imageDesc: editProperty.imageDesc.trim(),
        imageUrl: editProperty.imageUrl || "https://via.placeholder.com/400x300",
      };

      const response = await axios.put(`http://localhost:5000/api/properties/${editProperty.id}`, propertyData);
      setProperties((prev) =>
        prev.map((prop) => (prop.id === editProperty.id ? response.data : prop))
      );
      setShowEditModal(false);
      setEditProperty(null);
      setError(null);
      setSuccess("Property updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating property:", err);
      setError(err.response?.data?.message || "Failed to update property. Please try again.");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`http://localhost:5000/api/properties/${id}`);
        setProperties((prev) => prev.filter((property) => property.id !== id));
        setError(null);
        setSuccess("Property deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Error deleting property:", err);
        setError(err.response?.data?.message || "Failed to delete property. Please try again.");
      }
    }
  };

  const handleApproveProperty = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/properties/${id}/approve`);
      setProperties((prev) => prev.map((prop) => prop.id === id ? { ...prop, approved: true } : prop));
      setSuccess('Property approved!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to approve property.');
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleApproveRequest = async (msgId) => {
    try {
      await axios.put(`http://localhost:5000/api/messages/${msgId}/approve`);
      setApplications((prev) => prev.map(app => ({
        ...app,
        messages: app.messages.map(msg =>
          msg._id === msgId ? { ...msg, status: 'approved' } : msg
        )
      })));
      setSuccess('Request approved!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to approve request.');
      setTimeout(() => setError(null), 2000);
    }
  };

  const openEditModal = (property) => {
    setEditProperty({ ...property });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setNewProperty({
      id: "",
      title: "",
      state: "",
      city: "",
      location: "",
      price: "",
      beds: "",
      baths: "",
      imageDesc: "",
      image: null,
    });
    setPreviewUrl(null);
  };

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const res = await axios.get("http://localhost:5000/api/messages");
      setApplications(res.data);
    } catch (err) {
      setApplications([]);
    }
    setLoadingApplications(false);
  };

  return (
    <div className="min-h-screen  bg-[#0f172a] text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">PropertyHub</h1>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white">
            <Home size={18} />
            <span>Client View</span>
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white">
            <Shield size={18} />
            <span>Admin Panel</span>
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-600 text-white rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded-md">
            {success}
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Admin Dashboard</h2>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Property
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 border border-gray-700 rounded-md hover:bg-gray-800">
              <Upload size={18} className="text-blue-400" />
              <span>Upload Property Images</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 border border-gray-700 rounded-md hover:bg-gray-800">
              <MapPin size={18} className="text-green-400" />
              <span>Manage Locations</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 p-4 border border-gray-700 rounded-md hover:bg-gray-800"
              onClick={() => {
                setShowApplications((prev) => !prev);
                if (!showApplications) fetchApplications();
              }}
            >
              <FileText size={18} className="text-yellow-400" />
              <span>View All Applications</span>
            </button>
          </div>
        </section>

        {/* Applications Section */}
        {showApplications && (
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">All Applications</h3>
            {loadingApplications ? (
              <div className="text-gray-300">Loading...</div>
            ) : applications.length === 0 ? (
              <div className="text-gray-400">No applications found.</div>
            ) : (
              <div className="space-y-6">
                {applications.map((app) => (
                  <div key={app.propertyId} className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-purple-300 mb-2">{app.propertyTitle} (ID: {app.propertyId})</h4>
                    <div className="space-y-2">
                      {app.messages.map((msg, idx) => (
                        <div key={msg._id || idx} className="bg-gray-900 rounded p-3 mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div><span className="font-semibold">Name:</span> {msg.userName}</div>
                            <div><span className="font-semibold">Email:</span> {msg.userEmail}</div>
                            {msg.userPhone && <div><span className="font-semibold">Phone:</span> {msg.userPhone}</div>}
                            <div><span className="font-semibold">Message:</span> {msg.message}</div>
                            <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</div>
                          </div>
                          {/* Approve button for each request */}
                          {msg.status !== 'approved' ? (
                            <button
                              onClick={() => handleApproveRequest(msg._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-semibold mt-2 md:mt-0 md:ml-4"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-green-400 font-semibold mt-2 md:mt-0 md:ml-4">Approved</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your properties by title, city, or state..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400"
          />
        </div>

        {/* Properties List or Empty State */}
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Search size={64} className="text-gray-600 mb-4" />
            <p className="text-gray-400 mb-6">You haven't added any properties yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <div className="relative">
                  <img
                    src={property.imageUrl || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  {!property.approved && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                      Pending Approval
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-purple-400">{property.title}</h3>
                  <p className="text-gray-400">{property.location}</p>
                  <p className="text-gray-500 mt-1">
                    {property.imageDesc?.substring(0, 50)}
                    {property.imageDesc?.length > 50 ? "..." : ""}
                  </p>
                  <p className="text-gray-400 mt-1">Price: ${property.price}</p>
                  <p className="text-gray-400 mt-1">Beds: {property.beds} | Baths: {property.baths}</p>
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      onClick={() => openEditModal(property)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Property Modal*/}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-purple-400 mb-2">Add New Property</h2>
            <p className="text-gray-400 mb-6">Fill in the details to add a new property.</p>

            <form onSubmit={handleAddProperty}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Property ID (Optional)</label>
                <input
                  type="text"
                  name="id"
                  value={newProperty.id}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  placeholder="Leave blank for auto-generated ID"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={newProperty.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  placeholder="e.g., Modern Villa"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">State</label>
                <select
                  name="state"
                  value={newProperty.state}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white appearance-none"
                  required
                >
                  <option value="">Select state</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">City</label>
                <select
                  name="city"
                  value={newProperty.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white appearance-none"
                  required
                >
                  <option value="">Select city</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Tiruppur">Tiruppur</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={newProperty.location}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  placeholder="e.g., 123 Main Street"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={newProperty.price}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  min="0"
                  placeholder="e.g., 1000"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="beds"
                  value={newProperty.beds}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  min="0"
                  placeholder="e.g., 2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="baths"
                  value={newProperty.baths}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  min="0"
                  placeholder="e.g., 1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">PROPERTY Description</label>
                <textarea
                  name="imageDesc"
                  value={newProperty.imageDesc}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white h-24"
                  placeholder="Describe the property image"
                ></textarea>
              </div>

              {/* Note: Image is optional. To make it required, add the 'required' attribute to the input and update validation in handleAddProperty. */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Property Image (Optional)</label>
                <div className="flex items-center gap-2">
                  <label className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-gray-600">
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  <span className="text-gray-400">{newProperty.image ? newProperty.image.name : "No file chosen"}</span>
                </div>
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="h-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
                  Add Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {showEditModal && editProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-purple-400 mb-2">Edit Property</h2>
            <p className="text-gray-400 mb-6">Update the details of the property.</p>

            <form onSubmit={handleEditProperty}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={editProperty.title}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  placeholder="e.g., Modern Villa"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">State</label>
                <select
                  name="state"
                  value={editProperty.state}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white appearance-none"
                  required
                >
                  <option value="">Select state</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="kerala">Delhi</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">City</label>
                <select
                  name="city"
                  value={editProperty.city}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white appearance-none"
                  required
                >
                  <option value="">Select city</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Palakkad">Palakkad</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editProperty.location}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  placeholder="e.g., 123 Main Street"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={editProperty.price}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  min="0"
                  placeholder="e.g., 1000"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="beds"
                  value={editProperty.beds}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  min="0"
                  placeholder="e.g., 2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="baths"
                  value={editProperty.baths}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  required
                  min="0"
                  placeholder="e.g., 1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Image Description</label>
                <textarea
                  name="imageDesc"
                  value={editProperty.imageDesc}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white h-24"
                  placeholder="Describe the property image"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Property Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={editProperty.imageUrl}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                  placeholder="e.g., https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
                  Update Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}