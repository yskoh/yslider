

var exhEvt = {
  aniMode: 'fade',
  protoToString: Object.prototype.toString,
  slider: {
    // bannerData: [],
    // imgWidth: 0,
    // imgHeight: 0,
    intervalTime: 1000,
    aniTime: 500,
    slideFlag: false,
    billAni: null,
    curIdx: 0,
    width: 0,
    // maxLen: 10,
    length: 0,
    elem: {
      container: {},
      contents: {},
      btn: {
        idxDots: {}
      }
    },
    /**
     * slide 배너 이미지 롤링 효과
     */
    slide: function () {
      var that = this;
      var imgUl = that.elem.contents;
      var orgPt = that.width * -1;

      if (!that.slideFlag) {
        that.slideFlag = true;
        if (exhEvt.aniMode === 'slide') {
          var aniLeft = 0;
          var ends = 0;
          console.log(that.curIdx);
          // 다음의 사진을 보여줄 수 있어야 한다.
          aniLeft = that.width * that.curIdx * -1 + orgPt;
          if (that.curIdx < 0) {
            ends = that.width * that.length * -1;
          } else if (that.curIdx === that.length) {
            ends = orgPt;
          } else {
            ends = aniLeft;
          }
          imgUl.animate({left: aniLeft}, that.aniTime, function () {
            imgUl.css('left', ends);
            that.slideFlag = false;
          });
        } else if (exhEvt.aniMode === 'fade') {
          //fadein,out에 대한 처리
          var bannerImgs = imgUl.find('li[data-type="bannerImg"]');
          if (that.curIdx === this.length) {
            that.curIdx = 0;
          }
          //loop banneImgs- find active , fadeout
          var visibleImg = bannerImgs.filter(':visible');

          visibleImg.fadeOut(that.aniTime);
          bannerImgs.eq(that.curIdx).fadeIn(that.aniTime, function () {
            that.slideFlag = false;
          });
          that.elem.btn.idxDots.removeClass('active').eq(that.curIdx).addClass('active');
        }
      }
    },
    edge: function () {
      if (this.curIdx === this.length) {
        this.curIdx = 0;
        console.log('in len',this.curIdx);
      }
      if (this.curIdx < 0) {
        this.curIdx = this.length - 1;
        console.log('smlthan0', this.curIdx);
      }
    },
    /**
     * slideTo curIdx따라 전, 후의 이미지로 이동
     * @param  {String} direction prev/next 표시
     * @returns {Boolean} slideFlag true/false에 따라 slide 가능 여부
     */
    slideTo: function (direction) {
      // debugger;
      if (this.slideFlag) {
        return false;
      } else {
        switch (direction) {
          case 'next':
            this.curIdx++;
            // if (this.curIdx === this.length) {
            //   this.curIdx = 0;
            // }
            this.slide();
            this.edge();
            break;
          case 'prev':
            this.curIdx--;
            // if (this.curIdx < 0) {
            //   this.curIdx = this.length - 1;
            // }
            this.slide();
            this.edge();
            break;
          default:
            break;
        }
        return true;
      }
    },
    /**
     * cloner 무한 slide 효과 위해 list의 최상단과 끝 노드 복사
     */
    cloner: function () {
      var imgUl = this.elem.contents;
      var imgLi = imgUl.find('li');
      var cloneFirst = imgLi.eq(0).clone();
      var cloneLast = imgLi.eq(imgLi.length - 1).clone();
      imgUl.append(cloneFirst).prepend(cloneLast);
    },
    /**
     * interval interval 걸기
     * @param  {Boolean} flag interval start 또는 stop
     */
    interval: function (flag) {
      if (flag === 'start') {
        this.billAni = window.setInterval(this.billAniIntCallback, this.intervalTime);
      } else {
        if (flag === 'stop') {
          window.clearInterval(this.billAni);
          this.billAni = null;
        }
      }
    },
    /**
     * billAniIntCallback slideTo함수로의 callback 함수
     */
    billAniIntCallback: function () {
      exhEvt.slider.slideTo('next');
    },
    handlers: {
      /**
       * clickHandlers click에 대한 핸들링
       * @param  {event} e event객체
       * @return {Boolean} event bubbling 방지
       */
      clickHandlers: function (e) {
        exhEvt.slider.aniTime = 500;
        // exhEvt.slider.interval('stop');
        var target = $(e.target);
        var dType = target.attr('data-type');
        if (dType === 'next' || dType === 'prev') {
          exhEvt.slider.slideTo(dType);
        } else if (dType === 'pager-link') {
          exhEvt.slider.curIdx = target.index();
          exhEvt.slider.slide();
        } else {
          return true;
        }
        exhEvt.slider.aniTime = 500;
        // exhEvt.slider.interval('start');
        return false;
      },
      /**
       * mouseHandlers mouseenter, mouseleave 대한 핸들링
       * @param  {Object} e event 객체
       */
      mouseHandlers: function (e) {
        if (e.type === 'mouseenter') {
          // exhEvt.slider.interval('stop');
        } else if (e.type === 'mouseleave') {
          // exhEvt.slider.interval('start');
        }
      }
    },
    /**
     * init 배너 이미지 롤링 연관 요소들 init
     * @param  {String} mainStr 롤링 배너 담은 main jQuery selector
     */
    init: function (mainStr) {
      var main = $(mainStr);
      var prevArrow = main.find('a[data-type="prev"]');
      var nextArrow = main.find('a[data-type="next"]');

      this.length = this.elem.contents.find('li[data-type="bannerImg"]').length;
      if (this.length > 0) {
        main.css('display', 'block');
      }
      if (this.length < 3) {
        prevArrow.hide();
        nextArrow.hide();
      }

      this.elem.container = main;
      this.elem.btn.idxDots = main.find('a[data-type="pager-link"]') || [];

      if (exhEvt.aniMode === 'slide') {
        //하나의 너비
        this.width = main.width();
        var orgPt = this.width * -1;
        //클론하고
        this.cloner();
        //넣을 곳의 크기,location
        // this.length = this.elem.contents.find('li[data-type="bannerImg"]').length;
        this.elem.contents.css({width: (this.length + 2) * this.width, left: orgPt});

      } else if (exhEvt.aniMode === 'fade') {
        this.elem.container.css('position', 'relative');
        this.elem.contents.find('li[data-type="bannerImg"]').css({position: 'absolute', top: '0', left: '0', display: 'none'}).eq(0).css('display', 'block');
      }

      //binding
      this.elem.container.bind('click', this.handlers.clickHandlers);
      this.elem.contents.bind('mouseenter mouseleave', this.handlers.mouseHandlers);
      //interval걸고
      // this.interval('start');
    }
  },
  /**
   * setOptOrDefault 옵션 받은 값이나 default 값으로 세팅
   * @param {Object} setObj 세팅 옵션 담은 객체
   */
  setOptOrDefault: function (setObj) {
    this.slider.intervalTime = setObj.time || parseInt($('div[data-type="bannerWrapper"]').attr('data-time')) || this.slider.intervalTime;
    this.aniMode = setObj.bannerAniMode || this.aniMode;
    this.slider.elem.contents = $('div[data-type="bannerWrapper"]').find('ul[data-type="bannerUl"]');
  },
  /**
   * init selectors setting, ajax/php 변수 따라 setting
   * @param  {Object} setObj 세팅 옵션 담은 객체
   */
  init: function (setObj) {
    this.setOptOrDefault(setObj);
    exhEvt.slider.init('div[data-type="bannerWrapper"]');
  }
};
