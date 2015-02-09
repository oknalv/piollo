<?php
  include("../loader.php");
  $ret;
  if(isset($_GET['get'])){
    $ret=json_encode(Option::getAll());
  }
  else if(isset($_GET['def'])){
    $ret=json_encode(Option::getAll(true));
  }
  echo $ret;
