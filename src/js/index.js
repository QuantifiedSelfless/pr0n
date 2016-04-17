/*eslint no-console: "off"*/

let $       = require('jquery'),
    _       = require('lodash'),
    data    = require('./data/data'),
    helpers = require('./helpers/helpers');

helpers.initSocket();

$(function() {
  let processing = false;
  let count = 0;

  let $main = $('#main');
  let $imageArea = $main.find('#image-area');

  let getSample = function getSample() {
    processing = true;
    let url = `${data.api.root}/sample?userid=${data.userid}`;
    let promise = $.get(url);

    promise.then(
      data => {
        $imageArea.attr('src', data.data.url);
        $imageArea.attr('data-id', data.data.id);
        if (!(data.data && data.data.url)) return endPage();
        processing = false;
      },
      err => {
        alert('There\'s been an error on sample GET.');
        console.log(err);
        processing = false;
      }
    );
  };

  getSample();

  $('#main').on('click', '.button', function() {
    if (processing) return null;
    processing = true;

    let pref = $(this).attr('data-value');
    let id = $imageArea.attr('data-id');
    let url = `${data.api.root}/preference?`+
                `userid=${data.userid}&`+ 
                `id=${id}&`+ 
                `preference=${pref}`;
    let promise = $.get(url);

    promise.then(function() {
      count += 1;
      return count >= 5 ? endPage() : getSample();
    }, function(err) {
      alert('There\'s been an error on preference GET.');
      console.log(err);
      processing = false;
    });
  });

  let endPage = function() {
    let url = `${data.api.root}/results?userid=${data.userid}`;
    let promise = $.get(url);
    promise.then(data => {
      let list = _.filter(data.data, friend => friend.score > 0);
      let $displayArea = $main.find('#display-area');
      $imageArea.remove();
      $displayArea.html(helpers.getDisplayAreaEndHTML(list));
      _.defer(() => $main.addClass('finished'));
    }, err => {
      alert('There\'s been an error on results GET.');
      console.log(err);
      processing = false;
    });
  };
});
