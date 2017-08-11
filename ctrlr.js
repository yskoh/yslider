function Controller(dataObj, id) {
  this.model = new Slider(dataObj, id);
  this.model.setOptions(dataObj);
  this.view = new View(dataObj, this.model);
  this.view.appendSliderFrame(this.model);
  this.view.setElem(dataObj, this.model);
  this.view.init(this.model);
  // this.view.bindEvts();
}

Controller.prototype = {

};
