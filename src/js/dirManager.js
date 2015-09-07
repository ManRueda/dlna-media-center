var fs = require('fs');
var mode = 'media';
$('#media ul').on('click', 'li', function(event){
  var that = $(this);
  if (event.isPropagationStopped())
    return;
  event.stopPropagation();
  if (that.data('opened')){
    that.data('opened', false);
    that.find('ul:first').remove();
  }else{
    getPathChilds(that.data('path'), function(err, children){
      if (children){
        getPathsStats(children, that.data('path') + '/', function(children){
          that.data('opened', true);
          that.append('<ul>');
          addChildren(that.find('ul'), children, that.data('path') + '/');

        });
      }else{
        $('#media ul li.selected').removeClass('selected');
        that.addClass('selected');
        if (mode === 'media'){
          updateLabelMedia(that.data('path'));
        }else{
          updateLabelSub(that.data('path'));
        }
      }
    });
  }
});

$('#btnMode').click(function(){
  mode = 'sub';

  $('#media ul li.selected').removeClass('selected');
});

function updateLabelMedia(path){
  $('#media #mediaLabels > span:first span').text(path);
}

function updateLabelSub(path){
  $('#media #mediaLabels > span:eq(1)').removeClass('hide');
  $('#media #mediaLabels > span:eq(1) span').text(path);
}

reloadTree();

function reloadTree(){
  $('#media ul li').remove();
  fs.readdir('/', function(err, children){
    getPathsStats(children, '/', function(children){
      addChildren($('#media ul'), children, '/');
    });
  });
}

function addChildren(node, children, root){
  for(var i = 0; i < children.length; i++){
    var toBeAppended = $('<li data-path="' + root + children[i].name + '"></li>');
    if (children[i].isFile()){
      toBeAppended.addClass('file');
    }else{
      toBeAppended.addClass('directory');
    }
    toBeAppended.text(children[i].name);
    node.append(toBeAppended);
  }
}


function getPathChilds(path, cb){
  fs.stat(path, function (err, stats) {
    if (stats.isDirectory()){
      fs.readdir(path, cb);
    }else{
      cb();
    }
  });
}


function getPathsStats(files, root, cb){
  var count = 0;

  for(var i = 0; i < files.length; i++){
    fs.stat(root + files[i], function (err, stats) {
      stats.name = files[count];
      files[count] = stats;
      count++;
      if (count === files.length){
        cb(files);
      }
    });
  }

}
