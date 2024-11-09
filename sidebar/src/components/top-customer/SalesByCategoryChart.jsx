import { motion } from "framer-motion";
import {
	BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
	XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];
const MAX_CHARTS = 10;

const SalesByCategoryChart = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Year");
	const [chartType, setChartType] = useState("Bar");
	const [salesData, setSalesData] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [expandedChart, setExpandedChart] = useState(null);

	let endpoint = "";
	if (selectedTimeRange === "This Week") endpoint = '/sales/week';
	else if (selectedTimeRange === "Last Week") endpoint = '/sales/last-week';
	else if (selectedTimeRange === "This Month") endpoint = '/sales/month';
	else if (selectedTimeRange === "Last Month") endpoint = '/sales/last-month';
	else if (selectedTimeRange === "This Year") endpoint = '/sales/year';
	else if (selectedTimeRange === "Last Year") endpoint = '/sales/last-year';
	else if (selectedTimeRange === "Custom Range" && startDate && endDate) {
		endpoint = '/sales/custom-range';
	}

	const fetchSalesData = async () => {
		try {
			let params = {};
			if (selectedTimeRange === "Custom Range" && startDate && endDate) {
				params = { startDate, endDate };
			}
			const response = await axios.get(endpoint, { params });
			const data = response.data.map((customer) => ({
				name: customer.CUSTOMER_NAME,
				TotalSales: parseFloat(customer.TOTAL_AMOUNT),
			}));
			setSalesData(data);
		} catch (error) {
			console.error("Error fetching sales data:", error);
		}
	};

	useEffect(() => {
		fetchSalesData();

		const intervalId = setInterval(() => {
			fetchSalesData();
		}, 120000);

		return () => clearInterval(intervalId);
	}, [selectedTimeRange, startDate, endDate]);

	const ChartComponent = ({ data, type }) => (
		<ResponsiveContainer width="100%" height={270}>
			{type === "Pie" ? (
				<PieChart>
					<Pie data={data} cx="50%" cy="50%" outerRadius={80} label dataKey="TotalSales">
						{data.map((entry, i) => (
							<Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
						))}
					</Pie>
					<Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }} />
					<Legend />
				</PieChart>
			) : type === "Bar" ? (
				<BarChart data={data}>
					<XAxis dataKey="name" stroke="#E5E7EB" />
					<YAxis
						stroke="#E5E7EB"
						tick={{ angle: -45, dx: -10, dy: 0, fontSize: 17, fill: "#E5E7EB" }}
					/>
					<Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)" }} />
					<Bar dataKey="TotalSales" fill="#8884d8" />
				</BarChart>
			) : type === "Line" ? (
				<LineChart data={data}>
					<XAxis dataKey="name" stroke="#E5E7EB" />
					<YAxis
						stroke="#E5E7EB"
						tick={{ angle: -45, dx: -10, dy: 0, fontSize: 17, fill: "#E5E7EB" }}
					/>
					<Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)" }} />
					<Line type="monotone" dataKey="TotalSales" stroke="#8B5CF6" />
				</LineChart>
			) : null}
		</ResponsiveContainer>
	);

	return (
		<div>
			<div className="flex space-x-4 items-center m-5 mb-11">
				<label className="text-center font-extrabold text-black">Select Time Range:</label>
				<select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)} className="bg-white text-black border px-2 py-1 rounded-md focus:outline-none focus:ring-2">
					<option value="This Week">This Week</option>
					<option value="Last Week">Last Week</option>
					<option value="This Month">This Month</option>
					<option value="Last Month">Last Month</option>
					<option value="This Year">This Year</option>
					<option value="Last Year">Last Year</option>
					<option value="Custom Range">Select Range</option>
				</select>

				{selectedTimeRange === "Custom Range" && (
					<div className="flex space-x-4 items-center">
						<DatePicker
							selected={startDate}
							onChange={(date) => setStartDate(date)}
							selectsStart
							startDate={startDate}
							endDate={endDate}
							placeholderText="Start Date"
							className="bg-white text-black border px-2 py-1 rounded-md focus:outline-none focus:ring-2"
						/>
						<DatePicker
							selected={endDate}
							onChange={(date) => setEndDate(date)}
							selectsEnd
							startDate={startDate}
							endDate={endDate}
							minDate={startDate}
							placeholderText="End Date"
							className="bg-white text-black border px-2 py-1 rounded-md focus:outline-none focus:ring-2"
						/>
					</div>
				)}

				<label className="text-center font-extrabold text-black">Select Chart Type:</label>
				<select value={chartType} onChange={(e) => setChartType(e.target.value)} className="bg-white text-black border px-2 py-1 rounded-md focus:outline-none focus:ring-2">
					<option value="Bar">Bar</option>
					<option value="Line">Line</option>
					<option value="Pie">Pie</option>
				</select>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-center">
				{Array.from({ length: MAX_CHARTS }).map((_, index) => (
					<motion.div
						key={index}
						className="p-6 border rounded-xl bg-white bg-opacity-50 shadow-lg cursor-pointer"
						onClick={() => setExpandedChart(index)}
					>
						<h2 className="text-lg font-semibold text-center text-black">Chart {index + 1}</h2>
						<ChartComponent data={salesData} type={chartType} />
					</motion.div>
				))}
			</div>

			{expandedChart !== null && (
				<div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
					<div className="bg-white p-10 rounded-lg shadow-lg w-3/4 h-3/4">
						<button
							onClick={() => setExpandedChart(null)}
							className="text-black text-lg absolute top-4 right-4 font-bold"
						>
							X
						</button>
						<h2 className="text-2xl font-semibold text-center text-black mb-11">Chart {expandedChart + 1}</h2>
						<ChartComponent data={salesData} type={chartType} />
					</div>
				</div>
			)}
		</div>
	);
};

export default SalesByCategoryChart;
