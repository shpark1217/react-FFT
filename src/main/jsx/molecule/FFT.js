import React,{ useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Graph from '../atom/Graph'
import Spectrogram from '../atom/Spectrogram'
import Spectrogram2 from '../atom/Spectrogram2'



var fft = require('fft-js').fft;

export default class FFT extends React.Component {
state = {
	freqAndAmp:
		{
			"freq" : [10,25,30,50,80],
			"amp" : [10,40,40,50,30]
		},
	sampleFreq : 1024,
	sampleNum : 256,
	timeInterval : 2,
	xArray : [],
	yArray : [],
	deltaTimeStart : [],
	spectogramYarray : [],
	spectogramZarray : [],
	buttonClicked : false
}


shouldComponentUpdate(nextProps, nextState){
	let bool = nextProps.buttonClicked;
	/*
	if(JSON.stringify(nextProps.freqAndAmp) != JSON.stringify(this.props.freqAndAmp)){
		bool = true;
	}
	if(JSON.stringify(nextProps.sampleFreq) != JSON.stringify(this.props.sampleFreq)){
		bool = true;
	}
	*/
	if(bool == true){
		const freq = nextProps.sampleNum/nextProps.timeInterval;
		const specYarray = linspace(0, freq/2, nextProps.sampleNum/2);
		this.setState({
			...this.state,
			freqAndAmp:
			{
				"freq" : nextProps.freqAndAmp.freq,
				"amp" : nextProps.freqAndAmp.amp
			},
			sampleFreq : freq,
			timeInterval : nextProps.timeInterval,
			sampleNum : nextProps.sampleNum,
			spectogramYarray : specYarray
		}, () => this.xData());
	}
	return bool;
}

//input signal의 x축 배열을 만들어주는 함수
xData = () => {  
	const {xArray, sampleFreq, deltaTimeStart, sampleNum} = this.state;
	let time = 0;
	if(xArray.length > 0){
		time = xArray[xArray.length - 1] + 1/sampleFreq;
	}
	; // 샘플링 간의 시간 => 1/샘플링 주파수
	let arrayX = new Array();
	for(let i = 0 ; i < sampleNum ; i++){
		arrayX.push(time);
		time += 1/sampleFreq;
	}
	console.log(arrayX[0]);
	this.setState({
		...this.state,
		xArray : xArray.concat(arrayX),
		deltaTimeStart: deltaTimeStart.concat(arrayX[0])
	}, () => this.yData());
}; 

//input signal의 y축 배열을 만들어주는 함수
yData = () => {
	console.log(this.state.deltaTimeStart);
	const {xArray, yArray, freqAndAmp, sampleNum} = this.state;
	let arrayY = new Array();
	for(let i = 0 ; i < sampleNum ; i++){
		arrayY[i] = 0;
		for(let j = 0 ; j < freqAndAmp.freq.length ; j++){
			arrayY[i] = arrayY[i] + freqAndAmp.amp[j]*Math.sin(2*Math.PI*xArray[xArray.length - (sampleNum - i)]*
				freqAndAmp.freq[j]);
		}
	}
	this.setState({
		...this.state,
		yArray : yArray.concat(arrayY)
	}, () => this.inputSignal());
};

// input signal 그래프를 그려주는 함수
inputSignal = () => {
	const {xArray, yArray} = this.state;
	let inputGraph = <Graph xData={deepCopy(xArray)} 
	yData={deepCopy(yArray)} 
	name={'원래 Graph'} 
	color={'red'}/>;
	/*
	if(xArray.length >= 500){
		inputGraph = <Graph xData={this.deepCopy(xArray.splice(xArray.length - 501, xArray.length - 1))} 
		yData={this.deepCopy(yArray.splice(yArray.length - 501, yArray.length - 1))} 
		name={'원래 Graph'} 
		color={'red'}/>
	}
	*/
	ReactDOM.render(
		inputGraph,
		document.getElementById("signalGraph")
	);
	this.fftSignal();
	this.makeZofSpectrogram();
};
// fft 그래프를 그려주는 함수
fftSignal = () => {
	const {xArray, yArray, sampleFreq} = this.state;
	let arrayY = deepCopy(yArray);
	if(isNumberInteger(Math.log2(yArray.length))){
		let fftGraph = <Graph xData={deepCopy(this.changeXdataToFreq(xArray, sampleFreq))} 
		yData={deepCopy(this.getFFT(arrayY))} name={'FFT Graph (표본 개수 : ' + xArray.length+' 개)'} color={'blue'}/>;
		ReactDOM.render(
			fftGraph,
			document.getElementById("fftGraph")
		)
	}
};
// fft 결과의 x축 배열을 만들어주는 함수(주파수 축 생성)
changeXdataToFreq = (inputArray, samplingFreq) => {
	return linspace(0, samplingFreq/2, inputArray.length/2);
};

// fft를 수행하고 후처리까지 해주는 함수
getFFT = (inputArray) => {
	let array = fft(inputArray);
	//array = this.deepCopy(fft(inputArray));
	for(var i = 0 ; i < array.length ; i++){
		array[i] = Math.sqrt(Math.pow(array[i][0],2)+Math.pow(array[i][1],2));
	}
	array = mean(array);
	return array.splice(0, array.length/2);
};

// spectrogram을 그릴 배열을 만들어주는 함수
makeZofSpectrogram = () => {
	const {sampleNum, yArray, spectogramZarray} = this.state;
	let spectogramZarray2 = deepCopy(spectogramZarray);
	const yArray2 = deepCopy(yArray);
	let array = this.getFFT(yArray2.splice(yArray2.length - sampleNum, sampleNum));
	if(spectogramZarray2 == null || spectogramZarray2.length == 0){
		spectogramZarray2 = new Array(array.length);
		for(let i = 0 ; i < spectogramZarray2.length ; i++){
			spectogramZarray2[i] = [];
		}
	}
	for(let i = 0 ; i < array.length ; i++){
		spectogramZarray2[i].push(array[i]);
	}
	this.setState({spectogramZarray : spectogramZarray2}, () => this.drawSpectrogram());
}

// spectrogram을 그려주는 함수
drawSpectrogram = () => {
	const {deltaTimeStart, spectogramYarray, spectogramZarray} = this.state;
	let spectrogram = <Spectrogram xData={deepCopy(deltaTimeStart)} 
	yData={deepCopy(spectogramYarray)} 
	zData={deepCopy(spectogramZarray)}/>;
	ReactDOM.render(
		spectrogram,
		document.getElementById("spectrogram")
	)
}

render(){
	/*
	const timer = setInterval(() => {
		this.xData()
	}, 100)

	const timerStop = () => clearInterval(timer); 

	*/

	/*
	const xDataDummy = () => {
		for(var i = 0 ; i < 10000000; i++){
			xArrayDummy[i] = i;
		}
		return xArrayDummy;
	}

	const yDataDummy = () => {
		let array = new Array();
		for(var i = 0 ; i < 10000000 ; i++){
			//array[i] = Math.sin(2*(xArrayDummy[i])*(Math.PI)*10);
			array[i] = Math.log(xArrayDummy[i]);
			//array[i] = Math.pow(xArrayDummy[i],2);
		};
		return array;
	}
	
	const bigGraph = () => {
		return <Graph xData={xDataDummy()} 
		yData={yDataDummy()} name={'Big Graph (표본 개수 : ' +xArrayDummy.length+' 개)'} color={'green'}/>;
	}
	*/

    
    return(
		<div className="graphs">
		<span id="signalGraph"></span>
        <span id="fftGraph"></span>
		{/*<div id="BigGraph">{bigGraph()}</div>*/}
		<div id="spectrogram">
		</div>
		<div id="3dSpectrogram"><Spectrogram2/></div>
		</div>
	);
	}

}