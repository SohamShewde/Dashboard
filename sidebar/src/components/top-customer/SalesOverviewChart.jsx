import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const SalesOverviewChart = () => {
  const [chartType, setChartType] = useState("Run");
  const [expandedChart, setExpandedChart] = useState(null); // To handle expanded chart
  const [parameterIds, setParameterIds] = useState([]); // To hold the list of parameter IDs
  const [spcData, setSpcData] = useState({}); // Store data grouped by Parameter_Id

  // Fetch parameter IDs from the API
  const fetchParameterIds = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sales/parameters');
      setParameterIds(response.data);
    } catch (error) {
      console.error("Error fetching parameter data:", error);
    }
  };

  // Fetch SPC data for a specific parameterId
  const fetchSpcData = async (parameterId) => {
    try {
      const response = await axios.get(`http://localhost:5000/sales/spc-data/${parameterId}`);
      const data = response.data.map((entry) => ({
        name: entry.Reading,
        Value: parseFloat(entry['Actual Diameter']),
        UpperControl: parseFloat(entry['Upper Control Limit']),
        LowerControl: parseFloat(entry['Lower Control Limit']),
        Mean: parseFloat(entry['Mean Diameter']),
      }));
      setSpcData((prevData) => ({
        ...prevData,
        [parameterId]: data,
      }));
    } catch (error) {
      console.error("Error fetching SPC data:", error);
    }
  };

  // Generate Run Chart data with dynamic colors
  const generateRunChartData = (data) => {
    return data.map((entry) => {
      let blockColor = "#4ade80"; // Default green color
      let blockValue = entry.Value;

      if (blockValue > 80.1) {
        blockColor = "#f87171"; // Red color
      } else if (blockValue >= 80.05) {
        blockColor = "#fbbf24"; // Yellow color
      } else if (blockValue < 79.9) {
        blockColor = "#f87171"; // Red color below 79.9
      } else if (blockValue < 79.95) {
        blockColor = "#fbbf24"; // Yellow color below 79.95
      }

      return {
        name: entry.name,
        Value: blockValue,
        UpperControl: entry.UpperControl,
        LowerControl: entry.LowerControl,
        Mean: entry.Mean,
        BlockColor: blockColor,
      };
    });
  };

  // Dynamic Chart Component
  const DynamicChart = ({ parameterId, isExpanded }) => {
    const [chartData, setChartData] = useState([]);
    const [yDomain, setYDomain] = useState([79.85, 80.15]); // Default Dynamic Y Domain
    const [controlLimits, setControlLimits] = useState({ upper: 80.1, lower: 79.85 }); // Default control limits

    useEffect(() => {
      const loadChartData = async () => {
        // Fetch data only if it hasn't been fetched yet for the given parameterId
        if (!spcData[parameterId]) {
          await fetchSpcData(parameterId); // Fetch data for specific parameterId
        } else {
          const data = spcData[parameterId]; // Use data already fetched
          setChartData(generateRunChartData(data));

          // Dynamically calculate Y domain based on the fetched data
          if (data.length > 0) {
            const minValue = Math.min(...data.map(entry => entry.Value));
            const maxValue = Math.max(...data.map(entry => entry.Value));
            setYDomain([minValue - 0.1, maxValue + 0.1]); // Dynamic min and max values for Y domain

            // Set dynamic control limits
            const upperLimit = Math.max(...data.map(entry => entry.UpperControl));
            const lowerLimit = Math.min(...data.map(entry => entry.LowerControl));
            setControlLimits({ upper: upperLimit, lower: lowerLimit });
          }
        }
      };

      loadChartData();
    }, [parameterId, spcData]); // Re-fetch data when parameterId or spcData changes

    // Dynamic Y-axis ticks based on Y domain
    const yTicks = [yDomain[0], (yDomain[0] + yDomain[1]) / 2, yDomain[1]];

    return (
      <ChartComponent
        data={chartData}
        yDomain={yDomain}
        yTicks={yTicks}
        controlLimits={controlLimits} // Pass control limits dynamically
        isExpanded={isExpanded}
      />
    );
  };

  // Chart Component
  const ChartComponent = ({ data, yDomain, yTicks, isExpanded }) => {
    return (
      <ResponsiveContainer width="100%" height={isExpanded ? '100%' : 270}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#E5E7EB" />
          <YAxis stroke="#E5E7EB" domain={yDomain} ticks={yTicks} padding={{ top: 10, bottom: 10 }} />
          <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)" }} />
          <ReferenceArea y1={79.85} y2={79.9} fill="#f87171" opacity={0.7} />
          <ReferenceArea y1={79.9} y2={79.95} fill="#fbbf24" opacity={0.7} />
          <ReferenceArea y1={79.95} y2={80.05} fill="#4ade80" opacity={0.7} />
          <ReferenceArea y1={80.05} y2={80.1} fill="#fbbf24" opacity={0.7} />
          <ReferenceArea y1={80.1} y2={80.15} fill="#f87171" opacity={0.7} />
          <ReferenceLine y={80} stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="Value"
            stroke="#000"
            strokeWidth={2}
            dot={{ fill: ({ payload }) => payload.BlockColor, stroke: '#000', strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Fetch parameter IDs when component mounts
  useEffect(() => {
    fetchParameterIds();
  }, []);

  // Render charts dynamically based on fetched parameter IDs
  const renderCharts = () => {
    return parameterIds.map(({ parameterId, parameterName }) => (
      <motion.div
        key={parameterId} // Use parameterId as the key
        className="p-6 border rounded-xl bg-gray-800 bg-opacity-50 shadow-lg cursor-pointer"
        onClick={() => setExpandedChart(expandedChart === parameterId ? null : parameterId)}
      >
        <h2 className="text-lg font-semibold text-center text-gray-300">{parameterName}</h2>
        {/* Display parameterName */}
        <DynamicChart parameterId={parameterId} isExpanded={expandedChart === parameterId} />
      </motion.div>
    ));
  };

  return (
    <div>
      <div className="flex space-x-4 items-center m-5 mb-11">
        <label className="text-center font-extrabold text-gray-300">Select Chart Type:</label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="bg-gray-700 text-white border px-2 py-1 rounded-md focus:outline-none focus:ring-2">
          <option value="Run">Run Chart</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-6">{renderCharts()}</div>

      {expandedChart !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full h-full relative overflow-auto">
            <button
              onClick={() => setExpandedChart(null)}
              className="text-white text-lg absolute top-4 right-4 hover:bg-gray-600 p-2 rounded-full"
            >
              Close
            </button>
            <DynamicChart parameterId={expandedChart} isExpanded={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOverviewChart;
