<?php
$row = 1;
$data = isset($_GET['ver']) ? $_GET['ver'] : '';
list($mejor, $minor, $revision) = explode(".", $data);

$baseurl = 'https://produ.irelang.jp/docs/';
$file = 'reference.csv';

$go = isset($_GET['go']) ? $_GET['go'] : '';
if(strlen($go) == 0) {
	header('location: '.$baseurl);
	exit;
}
$code = isset($_GET['code']) ? $_GET['code'] : '';
if (($handle = fopen($file, 'r')) !== FALSE) {
	$path = '';
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		if(md5($data[0])==$go) {
			$go = $data[1];
			$go = str_replace('{code}', $code, $go);
			break;
		}
	}
	fclose($handle);
	if(strlen($go) > 0) {
		header('location: '.$baseurl.$go);
	} else {
		header('location: '.$baseurl.'#'.$go);
	}
}
?>