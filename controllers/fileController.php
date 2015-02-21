<?php
  include("../loader.php");
  $ret;
  if(isset($_GET['getPics'])){
    $ret=json_encode(array_reverse(array_slice(scandir("../pictures"),2)));
  }
  else if(isset($_GET['getVids'])){
    $ret=json_encode(array_slice(scandir("../videos"),2));
  }
  else if(isset($_GET['del'])){
    if(isset($_GET['type'])){
      $folder="";
      if($_GET['type']=="img") $folder="../pictures";
      else if($_GET['type']=="vid") $folder="../videos";
      $ret=in_array($_GET['del'],array_slice(scandir($folder),2));
      if($ret) unlink($folder."/".$_GET['del']);
    }
  }
  else if(isset($_GET['delAll'])){
    if(isset($_GET['type'])){
      $ret=false;
      $folder="";
      if($_GET['type']=="img") $folder="../pictures";
      else if($_GET['type']=="vid") $folder="../videos";
      if($folder!=""){
        $files=array_slice(scandir($folder),2);
        foreach($files as $file){
          unlink($folder."/".$file);
        }
        $ret=true;
      }
    }
  }
  echo $ret;
