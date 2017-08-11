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
}

Slider.prototype = {
  setOptions: function (settingsObj) {
    var imgsArr = settingsObj.imgs || [];

    this.imgWidth = parseFloat(settingsObj.bannerImgWidth) || this.imgWidth;
    this.imgHeight = parseFloat(settingsObj.bannerImgHeight) || this.imgHeight;

    this.dotsDisplay = settingsObj.dotsDisplay || this.dotsDisplay;
    this.intervalTime = settingsObj.time || this.intervalTime;
    this.aniMode = settingsObj.bannerAniMode || this.aniMode;
    this.autoPlay = settingsObj.autoPlay || this.autoPlay;
    this.bannerData = imgsArr && (this.protoToString.call(imgsArr) === '[object Array]' && imgsArr.length > 0) ? imgsArr : [];
  }
};
