import React, { useEffect, useState, useRef, memo } from "react";

import { XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Brush, CartesianGrid } from 'recharts';
import moment from 'moment';
import { LineChart, Line,  ReferenceArea } from 'recharts';
import evaluate_cmap from './JScolormap'

const jetColormap = (value) => {
  // Jet Colormap function
  const rgb = evaluate_cmap(value, 'jet', false)

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

const CustomXTick = (props) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fontSize={12} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    </g>
  );
};

  const DVV = ({ station, dataIndex, onIndexChange}) => {
    const [data, setData] = useState(null);
    const [resp, setResp] = useState();
    const [dvvmin, setDVVmin] = useState()
    const [dvvmax, setDVVmax] = useState()


    async function fetchData(){
      try{

        const response = await fetch("../"+station+"_dvv.json")
        const jsonData = await response.json()
        if (response.ok){
        setData(jsonData[dataIndex])
        console.log(jsonData)
        //setDVV(jsonData[dataIndex].map((data) => data.DVV))
        const min = Math.min(...jsonData[dataIndex].map(item => item.DVV))*1.5;
        const max = Math.max(...jsonData[dataIndex].map(item => item.DVV))*1.5;
        setDVVmin(min)
        setDVVmax(max)

      }
        } catch(error){
            console.log(error);
        }
      };


      useEffect(() => {
         fetchData();

        // Schedule data update every day at 00:00 a.m.
         const updateInterval = setInterval(() => {
           fetchData();
         }, 24 * 60 * 60 * 1000); // 24 hours
    
         // Cleanup interval on component unmount
         return () => clearInterval(updateInterval);
      }, [dataIndex]);
    
      
      if (data === null) {
        return <p>Loading...</p>;
      }
      const get90DaysAgo = () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); 
        currentDate.setDate(currentDate.getDate() - 90);
        return currentDate;
      };

      const timestampsForLast90Days = Array.from({ length: 91 }, (_, index) => {
        const date = new Date(get90DaysAgo());
        date.setDate(date.getDate() + index);
        date.setUTCHours(0, 0, 0, 0); 
        return date.toISOString();
      });


      const minTimestamp = get90DaysAgo().toISOString();
      const maxTimestamp = new Date().toISOString();
      const dateFormatter = date => {
        return moment(date).format('YYYY/MM/DD');
      };
      const filteredData = data.filter(point => point.DVV !== null);

    return (
    <div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" type="category"
            angle="20" tickCount="10" style={{ fontSize: '12px' }}
            domain={[minTimestamp, maxTimestamp]}
            tickFormatter={dateFormatter}/>
          <YAxis domain={[dvvmin,dvvmax]} tickFormatter={(value) => value.toFixed(4)}/>
          <Tooltip />
  
          <Line
            type="monotone"
            dataKey="DVV"
            stroke="#8884d8"
            dot={(props) => {
              if (props.payload.DVV === null) {
                return null;
              }
              return(
              <circle {...props} fill={jetColormap(props.payload.Corr)} />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    );
  };
  

export default DVV;