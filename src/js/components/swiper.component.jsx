import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Swiper from 'react-id-swiper';

export default class SwiperInit extends Component {
    constructor(props) {
        super(props);

        this.params = {
            loop: true,
            slidesPerView: 4,
            containerModifierClass: 'swiper-container',
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-next',
                prevEl: '.swiper-prev'
            },
            spaceBetween: 30
        };
    }

    renderSlides() {
        const slides = [];
        for (let i = 0; i < 5; i++) {
            slides.push(i);
        }

        return slides.map(item => {
            return (
                <div data-fancybox="events" data-src="images/event-0.jpg" className="swiper-slide" key={item}>
                    <img className="events__item__image" src="images/img.jpg" alt="" />
                </div>
            )
        });
    }

    render() {
        return (
            <Swiper {...this.params}>
                {this.renderSlides()}
            </Swiper>
        )
    }
}

const el = document.querySelector('.swiper-container');
if (typeof(el) !== 'undefined' && el !== null) {
    render(<SwiperInit />, el);
}