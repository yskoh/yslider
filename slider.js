

var Slider = {
  aniMode: 'fade',
  protoToString: Object.prototype.toString,
  bannerData: [],
  imgWidth: 0,
  imgHeight: 0,
  intervalTime: 1000,
  aniTime: 500,
  dotDisplay: true,
  autoplay: true,
  slideFlag: false,
  billAni: null,
  curIdx: 0,
  width: 0,
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
      if (that.aniMode === 'slide') {
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
      } else if (that.aniMode === 'fade') {
        //fadein,out에 대한 처리
        var bannerImgs = imgUl.find('li[data-type="bannerImg"]');
        //TODO 이 배열의 랭스
        if (that.curIdx === this.length) {
          that.curIdx = 0;
        }
        //loop banneImgs- find active , fadeout
        var visibleImg = bannerImgs.filter(':visible');

        visibleImg.fadeOut(that.aniTime);
        bannerImgs.eq(that.curIdx).fadeIn(that.aniTime, function () {
          that.slideFlag = false;
        });
      }
      // debugger;
      this.edge();
      this.elem.btn.idxDots.removeClass('active').eq(this.curIdx).addClass('active');
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
          // this.edge();
          break;
        case 'prev':
          this.curIdx--;
          // if (this.curIdx < 0) {
          //   this.curIdx = this.length - 1;
          // }
          this.slide();
          // this.edge();
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
    this.slideTo('next');
  },
  handlers: {
    /**
     * clickHandlers click에 대한 핸들링
     * @param  {event} e event객체
     * @return {Boolean} event bubbling 방지
     */
    clickHandlers: function (e) {
      this.aniTime = 500;
      this.interval('stop');
      var target = $(e.target);
      var dType = target.attr('data-type');
      if (dType === 'next' || dType === 'prev') {
        this.slideTo(dType);
      } else if (dType === 'pager-link') {
        this.curIdx = target.index();
        this.slide();
      } else {
        return true;
      }
      this.aniTime = 500;
      this.interval('start');
      return false;
    },
    /**
     * mouseHandlers mouseenter, mouseleave 대한 핸들링
     * @param  {Object} e event 객체
     */
    mouseHandlers: function (e) {
      if (e.type === 'mouseenter') {
        this.interval('stop');
      } else if (e.type === 'mouseleave') {
        this.interval('start');
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

    if (this.aniMode === 'slide') {
      //하나의 너비
      this.width = main.width();
      var orgPt = this.width * -1;
      //클론하고
      this.cloner();
      //넣을 곳의 크기,location
      this.elem.contents.css({width: (this.length + 2) * this.width, left: orgPt});

    } else if (this.aniMode === 'fade') {
      this.elem.container.css('position', 'relative');
      this.elem.contents.find('li[data-type="bannerImg"]').css({position: 'absolute', top: '0', left: '0', display: 'none'}).eq(0).css('display', 'block');
    }

    //binding
    this.elem.container.bind('click', this.handlers.clickHandlers);
    this.elem.contents.bind('mouseenter mouseleave', this.handlers.mouseHandlers);
    //interval걸고
    // debugger;
    if (this.autoplay) {
      this.interval('start');
    }
  },
// },
  /**
   * appendToDom dom에 해당 배열 내용을 붙이고 callback함수 실행
   * @param  {Array} rollBanner  롤링 배너 이미지 담은 배열
   * @param  {Object} $appendToUl 이미지들 담을 jQuery selector
   * @param  {Number} width   append할 이미지의 너비
   * @param  {Number} height  append할 이미지의 높이
   * @param  {Object} clbk    append 후 실행할 callback function
   */
  appendToDom: function (rollBanner, $appendToUl, width, height) {
    this.appendImgs(rollBanner, $appendToUl, width, height);
    if (this.dotDisplay) {
      this.appendDots(this.bannerData);
    }
    this.init('div[data-type="bannerWrapper"]');
  },
  /**
   * appendDots 이미지 나타내는 dots a로  append
   * @param  {Array} rollBanner 롤링 배너 이미지 담은 배열
   */
  appendDots: function (rollBanner) {
    var appendStr = '<a href="" class="pager-link active" data-type="pager-link">1</a>';
    for (var i = 1, loop = rollBanner.length; i < loop; i++) {
      appendStr += '<a href="" class="pager-link" data-type="pager-link">' + (i + 1) + '</a>';
    }
    $('.wrap-pager').html(appendStr);
  },
  /**
   * appendImgs 이미지들 dom에 li로 append
   * @param  {Array} rollBanner  롤링 배너 이미지 담은 배열
   * @param  {Object} $appendToUl 이미지들 담을 jQuery selector
   * @param  {Number} width   append할 이미지의 너비
   * @param  {Number} height  append할 이미지의 높이
   */
  appendImgs: function (rollBanner, $appendToUl, width, height) {
    var appendStr = '';
    var widthHeightStr = '';
    //size 명시되어 있지 않으면 원래 이미지 사이즈로 보이게
    if (width > 0) {
      widthHeightStr += ' width="' + width + '"';
    }
    if (height > 0) {
      widthHeightStr += ' height="' + height + '"';
    }

    for (var i = 0, loop = rollBanner.length; i < loop; i++) {
      appendStr += '<li data-type="bannerImg"><a href ="' + rollBanner[i].linkUrl + '" target="_blank"><img src= "' + rollBanner[i].imgUrl + widthHeightStr + '"></img></a></li>';
    }
    $appendToUl.append(appendStr);
  },
  /**
   * checkToAppend data 처음에 append할지 lazy load로 loading할지 대한 함수
   * @param  {Boolean} lazyLoadBool lazy load 설정 유/무
   */
  checkToAppend: function () {
    //TODO div 있는지 확인
    this.appendToDom(this.bannerData, this.elem.contents, this.imgWidth, this.imgHeight);
  },
  /**
   * initialData 처음 data 세팅 위한 체크, 준비
   * @param  {Object} bannerImgs dom에 append할 data
   */
  initialData: function (bannerImgs) {
    //데이터 안 왔을 경우, 왔는데 배열의 형태가 아닌 경우 {}같은,
    if (bannerImgs) {
      if (this.protoToString.call(bannerImgs) === '[object Array]') {
        //TODO length이 0이상인지, 온 값이 {'',''}의 형태인지
        this.bannerData = bannerImgs;
      }
    } else {
      return;
    }
  },
  /**
   * setOptOrDefault 옵션 받은 값이나 default 값으로 세팅
   * @param {Object} setObj 세팅 옵션 담은 객체
   */
  setOptOrDefault: function (setObj) {
    this.elem.contents = $('div[data-type="bannerWrapper"]').find('ul[data-type="bannerUl"]');
    this.imgWidth = parseFloat(setObj.bannerImgWidth) || this.imgWidth;
    this.imgHeight = parseFloat(setObj.bannerImgHeight) || this.imgHeight;
    this.dotDisplay = setObj.dotDisplay ? this.dotDisplay : setObj.dotDisplay;
    this.intervalTime = setObj.time || parseInt($('div[data-type="bannerWrapper"]').attr('data-time')) || this.intervalTime;
    this.aniMode = setObj.bannerAniMode || this.aniMode;
    this.autoplay = setObj.autoplay ? this.autoplay : setObj.autoplay;
  },
  /**
   * init selectors setting, ajax/php 변수 따라 setting
   * @param  {Object} setObj 세팅 옵션 담은 객체
   */
  init: function (setObj) {
    // debugger;
    this.setOptOrDefault(setObj);
    this.initialData(setObj.imgs);
    this.checkToAppend(this.bannerData, this.elem.contents, this.imgWidth, this.imgHeight);
    // exhEvt.slider.init('div[data-type="bannerWrapper"]');
  }
};
