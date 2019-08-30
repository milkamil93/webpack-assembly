import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
window.jQuery = window.$ = $;
import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/main.scss'
import Inputmask from "inputmask";
require('@fancyapps/fancybox');

$(() => {
    Inputmask('+7 999 999-99-99').mask(document.querySelectorAll('[type="tel"]'));
});

import App from './components/app.component';

render(<App />, document.getElementById('root'));