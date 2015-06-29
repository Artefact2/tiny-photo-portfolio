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
	});
});
