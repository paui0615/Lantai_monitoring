import React, { useState, useEffect } from 'react';

const ColorBar = () => {

    return (
        <>
        <div className="source-color-label">Coherence</div>
        <div className="source-legend-colorbar">
          <div className="source-colorbar-mark" style={{ left: '0%'}}>0</div>
          <div className="source-colorbar-mark" style={{ left: '20%'}}>0.2</div>
          <div className="source-colorbar-mark" style={{ left: '40%'}}>0.4</div>
          <div className="source-colorbar-mark" style={{ left: '60%'}}>0.6</div>
          <div className="source-colorbar-mark" style={{ left: '80%'}}>0.8</div>
          <div className="source-colorbar-mark" style={{ right: '0%'}}>1</div>
        </div>
        </>
    );
  };
export default ColorBar