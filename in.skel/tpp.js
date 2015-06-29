/* Author: Romain "Artefact2" Dal Maso <artefact2@gmail.com>
 *
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

$(function() {
	$("ul#photos > li").each(function() {
		var li = $(this);
		var href = li.data('img-href');

		var a = $(document.createElement('a'));
		var img = $(document.createElement('img'));

		a.prop('href', href);
		
		img.prop('src', href.replace(/\.bpg$/, ".thumb.bpg"));
		img.prop('alt', href);
		
		a.append(img);
		li.append(a);

		li.css('transform', 'rotate(' + (16*Math.random() - 8) + 'deg) translateX(' + (32*Math.random() - 16) + 'px) translateY(' + (32*Math.random() - 16) + 'px)');
	});

	var undofull = function() {
		$("ul#photos > li.current").removeClass('current');
		$("div#fullview").remove();
	};

	$("ul#photos > li > a").on('click', function(e) {
		var a = $(this);
		var li = a.parent();
		a.blur();

		li.parent().children('li.loading').addClass('cancel');
		li.addClass('loading');

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var img = new BPGDecoder(ctx);

		img.onload = function() {
			li.removeClass('loading');
			
			if(li.hasClass('cancel')) {
				li.removeClass('cancel');
				return;
			}
			
			undofull();
			li.addClass('current');

			var div = $(document.createElement('div'));
			div.prop('id', 'fullview');
			div.on('click', undofull);

			$(canvas)
				.prop('width', this.imageData.width)
				.prop('height', this.imageData.height)
			;
			ctx.putImageData(this.imageData, 0, 0);

			div.append(canvas);
			$("body").append(div);
		};

		img.load(a.prop('href'));
		e.preventDefault();
	});
	
	Mousetrap.bind('escape', undofull);
	Mousetrap.bind([ 'left', 'p', '<', 'pageup' ], function() {
		$("ul#photos > li.current").prev().children('a').click();
	});
	Mousetrap.bind([ 'right', 'n', '>', 'pagedown', 'space' ], function() {
		$("ul#photos > li.current").next().children('a').click();
	});
	Mousetrap.bind('up up down down left right left right b a', function() {
		$("ul#photos > li").each(function() {
			$(this).css('transform', 'rotate(' + 360*Math.random() + 'deg) translateX(' + (64*Math.random() - 32) + 'px) translateY(' + (64*Math.random() - 32) + 'px)');
		});
	});
});
