import React,{ useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Graph from '../atom/Graph'
import Plot from 'react-plotly.js';
import Data from '../atom/Data'

export default class FFT extends React.Component {
//var phasors = fft(signal);

render(){
	var fft = require('fft-js').fft;
	let xArray = new Array();
	let yArray = new Array();
	let fftGraph = null;
	let time = 0;
	let samplingFreq = 0;
	let xArrayDummy = new Array();

    const xData = () => {  
		xArray.push(time);
		samplingFreq = 1024;
		time += 1/samplingFreq; // 샘플링 간의 시간 => 1/샘플링 주파수
	}; 
	/*
	샘플링 주파수가 분석대상 주파수 중의 최대 주파수보다 두 배 이상 되어야 하고, 
	샘플링 주파수가 2의 승수꼴이어야 진폭 결과가 정확하고 빠르게 나옴.
	(이유는 정확하게는 모르겠지만, 진폭의 경우 주기별로 계속 값이 쌓이므로 주기가 딱 떨어져야 정확하게 나오는 것이 아닐까 추정. 
	fft 알고리즘은 input data를 2의 승수꼴로 이용하므로 2의 승수꼴일 때 주기가 딱 떨어져서 진폭값이 정확하게 나오는 것이 아닐까 싶다.)
	*/
	
    const yData = (inputXdata) => {
		//console.log(inputXdata);
		yArray.push(
			10*Math.sin(2*inputXdata[inputXdata.length -1]*Math.PI*10)+ 
			40*Math.cos(2*inputXdata[inputXdata.length -1]*Math.PI*25)+ 
			40*Math.sin(2*inputXdata[inputXdata.length -1]*Math.PI*30)+
			50*Math.cos(2*inputXdata[inputXdata.length -1]*Math.PI*50)+
			30*Math.cos(2*inputXdata[inputXdata.length -1]*Math.PI*80)
		);
	};


	const inputSignal = () => {
		let inputGraph = <Graph xData={deepCopy(xArray)} 
		yData={deepCopy(yArray)} 
		name={'원래 Graph'} 
		color={'red'}/>;
		if(xArray.length >= 100){
			inputGraph = <Graph xData={deepCopy(xArray).splice(deepCopy(xArray).length - 100, deepCopy(xArray).length -1)} 
			yData={deepCopy(yArray).splice(deepCopy(yArray).length - 100, deepCopy(yArray).length - 1)} 
			name={'원래 Graph'} 
			color={'red'}/>
		}
		ReactDOM.render(
			inputGraph,
			document.getElementById("signalGraph")
		);
		fftSignal();
	};
	const fftSignal = () => {
		//console.log(Math.log2(xArray.length));
		if(isNumberInteger(Math.log2(yArray.length))){
			fftGraph = <Graph xData={changeXdataToFreq(xArray, samplingFreq)/*.splice(0, changeXdataToFreq(xArray).length/2)*/} 
			yData={(getFFT(yArray))} name={'FFT Graph (표본 개수 : ' +xArray.length+' 개)'} color={'blue'}/>;
			ReactDOM.render(
				fftGraph,
				document.getElementById("fftGraph")
			)
		}
	};

	// 배열 원소 평균 내주는 함수
	const mean = (inputArray) => {
		for(var i = 0 ; i < inputArray.length ; i++){
			inputArray[i] = inputArray[i]*(2/inputArray.length);
		}
		return inputArray;
	}

	// input number가 정수인지 여부
	const isNumberInteger = (num) => {
		let bool = true;
		const array = num.toString().split(".");
		if(array.length == 2){
			return false;
		}
		return bool;
	};
	
	// 시작점, 끝점, 원소 개수를 받아 배열 생성하는 함수
	const linspace = (start, end, num) => {
		let array = new Array();
		array[0] = start;
		//alert(start + " " + end + " " + num);
		for(var i = 1 ; i < num ; i++){
			array[i] = array[i-1] + (end - start)/(num);
		}
		//console.log(array);
		return array;
	}

	// 배열 딥카피 함수
	const deepCopy = (inputArray) => {
		let array = new Array();
		for(var i = 0 ; i < inputArray.length ; i++){
			array[i] = inputArray[i];
		}
		return array;
	}

	// fft 결과의 x축 배열을 만들어주는 함수(주파수 축 생성)
	const changeXdataToFreq = (inputArray, samplingFreq) => {
		return linspace(0, samplingFreq/2, inputArray.length/2);
	};

	// fft를 수행하고 후처리까지 해주는 함수
	const getFFT = (inputArray) => {
		let array = new Array();
		array = deepCopy(fft(inputArray));
		for(var i = 0 ; i < array.length ; i++){
			array[i] = Math.sqrt(Math.pow(array[i][0],2)+Math.pow(array[i][1],2));
			//console.log(inputArray[i]);
		}
		array = mean(array);
		return array.splice(0, array.length/2);
	};

	setInterval(() => {
		xData(),
		yData(xArray),inputSignal()
	}, 10)

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

    
    return(
		<div className="graphs">
		<span id="signalGraph"></span>
        <span id="fftGraph"></span>
		<div id="BigGraph">{bigGraph()}</div>
		<div id="spectogram"><Data/></div>
		</div>
	);
	}

}