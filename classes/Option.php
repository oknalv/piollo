<?php
  class Option{
    public static function getAll(){
      if (file_exists('../config.xml')) {
        $config=array();
        $file='../config.xml';
        $xml = simplexml_load_file($file);
        foreach($xml->children() as $child){
          $config[$child->getName()]=$child->__toString();
        }
        return $config;
      } else {
        return('Error opening config.xml.');
      }
    }
    public static function change($imgFormat,         $width,
                                  $height,            $effect,
                                  $timer,             $rotate,
                                  $hflip,             $vflip,
                                  $colorpointColor,   $colorswapMode,
                                  $brightness,        $contrast,
                                  $saturation,        $sharpness,
                                  $posteriseSteps,    $blurSize,
                                  $watercolorEnableUV,$watercolorU,
                                  $watercolorV){
      if (file_exists('../config.xml')) {
        $xml = simplexml_load_file('../config.xml');
        $xml->imgFormat=$imgFormat;
        $xml->width=$width;
        $xml->height=$height;
        $xml->effect=$effect;
        $xml->timer=$timer;
        $xml->rotate=$rotate;
        $xml->hflip=$hflip;
        $xml->vflip=$vflip;
        $xml->colorpointColor=$colorpointColor;
        $xml->colorswapMode=$colorswapMode;
        $xml->brightness=$brightness;
        $xml->contrast=$contrast;
        $xml->saturation=$saturation;
        $xml->sharpness=$sharpness;
        $xml->posteriseSteps=$posteriseSteps;
        $xml->blurSize=$blurSize;
        $xml->watercolorEnableUV=$watercolorEnableUV;
        $xml->watercolorU=$watercolorU;
        $xml->watercolorV=$watercolorV;
        $xml->asXml('../config.xml');
      } else {
        return('Error opening config.xml.');
      }
    }
    public static function reset(){
      if(file_exists('../config-default.xml')){
        return copy('../config-default.xml','../config.xml');
      } else {
        return('Error opening config-default.xml');
      }
    }
  }
