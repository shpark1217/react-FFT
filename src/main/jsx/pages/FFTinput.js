import React,{ useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FFT from '../molecule/FFT';

export default class FFTinput extends React.Component {
    state = {
        freqAndAmp:
            {
                "freq" : 0,
                "amp" : 0
            }
        ,
        inputTag: [
            { "num" : 0, 
              "tag" : <div id={0}><input id={'freq0'} name={'freq'} placeholder="주파수"/><input id={'amp0'} name={'amp'} placeholder="진폭"/></div>
            }],
        cnt : 0,
        sampleFreq : 0,
        sampleNum : 0,
        buttonClicked : false
    }

    deleteSignal = (num) => {
        const {inputTag} = this.state;
        let index = -1;
        for(let i = 0 ; i < inputTag.length ; i++){
            if(this.state.inputTag[i].num == num){
                index = i;
            }
        }
        inputTag.splice(index, 1);
        this.setState({
            ...this.state,
            inputTag : inputTag
        });
    }

    addSignal = () => {
        const {cnt, inputTag} = this.state;
        //alert(inputTag.length);
        this.setState({
            ...this.state,
            inputTag : inputTag.concat(
                { "num" : cnt+1, 
                "tag" : <div id={cnt+1}><input id={'freq'+(cnt+1)} name={'freq'} placeholder="주파수"/>
                <input id={'amp'+(cnt+1)} name={'amp'} placeholder="진폭"/>
                <button onClick={this.deleteSignal.bind(this, cnt + 1)}>제거</button>
                </div>
              }
            ),
            cnt : cnt + 1
        });
    }

    submitSignal = () => {
        let freqs = Array.prototype.slice.call(document.getElementsByName("freq"));
        let amps = Array.prototype.slice.call(document.getElementsByName("amp"));
        freqs = freqs.map(x => x.value);
        amps = amps.map(x => x.value);
        this.setState({
            ...this.state,
            freqAndAmp : {
                "freq":freqs,
                "amp" : amps
            },
            sampleFreq : document.getElementById('SampleFreqInput').value,
            sampleNum : document.getElementById('SampleNumInput').value,
            buttonClicked : true
        }, () => this.setState({buttonClicked : false}));
    }

    render(){
        return(
            <React.Fragment>
                <div>샘플링 주파수(f) : <input id="SampleFreqInput" placeholder="샘플링 주파수"/></div>
                <div>샘플링 개수(N) : <input id="SampleNumInput" placeholder="샘플링 개수"/></div>
                <div>{this.state.inputTag.map(x => x.tag)}</div>
                <div><button onClick={this.addSignal}>추가</button><button onClick={this.submitSignal}>확인</button></div>
                <FFT freqAndAmp={this.state.freqAndAmp} sampleFreq={this.state.sampleFreq} 
                sampleNum={this.state.sampleNum} buttonClicked={this.state.buttonClicked}/>
            </React.Fragment>
        );
    }
}