import { useEffect, useState } from 'react';
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import axios from 'axios';

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserDemographicsChart from "../components/users/UserDemographicsChart";

const UsersPage = () => {
	const [userStats, setUserStats] = useState({
		totalUsers: 0,
		newUsersToday: 0,
		activeUsers: 0,
		churnRate: 0,
	}); // Initialize userStats with default values

	// Fetch user statistics from the server
	useEffect(() => {
		const fetchUserStats = async () => {
			try {
				const totalUsersResponse = await axios.get('/users/total');
				console.log('Total Users Response:', totalUsersResponse.data); 
				const totalUsers = totalUsersResponse.data[0]?.TOTAL_CUSTOMERS || 0;
	
				// const newUsersTodayResponse = await axios.get('/users/today');
				// console.log('New Users Today Response:', newUsersTodayResponse.data);
				// const newUsersToday = newUsersTodayResponse.data[0]?.NEW_USERS || 0;
	
				// const activeUsersResponse = await axios.get('/users/active');
				// console.log('Active Users Response:', activeUsersResponse.data);
				// const activeUsers = activeUsersResponse.data[0]?.ACTIVE_USERS || 0;
	
				// const churnRateResponse = await axios.get('/users/churn');
				// console.log('Churn Rate Response:', churnRateResponse.data);
				// const churnRate = churnRateResponse.data[0]?.CHURN_RATE || 0;
	
				setUserStats({
					totalUsers: totalUsers,
					newUsersToday: newUsersToday,
					activeUsers: activeUsers,
					churnRate: churnRate,
				});
			} catch (error) {
				console.error("Error fetching user stats:", error.message); // Log the error message
				if (error.response) {
					console.error("Response data:", error.response.data);
					console.error("Response status:", error.response.status);
					console.error("Response headers:", error.response.headers);
				} else if (error.request) {
					console.error("Request made but no response received:", error.request);
				} else {
					console.error("Error setting up the request:", error.message);
				}
			}
		};
	
		fetchUserStats();
	}, []);
	// Empty dependency array to run only once on mount

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={userStats.totalUsers.toLocaleString()} // Safe access since totalUsers should be 0 or higher
						color='#6366F1'
					/>
					<StatCard
						name='New Users Today'
						icon={UserPlus}
						value={userStats.newUsersToday.toLocaleString()} // Ensure newUsersToday is also initialized
						color='#10B981'
					/>
					<StatCard
						name='Active Users'
						icon={UserCheck}
						value={userStats.activeUsers.toLocaleString()} // Ensure this is also initialized
						color='#F59E0B'
					/>
					<StatCard
						name='Churn Rate'
						icon={UserX}
						value={`${userStats.churnRate}%`} // Display churn rate with a percentage sign
						color='#EF4444'
					/>
				</motion.div>

				<UsersTable />

				{/* USER CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					{/* <UserGrowthChart /> */}
					{/* <UserActivityHeatmap /> */}
					<UserDemographicsChart />
				</div>
			</main>
		</div>
	);
};

export default UsersPage;
