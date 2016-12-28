define(function () {
  var EDITABLE_PADDING = 24;

  var Statusbar = function (context) {
    var $document = $(document);
    var $statusbar = context.layoutInfo.statusbar;
    var $editable = context.layoutInfo.editable;
    var options = context.options;

    this.initialize = function () {
      if (options.airMode || options.disableResizeEditor) {
        return;
      }

      $statusbar.on('mousedown', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var isCodeview = context.invoke('codeview.isActivated');
        if (isCodeview) {
          var $codable = context.layoutInfo.codable;
          if ($codable.data('cmEditor')) {
            var y = $($codable.data('cmEditor').display.wrapper).offset().top;
          } else {
            var y = $codable.offset().top;
          }
        } else {
          var y = $editable.offset().top;
        }
        var startTop = y - $document.scrollTop();

        $document.on('mousemove', function (event) {
          var height = event.clientY - (startTop + EDITABLE_PADDING);

          height = (options.minheight > 0) ? Math.max(height, options.minheight) : height;
          height = (options.maxHeight > 0) ? Math.min(height, options.maxHeight) : height;
          if (isCodeview) {
            if ($codable.data('cmEditor')) {
              $codable.data('cmEditor').setSize(null, height);
            } else {
              $codable.height(height);
            }
          } else {
            $editable.height(height);
          }
        }).one('mouseup', function () {
          $document.off('mousemove');
        });
      });
    };

    this.destroy = function () {
      $statusbar.off();
      $statusbar.remove();
    };
  };

  return Statusbar;
});
