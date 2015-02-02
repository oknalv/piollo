<?php
  include("../loader.php");
  $ret;
  if(isset($_GET['getAll'])){
    $ret=json_encode(Language::getAll());
  }
  else if(isset($_GET['get'])){
    $ret=json_encode(Language::get($_GET['get']));
  }
  echo $ret;
