var RendererFinder = require('renderer-finder');
var dlnaCast = require('dlnacast');

var finder = new RendererFinder();
finder.on('found', function(info, msg, desc){
  if ($('#Renderers ul li[data-renderLocation="' + msg.Location + '"]').length > 0){
    return;
  }
  var render = $('<li>').attr('data-renderLocation', msg.Location);
  render.append($('<h2>').text(desc.device.friendlyName));
  render.append($('<h3>').text(msg.Location));
  $('#Renderers ul').append(render);

});

$('#Renderers ul').on('click', 'li', function(){
  $(this).siblings('li').removeClass('selected');
  $(this).addClass('selected');
});

$('#btnPlay').click(function(){
  var sub = $('#media #mediaLabels > span:eq(1) span').text();
  dlnaCast.renderMedia(
    $('#media #mediaLabels > span:first span').text(),
    null,
    $('#Renderers ul.selected').data('data-renderLocation'),
    sub && sub.length > 0 ? sub : null
  );
});

finder.start(true);
