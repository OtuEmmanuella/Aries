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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory('');
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, category, subcategory: '' });
    } else {
      setNewProduct({ ...newProduct, category, subcategory: '' });
    }
  };

  const handleSubcategoryChange = (e) => {
    const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);
    if (editingProduct) {
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
        const productToAdd = { ...newProduct, imageUrl };
        await addDoc(collection(db, 'products'), productToAdd);
        setNewProduct({ name: '', description: '', price: '', category: '', subcategory: '', imageUrl: '' });
        setSelectedFile(null);
        setSelectedCategory('');
        setSelectedSubcategory('');
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
      let updatedProduct = { ...editingProduct };
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

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h3 className="dashboard-title">Manage Products</h3>
      
      <form className="modern-form" onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={editingProduct ? editingProduct.name : newProduct.name}
          onChange={(e) => handleInputChange(e, !!editingProduct)}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={editingProduct ? editingProduct.description : newProduct.description}
          onChange={(e) => handleInputChange(e, !!editingProduct)}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={editingProduct ? editingProduct.price : newProduct.price}
          onChange={(e) => handleInputChange(e, !!editingProduct)}
          required
        />
        <select
          name="category"
          value={editingProduct ? editingProduct.category : selectedCategory}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.label} value={cat.label}>{cat.label}</option>
          ))}
        </select>

        {selectedCategory && categories.find(cat => cat.label === selectedCategory)?.children && (
          <select
            name="subcategory"
            value={editingProduct ? editingProduct.subcategory : selectedSubcategory}
            onChange={handleSubcategoryChange}
            required
          >
            <option value="">Select Subcategory</option>
            {categories.find(cat => cat.label === selectedCategory).children.map((subcat) => (
              <option key={subcat.label} value={subcat.label}>{subcat.label}</option>
            ))}
          </select>
        )}
        <input
          type="file"
          onChange={handleImageSelect}
        />
        <button className="action-button" type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
      </form>

      <div className="Adminproduct-grid">
        {products.map(product => (
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
    </div>
  );
};

export default ProductsSection;