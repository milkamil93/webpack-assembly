import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
window.jQuery = window.$ = $;
import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/main.scss'
import Inputmask from "inputmask";
require('@fancyapps/fancybox');

if (typeof window.componentName !== 'undefined') {
    try {
        require(`./components/${window.componentName}.component`);
    } catch(e) {}
}

$(() => {
    Inputmask('+7 999 999-99-99').mask(document.querySelectorAll('[type="tel"]'));
});