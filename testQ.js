QUnit.test('should append imgs', function (assert) {
  var result = $('ul[data-type="bannerUl"]').find('li').length - 2;
  var imgArrLen = dataObj.imgs.length;
  assert.ok(result === imgArrLen, 'passed');
});

QUnit.test('should append dots', function (assert) {
  var result = $('div[data-type="bannerWrapper"]').find('a[data-type="pager-link"]').length;
  var imgArrLen = dataObj.imgs.length;
  assert.ok(result === imgArrLen, 'dots append well');
});

QUnit.test('should append buttons', function (assert) {
  var result = function () {
    if ($('.btn-prev') && $('.btn-next')) {
      return true;
    } else {
      return false;
    }
  };

  assert.ok(result() === true, 'buttons appended well');
});

//????
QUnit.test('slider stop on mouseover', function (assert) {
  $('div[data-type="bannerWrapper"]').find('ul[data-type="bannerUl"]').trigger('mouseenter');
  assert.equal(Slider.playSlider, null, 'stopped');
});

QUnit.test('slider stop on mouseleave', function (assert) {
  $('div[data-type="bannerWrapper"]').find('ul[data-type="bannerUl"]').trigger('mouseleave');
  assert.equal(Boolean(Slider.playSlider), isFinite(Slider.playSlider), 'good');
});

QUnit.test('move to next slide on click next', function (assert) {
  $('.btn-next').trigger('click');
  assert.equal(Slider.curIdx, 1, 'nextpressed');
});
