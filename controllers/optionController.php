<?php
  include("../loader.php");
  $ret;
  if(isset($_GET['get'])){
    $ret=json_encode(Option::getAll());
  }
  else if(isset($_GET['change'])){
    $ret=Option::change($_GET['imgFormat'],         $_GET['width'],
                        $_GET['height'],            $_GET['effect'],
                        $_GET['timer'],             $_GET['rotate'],
                        $_GET['hflip'],             $_GET['vflip'],
                        $_GET['colorpointColor'],   $_GET['colorswapMode'],
                        $_GET['brightness'],        $_GET['contrast'],
                        $_GET['saturation'],        $_GET['sharpness'],
                        $_GET['posteriseSteps'],    $_GET['blurSize'],
                        $_GET['watercolorEnableUV'],$_GET['watercolorU'],
                        $_GET['watercolorV']);
  }
  else if(isset($_GET['reset'])){
    $ret=Option::reset();
  }
  echo $ret;
