import { motion } from "framer-motion"; 
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const SalesOverviewChart = () => {
  const [expandedChart, setExpandedChart] = useState(null);
  const [spcData, setSpcData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/sales/spc-data');
        setSpcData(response.data);
      } catch (error) {
        console.error("Error fetching SPC data:", error);
      }
    };
    fetchData();
  }, []);

  const DynamicChart = ({ parameterId, isExpanded }) => {
    const data = spcData[parameterId] || [];

    if (!data.length) return null;

    const lowerMax = data[0].LowerMAX;
    const upperMax = data[0].UpperMAX;
    const meanValue = data[0].Mean;
    const lowerControl = data[0].LowerControl;
    const upperControl = data[0].UpperControl;

    const yAxisValues = [];
    for (let value = lowerMax; value < meanValue; value = parseFloat((value + lowerControl).toFixed(2))) {
      yAxisValues.push(value);
    }
    yAxisValues.push(meanValue);
    for (let value = meanValue + upperControl; value <= upperMax; value = parseFloat((value + upperControl).toFixed(2))) {
      yAxisValues.push(value);
    }

    return (
      <ResponsiveContainer width="100%" height={isExpanded ? '100%' : 270}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#E5E7EB" />
          <YAxis stroke="#E5E7EB" domain={[yAxisValues[0], yAxisValues[yAxisValues.length - 1]]} ticks={yAxisValues} />
          <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)" }} />
          <ReferenceArea y1={yAxisValues[0]} y2={yAxisValues[1]} fill="#FF0000" opacity={0.7} />
          <ReferenceArea y1={yAxisValues[1]} y2={yAxisValues[2]} fill="#FCE205" opacity={0.7} />
          <ReferenceArea y1={yAxisValues[2]} y2={yAxisValues[yAxisValues.length - 3]} fill="#00FF00" opacity={0.7} />
          <ReferenceArea y1={yAxisValues[4]} y2={yAxisValues[5]} fill="#FCE205" opacity={0.7} />
          <ReferenceArea y1={yAxisValues[5]} y2={yAxisValues[6]} fill="#FF0000" opacity={0.7} />
          <ReferenceLine y={`${meanValue.toFixed(2)}`} stroke="blue" />
          <Line type="monotone" dataKey="Value" stroke="#000" strokeWidth={2} dot={{ fill: "#3b82f6", stroke: "#000", strokeWidth: 1 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderCharts = () => {
    const chartCount = Object.keys(spcData).length;
    const gridColsClass = chartCount === 1
      ? 'grid-cols-1'
      : chartCount === 2
      ? 'grid-cols-2'
      : chartCount <= 4
      ? 'grid-cols-2 md:grid-cols-4'
      : 'grid-cols-2 md:grid-cols-5';

    return (
      <div className={`grid ${gridColsClass} gap-4`}>
        {Object.keys(spcData).map((parameterId) => (
          <motion.div
            key={parameterId}
            className="p-6 border rounded-xl bg-gray-800 bg-opacity-50 shadow-lg cursor-pointer"
            onClick={() => setExpandedChart(expandedChart === parameterId ? null : parameterId)}
            style={{
              width: chartCount === 1 ? '100%' : 'auto',
              height: chartCount === 1 ? '500px' : 'auto'
            }}
          >
            <h2 className="text-lg font-semibold text-center text-gray-300">Parameter {parameterId}</h2>
            <DynamicChart parameterId={parameterId} isExpanded={expandedChart === parameterId} />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {renderCharts()}
      {expandedChart !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full h-full relative overflow-auto">
            <button
              onClick={() => setExpandedChart(null)}
              className="text-white text-lg absolute top-4 right-4 font-bold"
            >
              X
            </button>
            <h2 className="text-2xl font-semibold text-center text-gray-300 mb-4">Parameter {expandedChart}</h2>
            <DynamicChart parameterId={expandedChart} isExpanded={true} />

            {/* Legend */}
            <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="inline-block w-4 h-4 mr-1 bg-black"></span>Actual Dia
              </span>
              <span className="flex items-center">
                <span className="inline-block w-4 h-4 mr-1 bg-blue-500"></span>Mean Dia
              </span>
              <span className="flex items-center">
                <span className="inline-block w-4 h-4 mr-1 bg-red-500"></span>UMAX
              </span>
              <span className="flex items-center">
                <span className="inline-block w-4 h-4 mr-1 bg-yellow-500"></span>USL
              </span>
              <span className="flex items-center">
                <span className="inline-block w-4 h-4 mr-1 bg-green-600"></span>UCL
              </span>
              <span className="flex items-center">
                <span className="inline-block w-4 h-4 mr-1 bg-yellow-500"></span>LCL
              </span>
              <span className="flex items-center">
                <span className="inline-block w-4 h-4 mr-1 bg-red-500"></span>LSL
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOverviewChart;
