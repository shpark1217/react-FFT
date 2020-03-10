import React,{ useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Graph from './Graph'
import Plot from 'react-plotly.js';

let trace1 = {
  type : 'heatmap',
  x : [],
  y : [],
  z : [],
  colorscale: 'Jet'
}

  let layout = {
    title: {text: 'Spectrogram'}, 
    xaxis: {title: {text: 'Time'}}, 
    yaxis: {title: {text: 'Frequency'}}
  };


export default function Spectrogram(props){
  console.log(props.xData);
  trace1.x = props.xData;
  trace1.y = props.yData;
  trace1.z = props.zData;
  let data = [trace1];
  return <Plot data={data} layout={layout}/>;
}