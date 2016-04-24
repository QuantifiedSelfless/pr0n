/*eslint no-console: "off"*/
const RESET_TIMEOUT = 20000000;

let $       = require('jquery'),
    data    = require('./data/data'),
    defer   = require('lodash.defer'),
    filter  = require('lodash.filter'),
    helpers = require('./helpers/helpers');

helpers.initSocket();

$(function() {
  let $main               = $('#main'),
      $displayArea        = $main.find('#display-area'),
      $imageArea          = $main.find('#image-area'),
      $imageAreaContainer = $main.find('#image-area-container'),
      count               = 0;

  let getSample = function getSample() {
    let url = `${data.api.root}/sample?rfid=${data.rfid}`;
    helpers.fetchQSPayload(url, payload => {
      $imageArea.attr('src', payload.data.url);
      $imageArea.attr('data-id', payload.data.id);
      if (!(payload.data && payload.data.url)) return endPage();
    });
  };

  getSample();

  $main.on('click', '.button', function() {
    let pref = $(this).attr('data-value');
    let id = $imageArea.attr('data-id');
    let url = `${data.api.root}/preference?`+
                `rfid=${data.rfid}&`+ 
                `id=${id}&`+ 
                `preference=${pref}`;
    helpers.fetchQSPayload(url, () => {
      count += 1;
      return (count > 5 && (count % 5 === 0)) ? loadDecisionModal() : getSample();
    });
  });

  let endPage = function() {
    let url = `${data.api.root}/results?rfid=${data.rfid}`;
    helpers.fetchQSPayload(url, payload => {
      let list = filter(payload.data, friend => friend.score > 0).slice(0, 8);
      $imageArea.remove();
      $displayArea.html(helpers.getDisplayAreaEndHTML(list));
      defer(() => $main.addClass('finished'));
      setTimeout(() => helpers.redirectToLogin, RESET_TIMEOUT);
    });
  };

  let loadDecisionModal = function() {
    $imageArea.remove();
    $imageAreaContainer.html(
`<div id="maybe-continue">
<p>Compute your sexual appetite summary now<span id="right-continue-arrow" class="arrow">&#9654;</span></p>
<h2>or</h2>
<p><span id="left-continue-arrow" class="arrow">&#9664;</span>Keep helping DesignCraft learn about your desires</p>
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
