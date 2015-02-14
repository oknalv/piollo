<?php
  include("../loader.php");
  $ret;
  if(isset($_GET['get'])){
    $ret=json_encode(Option::getAll());
  }
  else if(isset($_GET['change'])){
    $ret=Option::change($_GET['iformat'],$_GET['iwidth'],$_GET['iheight'],$_GET['ieffect']);
  }
  else if(isset($_GET['reset'])){
    $ret=Option::reset();
  }
  echo $ret;
