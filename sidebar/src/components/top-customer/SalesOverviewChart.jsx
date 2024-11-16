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

    if (!isExpanded) {
      return <h2 className="text-lg font-semibold text-center text-white">Parameter {parameterId}</h2>;
    }

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
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#E5E7EB" />
          <YAxis
            stroke="#E5E7EB"
            domain={[yAxisValues[0], yAxisValues[yAxisValues.length - 1]]}
            ticks={yAxisValues}
          />
          <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)" }} />
          <ReferenceArea y1={yAxisValues[0]} y2={yAxisValues[1]} fill="#FF0000" fillOpacity={1} />
          <ReferenceArea y1={yAxisValues[1]} y2={yAxisValues[2]} fill="#FCE205" fillOpacity={1} />
          <ReferenceArea y1={yAxisValues[2]} y2={yAxisValues[yAxisValues.length - 3]} fill="#00FF00" fillOpacity={1} />
          <ReferenceArea y1={yAxisValues[4]} y2={yAxisValues[5]} fill="#FCE205" fillOpacity={1} />
          <ReferenceArea y1={yAxisValues[5]} y2={yAxisValues[6]} fill="#FF0000" fillOpacity={1} />
          <ReferenceLine y={`${meanValue.toFixed(2)}`} stroke="blue" />
          <Line
            type="monotone"
            dataKey="Value"
            stroke="#000"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", stroke: "#000", strokeWidth: 1 }}
          />
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
        : chartCount <= 10
          ? 'grid-cols-2 md:grid-cols-7'
          : 'grid-cols-2 md:grid-cols-7';

    return (
      <div className={`grid ${gridColsClass} gap-4`}>
        {Object.keys(spcData).map((parameterId) => (
          <motion.div
            key={parameterId}
            className={`p-3 border rounded-xl bg-gray-900 opacity-95 shadow-lg cursor-pointer ${expandedChart === parameterId ? "expanded-chart" : "collapsed-chart"
              }`}
            onClick={() => setExpandedChart(expandedChart === parameterId ? null : parameterId)}
            style={{
              width: chartCount === 1 ? '100%' : 'auto',
              height: expandedChart === parameterId ? '500px' : 'auto',
            }}
          >
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
        <div className="bg-white p-10  shadow-lg w-full h-full relative overflow-auto">
          {/* Close Button */}
          <button
            onClick={() => setExpandedChart(null)}
            className="text-black text-lg absolute top-4 right-4 font-bold"
          >
            X
          </button>
  
          {/* Chart Header */}
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
            Parameter {expandedChart}
          </h2>
  
          {/* Dynamic Chart */}
          <DynamicChart parameterId={expandedChart} isExpanded={true} />
  
          {/* Legend Section */}
          <div className="mt-6 flex flex-wrap justify-center space-x-6 text-sm text-gray-900">
            {/* Actual Dia - Line with Circle Markers */}
            <span className="flex items-center mb-2">
              <span
                className="inline-block w-6 h-0.5 bg-black mr-1 relative"
                style={{ position: "relative" }}
              >
                <span
                  className="absolute top-[-3.5px] left-2 w-2 h-2 rounded-full border border-black bg-blue-500"
                ></span>
              </span>
              Actual Dia
            </span>
  
            {/* Mean Dia - Straight Line */}
            <span className="flex items-center mb-2">
              <span className="inline-block w-6 h-0.5 bg-blue-500 mr-1"></span>
              Mean Dia
            </span>
  
            {/* Other Legend Items */}
            <span className="flex items-center mb-2">
              <span className="inline-block w-4 h-4 mr-2 bg-red-500 "></span>
              UMAX
            </span>
            <span className="flex items-center mb-2">
              <span className="inline-block w-4 h-4 mr-2 bg-yellow-500"></span>
              USL
            </span>
            <span className="flex items-center mb-2">
              <span className="inline-block w-4 h-4 mr-2 bg-green-600"></span>
              UCL
            </span>
            <span className="flex items-center mb-2">
              <span className="inline-block w-4 h-4 mr-2 bg-yellow-500"></span>
              LCL
            </span>
            <span className="flex items-center mb-2">
              <span className="inline-block w-4 h-4 mr-2 bg-red-500"></span>
              LSL
            </span>
          </div>
        </div>
      </div>
    )}
  </div>
  
  
  
  );
};

export default SalesOverviewChart;
