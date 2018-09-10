//import _ from 'lodash';
import './style.css';

function component() {
    let element = document.createElement('div');
  
    //element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
    element.innerHTML = "<p>test</p>";
    element.classList.add('hello');

    return element;
}

document.body.appendChild(component());