import 'bootstrap/dist/css/bootstrap.min.css';
import '../styl/main.styl';
import $ from 'jquery';
window.jQuery = window.$ = $;
import Inputmask from 'inputmask';
require('@fancyapps/fancybox');
import 'inputmask/css/inputmask.css';

if (typeof window.componentName !== 'undefined') {
    try {
        require(`./${window.componentName}.js`);
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    // аттрибуты для внешних ссылок
    document.querySelectorAll('[target="_blank"]').forEach(e =>
        e.setAttribute('rel','noopener noreferrer')
    );

    // фикс к формам для яндекс метрики
    document.querySelectorAll('form').forEach(e => e.classList.add('-visor-no-click'));

    // маска для номера
    Inputmask({
        'mask': '+7 999 999-99-99',
        'onincomplete': e => {
            e.target.value = '';
        }
    }).mask(document.querySelectorAll('[type="tel"]'));
});