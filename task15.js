window.addEventListener("DOMContentLoaded", function() {

    'use strict';
    let tab = document.querySelectorAll(".info-header-tab"),
        info = document.querySelector(".info-header"),
        tabContent = document.querySelectorAll(".info-tabcontent"),
        tabBtn = document.querySelectorAll(".info-tabcontent .description-btn"),
        overlay = document.querySelector(".overlay");

    console.log(tabBtn);

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove("show");
            tabContent[i].classList.add("hide");
        }
    }

    hideTabContent(1);

    function showTabContent (b) {
        if (tabContent[b].classList.contains("hide")) {
            tabContent[b].classList.remove("hide");
            tabContent[b].classList.add("show");
        }
    } 

    info.addEventListener("click", function(event) {
        let target = event.target;
        if (target && target.classList.contains("info-header-tab")) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    tabBtn[i].addEventListener("click", function() {
                        overlay.style.display = "block";
                        this.classList.add("more-splash");
                        document.body.style.overflow = "hidden";
                    });
                    break;
                }
            }
        }
    });

    let deadline = '2019-10-9';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            t = 0;
        }

        let seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60) % 60),
            hours = Math.floor(t/(1000*60*60));

        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock (id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector(".hours"),
            minutes = timer.querySelector(".minutes"),
            seconds = timer.querySelector(".seconds"),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime),
                hoursT = t.hours,
                minutesT = t.minutes,
                secondsT = t.seconds;

            if (hoursT >= 0 && hoursT <10) {
                hoursT = `0 ${hoursT}`; 
            }

            hours.textContent = hoursT;

            if (minutesT >= 0 && minutesT <10) {
                minutesT = `0 ${minutesT}`; 
            }

            minutes.textContent = minutesT;

            if (secondsT >= 0 && secondsT <10) {
                secondsT = `0 ${secondsT}`; 
            }

            seconds.textContent = secondsT;

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    

    setClock('timer', deadline);

    let more = document.querySelector(".more"),
        close = document.querySelector(".popup-close");

    more.addEventListener("click", function() {
        overlay.style.display = "block";
        this.classList.add("more-splash");
        document.body.style.overflow = "hidden";
    });

    close.addEventListener("click", function() {
        overlay.style.display = "none";
        more.classList.remove("more-splash");
        document.body.style.overflow = "";
    });

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        let formData = new FormData(form);

        let obj = {};
        formData.forEach(function(value, key) {
            obj[key] = value;
        });
        let json = JSON.stringify(obj);

        request.send(json);

        function readyOrNot () {
            return new Promise(function (resolve,reject) {

                request.addEventListener('readystatechange', function() {
                    if (request.readyState < 4) {
                        resolve();
                    } else if(request.readyState === 4 && request.status == 200) {
                        resolve();
                    } else {
                        reject();
                    }
            });

        });
        }

        function clearInput() {
            for (let i = 0; i < input.length; i++) {
                input[i].value = '';
            }
        }

        readyOrNot()
                    .then(() => statusMessage.innerHTML = message.loading)
                    .then(() => {
                        thanksModal.style.display = "block";
                        mainModal.style.display = "none";
                        statusMessage.innerHTML = "";
                    })
                    .catch(() => statusMessage.innerHTML = message.failure)
                    .then(clearInput);
    });

    
    let slideIndex = 1,
        slides = document.querySelectorAll(".slider-item"),
        prev = document.querySelector(".prev"),
        next = document.querySelector(".next"),
        dotsWrap = document.querySelector(".slider-dots"),
        dots = document.querySelectorAll(".dot");
    
    showSlides(slideIndex);
    function showSlides(n) {

        if(n > slides.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = "none");
        dots.forEach((item) => item.classList.remove("dot-active"));

        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].classList.add("dot-active");
    }

    function plusSlides(n) {
        showSlides(slideIndex +=n);
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener("click", function() {
        plusSlides(-1);
    });

    next.addEventListener("click", function() {
        plusSlides(1);
    });

    dotsWrap.addEventListener("click", function(event) {
        for (let i = 1; i < dots.length + 1; i++) {
            if (event.target.classList.contains("dot") && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });
});