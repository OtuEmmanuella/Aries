import React, { useState, useEffect } from 'react';
import { db, storage } from '../../Firebase/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import './admin.css';

const categories = [
  {
    label: "MEN",
    children: [
      { label: "Shirts" },
      { label: "Pants" },
      { label: "Sneakers" },
      { label: "Caps" },
    ],
  },
  {
    label: "WOMEN",
    children: [
      { label: "Bags" },
      { label: "Beauty" },
      { label: "Dress" },
    ],
  },
  { label: "SUITS" },
  { label: "T-Shirts" },
];

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    subcategory: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    priceRange: { min: 0, max: 1000000 },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply subcategory filter
    if (filters.subcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === filters.subcategory);
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'price') {
        return filters.sortOrder === 'asc' 
          ? a.price - b.price
          : b.price - a.price;
      }
      return 0;
    });

    setFilteredProducts(filtered);
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    const updatedValue = name === 'price' ? Number(value) : value;
    if (isEditing) {
      setEditingProduct({ ...editingProduct, [name]: updatedValue });
    } else {
      setNewProduct({ ...newProduct, [name]: updatedValue });
    }
  };

  const handleCategoryChange = (e, isEditing = false) => {
    const category = e.target.value;
    if (isEditing) {
      setEditingProduct({ ...editingProduct, category, subcategory: '' });
    } else {
      setNewProduct({ ...newProduct, category, subcategory: '' });
    }
  };

  const handleSubcategoryChange = (e, isEditing = false) => {
    const subcategory = e.target.value;
    if (isEditing) {
      setEditingProduct({ ...editingProduct, subcategory });
    } else {
      setNewProduct({ ...newProduct, subcategory });
    }
  };

  const handleImageSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async (category, subcategory) => {
    if (selectedFile) {
      try {
        const folderPath = subcategory 
          ? `${category}/${subcategory}` 
          : category;
        const storageRef = ref(storage, `products/${folderPath}/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        const imageUrl = await getDownloadURL(storageRef);
        return imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.");
        return null;
      }
    }
    return null;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await handleImageUpload(newProduct.category, newProduct.subcategory);
      if (imageUrl) {
        const productToAdd = { 
          ...newProduct, 
          imageUrl,
          price: Number(newProduct.price)
        };
        await addDoc(collection(db, 'products'), productToAdd);
        setNewProduct({ name: '', description: '', price: '', category: '', subcategory: '', imageUrl: '' });
        setSelectedFile(null);
        fetchProducts();
        toast.success('Product added successfully');
      } else {
        toast.error('Failed to upload image. Product not added.');
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error('Failed to add product. Please try again.');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      let updatedProduct = { 
        ...editingProduct,
        price: Number(editingProduct.price)
      };
      if (selectedFile) {
        const imageUrl = await handleImageUpload(editingProduct.category, editingProduct.subcategory);
        if (imageUrl) {
          updatedProduct.imageUrl = imageUrl;
        } else {
          toast.error('Failed to upload new image. Using existing image.');
        }
      }
      const productRef = doc(db, 'products', editingProduct.id);
      await updateDoc(productRef, updatedProduct);
      setEditingProduct(null);
      setSelectedFile(null);
      fetchProducts();
      toast.success('Product updated successfully');
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId, imageUrl) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'products', productId));
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
        fetchProducts();
        Swal.fire(
          'Deleted!',
          'Your product has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h3 className="dashboard-title">Manage Products</h3>
      
      {/* Filter controls */}
      <div className="filter-controls">
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value, subcategory: 'all'})}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.label} value={cat.label}>{cat.label}</option>
          ))}
        </select>
        
        {filters.category !== 'all' && categories.find(cat => cat.label === filters.category)?.children && (
          <select
            value={filters.subcategory}
            onChange={(e) => setFilters({...filters, subcategory: e.target.value})}
          >
            <option value="all">All Subcategories</option>
            {categories.find(cat => cat.label === filters.category).children.map(subcat => (
              <option key={subcat.label} value={subcat.label}>{subcat.label}</option>
            ))}
          </select>
        )}
        
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            setFilters({...filters, sortBy, sortOrder});
          }}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      {/* Product form */}
      <form className="modern-form" onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
  <input
    type="text"
    name="name"
    value={editingProduct ? editingProduct.name : newProduct.name}
    onChange={(e) => handleInputChange(e, !!editingProduct)}
    placeholder="Product Name"
    required
  />
  <textarea
    name="description"
    value={editingProduct ? editingProduct.description : newProduct.description}
    onChange={(e) => handleInputChange(e, !!editingProduct)}
    placeholder="Product Description"
    required
  />
  <input
    type="number"
    name="price"
    value={editingProduct ? editingProduct.price : newProduct.price}
    onChange={(e) => handleInputChange(e, !!editingProduct)}
    placeholder="Price"
    required
  />
  <select
    name="category"
    value={editingProduct ? editingProduct.category : newProduct.category}
    onChange={(e) => handleCategoryChange(e, !!editingProduct)}
    required
  >
    <option value="">Select Category</option>
    {categories.map(cat => (
      <option key={cat.label} value={cat.label}>{cat.label}</option>
    ))}
  </select>
  {(editingProduct ? editingProduct.category : newProduct.category) && 
   categories.find(cat => cat.label === (editingProduct ? editingProduct.category : newProduct.category))?.children && (
    <select
      name="subcategory"
      value={editingProduct ? editingProduct.subcategory : newProduct.subcategory}
      onChange={(e) => handleSubcategoryChange(e, !!editingProduct)}
      required
    >
      <option value="">Select Subcategory</option>
      {categories.find(cat => cat.label === (editingProduct ? editingProduct.category : newProduct.category)).children.map(subcat => (
        <option key={subcat.label} value={subcat.label}>{subcat.label}</option>
      ))}
    </select>
  )}
  <input
    type="file"
    onChange={handleImageSelect}
    accept="image/*"
  />
  <button type="submit">
    {editingProduct ? 'Update Product' : 'Add Product'}
  </button>
</form>
      
      {/* Product grid */}
      <div className="Adminproduct-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="Adminproduct-card">
            <img src={product.imageUrl} alt={product.name} />
            <div className="Adminproduct-info">
              <h4 className="Adminproduct-name">{product.name}</h4>
              <p className="Adminproduct-description">{product.description}</p>
              <p className="Adminproduct-price">Price: ₦{product.price}</p>
              <p className="Adminproduct-category">Category: {product.category}</p>
              {product.subcategory && <p className="Adminproduct-subcategory">Subcategory: {product.subcategory}</p>}
              <div className="Adminproduct-actions">
                <button className="action-button edit" onClick={() => setEditingProduct(product)}>Edit</button>
                <button className="action-button delete" onClick={() => handleDeleteProduct(product.id, product.imageUrl)}>
                  <FaTrash className='trash' size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default ProductsSection;