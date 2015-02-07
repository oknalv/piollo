<?php
  include("../loader.php");
  $ret="";
  if(isset($_GET['take'])){
    $ret=exec("../python/shoot.py");
  }
  echo $ret;
