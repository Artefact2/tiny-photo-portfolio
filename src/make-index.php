#!/usr/bin/env php
<?php
/* Author: Romain "Artefact2" Dalmaso <artefact2@gmail.com>
 *
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

namespace TinyPhotoPortfolio;

require __DIR__.'/common.php';

$progname = array_shift($argv); /* $0 */
$outfile = array_shift($argv);
$infile = array_shift($argv);

$p = new \EasyDOM\Document();

if($p->load($infile) !== true) {
	trigger_error('DOMDocument::load() failed, check validity of index.xhtml file', E_USER_ERROR);
	die(1);
}

$p->normalizeDocument();

$xpath = new \DOMXPath($p);
$ul = $xpath->query('//*[@id="photos"]')->item(0);

if(!($ul instanceof \DOMElement)) {
	trigger_error('Could not find #photos in index.xhtml', E_USER_ERROR);
	die(1);
}

foreach($argv as $tfile) {
	$ul->appendCreate('li', [
		'data-img-href' => './'.$tfile.'.bpg',
	]);
}

$p->save($outfile);
