tiny-photo-portfolio
====================

A minimalist static photography portfolio.

Released under the WTFPLv2 license.

Uses Mousetrap.js, released under the Apache 2.0 license:
http://craig.is/killing/mice

Uses Hammer.JS, released under the MIT license:
https://hammerjs.github.io/

Usage
=====

* Copy `in.skel` folder to `in`.

* Alter contents of `in` files to taste.

* Put your `.tif` photos in the `in` directory. For optimal results,
  make sure they have EXIF data (including title, author, and
  copyright).

* Run `make`.

* Upload the `out` folder to your webserver. You're done!

Tips
====

Make sure your webserver sends some kind of caching headers (ETags,
Last-Modified, etc.) for bandwidth efficiency. Also make sure it is
compressing static content.

Make sure your MIME types are properly configured, particularly
`.xhtml` files must be served with the `application/xhtml+xml` content
type.

Dependencies
============

These are only needed for generating the static pages. They are not
required on the server that will be hosting the pages.

* PHP ≥ 5.6 (CLI only)
* Exiv2
* ImageMagick
* Sass
