<?php


$mysql_host='localhost';
$mysql_user='root';
$mysql_pass='';
$mysql_db='espectro';

if(!mysql_connect($mysql_host,$mysql_user,$mysql_pass)||!mysql_select_db($mysql_db)){
	die(mysql_error());
}
/*
$HOST = '';
$USER = 'tarunsmalviya12';
$PASSWORD = 'android@123!';
$DATABASE = 'espectro2k16';

if(!mysql_connect($HOST,$USER,$PASSWORD)||!mysql_select_db($DATABASE)){
	die ( "ERROR: Could not connect.... " . mysql_errno () );
}
*/
?>
