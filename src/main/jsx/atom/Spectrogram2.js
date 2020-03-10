import React,{ useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Graph from './Graph'
import Plot from 'react-plotly.js';

let trace1 = {
    uid: '31d325cd-efb0-4a69-990d-a022e6d4eb7c', 
    type: 'surface', 
  };
  let data = [trace1];
  let layout = {
    scene: {
      xaxis: {title: {text: 'Time'}}, 
      yaxis: {title: {text: 'Frequencies'}}, 
      zaxis: {title: {text: 'Log Amplitude'}}
    }, 
    title: {text: 'Spectrogram in 3D'}, 
    width: 500, 
    height: 500, 
    margin: {
      b: 65, 
      l: 65, 
      r: 50, 
      t: 90
    }, 
    autosize: false
  };

  export default function Spectrogram2(){
    return <Plot data={data} layout={layout}/>;
  }