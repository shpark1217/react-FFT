import React from 'react';
import ReactDOM from 'react-dom';
import FFTinput from './pages/FFTinput';


function MainPage (){
    return (
        <React.Fragment>
            <FFTinput/>
        </React.Fragment>
    );
}
 
ReactDOM.render(<MainPage/>, document.getElementById('root'));