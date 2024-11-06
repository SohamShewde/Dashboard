import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/top-customer/SalesOverviewChart";
// import DateFilter from "../components/sales/DateFilter";
import SalesByCategoryChart from "../components/top-customer/SalesByCategoryChart";
// import DailySalesTrend from "../components/sales/DailySalesTrend";



const TopCustomerPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Top Customers' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* SALES STATS */}
				{/* <motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					
				</motion.div> */}

				
				<SalesOverviewChart />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
				    {/* <SalesByCategoryChart />  */}
					{/* <DailySalesTrend /> */}
				</div>
			</main>
		</div>
	);
};
export default TopCustomerPage;
