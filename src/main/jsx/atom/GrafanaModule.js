import React, { useState, useEffect } from 'react';
import '../MainCss.css';


export default function GrafanaModule(props){
    return (
        <div>
        <h1>메인 페이지</h1>
        <div className="container" >
            <iframe src={props.juso} width={props.width} height={props.height} frameborder="0">
            </iframe>
        <div className="overlay"></div></div></div>
    );
}