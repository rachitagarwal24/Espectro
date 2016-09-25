<?php
ob_start();
session_start();
$current_file=$_SERVER['SCRIPT_NAME'];
if(isset($_SERVER['HTTP_REFERER']))
$http_referer=$_SERVER['HTTP_REFERER'];

function getfield($field){
	$query="SELECT `$field` FROM `user` WHERE `id`='".$_SESSION['userid']."'";
	if($query_run=mysql_query($query)){
		return mysql_result($query_run,0,$field);
	}
}
function loggedin(){
	if(isset($_SESSION['userid'])&&!empty($_SESSION['userid'])){
		return true;
	}
	else {
		return false;
	}
}

function xyz($url,$fields ){


//url-ify the data for the POST
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string, '&');

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

//execute post
 $result = curl_exec($ch);

//close connection
curl_close($ch);
return $result;
}

?>