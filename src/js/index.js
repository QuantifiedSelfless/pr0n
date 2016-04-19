/*eslint no-console: "off"*/

let $       = require('jquery'),
    filter  = require('lodash.filter'),
    defer   = require('lodash.defer'),
    data    = require('./data/data'),
    helpers = require('./helpers/helpers');

helpers.initSocket();

$(function() {
  let $main               = $('#main'),
      $displayArea        = $main.find('#display-area'),
      $imageArea          = $main.find('#image-area'),
      $imageAreaContainer = $main.find('#image-area-container'),
      processing          = false,
      count               = 0;

  let getSample = function getSample() {
    processing = true;
    let url = `${data.api.root}/sample?rfid=${data.rfid}`;
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

  $main.on('click', '.button', function() {
    if (processing) return null;
    processing = true;

    let pref = $(this).attr('data-value');
    let id = $imageArea.attr('data-id');
    let url = `${data.api.root}/preference?`+
                `rfid=${data.rfid}&`+ 
                `id=${id}&`+ 
                `preference=${pref}`;
    let promise = $.get(url);

    promise.then(function() {
      count += 1;
      return (count > 5 && (count % 5 === 0)) ? loadDecisionModal() : getSample();
    }, function(err) {
      alert('There\'s been an error on preference GET.');
      console.log(err);
      processing = false;
    });
  });

  let endPage = function() {
    let url = `${data.api.root}/results?rfid=${data.rfid}`;
    let promise = $.get(url);
    promise.then(data => {
      let list = filter(data.data, friend => friend.score > 0).slice(0, 8);
      $imageArea.remove();
      $displayArea.html(helpers.getDisplayAreaEndHTML(list));
      defer(() => $main.addClass('finished'));
    }, err => {
      alert('There\'s been an error on results GET.');
      console.log(err);
      processing = false;
    });
  };

  let loadDecisionModal = function() {
    $imageArea.remove();
    $imageAreaContainer.html(
`<div id="maybe-continue">
<p>Want to see who you're most attracted to now? &#9654;</p>
<h2>OR</h2>
<p>Keep going and help us learn your desires better? &#9664;</p>
</div>`
    );
    let leftEvent = () => {
      removeEvents();
      $imageAreaContainer.empty();
      $imageAreaContainer.append($imageArea = $('<img id="image-area">'));
      getSample();
      return null;
    };
    let rightEvent = () => {
      removeEvents();
      $imageAreaContainer.empty();
      $imageAreaContainer.append($imageArea = $('<img id="image-area">'));
      endPage();
      return null;
    };
    let removeEvents = () => {
      $main.off('click', '#right-button', rightEvent);
      $main.off('click', '#left-button', leftEvent);
    };
    $main.on('click', '#right-button', rightEvent);
    $main.on('click', '#left-button', leftEvent);
  };
});
