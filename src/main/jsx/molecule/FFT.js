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
	xArray : [],
	yArray : [],
	deltaTimeStart : [],
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
		this.setState({
			...this.state,
			freqAndAmp:
			{
				"freq" : nextProps.freqAndAmp.freq,
				"amp" : nextProps.freqAndAmp.amp
			},
			sampleFreq : nextProps.sampleFreq,
			sampleNum : nextProps.sampleNum
		}, () => this.xData());
	}
	return bool;
}

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
	this.setState({
		...this.state,
		xArray : xArray.concat(arrayX),
		deltaTimeStart: deltaTimeStart.concat(arrayX[0])
	}, () => this.yData());
}; 
/*
샘플링 주파수가 분석대상 주파수 중의 최대 주파수보다 두 배 이상 되어야 하고, 
샘플링 주파수가 2의 승수꼴이어야 진폭 결과가 정확하고 빠르게 나옴.
(이유는 정확하게는 모르겠지만, 진폭의 경우 주기별로 계속 값이 쌓이므로 주기가 딱 떨어져야 정확하게 나오는 것이 아닐까 추정. 
fft 알고리즘은 input data를 2의 승수꼴로 이용하므로 2의 승수꼴일 때 주기가 딱 떨어져서 진폭값이 정확하게 나오는 것이 아닐까 싶다.)
*/

yData = () => {
	const {xArray, yArray, sampleFreq, freqAndAmp, sampleNum} = this.state;
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


inputSignal = () => {
	const {xArray, yArray} = this.state;
	let inputGraph = <Graph xData={this.deepCopy(xArray)} 
	yData={this.deepCopy(yArray)} 
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
};
fftSignal = () => {
	const {xArray, yArray, sampleFreq} = this.state;
	if(this.isNumberInteger(Math.log2(yArray.length))){
		let fftGraph = <Graph xData={this.deepCopy(this.changeXdataToFreq(xArray, sampleFreq))/*.splice(0, changeXdataToFreq(xArray).length/2)*/} 
		yData={this.deepCopy(this.getFFT(yArray))} name={'FFT Graph (표본 개수 : ' + xArray.length+' 개)'} color={'blue'}/>;
		ReactDOM.render(
			fftGraph,
			document.getElementById("fftGraph")
		)
	}
};
// fft 결과의 x축 배열을 만들어주는 함수(주파수 축 생성)
changeXdataToFreq = (inputArray, samplingFreq) => {
	return this.linspace(0, samplingFreq/2, inputArray.length/2);
};

// fft를 수행하고 후처리까지 해주는 함수
getFFT = (inputArray) => {
	let array = fft(inputArray);
	//array = this.deepCopy(fft(inputArray));
	for(var i = 0 ; i < array.length ; i++){
		array[i] = Math.sqrt(Math.pow(array[i][0],2)+Math.pow(array[i][1],2));
	}
	array = this.mean(array);
	return array.splice(0, array.length/2);
};

// 배열 원소 평균 내주는 함수
mean = (inputArray) => {
	for(var i = 0 ; i < inputArray.length ; i++){
		inputArray[i] = inputArray[i]*(2/inputArray.length);
	}
	return inputArray;
}

// input number가 정수인지 여부
isNumberInteger = (num) => {
	let bool = true;
	const array = num.toString().split(".");
	if(array.length == 2){
		return false;
	}
	return bool;
};

// 시작점, 끝점, 원소 개수를 받아 배열 생성하는 함수
linspace = (start, end, num) => {
	let array = new Array();
	array[0] = start;
	for(var i = 1 ; i < num ; i++){
		array[i] = array[i-1] + (end - start)/(num);
	}
	return array;
}

// 배열 딥카피 함수
deepCopy = (inputArray) => {
	let array = new Array();
	for(var i = 0 ; i < inputArray.length ; i++){
		array[i] = inputArray[i];
	}
	return array;
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
		<div id="spectrogram"><Spectrogram/></div>
		<div id="3dSpectrogram"><Spectrogram2/></div>
		</div>
	);
	}

}