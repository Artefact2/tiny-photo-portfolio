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
	trigger_error('Could not find ul#photos in index.xhtml', E_USER_ERROR);
	die(1);
}

$landscapes = [];
$portraits = [];
$squares = [];

foreach($argv as $tfile) {
	$base = pathinfo($tfile, \PATHINFO_FILENAME);
	$exif = read_exif_exiv2($tfile);

	$li = $p->element('li', [
		'style' => 'background-image: url("'.$base.'.thumb.jpg");',

		'data-fullres' => $base.'.jpg',

		'data-description' => $exif['Image']['ImageDescription'],
		'data-author' => $exif['Image']['Artist'],
		'data-copyright' => $exif['Image']['Copyright'],
		'data-exposuretime' => $exif['Photo']['ExposureTime'][0][0].'/'.$exif['Photo']['ExposureTime'][0][1],
		'data-aperture' => 'f/'.($exif['Photo']['FNumber'][0][0] / $exif['Photo']['FNumber'][0][1]),
		'data-iso' => 'ISO'.$exif['Photo']['ISOSpeedRatings'][0],
		'data-focallength' => ($exif['Photo']['FocalLength'][0][0] / $exif['Photo']['FocalLength'][0][1]).'mm',
	]);

	$a = $li->appendCreate('a', [
		'href' => $base.'.jpg',
	]);

	$w = $exif['Image']['ImageWidth'];
	$l = $exif['Image']['ImageLength'];

	if($w > $l) {
		$li->addClass('landscape');
		$landscapes[] = $li;
	} else if($l > $w) {
		$li->addClass('portrait');
		$portraits[] = $li;
	} else {
		$li->addClass('square');
		$squares[] = $li;
	}
}

$ul->append($landscapes);
$ul->append($portraits);
$ul->append($squares);

$p->save($outfile);

function read_exif_exiv2($filename) {
	exec('exiv2 -p v '.escapeshellarg($filename), $output, $ret);
	if($ret !== 0) return false;

	$tags = [];
	foreach($output as $l) {
		if(!preg_match(
			'%^
			0x(?<id>[0-9a-f]{4})
			\s+
			(?<category>[A-Za-z0-9]+)
			\s+
			(?<tag>[A-Za-z0-9]+)
			\s+
			(?<type>Byte|Ascii|S?Short|S?Long|Rational|Undefined|SRational|Comment)
			\s+
			(?<count>[1-9][0-9]*)
			(  )
			(?<contents>.+)
			$%x',
			$l,
			$match)) {
			trigger_error('Unknown EXIF line: '.$l, E_USER_WARNING);
			continue;
		}

		$contents = trim($match['contents']);

		switch($match['type']) {

		case 'Short':
		case 'SShort':
		case 'Long':
		case 'SLong':
			$value = array_map('intval', explode(' ', $contents));
			break;

		case 'Ascii':
			$value = $contents;
			break;

		case 'Rational':
		case 'SRational':
			$value = array_map(function($rat) {
				return array_map('intval', explode('/', $rat, 2));
			}, explode(' ', $contents));
			break;

		case 'Byte':
		case 'Comment':
		case 'Undefined':
		default:
			$value = null;

		}

		$tags[intval($match['id'], 16)] = $value;
		$tags[$match['category']][$match['tag']] = $value;

	}

	return $tags;
}
