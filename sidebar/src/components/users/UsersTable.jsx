import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from 'axios'

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredInvoices, setFilteredInvoices] = useState([]);
	const [invoiceData, setInvoiceData] = useState([]); // State to store fetched invoice data
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
  
	useEffect(() => {
		
		const fetchInvoices = async () => {
		  try {
			const response = await axios.get('/users');
			setInvoiceData(response.data);
			setFilteredInvoices(response.data);
			setLoading(false);
		  } catch (err) {
			setError(err.message);
			setLoading(false);
		  }
		};
	  
		fetchInvoices();
	  }, []);

	const handleSearch = (e) => {
	  const term = e.target.value.toLowerCase();
	  setSearchTerm(term);
	  const filtered = invoiceData.filter(
		(invoice) =>
		  invoice.CUSTOMER_NAME.toLowerCase().includes(term) ||
		  invoice.INVOICE_NO.toLowerCase().includes(term)
	  );
	  setFilteredInvoices(filtered);
	};
  
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
  
	return (
	  <motion.div
		className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.1 }}
	  >
		<div className="flex justify-between items-center mb-6">
		  <h2 className="text-xl font-semibold text-gray-100">Customers</h2>
		  <div className="relative">
			<input
			  type="text"
			  placeholder="Search invoices..."
			  className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			  value={searchTerm}
			  onChange={handleSearch}
			/>
			<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
		  </div>
		</div>
  
		<div className="overflow-x-auto">
		  <table className="min-w-full divide-y divide-gray-700">
			<thead>
			  <tr>
				<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer Name</th>
				<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice No</th>
				<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice Date</th>
				<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
				<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
			  </tr>
			</thead>
  
			<tbody className="divide-y divide-gray-700">
			  {filteredInvoices.map((invoice) => (
				<motion.tr key={invoice.INVOICE_NO} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
				  <td className="px-6 py-4 whitespace-nowrap">
					<div className="text-sm font-medium text-gray-100">{invoice.CUSTOMER_NAME}</div>
				  </td>
  
				  <td className="px-6 py-4 whitespace-nowrap">
					<div className="text-sm text-gray-300">{invoice.INVOICE_NO}</div>
				  </td>
				  <td className="px-6 py-4 whitespace-nowrap">
					<div className="text-sm text-gray-300">{new Date(invoice.INVOICE_DATE).toLocaleDateString()}</div>
				  </td>
				  <td className="px-6 py-4 whitespace-nowrap">
					<div className="text-sm text-gray-300">{invoice.INVOICE_QTY}</div>
				  </td>
				  <td className="px-6 py-4 whitespace-nowrap">
					<div className="text-sm text-gray-300">{invoice.INVOICE_PRICE}</div>
				  </td>
				</motion.tr>
			  ))}
			</tbody>
		  </table>
		</div>
	  </motion.div>
	);
};

export default UsersTable;

// const [userStats, setUserStats] = useState({
// 	totalUsers: 0,
// 	newUsersToday: 0,
// 	activeUsers: 0,
// 	churnRate: "0%",
// });
