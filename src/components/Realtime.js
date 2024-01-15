import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { LineChart, Line,  ReferenceArea } from 'recharts';
import socket from './socket';


const  Arithmetic_Array = (a,b) => {
  let arr = []
  for (let i = a; i < b ; i=i+((b-a)/20)) {
 arr.push(i)
}
return arr
}



function Realtime() {
  const [TimeArray, setTimeArray]= useState([]);
  const [datatime, setDatatime] = useState([])
  const [dataseis1, setDataseis1] = useState([])
  const [dataseis2, setDataseis2] = useState([])
  const [dataseis3, setDataseis3] = useState([])
  const [dataseis4, setDataseis4] = useState([])
  const [dataseis5, setDataseis5] = useState([])
  const [dataseis6, setDataseis6] = useState([])
  const [dataseis7, setDataseis7] = useState([])
  const [dataseis8, setDataseis8] = useState([])
  const [dataseis9, setDataseis9] = useState([])
  const [data, setData] = useState(null);


  //socket.emit('random_data')
  useEffect(() => {
    socket.on('json', (newData) => {
      const epoch = newData.map(item => {
      const newDatatimes = moment(item.times).valueOf()
      return {...item, times:newDatatimes};
      });
      setData(epoch);

      const epoch2 = newData.map(d => d.times= moment(d.times).valueOf())
      setDatatime(epoch2)
    //  setDatatime(newData.map((data) => data.times));

      setDataseis1(newData.map((data) => data.LT01));
      setDataseis2(newData.map((data) => data.LT03));
      setDataseis3(newData.map((data) => data.LT04));
      setDataseis4(newData.map((data) => data.LT05));
      setDataseis5(newData.map((data) => data.LT06));
      setDataseis6(newData.map((data) => data.LT07));
      setDataseis7(newData.map((data) => data.LT08));
      setDataseis8(newData.map((data) => data.LT09));
      setDataseis9(newData.map((data) => data.LT10));


    });
    setTimeout(()=> {
      socket.emit("random_data");
    },5000)
  }, []);
  console.log(data)


const dateFormatter = date => {

  return moment(date).format('HH:mm:ss');
};
const timemin= Math.min(...datatime)
const timemax= Math.max(...datatime)
const seismin1= Math.min(...dataseis1)*1.2
const seismin2= Math.min(...dataseis2)*1.2
const seismin3= Math.min(...dataseis3)*1.2
const seismin4= Math.min(...dataseis4)*1.2
const seismin5= Math.min(...dataseis5)*1.2
const seismin6= Math.min(...dataseis6)*1.2
const seismin7= Math.min(...dataseis7)*1.2
const seismin8= Math.min(...dataseis8)*1.2
const seismin9= Math.min(...dataseis9)*1.2

const seismax1= Math.max(...dataseis1)*1.2
const seismax2= Math.max(...dataseis2)*1.2
const seismax3= Math.max(...dataseis3)*1.2
const seismax4= Math.max(...dataseis4)*1.2
const seismax5= Math.max(...dataseis5)*1.2
const seismax6= Math.max(...dataseis6)*1.2
const seismax7= Math.max(...dataseis7)*1.2
const seismax8= Math.max(...dataseis8)*1.2
const seismax9= Math.max(...dataseis9)*1.2

console.log(timemin)


const InitializeTick = () => {
  setTimeArray(Arithmetic_Array(timemin,timemax));
}
useEffect(() => {
  InitializeTick();
}, []);



return (
  <>

    <h3 className="text-heading">
        LT01.HHE
    </h3>
    <ResponsiveContainer width="99%" height={100}>


      <LineChart 
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>    

        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time" angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT01"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin1, seismax1]}
        />

        <Line type="monotone" dataKey="LT01"  stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>

      <h3 className="text-heading">
        LT03.HHE
      </h3>
      <ResponsiveContainer width="99%" height={100}>
      <LineChart
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT03"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin2, seismax2]}
        />

        <Line type="monotone" dataKey="LT03" stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>

      <h3 className="text-heading">
        LT04.HHE
      </h3>
      <ResponsiveContainer width="99%" height={100}>
      <LineChart
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT04"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin3, seismax3]}
        />

        <Line type="monotone" dataKey="LT04" stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>

      <h3 className="text-heading">
        LT05.HHE
      </h3>
      <ResponsiveContainer width="99%" height={100}>
      <LineChart
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT05"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin4, seismax4]}
        />

        <Line type="monotone" dataKey="LT05" stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>

      <h3 className="text-heading">
        LT06.HHE
      </h3>
      <ResponsiveContainer width="99%" height={100}>
      <LineChart
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT06"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin5, seismax5]}
        />

        <Line type="monotone" dataKey="LT06" stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>

      <h3 className="text-heading">
        LT07.HHE
      </h3>
      <ResponsiveContainer width="99%" height={100}>
      <LineChart
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT07"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin6, seismax6]}
        />

        <Line type="monotone" dataKey="LT07" stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>

      <h3 className="text-heading">
        LT08.HHE
      </h3>
      <ResponsiveContainer width="99%" height={100}>
      <LineChart
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT08"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin7, seismax7]}
        />

        <Line type="monotone" dataKey="LT08" stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>

      <h3 className="text-heading">
        LT09.HHE
      </h3>
      <ResponsiveContainer width="99%" height={100}>
      <LineChart
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT09"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin8, seismax8]}
        />

        <Line type="monotone" dataKey="LT09" stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>
      
      <h3 className="text-heading">
        LT10.HHE
      </h3>
      <ResponsiveContainer width="99%" height={100}>
      <LineChart
        data={data} syncId="anyId"
        margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
        
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10" domain={[timemin, timemax]}
          tick={{fontSize: 12, dy:5}} allowDataOverflow={true}
        />
      
        <YAxis type="number" dataKey="LT10"
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true} domain={[seismin9, seismax9]}
        />

        <Line type="monotone" dataKey="LT10" stroke="black" dot={false} animationDuration={300}/>
      </LineChart>
      </ResponsiveContainer>

  </>
);
}
export default Realtime;