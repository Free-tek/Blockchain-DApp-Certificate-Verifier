import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as $ from 'jquery'

var app  = ReactDOM.render(<App />, document.getElementById('register'));

$(function() {
  $('#capture').click(function() {
  	console.log("trigger happened")
  	app.callReactFunction();
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
