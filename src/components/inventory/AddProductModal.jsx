// src/components/inventory/AddProductModal.jsx

import React, { useState } from 'react';
import { X, Package } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose, onSave, categories }) => {
  // Define the required fields for your API
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unit_price: '', // Keep as string for input field
    current_stock: '', // Keep as string for input field
    category: '', // API expects category ID or slug, depending on your backend
    description: '',
    is_active: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Prepare and sanitize data before sending to the service
    const dataToSave = {
        ...formData,
        // Convert string inputs to correct numeric types for the API
        unit_price: parseFloat(formData.unit_price) || 0,
        current_stock: parseInt(formData.current_stock, 10) || 0,
        // Ensure category is sent as a number if your API expects an ID
        category: formData.category ? parseInt(formData.category, 10) : null,
    };
    
    // onSave is the handleAddProduct function from the parent
    const success = await onSave(dataToSave); 
    
    if (success) {
      // Reset form fields upon successful save
      setFormData({
        name: '', sku: '', unit_price: '', current_stock: '',
        category: '', description: '', is_active: true,
      });
    }

    setIsSaving(false);
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <Package className="w-6 h-6 text-primary-600" />
            <span>Add New Product</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field mt-1"
            />
          </div>

          {/* SKU and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                name="sku"
                id="sku"
                value={formData.sku}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">Unit Price *</label>
              <input
                type="number"
                name="unit_price"
                id="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
                className="input-field mt-1"
              />
            </div>
          </div>

          {/* Stock and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="current_stock" className="block text-sm font-medium text-gray-700">Initial Stock *</label>
              <input
                type="number"
                name="current_stock"
                id="current_stock"
                value={formData.current_stock}
                onChange={handleChange}
                min="0"
                required
                className="input-field mt-1"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="">Select Category</option>
                {/* Populate with categories from props */}
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="input-field mt-1"
            ></textarea>
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Product is Active
            </label>
          </div>

          {/* Modal Footer (Actions) */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;