<?php
  class Option{
    public static function getAll(){
      if (file_exists('../config.xml')) {
        $config=array();
        $file='../config.xml';
        $xml = simplexml_load_file($file);
        foreach($xml->img->children() as $child){
          $config['img'][$child->getName()]=$child->__toString();
        }
        foreach($xml->vid->children() as $child){
          $config['img'][$child->getName()]=$child->__toString();
        }
        return $config;
      } else {
        return('Error opening config.xml.');
      }
    }
    public static function change($iformat,$iwidth,$iheight,$ieffect){
      if (file_exists('../config.xml')) {
        $xml = simplexml_load_file('../config.xml');
        $xml->img->format=$iformat;
        $xml->img->width=$iwidth;
        $xml->img->height=$iheight;
        $xml->img->effect=$ieffect;
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
