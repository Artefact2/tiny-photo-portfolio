/* Author: Romain "Artefact2" Dalmaso <artefact2@gmail.com>
 *
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

if(typeof history === 'undefined') {
	history = {
		pushState: function() {},
	};
}

$(function() {

	var popstating = 0;

	var h = new Hammer($("body").get(0));
	h.on('swipeleft', function() {
		$("a#next").click();
	});
	h.on('swiperight', function() {
		$("a#prev").click();
	});

	Mousetrap.bind('escape', function() {
		$("div#dc").click();
	});
	Mousetrap.bind('left', function() {
		$("a#prev").click();
	});
	Mousetrap.bind('right', function() {
		$("a#next").click();
	});

	$(window).on('popstate', function(e) {
		++popstating;
		var i = e.originalEvent.state;

		if(i === null) {
			$("div#dc").click();
		} else {
			$("ul#photos").children('li').eq(i).children('a').click();
		}
	});

	tpp_load_image = function(div, li) {
		var image = $(new Image());
		var fullres = li.data('fullres');

		var frame = div.find('div#frame');
		var spinner = div.find('div#spinner');

		var ul = li.parent();
		var nphotos = ul.children('li').length;
		var i = li.index();

		frame.fadeOut(100, function() {
			spinner.fadeIn(0, function() {
				image.one('load', function() {
					spinner.fadeOut(0, function() {
						div.children('a#prev').one('click', function(e) {
							e.stopPropagation();
							$(this).blur();
							tpp_load_image(div, ul.children('li').eq((i-1 + nphotos) % nphotos));
						});
						div.children('a#next').one('click', function(e) {
							e.stopPropagation();
							$(this).blur();
							tpp_load_image(div, ul.children('li').eq((i+1) % nphotos));
						});

						frame.children('p#exif').text(
							li.data('description')
								+ ' — ' + 
								li.data('focallength')
								+ '; ' +
								li.data('aperture')
								+ '; ' +
								li.data('exposuretime')
								+ 's; ' +
								li.data('iso')
								+ ' — ' +
								li.data('author')
								+ ' — ' + li.data('copyright')
						);

						if(popstating === 0) {
							history.pushState(i, null, "#" + i);
						} else --popstating;

						frame.css('background-image', 'url("' + fullres + '")');
						frame.fadeIn(500);
					});
				});

				image.prop('src', fullres);
			});
		});
	};

	$("ul#photos > li > a").each(function() {
		var a = $(this);
		a.removeProp('href');
		a.removeAttr('href');
	}).click(function(e) {
		e.preventDefault();
		e.stopPropagation();

		var a = $(this);
		var li = a.parent();
		var dc;
		a.blur();

		if((dc = $("div#dc")).length === 0) {
			dc = $(document.createElement('div'));
			dc.prop('id', 'dc');
			dc.hide();
			dc.click(function() {
				if(popstating === 0) {
					history.pushState(null, null, '#');
				} else --popstating;

				dc.fadeOut(250, function() {
					dc.remove();
				});
			});

			var div = $(document.createElement('div'));
			div.prop('id', 'detail');
			dc.append(div);

			var fdiv = $(document.createElement('div'));
			fdiv.prop('id', 'frame');
			fdiv.hide();
			div.append(fdiv);

			var p = $(document.createElement('p'));
			p.prop('id', 'exif');
			fdiv.append(p);

			var sdiv = $(document.createElement('div'));
			sdiv.prop('id', 'spinner');
			div.append(sdiv);

			var a = $(document.createElement('a'));
			a.prop('id', 'prev');
			a.append($(document.createElement('span')).text('←'));
			dc.append(a);

			a = $(document.createElement('a'));
			a.prop('id', 'next');
			a.append($(document.createElement('span')).text('→'));
			dc.append(a);

			$("body").append(dc);
			dc.fadeIn(250);
		}

		tpp_load_image(dc, li);
	});

	var hash;
	console.log(window.location.hash);
	if(window.location.hash.length >= 2 && 
	   !isNaN(hash = parseInt(window.location.hash.substring(1)))) {
		++popstating;
		$("ul#photos").children('li').eq(hash).children('a').click();
	}
});
