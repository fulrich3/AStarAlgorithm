//import _ from 'lodash';
import './style.scss';
import './template.html';


function component() {
    let element = document.createElement('div');
  
    //element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
    element.innerHTML = '<p class="red">excellent</p>';
    element.classList.add('hello');

    return element;
}

document.body.appendChild(component());

console.log("O haï Mark!");