<?php
require 'php/core.inc.php';
session_unset();
session_destroy();
header('Location:login.php');

?>