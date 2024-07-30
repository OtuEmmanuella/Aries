import React, { useState, useEffect } from 'react';
import { db, auth } from '../../Firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import './admin.css';

const UsersSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminDoc = await getDoc(adminDocRef);
          const adminStatus = adminDoc.exists() && adminDoc.data().isAdmin === true;
          console.log("Admin status:", adminStatus);
          setIsAdmin(adminStatus);
        } else {
          console.log("No user is currently signed in.");
          setError("No user is currently signed in.");
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError("Error checking admin status: " + err.message);
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        console.log("Attempting to fetch users...");
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        
        console.log("Snapshot received, doc count:", snapshot.docs.length);
        if (snapshot.empty) {
          console.log("No documents found in 'users' collection");
        } else {
          snapshot.docs.forEach(doc => {
            console.log("Document data:", doc.id, doc.data());
          });
        }

        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log("Processed users:", usersList);
        setUsers(usersList);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error fetching users: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAdmin) {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className="users-section">
      <h2 className="section-title">User Accounts</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td data-label="User ID">{user.id}</td>
                  <td data-label="First Name">{user.firstName || 'N/A'}</td>
                  <td data-label="Last Name">{user.lastName || 'N/A'}</td>
                  <td data-label="Email">{user.email || 'N/A'}</td>
                  <td data-label="Registration Date">
                    {user.createdAt && user.createdAt.seconds
                      ? new Date(user.createdAt.seconds * 1000).toLocaleString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersSection;