import React, { useEffect, useState, useRef, memo } from "react";

import { XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import moment from 'moment';
import { LineChart, Line,  ReferenceArea } from 'recharts';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';



const  Arithmetic_Array = (a,b) => {
  let arr = []
  for (let i = a; i < b ; i=i+((b-a)/20)) {
 arr.push(i)
}
return arr
}



function BigSearchComp() {



const [TimeArray, setTimeArray]= useState([]);
const [data, setData] = useState(null);
const [data2, setData2] = useState(null);  
const [datatime, setDatatime] = useState([])
const [dataseis1, setDataseis1] = useState([])
const [dataseis2, setDataseis2] = useState([])
const [dataseis3, setDataseis3] = useState([])
const [seismin1, setSeismin1] = useState("");
const [seismin2, setSeismin2] = useState("");
const [seismin3, setSeismin3] = useState("");
const [seismax1, setSeismax1] = useState("");
const [seismax2, setSeismax2] = useState("");
const [seismax3, setSeismax3] = useState("");
const [timemin, setTimemin] = useState("");
const [timemax, setTimemax] = useState("");

const [inputend, setInputend] = useState("");
const [timeerror, setTimeerror] = useState(false)
const [inputstart, setInputstart] = useState("");
const [inputstation,setInputstation]= useState("");
const [searchLoading, setSearchLoading] = useState(false)
const startTime = useRef();
const endTime = useRef();
const stationName = useRef();

async function Search(event, time1,time2,name,count){
  count=count+1
  if (count>3){
    return;
  }
  event.preventDefault();
  setSearchLoading(true)

try{
  const response = await fetch("http://localhost:5001/searchdata", {
   method: "POST",
   headers: {
     "Content-Type": "application/json"
   },
   body: JSON.stringify({timeinput1: time1, timeinput2: time2, stationinput: name })
 })
 const data = await response.json();

 if (response.ok){
  setData(data);
  console.log(data)
  const epoch6 = data.map(d => d.times= moment(d.times).valueOf())
  setDatatime(epoch6)
  setDataseis1(data.map((data) => data.value1))
  setDataseis2(data.map((data) => data.value2))
  setDataseis3(data.map((data) => data.value3))

  const min1 = Math.min(...data.map(item => item.value1))*1.2;
  const min2 = Math.min(...data.map(item => item.value2))*1.2;
  const min3 = Math.min(...data.map(item => item.value3))*1.2;
  setSeismin1(min1)
  setSeismin2(min2)
  setSeismin3(min3)
  const max1 = Math.max(...data.map(item => item.value1))*1.2;
  const max2 = Math.max(...data.map(item => item.value2))*1.2;
  const max3 = Math.max(...data.map(item => item.value3))*1.2;
  setSeismax1(max1)
  setSeismax2(max2)
  setSeismax3(max3)
  const tmin = Math.min(...data.map(item => item.times));
  const tmax = Math.max(...data.map(item => item.times));
  setTimemin(tmin)
  setTimemax(tmax)
  console.log(timemin)
  setSearchLoading(false)
  setTimeerror("")
 } else {
  setTimeerror(data.error)
 }
 } catch (error){
  console.error(error);

}};


 const Setinputtime = (event) =>{
  event.preventDefault();
  setInputstation(stationName.current.value)
  setInputstart(startTime.current.value)
  setInputend(endTime.current.value)
  const time1 = startTime.current.value
  const time2 = endTime.current.value
  const name = stationName.current.value
  Search(event, time1,time2,name,0)
  //Search(event, inputstart,inputend)

}



console.log(searchLoading)




 const dateFormatter = date => {

  return moment(date).format('HH:mm:ss');
};

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

const InitializeTick = () => {
  setTimeArray(Arithmetic_Array(timemin,timemax));
}
useEffect(() => {
  InitializeTick();
}, []);
console.log(TimeArray)


const [freqMin, setFreqMin] = useState("");
const [freqMax, setFreqMax] = useState("");
const [banderror, setBanderror] = useState(false)
const freqminRef = useRef();
const freqmaxRef = useRef();


async function Bandpass(event,freq1,freq2){
  event.preventDefault();
  setSearchLoading(true)
try{
  const response = await fetch("http://localhost:5001/bandpass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({freqinput1: freq1, freqinput2: freq2,timeinput1: inputstart, timeinput2: inputend, stationinput: inputstation })
  });
  const data = await response.json();

    if (response.ok) {
      setData(data);

      const epoch6 = data.map(d => d.times= moment(d.times).valueOf())
      setDatatime(epoch6)
      setDataseis1(data.map((data) => data.value1))
      setDataseis2(data.map((data) => data.value2))
      setDataseis3(data.map((data) => data.value3))
      const min1 = Math.min(...data.map(item => item.value1))*1.2;
      const min2 = Math.min(...data.map(item => item.value2))*1.2;
      const min3 = Math.min(...data.map(item => item.value3))*1.2;
      setSeismin1(min1)
      setSeismin2(min2)
      setSeismin3(min3)
      const max1 = Math.max(...data.map(item => item.value1))*1.2;
      const max2 = Math.max(...data.map(item => item.value2))*1.2;
      const max3 = Math.max(...data.map(item => item.value3))*1.2;
      setSeismax1(max1)
      setSeismax2(max2)
      setSeismax3(max3)
      setSearchLoading(false)
      setBanderror("")
    } else {
      setBanderror(data.error);
    } 
    } catch(error) {
      console.error(error);
    }
  }


const Setinputfreq = (event) =>{
  event.preventDefault();
  setFreqMin(freqminRef.current.value)
  setFreqMax(freqmaxRef.current.value)
  const freq1 = freqminRef.current.value
  const freq2 = freqmaxRef.current.value
  Bandpass(event, freq1,freq2)
  //Search(event, inputstart,inputend)

}



return (
    <>
    <div>
      <h4>Inquiring system</h4>
      <div>


        <form onSubmit={Setinputtime}>
        <InputGroup className="mb-3">
        <InputGroup.Text>Station Name</InputGroup.Text>
          <Form.Control type="text" ref={stationName}
            aria-label="stationName" placeholder="ex. LT01"/>

        </InputGroup>
        <InputGroup className="mb-3">
        <InputGroup.Text>Begin/End</InputGroup.Text>
          <Form.Control type="text" ref={startTime}
            aria-label="startTime" placeholder="ex. 202301010000"/>
          <Form.Control type="text" ref={endTime}
            aria-label="endTime" placeholder="ex. 202301010050"/>
        </InputGroup>
          <Button variant="outline-secondary" id="button-addon1" type='submit'>
                Search
          </Button>
        </form>
      </div>

      {timeerror &&
            <p style={{color: "red",}}>Error: {timeerror}!!</p>
        }

      {searchLoading ?
      <div>
        <br/>
        <Spinner animation="border" role="status" style={{ width: "4rem", height: "4rem" }}/>
        <p style={{fontSize:20}}>Loading seismograms...</p>

      </div>
      :
      <div>
      <ResponsiveContainer width="99%" height={180}>
        <LineChart data={data} syncId="anyId"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10"
          tick={{fontSize: 12, dy:5}} domain={['dataMin', 'dataMax']} allowDataOverflow={true}
          ticks={TimeArray}
        />
        
        <YAxis type="number" dataKey="value1" domain={[seismin1, seismax1]} 
          tickFormatter={(value) => Number(value.toFixed(10)).toExponential()}
          allowDataOverflow={true}
        />
  
        <Line type="natural" dataKey="value1" stroke="black" dot={false} animationDuration={300}/>
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="99%" height={180}>
        <LineChart
          data={data} syncId="anyId"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          
        <XAxis type="number" dataKey="times" tickFormatter={dateFormatter}
          scale="time" angle="20" tickCount="10"
          tick={{fontSize: 12, dy:5}} domain={['dataMin', 'dataMax']} allowDataOverflow={true}
          ticks={TimeArray}
        />
        
        <YAxis type="number" dataKey="value2" domain={[seismin2, seismax2]} 
          tickFormatter={(value) => Number(value.toFixed(10)).toExponential()}
          allowDataOverflow={true}
        />
  
        <Line type="monotone" dataKey="value2" stroke="black" dot={false} animationDuration={300}/>

        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="99%" height={180}>
        <LineChart
          data={data} syncId="anyId"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          
        <XAxis type="number" dataKey="times"  tickFormatter={dateFormatter}
          scale="time"  angle="20" tickCount="10"
          tick={{fontSize: 12, dy:5}} domain={['dataMin', 'dataMax']} allowDataOverflow={true}
          ticks={TimeArray}
        />
        
        <YAxis type="number" dataKey="value3" domain={[seismin3, seismax3]} 
          tickFormatter={(value) => Number(value.toFixed(10)).toExponential()}
           allowDataOverflow={true}
        />
        <Brush dataKey="times" tickFormatter={dateFormatter} width="99%" gap={10} />
        <Line type="natural" dataKey="value3" stroke="black" dot={false} animationDuration={300}/>



        </LineChart>
      </ResponsiveContainer>
      </div>
      }
      <div>
      <div>
        <form onSubmit={Setinputfreq}>
        <InputGroup className="mb-3">
          <InputGroup.Text>Frequency range</InputGroup.Text>
          <Form.Control type="text" ref={freqminRef}
            aria-label="freqMin" placeholder="Enter fmin (ex. 1)"/>
          <Form.Control type="text" ref={freqmaxRef}
            aria-label="freqMax" placeholder="Enter fmax (ex. 10)"/>
        </InputGroup>
          <Button variant="outline-secondary" id="button-addon1" type='submit'>
                Bandpass
          </Button>
        </form>
      </div>


        
        {banderror &&
            <p style={{color: "red",}}>Error: {banderror}!!</p>
        }
        </div>

      </div>
  </>
);

}
export default BigSearchComp;