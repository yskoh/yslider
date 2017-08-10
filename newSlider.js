function Slider(settingData, id) {
  this.id = id;
  this.aniMode = 'fade';
  this.protoToString = Object.prototype.toString;
  this.bannerData = [];
  this.imgWidth = 0;
  this.imgHeight = 0;
  this.intervalTime = 1000;
  this.dotsDisplay = false;
  this.autoPlay = false;
  //below are keys that cannot be set externally
  this.aniTime = 500;
  this.slideFlag = false;
  this.sliderLength = 0;
  this.playSlider = null;
  this.curIdx = 0;
  this.containerWidth = 0;
  this.elem = {
    location: $('body'),
    container: {},
    contents: {},
    btn: {
      idxDots: {}
    }
  };
  this.init(settingData);
}

Slider.prototype = {
  slide: function () {
    var that = this;
    var imgUl = that.elem.contents;
    var orgPt = that.containerWidth * -1;
    if (!that.slideFlag) {
      that.slideFlag = true;
      switch (that.aniMode) {
        case 'slide':
          var aniLeft = 0;
          var ends = 0;
          aniLeft = that.containerWidth * that.curIdx * -1 + orgPt;
          if (that.curIdx < 0) {
            ends = that.containerWidth * that.sliderLength * -1;
          } else if (that.curIdx === that.sliderLength) {
            ends = orgPt;
          } else {
            ends = aniLeft;
          }
          imgUl.animate({left: aniLeft}, that.aniTime, function () {
            imgUl.css('left', ends);
            that.slideFlag = false;
          });
          break;
        case 'fade':
          var bannerImgs = imgUl.find('li[data-type="bannerImg"]');
          if (that.curIdx === this.sliderLength) {
            that.curIdx = 0;
          }
          var visibleImg = bannerImgs.filter(':visible');

          visibleImg.fadeOut(that.aniTime);
          bannerImgs.eq(that.curIdx).fadeIn(that.aniTime, function () {
            that.slideFlag = false;
          });
          break;
        default:
          break;
      }
      this.edge();
      this.elem.btn.idxDots.removeClass('active').eq(this.curIdx).addClass('active');
    }
  },
  edge: function () {
    if (this.curIdx === this.sliderLength) {
      this.curIdx = 0;
    }
    if (this.curIdx < 0) {
      this.curIdx = this.sliderLength - 1;
    }
  },
  slideTo: function (direction) {
    if (this.slideFlag) {
      return false;
    } else {
      switch (direction) {
        case 'next':
          this.curIdx++;
          this.slide();
          break;
        case 'prev':
          this.curIdx--;
          this.slide();
          break;
        default:
          break;
      }
      return true;
    }
  },
  cloner: function () {
    var imgUl = this.elem.contents;
    var imgLi = imgUl.find('li');
    var cloneFirst = imgLi.eq(0).clone();
    var cloneLast = imgLi.eq(imgLi.length - 1).clone();
    imgUl.append(cloneFirst).prepend(cloneLast);
  },
  interval: function (flag) {
    if (flag === 'start') {
      this.playSlider = window.setInterval(this.playSliderCallback.bind(this), this.intervalTime);
    } else if (flag === 'stop') {
      window.clearInterval(this.playSlider);
      this.playSlider = null;
    }
  },
  playSliderCallback: function () {
    this.slideTo('next');
  },
  handlers: {
    clickHandlers: function (e) {
      if (this.autoplay) {
        this.interval('stop');
      }
      var target = $(e.target);
      var dType = target.attr('data-type');
      if (dType === 'next' || dType === 'prev') {
        this.slideTo(dType);
      } else if (dType === 'pager') {
        this.curIdx = target.index();
        this.slide();
      } else {
        return true;
      }
      this.aniTime = 500;
      if (this.autoplay) {
        this.interval('start');
      }
      return false;
    },
    mouseHandlers: function (e) {
      if (e.type === 'mouseenter') {
        this.interval('stop');
        return false;
      } else if (e.type === 'mouseleave') {
        this.interval('start');
        return true;
      }
    }
  },
  bindEvts: function () {
    this.elem.container.bind('click', this.handlers.clickHandlers.bind(this));
    if (this.autoPlay) {
      this.elem.contents.bind('mouseenter mouseleave', this.handlers.mouseHandlers.bind(this));
      this.interval('start');
    }
  },
  setSliderModeDom: function () {
    var $container = this.elem.container;
    var $contentsUl = this.elem.contents;
    this.sliderLength = $contentsUl.find('li[data-type="bannerImg"]').length;
    switch (this.aniMode) {
      case 'slide':
        this.containerWidth = $container.width();
        var orgPt = -this.containerWidth;
        this.cloner();
        $contentsUl.css({width: (this.sliderLength + 2) * this.containerWidth, left: orgPt});
        break;
      case 'fade':
        $container.css('position', 'relative');
        $contentsUl.find('li[data-type="bannerImg"]').css({position: 'absolute', top: '0', left: '0', display: 'none'}).eq(0).css('display', 'block');
        break;
      default:
        break;
    }
    this.bindEvts();

  },
  appendDots: function () {
    var $container = this.elem.container;
    var appendStr = '<div class="wrap-pager">'
                    + '<a href="" class="pager active" data-type="pager">1</a>';
    for (var i = 1, loop = this.bannerData.length; i < loop; i++) {
      appendStr += '<a href="" class="pager" data-type="pager">' + (i + 1) + '</a>';
    }
    appendStr += '</div>';
    $container.append(appendStr);
    this.elem.btn.idxDots = $container.find('a[data-type="pager"]');
    if (!this.dotsDisplay) {
      $container.find('a[data-type="pager"]').hide();
    }
  },
  appendBtns: function () {
    if (this.bannerData.length > 2) {
      var appendStr = '<button type="button" class="arrow-btn prev" data-type="prev" ></button>'
                      + '<button type="button" class="arrow-btn next" data-type="next"></button>';
      this.elem.container.append(appendStr);
    }
  },
  appendImgs: function () {
    var rollBanner = this.bannerData;
    var appendStr = '';
    var widthHeightStr = '';
    var width = this.imgWidth;
    var height = this.imgHeight;
    if (width > 0) {
      widthHeightStr += ' width="' + width + '"';
    }
    if (height > 0) {
      widthHeightStr += ' height="' + height + '"';
    }
    for (var i = 0, loop = rollBanner.length; i < loop; i++) {
      appendStr += '<li data-type="bannerImg">'
                    + '<a href ="' + rollBanner[i].linkUrl + '" target="_blank">'
                    + '<img src= "' + rollBanner[i].imgUrl + widthHeightStr + '"></img>'
                    + '</a>'
                    + '</li>';
    }
    this.elem.contents.append(appendStr);
  },
  appendSliderFrame: function () {
    var appendStr = '<div class="banner-slider" data-type="sliderWrapper' + this.id + '">'
                    + '<ul class="banner-li" data-type="bannerUl">'
                    + '</ul>'
                    + '</div>';
    this.elem.location.append(appendStr);
  },
  appendToDom: function () {
    this.appendImgs();
    this.appendDots();
    this.appendBtns();
  },
  setOptions: function (settingsObj) {
    var imgsArr = settingsObj.imgs || [];
    this.elem.container = $('div[data-type="sliderWrapper' + this.id + '"]');
    this.elem.contents = this.elem.container.find('ul[data-type="bannerUl"]');
    this.imgWidth = parseFloat(settingsObj.bannerImgWidth) || this.imgWidth;
    this.imgHeight = parseFloat(settingsObj.bannerImgHeight) || this.imgHeight;
    this.elem.location = settingsObj.location && settingsObj.location.length > 0 ? settingsObj.location : this.elem.location;
    this.elem.container.css('width', this.imgWidth);
    this.elem.container.css('height', this.imgHeight);
    this.elem.contents.find('li[data-type="bannerImg"]').css('width', this.imgWidth);
    this.elem.container.css('width', this.imgWidth);
    this.elem.contents.find('li[data-type="bannerImg"]').css('height', this.imgHeight);
    this.dotsDisplay = settingsObj.dotsDisplay || this.dotsDisplay;
    this.intervalTime = settingsObj.time || this.intervalTime;
    this.aniMode = settingsObj.bannerAniMode || this.aniMode;
    this.autoPlay = settingsObj.autoPlay || this.autoPlay;
    this.bannerData = imgsArr && (this.protoToString.call(imgsArr) === '[object Array]' && imgsArr.length > 0) ? imgsArr : [];
  },
  init: function (dataObj) {
    this.appendSliderFrame();
    this.setOptions(dataObj);
    this.appendToDom();
    this.setSliderModeDom();
  }
};
