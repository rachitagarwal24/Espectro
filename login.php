<?php 

  require 'php/core.inc.php';
  require 'php/connect.inc.php';

  if(!loggedin()){
  if(!empty($_POST['name'])&&!empty($_POST['email'])&&!empty($_POST['password'])&&!empty($_POST['retypepassword'])&&!empty($_POST['mobile'])&&!empty($_POST['college']) )
  {
    $name=mysql_real_escape_string($_POST['name']);
    $email=mysql_real_escape_string($_POST['email']);
    $password=mysql_real_escape_string($_POST['password']);
    $retypepassword=mysql_real_escape_string($_POST['retypepassword']);
    $mobile=mysql_real_escape_string($_POST['mobile']);
    $city=mysql_real_escape_string($_POST['city']);
    $college=mysql_real_escape_string($_POST['college']);
    $password_hash=sha1($password);

$query="SELECT email FROM user WHERE email='$email' OR phone_no='$mobile'";
    $query_run=mysql_query($query);
    if(mysql_num_rows($query_run)==1)
	{
      echo "<script>window.alert('Email " . $email . " already exists');window.location = 'login.php';</script>";
    }
    else
	{

    $query="INSERT INTO user(`clg_id`, `fb_id`, `name`, `email`, `password`, `phone_no`,`from`) VALUES" . " ('$college','','$name','$email','$password','$mobile',2)";
        if($query_run=mysql_query($query))
		{

$to = $email;
			$subject = "Espectro 2k16: Registeration";
			$message = "Dear $name. Thanks for registering for Espectro 2k16.\r\n\nYour details are as below: \r\nSID : ESP" . (16000 + mysql_insert_id ()) . "\r\nEmail ID : $email\r\nPassword : $password\r\n\nPlease click on the link to verify the email address : \nhttp://www.espectro2016.in/android/api/authorize.php?user_id=" . (16000 + (mysql_insert_id () * 2)) / 2 . "\r\n\nNote :\n1. Kindly click on NOT SPAM if you find this mail in your spam folder.\r\n\nWe will reach out to you soon with more updates.\r\nHope to see you at Espectro 2k16, 25th-27th April 2016.\r\n\nLike us : https://web.facebook.com/Espectro-1455747224717031\r\nFollow us : https://www.instagram.com/mbm.espectro.2k16\r\n\nThanks,\r\nTeam Espectro 2k16";
			$message = wordwrap ( $message, 70, "\r\n" );
			$headers = 'From: espectro@espectro2016.in' . "\r\n" . 'Reply-To: espectro@espectro2016.in' . "\r\n" . 'X-Mailer: PHP/' . phpversion ();
			
			mail ( $to, $subject, $message, $headers );
			
 echo "<script>window.alert('Please check your mail and verify your email address.');window.location = 'login.php';</script>";

          /*$query="SELECT `userid` FROM `reglogin` WHERE `email`='$email'";
          $query_run=mysql_query($query);
          $userid=mysql_result($query_run,0,'userid');
                    
            $userid += 200;
          $sid='esp16'.$userid.'';
          
          $query="UPDATE `reglogin` SET `sid`='$sid' WHERE `email`='$email'";
          $query_run=mysql_query($query);
          //  header('Location:register.php');
					
					
				
          $to      =  $email;
          $subject =  $name . " , Your Espectro Registration is Successful";
          $message =  $name . " , Congrats For Registering on the Espectro 2k16's Site. Your Login details are :- \n\nEmail : " . $email . " \n Password : " . $password . " \n Your Espectro ID is : " . strtoupper($sid) . " ! ";
          $headers = 'From: espectro@espectro2016.in' . "\r\n" .
              'Reply-To: espectro@espectro2016.in' . "\r\n" .
              'X-Mailer: PHP/' . phpversion();

          mail($to, $subject, $message, $headers);
	*/	  
		  

        }
		else
		{
          echo "<script>window.alert('We CANNOT Register You Currently. If You SEE THIS MESSAGE, PLEASE CALL ON : 7891615021 or 9928911191. ');window.location = 'login.php';</script>";
        }
      }
    }


   //Login work
   
	if(isset($_POST['loginemail']) && isset($_POST['loginpassword']))
	{
	 $email = $_POST['loginemail'];
	 $password = $_POST['loginpassword'];
	
	 if(!empty($password)&&!empty($email))
	 {
	  $query="SELECT `id`,`authorized` FROM `user` WHERE `email`='".mysql_real_escape_string($email)."' AND `password`='".mysql_real_escape_string($password)."'";
	  if($query_run=mysql_query($query))
		  $query_num_rows=mysql_num_rows($query_run);
	  if($query_num_rows==0)
	  {
	   echo "<script>window.alert('Invalid UserName and Password');window.location = 'login.php';</script>";
	  }
	  else if($query_num_rows==1)
	  {
	   $userid=mysql_result($query_run,0,'id');
  $authorized=mysql_result($query_run,0,'authorized');

if ($authorized==1){
	   $_SESSION['userid']=$userid;
	   header('Location:account.php');}
else{
echo "<script>window.alert('Please verify your email.');window.location = 'login.php';</script>";
}
	  }
	 }
	 else
	 {
	  echo "<script>window.alert('Invalid UserName and Password');window.location = 'login.php';</script>";      
	 }
	}

	
  }
 else
 {
  header('Location:account.php');
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
			
    <title>Login Form</title>
<link rel="shortcut icon" href="img/icon.png" type="image/png">
    
    
    
        <link href="css/bootstrap.min.css" rel="stylesheet">
    <!-- <link rel="stylesheet" type="text/css" href="css/demo.css"/>
	  	 <link href="css/style.css" rel="stylesheet"/>
		 <link href="css/style4.css" rel="stylesheet" />

	  <link rel="stylesheet" type="text/css" href="css/set1.css">-->
	 <link rel="stylesheet" href="css/style2.css">

	 <link href='https://fonts.googleapis.com/css?family=Nova+Mono' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Merienda:400,700' rel='stylesheet' type='text/css'>
	<link href='https://fonts.googleapis.com/css?family=Lily+Script+One' rel='stylesheet' type='text/css'>
	    <link href='https://fonts.googleapis.com/css?family=Freckle+Face' rel='stylesheet' type='text/css'>
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
          <link rel="stylesheet" href="css/style3.css">
<link rel="stylesheet" href="css/reset.css">

<style type="text/css">

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
			html{
			overflow: hidden;
			height: 100%;    
		}
		body{
			overflow: auto;
			height: 100%;
		}
		
		}
</style>

</head>


  <body style="postion:fixed;">
		
<!-- Header -->
        <?php include"header.php" ?>
<!-- header -->

<log class="mid">

<div class="container" style="margin-top:100px;">
  <div class="card"></div>
  <div class="card">
    <h1 class="title">Register</h1>
    <form role="form" action="login.php" name="myform" method="POST">
      <div class="input-container">
        <input type="text" id="Username" required="required" name="name" />
        <label for="Username">Name</label>
        <div class="bar"></div>
      </div>
	  <script type="text/javascript">
              function val()
			  {
 				var x=document.forms["myform"]["email"].value;
 				var atpos=x.indexOf("@");
 				var dotpos=x.lastIndexOf(".");
 				if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
 				{
  					document.getElementById('uemail').focus();	 
 	 				alert("Not a valid e-mail address");
  					return false;
 				}
			 }

      </script>
	  
	  <div class="input-container">
        <input type="text" id="uemail"  required="required" name="email" />
        <label for="Email">Email</label>
        <div class="bar"></div>
      </div>
	  
	  
	  
	   <script type="text/javascript">
              function pass_check(){
                pass= document.getElementById('Password').value;
                retypepass= document.getElementById('retypepassword').value;
                if(pass != retypepass)
                {
				  document.getElementById('Password').focus();	 
  
                  alert('Passwords Do not Match!!!');
                  return false;
                }
            }
            </script>
	  
      <div class="input-container">
        <input type="password" id="Password" name="password" minlength=8 required="required" />
        <label for="Password">Password</label>
        <div class="bar"></div>
      </div>
	  
	   <div class="input-container">
        <input type="password" id="retypepassword" name="retypepassword" minlength="8" onfocusout="pass_check()" required="required"/>
        <label for="retypepassword">Re-type Password</label>
        <div class="bar"></div>
      </div>
	

	       <script type="text/javascript">
              function IsMobileNumber(txtMobId) {
                  var mob = /^[1-9]{1}[0-9]{9}$/;
                  var txtMobile = document.getElementById(txtMobId);
                  if (mob.test(txtMobile.value) == false) {
				   document.getElementById('mobile').focus();	 
  
                      alert("Please enter valid mobile number.");
                      return false;
                  }
                  return true;
              }
      </script>
	   <div class="input-container">
        <input type="text" id="mobile" name="mobile"  maxlength="10" size="10" required="required"/>
        <label for="mobile">Mobile No.</label>
        <div class="bar"></div>
      </div>
     
         <div class="form-group">
            
              <div class="col-sm-12">
              <select name="college" style="background-color:#fff; font-weight:bold; margin-bottom:20px; " class="col-md-8 col-sm-6 form-control" required>
                  <option value="">Select College</option>
                  <option value="1">M.B.M. Engineering College, Jodhpur</option>
                  <option value="2">Jai Narain Vyas University, Jodhpur</option>
                  <option value="3">IIT, Jodhpur</option>
                  <option value="4">Vyas Institute of Technology, Jodhpur</option>
                  <option value="5">AIIMS, Jodhpur</option>
                  <option value="6">NLU, Jodhpur</option>
                  <option value="7">Dr. S.N. Medical College, Jodhpur</option>
                  <option value="8">Jodhpur National University, Jodhpur</option>
                  <option value="9">NIFT, Jodhpur</option>
                  <option value="10">FDDI, Jodhpur</option>
                  <option value="11">Lachoo Memorial College, Jodhpur</option>
                  <option value="12">Arid Forest Research Institute, Jodhpur</option>
                  <option value="13">Kamla Nehru College for Women, Jodhpur</option>
		  <option value="14">Government Women's Polytechnic College, Jodhpur</option>
		  <option value="15">JIET, Jodhpur</option>
		  <option value="16">JIETSETG, Jodhpur</option>
		  <option value="17">MNIT, Jaipur</option>
		  <option value="18">JECRC, Jaipur</option>
		  <option value="19">Government Engineering College, Ajmer</option>
		  <option value="20">M.L.V. Textile & Engineering College, Bhilwara</option>
		  <option value="21">College of Technology & Engineering, Udaipur</option>
				  
               </select>
              </div>
            </div>
           </br></br>
<div class="col-md-12">
       <center> <label  style="font-size:13px; color:#000000; margin-top:7px;">Note :- Please leave us a email on <a>espectro@espectro2016.in</a> with your college details if not listed above.</label>
        
	  </center>
      </div>
</br></br>
</br>
            </br></br>
      <div class="button-container">
        <button type="submit" onClick=" return pass_check()"><span>Register</span></button>
      </div>
    </form>
  </div>
  <div class="card alt">
      <div class="toggle">Login</div>

  <h1 class="title">Login
    <div class="close"></div> 
  </h1>
    <form role="form" action="login.php" method="POST">
      <div class="input-container">
        <input type="text" id="uemail"  name=" loginemail" required="required"/>
        <label for="Username">Email</label>
        <div class="bar"></div>
      </div>
      <div class="input-container">
        <input type="password" id="Password" name="loginpassword" required="required"/>
        <label for="Password">Password</label>
        <div class="bar"></div>
      </div>
      <div class="button-container">
        <button type="submit"><span>Go</span></button>
      </div>
    </form>
  </div>
</div>
</div>
 </log>
      
 <script src="js/index.js"></script>
<style type="text/css">
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
<a href = "login.php"><span style="position:fixed; top:150px; left:-10px; " class="rac1">Register</span></a>

       <div class="" style="position:fixed; bottom:0px; background:#000000; width:100%; height:40px;" >
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                        
                    <p style="text-align:right; line-height:40px; margin-left:-200px; font-size:20px; color:#fff; font-weight:bold;">
                          
                                              <b> <rachit2>Like us on <a href="http://facebook.com/Espectro-1455747224717031" ><img src="img/6.png" height="35" width="35"></a></rachit2></b>
					<b><rachit2>mail us on <a href="http://espectro.mbm.2k16@gmail.com"><img src="img/7.png" height="35" width="35"></a></rachit2></b>
                   </p>
                </div>
            </div>
        </div>
    </div>
    
    
  </body>
</html>