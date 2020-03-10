<%@ page language="java" contentType="text/html; charset=utf-8"
%>
<!doctype html>
<html>
<head>
    <title>${pageName}</title>
</head>
<!-- <script src="https://d3js.org/d3.v5.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.js"></script>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.css" />
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script> -->
<script>
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
</script>
<body>
    <div id="root"></div>
    <script src="/js/react/${pageName}.bundle.js"></script>
</body>
</html>