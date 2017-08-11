function View(settingData, model) {
  this.elem = {
    location: $('body'),
    container: {},
    contents: {},
    btn: {
      idxDots: {}
    }
  };
  // this.appendSliderFrame(model);
  // this.setElem(settingData, model);
  // this.init(model);
}

View.prototype = {
  setElem: function (settingsObj, model) {
    this.elem.container = $('div[data-type="sliderWrapper' + model.id + '"]');
    this.elem.contents = this.elem.container.find('ul[data-type="bannerUl"]');
    //??location 하나 잡기 위해 settingData를 보내고 있음.. 근데  이건 뷰와 과련된 속성이니까 이쪽에 하는게 맞지 않나? 아니면 이것도 모델로??
    this.elem.location = settingsObj.location && settingsObj.location.length > 0 ? settingsObj.location : this.elem.location;
    this.elem.container.css('width', model.imgWidth);
    this.elem.container.css('height', model.imgHeight);
    this.elem.contents.find('li[data-type="bannerImg"]').css('width', model.imgWidth);
    this.elem.container.css('width', model.imgWidth);
    this.elem.contents.find('li[data-type="bannerImg"]').css('height', model.imgHeight);
  },
  init: function (model) {
    this.appendToDom(model);
    this.setSliderModeDom(model);
  },
  appendSliderFrame: function (model) {
    var appendStr = '<div class="banner-slider" data-type="sliderWrapper' + model.id + '">'
                    + '<ul class="banner-li" data-type="bannerUl">'
                    + '</ul>'
                    + '</div>';
    this.elem.location.append(appendStr);
  },
  appendToDom: function (model) {
    this.appendImgs(model);
    this.appendDots(model);
    this.appendBtns(model);
  },
  appendDots: function (model) {
    var $container = this.elem.container;
    var appendStr = '<div class="wrap-pager">'
                    + '<a href="" class="pager active" data-type="pager">1</a>';
    for (var i = 1, loop = model.bannerData.length; i < loop; i++) {
      appendStr += '<a href="" class="pager" data-type="pager">' + (i + 1) + '</a>';
    }
    appendStr += '</div>';
    $container.append(appendStr);
    this.elem.btn.idxDots = $container.find('a[data-type="pager"]');
    if (!model.dotsDisplay) {
      $container.find('a[data-type="pager"]').hide();
    }
  },
  appendBtns: function (model) {
    if (model.bannerData.length > 2) {
      var appendStr = '<button type="button" class="arrow-btn prev" data-type="prev" ></button>'
                      + '<button type="button" class="arrow-btn next" data-type="next"></button>';
      this.elem.container.append(appendStr);
    }
  },
  appendImgs: function (model) {
    var rollBanner = model.bannerData;
    var appendStr = '';
    var widthHeightStr = '';
    var width = model.imgWidth;
    var height = model.imgHeight;
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
  setSliderModeDom: function (model) {
    var $container = this.elem.container;
    var $contentsUl = this.elem.contents;
    model.sliderLength = $contentsUl.find('li[data-type="bannerImg"]').length;
    switch (model.aniMode) {
      case 'slide':
        model.containerWidth = $container.width();
        var orgPt = -model.containerWidth;
        this.cloner();
        $contentsUl.css({width: (model.sliderLength + 2) * model.containerWidth, left: orgPt});
        break;
      case 'fade':
        $container.css('position', 'relative');
        $contentsUl.find('li[data-type="bannerImg"]').css({position: 'absolute', top: '0', left: '0', display: 'none'}).eq(0).css('display', 'block');
        break;
      default:
        break;
    }
    this.bindEvts(model);
  },
  cloner: function () {
    var imgUl = this.elem.contents;
    var imgLi = imgUl.find('li');
    var cloneFirst = imgLi.eq(0).clone();
    var cloneLast = imgLi.eq(imgLi.length - 1).clone();
    imgUl.append(cloneFirst).prepend(cloneLast);
  },
  slide: function (model) {
    var that = this;
    var imgUl = that.elem.contents;
    var orgPt = model.containerWidth * -1;
    if (!model.slideFlag) {
      model.slideFlag = true;
      switch (model.aniMode) {
        case 'slide':
          var aniLeft = 0;
          var ends = 0;
          aniLeft = model.containerWidth * model.curIdx * -1 + orgPt;
          if (model.curIdx < 0) {
            ends = model.containerWidth * model.sliderLength * -1;
          } else if (model.curIdx === model.sliderLength) {
            ends = orgPt;
          } else {
            ends = aniLeft;
          }
          imgUl.animate({left: aniLeft}, model.aniTime, function () {
            imgUl.css('left', ends);
            model.slideFlag = false;
          });
          break;
        case 'fade':
          var bannerImgs = imgUl.find('li[data-type="bannerImg"]');
          if (model.curIdx === model.sliderLength) {
            model.curIdx = 0;
          }
          var visibleImg = bannerImgs.filter(':visible');

          visibleImg.fadeOut(model.aniTime);
          bannerImgs.eq(model.curIdx).fadeIn(model.aniTime, function () {
            model.slideFlag = false;
          });
          break;
        default:
          break;
      }
      this.edge(model);
      this.elem.btn.idxDots.removeClass('active').eq(model.curIdx).addClass('active');
    }
  },
  edge: function (model) {
    if (model.curIdx === model.sliderLength) {
      // debugger;
      model.curIdx = 0;
    }
    if (model.curIdx < 0) {
      // debugger;
      model.curIdx = model.sliderLength - 1;
    }
  },
  slideTo: function (direction, model) {
    if (model.slideFlag) {
      return false;
    } else {
      switch (direction) {
        case 'next':
          model.curIdx++;
          this.slide(model);
          break;
        case 'prev':
          model.curIdx--;
          this.slide(model);
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
  interval: function (flag, model) {
    if (flag === 'start') {
      model.playSlider = window.setInterval(this.playSliderCallback.bind(this, model), model.intervalTime);
    } else if (flag === 'stop') {
      window.clearInterval(model.playSlider);
      model.playSlider = null;
    }
  },
  playSliderCallback: function (model) {
    this.slideTo('next', model);
  },
  handlers: {
    clickHandlers: function (model, e) {
      // debugger;
      if (model.autoPlay) {
        this.interval('stop', model);
      }
      var target = $(e.target);
      var dType = target.attr('data-type');
      if (dType === 'next' || dType === 'prev') {
        this.slideTo(dType, model);
      } else if (dType === 'pager') {
        model.curIdx = target.index();
        this.slide(model);
      } else {
        return true;
      }
      model.aniTime = 500;
      if (model.autoPlay) {
        this.interval('start', model);
      }
      return false;
    },
    mouseHandlers: function (model, e) {
      if (e.type === 'mouseenter') {
        this.interval('stop', model);
        return false;
      } else if (e.type === 'mouseleave') {
        this.interval('start', model);
        return true;
      }
    }
  },
  bindEvts: function (model) {
    this.elem.container.bind('click', this.handlers.clickHandlers.bind(this, model));
    if (model.autoPlay) {
      this.elem.contents.bind('mouseenter mouseleave', this.handlers.mouseHandlers.bind(this, model));
      this.interval('start', model);
    }
  }
};
