<?php
require 'php/core.inc.php';
require 'php/connect.inc.php';

if(loggedin()){
	$name=getfield('name');
	$sid=getfield('id')+16000;
}else{
header('Location:login.php');
}

?>
 <!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1 ,user-scalable=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>account</title>
    <link rel="shortcut icon" href="img/icon.png" type="image/png">
    

    
        <link href="css/bootstrap.min.css" rel="stylesheet">

	 <link rel="stylesheet" href="css/style2.css">
	 <link href='https://fonts.googleapis.com/css?family=Nova+Mono' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Merienda:400,700' rel='stylesheet' type='text/css'>
		 <link href="css/one-page-wonder.css" rel="stylesheet">
		 
		 
		 <link href='http://fonts.googleapis.com/css?family=Black+Ops+One|Luckiest+Guy|Sonsie+One|Shojumaru&effect=3d|3d-float|anaglyph|brick-sign|canvas-print|
            crackle|decaying|destruction|distressed|distressed-wood|emboss|fire|fire-animation|fragile|grass|ice|mitosis|neon|outline|putting-green|
            scuffed-steel|shadow-multiple|splintered|static|stonewash|vintage|wallpaper' 
            rel='stylesheet' type='text/css'>
		 
		 
		 
		 

    <!-- Custom CSS -->
	
	  <script src = "js/jquery.min.js"></script>
	 <script src="js/jquery-1.12.1.min.js"></script>
	<script type="text/javascript" src="js/jquery.chocolate.js"></script>
	<script>
		$(function() {
			$('body').chocolate({
				images		: ['img/15.jpg','img/23.jpg','img/24.jpg'],
				interval	: 5000,
				speed		: 3000,
			});
		});
	</script>
        <!-- Bootstrap Core JavaScript -->
        <script src="js/bootstrap.min.js"> </script>
	  	<link href="css/style7.css" rel="stylesheet" type="text/css">  
        
		   	   <style type="text/css">
	    body
		{
			}
		.se
		{
		 border:1px #FFFFFF solid;
		 border-radius:20px;
		 position:fixed;
		 top:80px;
		 line-height:50px;
		 height:50px;
		 width:200px;
		 color:#000000;
		 background:#FFFFFF;
		 text-align:center;
		}
	   </style>
	   
	   <style>
        
        
        .btn3d.btn-primary {
            box-shadow: 0 0 0 1px #417fbd inset, 0 0 0 2px rgba(255, 255, 255, 0.15) inset, 0 8px 0 0 #4D5BBE, 0 8px 8px 1px rgba(0, 0, 0, 0.5);
            background-color: #4274D7;
        }
        
        .btn3d.btn-primary:active,
        .btn3d.btn-primary.active {
            box-shadow: 0 0 0 1px #417fbd inset, 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 1px 3px 1px rgba(0, 0, 0, 0.3);
            background-color: #4274D7;
        }
          	.rac1
		{
	background: #ed2553;
  width: 100px;
  height: 60px;
  border-radius: 20%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  color: #FFFFFF;
  text-decoration:none;
  
  font-size: 20px;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
}
.rac1:hover
{
 font-size:22px;
}
		
    </style>


</head>


  <body >
        <?php include"header.php" ?>
		
<div class="container" style="margin-top:150px;">		
<div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="hs_contact_form_div self" style="font-size:1.2em; text-align:center; color:#fff;">
        Hello <?php echo $name;?>, You are registered to <span style="font-size:1.8em;">Espectro 2k16</span>'s Official Website.<br>
               In case of queries , Whatsapp/call at <span style="color:#fff;font-size:1.2em;">7891615021 or 9928911191 .</span>
        
      </div>
    </div>
  </div>
  </div>
  
  
  <div class="row" style="margin-top:100px;">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="hs_contact_form_div self" style="font-size:1.2em; text-align:center; padding-bottom:20px; color:#fff;">
        Show Your Espectro ID at the Registeration Desks and  We will take care of everything else.
        <div class="hs_contact_form">
            <form class="form-horizontal col-md-offset-4 col-lg-offset-4 col-sm-offset-4 col-xs-offset-4" role="form">
            <div class="form-group">
              <div class="col-sm-6">
			  
              <p style="color:#fff; text-align:center; margin-top:20px; margin-left:20px; border:2px solid white; padding:5px; font-size:1.8em">SID : <?php echo "ESP".strtoupper($sid);?></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
	
	
  </div>
         <!--   <div class="row" style="margin-left:40px;">
                <div class="col-md-3 col-sm-6 col-xs-6 ">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
				  <div class="col-md-3 col-sm-6 col-xs-6">
				<input type="checkbox" name="" value="" />Event 1
                </div>
                <div class="col-md-3 col-sm-6 col-xs-6">
                    <input type="checkbox" name="" value="" />Event 1
                </div>
                <div class="col-md-3 col-sm-6 col-xs-6">
                   <input type="checkbox" name="" value="" />Event 1
                </div>
            </div>

             -->  
<center>  <a href="logout.php">    <button type="button" class="btn btn-primary btn3d" style="position:fixed; top:80px; margin-left:-50px;">LOGOUT
                   
  
</button></a></center>


 <a href = "login.php"><span style="position:fixed; top:150px; left:-10px; " class="rac1">Register</span></a>
	  
           <div class="" style="position:fixed; bottom:0px; background:#000000; width:100%; height:40px;" >
        <div class="container">
            <div class="row">
                
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <p style="text-align:right; line-height:40px; color:#fff;">
                      <b> Developed by <a href="http://facebook.com/rachitmbm" style="text-decoration:none; color:#fff;">Rachit agarwal </a>, Sanjay Rajpurohit</b>
                   </p>
                </div>
            </div>
        </div>
    </div>

 
</body>
</html>