<?php
  include("../loader.php");
  $ret;
  if(isset($_GET['getPics'])){
    $ret=json_encode(array_slice(scandir("../pictures"),2));
  }
  if(isset($_GET['getVids'])){
    $ret=json_encode(array_slice(scandir("../videos"),2));
  }
  echo $ret;
