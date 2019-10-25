svg4everybody(); //for svg spite in ie

let $window,
    $body,
    wWidth = 0,
    wHeight = 0,
    W_SM = 576,
    W_MD = 768,
    W_LG = 992,
    W_XL = 1200,
    locale = 'en'
    ;


$(document).ready(function () {
	$body = $('body');
    $window = $(window);

    wWidth =  $(window).width();
    wHeight =  $(window).height();

    $window.on('resize', function() {
        wWidth =  $window.width();
        wHeight =  $window.height();
    });


    locale = getLocale();
    

    let $header = createHeader();
    $header.init();


    let $sideMenu = createSideMenu();
    $sideMenu.init();
    

    let $animateOnScroll = createAnimateOnScroll();
    $animateOnScroll.init();


    // bodyScroll();

    formScript();

    other();

    let $slideImages = slideImagesCreate();


    if ( $('.s-slide').length ) {
        $slideImages.init();
        $slideImages.run();
    };


    // headerScript();
    if ( wWidth >= W_XL ) {
        parallaxImages();
    }

    if ( wWidth < W_LG ) {

        mobileVhFix();
    }






    function createSideMenu () {
        return {
            sideNav: $('.side-nav'),
            sideNavIsOpen: false,
            openClass: 'side-nav-open',
            opening: false,
            transitionTime: 500,
            timeout: 0,


            init: function() {
                let _this = this;

                _this.sideNavIsOpen = _this.sideNav.hasClass('open');

                $body.on('click touch', '.js-side-nav-trigger', function (e) {
                    e.preventDefault();
                    _this.toggle();
                });


                $body.on('click touch', function (event) {
                    let obj = $(event.target);
                    
                    if ( !_this.opening && _this.sideNav.hasClass('open') && !obj.closest('.side-nav').length && !obj.closest('.fancybox-container').length ) {
                        _this.toggle();
                    };
                });

                $body.on('keydown', function(e) {
                    if ( !_this.opening && _this.sideNavIsOpen && (e.keyCode  === 27)) { // escape key maps to keycode '27'
                        _this.toggle();
                    };
                });


                $('.side-nav__content').on('scroll',function(e) {
                    if ( $('.side-nav__content').scrollTop() > 10 ) {
                        $body.addClass('side-nav-scroll');
                    } else {
                        $body.removeClass('side-nav-scroll');
                    }
                });
            },


            toggle: function (needState) {
                let _this = this;

                if ( _this.opening ) {
                    return 
                }

                _this.opening = true;

                _this.sideNavIsOpen = _this.sideNav.hasClass('open');

                _this.sideNav.toggleClass('open', !_this.sideNavIsOpen);

                if (!_this.sideNavIsOpen) {
                    $body.toggleClass(_this.openClass, true);
                    // $('html').toggleClass(_this.openClass, true);
                }
               
                if ( _this.timeout ) {
                    clearTimeout(_this.timeout)
                }

                _this.timeout = setTimeout(function() {
                    _this.sideNavIsOpen = _this.sideNav.hasClass('open');

                    if (!_this.sideNavIsOpen) {
                        $body.toggleClass(_this.openClass, false);
                        // $('html').toggleClass(_this.openClass, false);
                    };

                    _this.opening = false;
                }, _this.transitionTime)
                
            },
            
            close: function (needState) {
                let _this = this;

                // if ( _this.opening ) {
                //     return 
                // }

                // _this.opening = true;

                _this.sideNav.toggleClass('open', false);

                // if (!_this.sideNavIsOpen) {
                //     $body.toggleClass(_this.openClass, true);
                // }
               
                if ( _this.timeout ) {
                    clearTimeout(_this.timeout)
                }

                _this.timeout = setTimeout(function() {
                    _this.sideNavIsOpen = _this.sideNav.hasClass('open');

                    if (!_this.sideNavIsOpen) {
                        $body.toggleClass(_this.openClass, false);
                        // $('html').toggleClass(_this.openClass, false);
                    };

                    // _this.opening = false;
                }, _this.transitionTime)
                
            },

        }

    };


    function slideImagesCreate() {
        return {
            slideStage: 0,
            slidePrevStage: 0,
            slideStagesCount: 2,
            activeClass: 'is-active',
            animateClass: 'is-animate',
            speed: 5000,
            interval: 0,

            init: function() {
                this.wrap = $('.s-slide');
                this.slideList = this.wrap.find('.s-slide__list');
                this.slide = this.wrap.find('.s-slide__item');
                this.slideStagesCount = this.slide.length - 1;
                // this.display = this.wrap.find('.s-slide__cam-display');
                // this.resultBox = this.wrap.find('.s-slide__cam-result');
            },

            run: function () {
                let _this =  this;
                let nextStage =  function () {
                    _this.nextStage(_this)
                };

                if ( !_this.slideList.find('.' + _this.activeClass).length ) {
                    _this.setStage();
                } else {
                    _this.slidePrevStage = _this.slideStage = _this.slideList.find('.' + _this.activeClass).index();
                    _this.setStage();
                }

                _this.interval = setInterval(nextStage, _this.speed);
            },

            stop: function () {
                let _this =  this;

                clearInterval(_this.interval);

                _this.slideStage = 0;

                _this.setStage();
            },

            setStage: function () {
                let prev = this.slidePrevStage;
                let current = this.slideStage;
                // let prev = 0;
                // let current = 0;
 
                
                this.slide
                    .removeClass(this.activeClass)
                    .removeClass(this.animateClass)

                    .eq(prev)
                    .addClass(this.animateClass);

                this.slide.eq(current)
                    .addClass(this.animateClass)
                    .addClass(this.activeClass);
            },

            nextStage: function (obj) {
                let _this = obj;

                _this.slidePrevStage = _this.slideStage;

                if ( _this.slideStage < _this.slideStagesCount ) {
                    ++_this.slideStage;
                } else {
                    _this.slideStage = 0;
                };


                _this.setStage();

            },

        };
    };


    function createAnimateOnScroll() {
        return {
            scrollAnimList: $body.find('[data-anim=false]'),
            defOffsetTop: 100,

            animateElements: [],

            animate: function(scrollTop) {
                let _this = this;

                if ( _this.animateElements.length ) {
                    
                    _this.animateElements.forEach(function(item) {
                        let $el = item['element'],
                            offsetTop = ( $el.data('offset') && !isNaN(+$el.data('offset')) ) ? +$el.data('offset') : _this.defOffsetTop

                        if ( $el.offset().top + offsetTop < scrollTop + wHeight ) {
                            $el.attr("data-anim", "true")
                        };
                    });
                    
                };

            },


            setOffsetValues: function(arr) {
                if ( !arr.length ) {
                    return
                }

                arr.forEach(function(item) {
                    item['offsetTop'] = item['element'].offset().top;
                });
            },

            setElements: function() {
                let _this = this;

                $('[data-anim]').each(function() {
                    let $el = $(this), 
                        tempObj = {};


                    tempObj['element'] = $el;

                    _this.animateElements.push(tempObj);
                });

                _this.setOffsetValues(_this.animateElements);
            },


            init: function() {
                let _this =  this;

                _this.setElements();
               

                _this.animate( $window.scrollTop() );

                $window.on('scroll resize',function(e) {
                    _this.animate( $window.scrollTop() );
                });

            },

            

            refresh: function() {
                let _this =  this;

                _this.animateElements = [];

                _this.setElements();

                _this.animate( $window.scrollTop() );

            }
        }
    };

    
    // function bodyScroll () {
    //     let $scrollAnimList = $body.find('[data-anim=false]'),
    //         defOffsetTop = 100;


    //     $window.on('scroll resize',function(e) {
    //         windowScroll( $window.scrollTop() );
    //     });

    //     windowScroll( $window.scrollTop() );

    //     function windowScroll(scrollTop) {

    //         if ( scrollTop > 10 ) {
    //             $body.addClass('body-scroll');
    //         } else {
    //             $body.removeClass('body-scroll');
    //         }    
    //     };

    // };


    function parallaxImages() {
        let images = $('.parallax-image');

        if ( !images.length ) {
            return
        };

        // $window.scroll(function() {
        $window.on('scroll', function() {

            // Add parallax scrolling to all images in .paralax-image container
            images.each(function() {
                let $this = $(this); 

                // only put top value if the window scroll has gone beyond the top of the image
                let difference = $window.scrollTop() - $this.offset().top;


                difference = difference > 500 ? 500 : difference;
                difference = difference < -500 ? -500 : difference;
                // Top value of image is set to half the amount scrolled
                // (this gives the illusion of the image scrolling slower than the rest of the page)
                
                let half = (difference / 3) + 'px',
                        transform = 'translate3d( 0, ' + half + ',0)';

                
                //$this.find('img').css('transform', transform);
                $this.css('transform', transform);
              
            });
        });
    };


    function createHeader() {
        return {
            header: $('.header'),
            headerHideClass: 'header--hide',
            headerHideOpacityClass: 'header--hide-opacity',
            headerPaddingTop: 0,
            
            isMainPage: $('.wrapper--main-page').length,

            headerThemeLightClass: 'header--light',
            
            headerDarkElements: [],
            headerHideElements: [],

            upadateArrTimeout: 0,



            setOffsetValues: function(arr) {
                if ( !arr.length ) {
                    return
                }

                arr.forEach(function(item) {
                    item['offsetTop'] = item['element'].offset().top;
                    item['offsetBottom'] = item['offsetTop'] + item['element'].height();
                });

            },

            setHeaderDarkElements: function() {
                let _this = this;

                $('.s-arh__item-img-wrap').each(function() {
                    let $el = $(this), 
                        tempObj = {};

                    if ( $el.is('.more-hide-item') || $el.closest('.more-hide-item').length ) {
                        return
                    }

                    tempObj['element'] = $el;

                    _this.headerDarkElements.push(tempObj);
                });

                _this.setOffsetValues(_this.headerDarkElements);
            },

            setHeaderHideElements: function() {
                let _this = this;

                $('.s-team').each(function() {
                    let $el = $(this), 
                        tempObj = {};

                    if ( $el.is('.more-hide-item') || $el.closest('.more-hide-item').length ) {
                        return
                    }

                    tempObj['element'] = $el;

                    _this.headerHideElements.push(tempObj);
                });

                _this.setOffsetValues(_this.headerHideElements);
            },

            visibleToggle: function (scrollTop) {
                let _this =  this,
                    isHide = false;

                // Toggle hide
                if ( _this.isMainPage ) {
                    isHide = (scrollTop < wHeight - 20);
                    _this.header.toggleClass(_this.headerHideClass, isHide);

                } else {
                    _this.header.removeClass(_this.headerHideClass);
                };

                if ( _this.headerHideElements.length && !isHide) {
                    let isHide = 0,
                        scrollTopWithPadding = scrollTop + _this.headerPaddingTop;
                    
                    _this.headerHideElements.forEach(function(item) {
                        if ( (item['offsetTop'] < scrollTopWithPadding) && (scrollTopWithPadding < item['offsetBottom'] + ( _this.headerPaddingTop - 10 ) ) ) {
                            ++isHide
                        }
                    });


                    _this.header.toggleClass(_this.headerHideOpacityClass, !!isHide);
                    
                };
            },

            darkThemeToggle: function (scrollTop) {
                let _this =  this;

                if ( _this.headerDarkElements.length ) {
                    let isDark = 0,
                        scrollTopWithPadding = scrollTop + _this.headerPaddingTop;
                    
                    _this.headerDarkElements.forEach(function(item) {
                        if ( (item['offsetTop'] < scrollTopWithPadding) && (scrollTopWithPadding < item['offsetBottom'] ) ) {
                            ++isDark
                        }
                    });


                    _this.header.toggleClass(_this.headerThemeLightClass, !!isDark);
                    
                };
            },

            onWindowScroll: function (scrollTop) {
                let _this =  this;

                // Toggle hide
                _this.visibleToggle(scrollTop);

                // Toggle theme on dark elements
                _this.darkThemeToggle(scrollTop);
            },

            init: function() {
                let _this =  this;

                _this.setHeaderDarkElements();

                _this.setHeaderHideElements();

               
                _this.headerPaddingTop = _this.header.outerHeight() - 20;


                $window.on('resize', function() {
                    if ( _this.upadateArrTimeout ) {
                        clearTimeout(_this.upadateArrTimeout);
                    };

                    _this.upadateArrTimeout = setTimeout(function () {
                        _this.headerPaddingTop = _this.header.outerHeight() - 20;

                        _this.setOffsetValues(_this.headerDarkElements);
                        _this.setOffsetValues(_this.headerHideElements);
                        
                        _this.darkThemeToggle( $window.scrollTop() );
                        _this.visibleToggle( $window.scrollTop() );

                    }, 700);

                });
            

                _this.visibleToggle( $window.scrollTop() );
                _this.darkThemeToggle( $window.scrollTop() );


                $window.on('scroll resize', function() {
                    _this.onWindowScroll( $window.scrollTop() );    
                });
            },

            refresh: function() {
                let _this =  this;
                console.log(_this.upadateArrTimeout);

                if ( _this.upadateArrTimeout ) {
                    clearTimeout(_this.upadateArrTimeout);
                };

                _this.headerDarkElements = [];
                _this.headerHideElements = [];

                _this.setHeaderDarkElements();
                _this.setHeaderHideElements();

                _this.darkThemeToggle( $window.scrollTop() );
                _this.visibleToggle( $window.scrollTop() );
            }
        }
    };




    function other() {

        
        $('.s-int__item--not-available .s-int__item-title, .s-int__item--not-available .s-int__item-img-wrap').on('click touch', function(e) {
            e.preventDefault();

            $(this).closest('.s-int__item--not-available').addClass('is-click')
        });

        $('.s-arh__item--not-available .s-arh__item-title, .s-arh__item--not-available .s-arh__item-img-wrap').on('click touch', function(e) {
            e.preventDefault();

            $(this).closest('.s-arh__item--not-available').addClass('is-click')
        });


        $body.on('click touch', '[data-go-link]', function (e) {
            e.preventDefault();
            window.open($(this).data('go-link'));
        });



        $body.on('click touch', '.js-anchor', function (e) {
            let trigger = $(this),
                href = trigger.attr('href'),
                scrollOnMenuBtn = false,
                scrollOnHeaderHide = false,
                scrollSpeed = 800,
                delay = 0;

           
            href = '#' + href.split("#").pop();

            if ( !$(href).length  ) {
                console.log('No find element with this id')
                return
            }

            e.preventDefault();

            let obj = $(e.target);

            if ( obj.closest('.side-nav').length ) {
                delay = 300;
            };

            $sideMenu.close();

            scrollToId(href, delay);    
        });

        function scrollToId(href, delay) {
            let scrollOnMenuBtn = false,
                scrollOnHeaderHide = false,
                scrollSpeed = 800;


            if ( href == '#interior' 
                || href == '#magazines'
            ) {
                scrollOnMenuBtn = true;
            }


            setTimeout(function() {
                scrollTo();
            }, delay)

            function scrollTo() {

                let targetOffset = $(href).offset().top;

                if ( wWidth >= W_MD && scrollOnMenuBtn ) {
                    targetOffset -= $('.side-nav__trigger-icon-line--1').offset().top - $('.header').offset().top;
                } else if (wWidth < W_MD && !scrollOnHeaderHide) {
                    targetOffset -= $('.header').outerHeight();
                }

                try {
                    scrollSpeed = Math.abs($window.scrollTop() - targetOffset) / Math.abs($body[0].scrollHeight) * 4000
                } catch(event) {
                    console.error(event);
                }

                scrollSpeed = ( scrollSpeed < 500 ) ? 500 : scrollSpeed;
         
                $('html, body').animate({ scrollTop: targetOffset }, scrollSpeed);

                location.replace(href);
                
            }
        };

        var $hash = '#' + location.hash.replace('#','');
        
        if ( $hash !== '#' && $($hash).length  ) {
            scrollToId($hash, 0);
        }


        $body.on('click touch', '.js-more-trigger', function (e) {
            let trigger = $(this),
                listEl = $(trigger.data('list')),
                showCount = +trigger.data('show-count'),
                showDelay = 500;

            showCount = (!isNaN(showCount) && ( showCount != 0 )) ? showCount : 3;

            if ( listEl.length ) {
                e.preventDefault();

                trigger.addClass('loading');

                let hideItems = listEl.find('.more-hide-item').slice(0, showCount);

               
                setTimeout(function() {
                   

                    trigger.removeClass('loading').addClass('hidden-opacity');
                }, showDelay);


                setTimeout(function() {
                    hideItems.removeClass('more-hide-item');

                    hideItems.each(function() {
                        let item = $(this);
                        
                        if (item.is('[data-anim]') ) {
                            item.attr('data-anim', false);
                        } 
                        
                        item.find('[data-anim]').attr('data-anim', false);
                       
                    });

                    

                    // trigger.removeClass('hidden-opacity').toggle(listEl.find('.more-hide-item').length !== 0);
                }, showDelay + 300);

                setTimeout(function() {
                    if ( hideItems.eq(0).is('[data-anim]') ) {
                        hideItems.eq(0).attr('data-anim', true);
                    } 

                    hideItems.eq(0).find('[data-anim]').attr('data-anim', true);

                    $header.refresh();
                    $animateOnScroll.refresh();

                    trigger.removeClass('hidden-opacity').toggle(listEl.find('.more-hide-item').length !== 0);
                }, showDelay + 400);

                
            } else {
                console.log('Not find element - ' + trigger.data('list'));
            };
        });

        let callUsFormOpennig = false;

        $body.on('click touch', '.js-call-us-form-toggle', function (e) {
            let trigger = $(this),
                wrap = trigger.closest('.footer__call-us'),
                formWrap = wrap.find('.footer__call-us-form'),
                showDelay = 500;

            e.preventDefault();

            if ( callUsFormOpennig ) {
                return
            }

            callUsFormOpennig = true;

            if ( trigger.hasClass('open') ) {
                trigger.removeClass('open');

                setTimeout(function() {
                    formWrap.slideUp(500, function() {
                        callUsFormOpennig = false;
                    });
                    // trigger.removeClass('loading').addClass('hidden-opacity');
                    // trigger.removeClass('loading');
                }, showDelay + 100);

            } else {
                trigger.addClass('open');

                setTimeout(function() {
                    formWrap.slideDown(500, function() {
                        callUsFormOpennig = false;
                    });
                    // trigger.removeClass('loading').addClass('hidden-opacity');
                    // trigger.removeClass('loading');
                }, showDelay + 100);
            }



            // let hideItems = listEl.find('.more-hide-item').slice(0, showCount);

           
            


            // setTimeout(function() {
            //     hideItems.removeClass('more-hide-item');

            //     hideItems.each(function() {
            //         let item = $(this);
                    
            //         if (item.is('[data-anim]') ) {
            //             item.attr('data-anim', false);
            //         } 
                    
            //         item.find('[data-anim]').attr('data-anim', false);
                   
            //     });

                

            //     // trigger.removeClass('hidden-opacity').toggle(listEl.find('.more-hide-item').length !== 0);
            // }, showDelay + 300);

            // setTimeout(function() {
            //     if ( hideItems.eq(0).is('[data-anim]') ) {
            //         hideItems.eq(0).attr('data-anim', true);
            //     } 

            //     hideItems.eq(0).find('[data-anim]').attr('data-anim', true);

            //     $header.refresh();
            //     $animateOnScroll.refresh();

            //     trigger.removeClass('hidden-opacity').toggle(listEl.find('.more-hide-item').length !== 0);
            // }, showDelay + 400);

        });          
  

        $('.s-magazines__item-img-wrap').matchHeight({ property: 'min-height' });

        $('[data-fancybox]').fancybox({
            vimeo : {
                params : {
                  autoplay : 0
                }
            }
        });
    };



    function formScript () {

        $('[type=tel]').mask('+7 (000) 000-00-00');

        Parsley
            .addValidator('ruPhone', {
                // string | number | integer | date | regexp | boolean
                requirementType: 'string',

                // validateString | validateDate | validateMultiple
                validateString: function (value, requirement) {
                    let regexp = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
                    
                    return  regexp.test(value) 
                },

                messages: {
                    ru: 'Неверный формат номера',
                    en: 'Invalid number format'
                }
            })
            .addValidator('personName', {
                // string | number | integer | date | regexp | boolean
                requirementType: 'string',

                // validateString | validateDate | validateMultiple
                validateString: function (value, requirement) {
                    let regexp = /^[а-яА-ЯёЁa-zA-Z\ ]+$/;

                    return  regexp.test(value) 
                },

                messages: {
                  ru: 'Используйте только буквы',
                  en: 'Use only letters'
                }
            })
            .addMessages('ru', {
                defaultMessage: "Некорректное значение.",
                type: {
                    email:        "Введите правильный е-mail",
                    url:          "Введите URL адрес",
                    number:       "Введите число",
                    integer:      "Введите целое число",
                    digits:       "Введите только цифры",
                    alphanum:     "Введите буквенно-цифровое значение"
                },
                notblank:       "Это поле должно быть заполнено",
                required:       "Заполните это поле",
                pattern:        "Это значение некорректно",
                min:            "Это значение должно быть не менее чем %s",
                max:            "Это значение должно быть не более чем %s",
                range:          "Это значение должно быть от %s до %s",
                minlength:      "Это значение должно содержать не менее %s символов",
                maxlength:      "Это значение должно содержать не более %s символов",
                length:         "Это значение должно содержать от %s до %s символов",
                mincheck:       "Выберите не менее %s значений",
                maxcheck:       "Выберите не более %s значений",
                check:          "Выберите от %s до %s значений",
                equalto:        "Это значение должно совпадать"
            })
            .setLocale(locale);

        $('.js-validate').parsley({

        });


        // $body.on('input', '.input-text input', function() {
        //     let input = $(this),
        //         wrap = input.closest('.input-text');
        
        //     wrap.toggleClass('input-text--dirty', ((input.val() != '') && !input.is(':focus')));
        // });



        $body.on('focusin', '.input-text input, .input-text textarea', function() {
            let input = $(this),
                wrap = input.closest('.input-text');

            wrap.addClass('input-text--dirty');
        });

        $body.on('focusout', '.input-text input, .input-text textarea', function() {
            let input = $(this),
                wrap = input.closest('.input-text');

            wrap.toggleClass('input-text--dirty', input.val() != '');
        });

        $('.input-text input, .input-text textarea').each(function() {
            let input = $(this),
                wrap = input.closest('.input-text');

            wrap.toggleClass('input-text--dirty', input.val() != '')
        });

       
    };

    

    function mobileVhFix() {
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', vh + 'px');

        window.addEventListener('resize', function() {
            // We execute the same script as before
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
        });
    };
    

    function getLocale () {
        let result = 'ru',
            docLang = document.documentElement.lang;

        if ( docLang == 'en' || docLang == 'en-EN' ) {
            result = 'en'
        }

        return result
    };
});

function formResset(form) {
    if ( !form.length ) {
        return
    }

    $('.input-text input, .input-text textarea', form).each(function() {
        let input = $(this),
            wrap = input.closest('.input-text');

        input.val('').trigger('input');


        wrap.toggleClass('input-text--dirty', input.val() != '');
    });

    form.parsley().reset();

};


function formSuccessSent(form) {
    if ( form.length ) {
        form.addClass('form-sent');


        formResset(form);

        if ( form.closest('.popup').length ) {
            form.closest('.popup').addClass('popup--form-sent');
        } else if ( form.closest('.feedback-form').length ) {
            form.closest('.feedback-form').addClass('feedback-form--form-sent');
        }



        setTimeout(function() {
            form.removeClass('form-sent');
            $('.popup').removeClass('popup--form-sent');
            $('.feedback-form').removeClass('feedback-form--form-sent');

            if ($('.fancybox-is-open').length) {
                $.fancybox.close();
            };

        }, 8000);

    }
};


