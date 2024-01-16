import React, { useEffect, useState, useRef, memo } from "react";
import * as d3 from "d3";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import moment from 'moment';
import { LineChart, Line,  ReferenceArea } from 'recharts';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const  Arithmetic_Array = (a,b) => {
  let arr = []
  for (let i = a; i < b ; i=i+((b-a)/20)) {
 arr.push(i)
}
return arr
}


function Inputtime(props) {

    const [TimeArray, setTimeArray]= useState([]);
    const [data, setData] = useState(null);
    const [data2, setData2] = useState(null);  
    const [datatime, setDatatime] = useState([])
    const [dataseis1, setDataseis1] = useState([])
    const [dataseis2, setDataseis2] = useState([])
    const [dataseis3, setDataseis3] = useState([])
    const starttime=props.timex1
    const endtime=props.timex2

    function Search(event){
        event.preventDefault();
        fetch("http://localhost:5001/searchdata", {
         method: "POST",
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify({timeinput1: starttime, timeinput2: endtime })
       })
       .then(response => {
         if (response.ok) {
         return response.json();
       } else {
         throw new Error("fmax cannnot exceed fnq");
         
       }
       })
       
       .then(data => {
         setData(data);
     
         const epoch6 = data.map(d => d.times= moment(d.times).valueOf())
         setDatatime(epoch6)
         setDataseis1(data.map((data) => data.value1))
         setDataseis2(data.map((data) => data.value2))
         setDataseis3(data.map((data) => data.value3))

       })

     }


 const dateFormatter = date => {
  return moment(date).format('HH:mm:ss');
};

const timemin= Math.min(...datatime)
const timemax= Math.max(...datatime)
const seismin1= Math.min(...dataseis1)*1.2
const seismax1= Math.max(...dataseis1)*1.2
const seismin2= Math.min(...dataseis2)*1.2
const seismax2= Math.max(...dataseis2)*1.2
const seismin3= Math.min(...dataseis3)*1.2
const seismax3= Math.max(...dataseis3)*1.2

const InitializeTick = () => {
  setTimeArray(Arithmetic_Array(timemin,timemax));
}

useEffect(() => {
  InitializeTick();
}, []);


 const [RefArea, setRefArea] = useState({refAreaLeft:"", refAreaRight:"",
    left: "dataMin", right: "dataMax", data: data
  })

  const zoom = (e) => {

     if (RefArea.refAreaLeft === RefArea.refAreaRight || RefArea.refAreaRight === "") {
       setRefArea({refAreaLeft: "",refAreaRight: ""})
       return;
     }

    // xAxis domain
    if (RefArea.refAreaLeft > RefArea.refAreaRight)
      [RefArea.refAreaLeft, RefArea.refAreaRight] = [RefArea.refAreaRight, RefArea.refAreaLeft];


    setRefArea({refAreaLeft: "",refAreaRight: "", data:data?.slice(), 
      left:RefArea.refAreaLeft, right:RefArea.refAreaRight,});
    setTimeArray(Arithmetic_Array(RefArea.refAreaLeft,RefArea.refAreaRight));
}

const zoomOut = (e) => {
    setTimeArray(Arithmetic_Array(timemin,timemax));
    setRefArea({ ...RefArea, left:timemin, right:timemax})
 }

return(
    <>

        <Button variant="outline-secondary" id="button-addon1" type='submit' onClick={Search}>
            Search
        </Button>

      <button className="btn update" onClick={(e) => zoomOut(e)}>
        Zoom Out
      </button>
      <ResponsiveContainer width="99%" height={200}>
        <LineChart data={data} syncId="anyId"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10"
          tick={{fontSize: 12, dy:5}} domain={[RefArea.left, RefArea.right]} allowDataOverflow={true}
          ticks={TimeArray}
        />
        
        <YAxis type="number" dataKey="value1" domain={[seismin1, seismax1]} 
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true}
        />
  
        <Line type="natural" dataKey="value1" stroke="black" dot={false} animationDuration={300}/>
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="99%" height={200}>
        <LineChart
          data={data} syncId="anyId"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time" angle="20" tickCount="10"
          tick={{fontSize: 12, dy:5}} domain={[RefArea.left, RefArea.right]} allowDataOverflow={true}
          ticks={TimeArray}
        />
        
        <YAxis type="number" dataKey="value2" domain={[seismin2, seismax2]} 
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
          allowDataOverflow={true}
        />
  
        <Line type="monotone" dataKey="value2" stroke="black" dot={false} animationDuration={300}/>

        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="99%" height={200}>
        <LineChart
          data={data} syncId="anyId"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10"
          tick={{fontSize: 12, dy:5}} domain={[RefArea.left, RefArea.right]} allowDataOverflow={true}
          ticks={TimeArray}
        />
        
        <YAxis type="number" dataKey="value3" domain={[seismin3, seismax3]} 
          tickFormatter={(value) => Number(value.toFixed(8)).toExponential()}
           allowDataOverflow={true}
        />

        <Line type="natural" dataKey="value3" stroke="black" dot={false} animationDuration={300}/>
        <Brush dataKey="times" tickFormatter={dateFormatter} width="99%" />


        </LineChart>
      </ResponsiveContainer>
      </>
);

}
export default Inputtime;