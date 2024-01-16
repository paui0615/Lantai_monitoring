import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { LineChart, Line,  ReferenceArea } from 'recharts';
import socket from './socket';
import CustomLineChart from './Stationplot';

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


  useEffect(() => {
    socket.on('json', (newData) => {
      const epoch = newData.map(item => {
      const newDatatimes = moment(item.times).valueOf()
      return {...item, times:newDatatimes};
      });
      setData(epoch);

      const epoch2 = newData.map(d => d.times= moment(d.times).valueOf())
      setDatatime(epoch2)

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
  <div>
    <CustomLineChart data={data} dataKey="LT01" label="LT01.HHE" seismax={seismax1} seismin={seismin1} />
    <CustomLineChart data={data} dataKey="LT03" label="LT03.HHE" seismax={seismax2} seismin={seismin2} />
    <CustomLineChart data={data} dataKey="LT04" label="LT04.HHE" seismax={seismax3} seismin={seismin3} />
    <CustomLineChart data={data} dataKey="LT05" label="LT05.HHE" seismax={seismax4} seismin={seismin4} />
    <CustomLineChart data={data} dataKey="LT06" label="LT06.HHE" seismax={seismax5} seismin={seismin5} />
    <CustomLineChart data={data} dataKey="LT07" label="LT07.HHE" seismax={seismax6} seismin={seismin6} />
    <CustomLineChart data={data} dataKey="LT08" label="LT08.HHE" seismax={seismax7} seismin={seismin7} />
    <CustomLineChart data={data} dataKey="LT09" label="LT09.HHE" seismax={seismax8} seismin={seismin8} />
    <CustomLineChart data={data} dataKey="LT10" label="LT10.HHE" seismax={seismax9} seismin={seismin9} />
  </div>
  </>
);
}
export default Realtime;