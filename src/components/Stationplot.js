import React from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line } from 'recharts';

const CustomLineChart = ({ data, dataKey, label, seismax, seismin }) => (
  <div>
    <h3 className="text-heading">{label}</h3>
    <ResponsiveContainer width="99%" height={100}>
      <LineChart data={data} syncId="anyId" margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        <XAxis
          type="number"
          dataKey="times"
          tickFormatter={dateFormatter}
          scale="time"
          angle="20"
          tickCount="10"
          domain={[timemin, timemax]}
          tick={{ fontSize: 12, dy: 5 }}
          allowDataOverflow={true}
        />
        <YAxis
          type="number"
          dataKey={dataKey}
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true}
          domain={[seismin, seismax]}
        />
        <Line type="monotone" dataKey={dataKey} stroke="black" dot={false} animationDuration={300} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default CustomLineChart;