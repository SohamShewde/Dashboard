import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrudOperations = () => {
  const [invoices, setInvoices] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceQty, setInvoiceQty] = useState('');
  const [invoicePrice, setInvoicePrice] = useState('');
  const [editId, setEditId] = useState(null);

  // Fetch Invoices on Component Mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/invoices/read'); // Update with your backend URL
      setInvoices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Create or Update Invoice
  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/invoices/update/${editId}`, {
          CUSTOMER_NAME: customerName,
          INVOICE_NO: invoiceNo,
          INVOICE_DATE: invoiceDate,
          INVOICE_QTY: invoiceQty,
          INVOICE_PRICE: invoicePrice,
        });
        alert('Invoice updated successfully');
      } else {
        await axios.post('http://localhost:5000/invoices/create', {
          CUSTOMER_NAME: customerName,
          INVOICE_NO: invoiceNo,
          INVOICE_DATE: invoiceDate,
          INVOICE_QTY: invoiceQty,
          INVOICE_PRICE: invoicePrice,
        });
        alert('Invoice created successfully');
      }
      fetchInvoices();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Invoice
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/invoices/delete/${id}`);
      alert('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      console.error(error);
    }
  };

  // Set data for editing
  const handleEdit = (invoice) => {
    setCustomerName(invoice.CUSTOMER_NAME);
    setInvoiceNo(invoice.INVOICE_NO);
    setInvoiceDate(invoice.INVOICE_DATE);
    setInvoiceQty(invoice.INVOICE_QTY);
    setInvoicePrice(invoice.INVOICE_PRICE);
    setEditId(invoice.ID);
  };

  // Reset the form after submitting or canceling
  const resetForm = () => {
    setCustomerName('');
    setInvoiceNo('');
    setInvoiceDate('');
    setInvoiceQty('');
    setInvoicePrice('');
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoice Management</h1>

      {/* Form Section */}
      <div className="bg-gray-800  shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4 text-purple-500">
          {editId ? 'Edit Invoice' : 'Add Invoice'}
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="shadow text-black appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-2"
          />
          <input
            type="text"
            placeholder="Invoice Number"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          />
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={invoiceQty}
            onChange={(e) => setInvoiceQty(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={invoicePrice}
            onChange={(e) => setInvoicePrice(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editId ? 'Update Invoice' : 'Create Invoice'}
        </button>
        {editId && (
          <button
            onClick={resetForm}
            className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Invoices List */}
      <div className="bg-gray-800  shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-500">Invoice List</h2>
        {invoices.length ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-purple-500">Customer Name</th>
                <th className="px-4 py-2 text-purple-500">Invoice No</th>
                <th className="px-4 py-2 text-purple-500">Invoice Date</th>
                <th className="px-4 py-2 text-purple-500">Quantity</th>
                <th className="px-4 py-2 text-purple-500">Price</th>
                <th className="px-4 py-2 text-purple-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.ID}>
                  <td className="border px-3 py-2 text-white">{invoice.CUSTOMER_NAME}</td>
                  <td className="border px-3 py-2 text-white">{invoice.INVOICE_NO}</td>
                  <td className="border px-3 py-2 text-white">{invoice.INVOICE_DATE}</td>
                  <td className="border px-7 py-2 text-white">{invoice.INVOICE_QTY}</td>
                  <td className="border px-3 py-2 text-white">{invoice.INVOICE_PRICE}</td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2 mb-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.ID)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No invoices found</p>
        )}
      </div>
    </div>
  );
};

export default CrudOperations;
