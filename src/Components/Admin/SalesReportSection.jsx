import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './admin.css'

const SalesReportSection = () => {
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlySales, setMonthlySales] = useState({});

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    const salesCollection = collection(db, 'orders');
    const salesSnapshot = await getDocs(salesCollection);
    const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSalesData(salesList);

    // Calculate total revenue
    const revenue = salesList.reduce((sum, sale) => sum + sale.total, 0);
    setTotalRevenue(revenue);

    // Calculate monthly sales
    const monthlyData = salesList.reduce((acc, sale) => {
      const date = new Date(sale.date.seconds * 1000);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + sale.total;
      return acc;
    }, {});
    setMonthlySales(monthlyData);
  };

  return (
    <div className="admin-dashboard">
      <h3 className="section-title">Sales Report</h3>
      <div className="total-revenue">
        <h4 className="section-subtitle">Total Revenue</h4>
        <p className="revenue-amount">₦{totalRevenue.toFixed(2)}</p>
      </div>
      <div className="monthly-sales">
        <h4 className="section-subtitle">Monthly Sales</h4>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Month/Year</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlySales).map(([monthYear, sales]) => (
              <tr key={monthYear}>
                <td>{monthYear}</td>
                <td>₦{sales.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReportSection;