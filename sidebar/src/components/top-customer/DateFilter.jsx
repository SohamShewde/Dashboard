import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const DateFilter = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [predefinedRange, setPredefinedRange] = useState('');

  const handlePredefinedRange = (range) => {
    let start = null, end = moment();
    
    switch (range) {
      case 'thisWeek':
        start = moment().startOf('week');
        break;
      case 'lastWeek':
        start = moment().subtract(1, 'weeks').startOf('week');
        end = moment().subtract(1, 'weeks').endOf('week');
        break;
      case 'thisMonth':
        start = moment().startOf('month');
        break;
      case 'lastMonth':
        start = moment().subtract(1, 'months').startOf('month');
        end = moment().subtract(1, 'months').endOf('month');
        break;
      case 'thisYear':
        start = moment().startOf('year');
        break;
      case 'lastYear':
        start = moment().subtract(1, 'years').startOf('year');
        end = moment().subtract(1, 'years').endOf('year');
        break;
      default:
        break;
    }
    
    setStartDate(start.toDate());
    setEndDate(end.toDate());
    setPredefinedRange(range);
    onFilterChange(start, end);  // Pass the selected range to parent component
  };

  return (
    <div>
      <label>Select Date Range:</label>
      <div>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
        />
      </div>

      <label>Or Select Predefined Range:</label>
      <select value={predefinedRange} onChange={(e) => handlePredefinedRange(e.target.value)}>
        <option value="">Select Range</option>
        <option value="thisWeek">This Week</option>
        <option value="lastWeek">Last Week</option>
        <option value="thisMonth">This Month</option>
        <option value="lastMonth">Last Month</option>
        <option value="thisYear">This Year</option>
        <option value="lastYear">Last Year</option>
      </select>
    </div>
  );
};

export default DateFilter;
<div className="w-full h-80 m-5">
        <ResponsiveContainer>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Bar dataKey="totalSales" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>