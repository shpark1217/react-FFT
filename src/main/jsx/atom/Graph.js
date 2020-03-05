import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

export default function Graph(props) {
    return(
        <Plot
        data={[
          {
            x: props.xData,
            y: props.yData,
            type: 'line',
            marker: {color: props.color},
          }
        ]}
        layout={ {width: 700, height: 500, title:props.name} }
      />
    );

}