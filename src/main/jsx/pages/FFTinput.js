import React,{ useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FFT from '../molecule/FFT';


export default class FFTinput extends React.Component {
    state = {
        cnt:0,
        freqAndAmp:[]
    }

    render(){

        return(
            <React.Fragment>
                <FFT inputSignal={this.state.freqAndAmp}/>
            </React.Fragment>
        );
    }
}