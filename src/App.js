import React, { useState, useEffect } from 'react';
import {Container, Row, Col} from "react-bootstrap";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import Map from './components/Map'
import Realtime from './components/Realtime'
//import BigSearchComp from  "./BigSearchComp"
import DVV from './components/DVV'
import ColorBar from './components/Colormap'
import './index.css';

const title={backgroundColor: '#282c34',
  color: 'white',
  padding: 20,
  fontFamily: 'Sans-Serif',
  textAlign: 'center',
};
const stations = ["LT01", "LT02", "LT03", "LT04", "LT05", "LT06", "LT07", "LT08", "LT11", "LT12", "LATB"];





function App(){
  const [currentIndex, setCurrentIndex] = useState("1-4");
  const [value, setValue] = useState(1);

  const handleChange = (val) => setValue(val);
  const handleIndexChange = newIndex => {
    setCurrentIndex(newIndex);
  };
  return(
  <>
    <Container fluid>
    <h1 style={title}>Lantai monitoring system</h1>
    <Row>
      <Col sm={7} md={7} xs={12} style={{top:50}}>
        <div>
           <Realtime />
        </div>
      </Col>
    
      <Col sm={5} md={5} xs={12}>
        <div style={{position: "relative",top:50,right:50}}>
          <Map />
        </div>

        <div style={{border: "solid 4px", borderRadius: "5px", position: "relative",top:100,right:50, padding: "0.5cm 0.5cm"}}>
          {/*<BigSearchComp />*/}
          <div className="colorbar">
            <ColorBar />
          </div>
          
          <br/>

          <div>
            <ToggleButtonGroup style={{ width:"100%"}} type="radio" name="options" defaultValue={1} onChange={handleChange}>

              <ToggleButton className='button-text' id="tbg-radio-1" variant='outline-info' value={1} style={{ width: '100%', height: '4em', fontSize: '0.8em' }} onClick={() => handleIndexChange("1-4")}>
                <p>1-4 Hz</p></ToggleButton>
              <ToggleButton className='button-text' id="tbg-radio-2" variant='outline-info' value={2} style={{ width: '100%', height: '4em', fontSize: '0.8em' }} onClick={() => handleIndexChange("2-6")}>
                <p>2-6 Hz</p></ToggleButton>
              <ToggleButton className='button-text' id="tbg-radio-3" variant='outline-info' value={3} style={{ width: '100%', height: '4em', fontSize: '0.8em' }} onClick={() => handleIndexChange("4-8")}>
                <p>4-8 Hz</p></ToggleButton>
              <ToggleButton className='button-text' id="tbg-radio-4" variant='outline-info' value={4} style={{ width: '100%', height: '4em', fontSize: '0.8em' }} onClick={() => handleIndexChange("8-12")}>
                <p>8-12 Hz</p></ToggleButton>
              <ToggleButton className='button-text' id="tbg-radio-5" variant='outline-info' value={5} style={{ width: '100%', height: '4em', fontSize: '0.8em' }} onClick={() => handleIndexChange("12-16")}>
                <p>12-16 Hz</p></ToggleButton>
              <ToggleButton className='button-text' id="tbg-radio-6" variant='outline-info' value={6} style={{ width: '100%', height: '4em', fontSize: '0.8em' }} onClick={() => handleIndexChange("16-20")}>
                <p>16-20 Hz</p></ToggleButton>       
            </ToggleButtonGroup>

            </div>

          <br/>
          {stations.map(station => (
            <DVV key={station} station={station} dataIndex={currentIndex}
            onIndexChange={handleIndexChange}/>
          ))}

        </div>
      </Col>  

    </Row>
    </Container>
  </>

  )
}

export default App;