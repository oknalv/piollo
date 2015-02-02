<?php
  include("../loader.php");
  $ret;
  if(isset($_GET['check'])){
    //por editar
    $ret=true;
  }
  else if(isset($_GET['switch'])){
    //por editar
    if($_GET['switch']=="on");
    else if($_GET['switch']=="off");
  }
  echo $ret;
