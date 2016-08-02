(function($) {
	$.fn.popupTooltip = function(side, text) {
		var $_elm = $(this);
			$_elm.css('position', 'relative');
			if ($_elm.is('span')) $_elm.css('display', 'inbline-block');

		var $_popup = $('<div>')
				.addClass('popupTooltip')
				.addClass('side-'+side)
				.text(text)
				.hide()
				.bind('click', function () {
					return false;
				});

		var $_close = $('<span>')
					.addClass('popupTooltip-close')
					.bind('click', function () {
					    closePopup()
					    return false;
					});

		$_popup.append($_close);
		$_elm.append($_popup);

		$_popup.fadeIn(600);

		if (side == 'right' || side == 'left') {
			$_popup.css('margin-top', $_popup.outerHeight()/2*(-1) );
		}

		var timeout = setTimeout(closePopup, 10000);

		function closePopup() {
			$_popup.fadeOut(600, function() {
				$_popup.remove();
			});
		}

		$_elm.on('hide', function() {
			closePopup();
		})

	};
})(jQuery);