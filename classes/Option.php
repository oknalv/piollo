<?php
  class Option{
    public static function getAll($def=false){
      if (file_exists('../config.xml')&&file_exists('../config-default.xml')) {
        $config=array();
        $file='../config.xml';
        if($def) $file='../config-default.xml';
        $xml = simplexml_load_file($file);
        foreach($xml->img->children() as $child){
          $config['img'][$child->getName()]=$child->__toString();
        }
        foreach($xml->vid->children() as $child){
          $config['img'][$child->getName()]=$child->__toString();
        }
        return $config;
      } else {
        return('Error opening config.xml and config-defaul.xml.');
      }
    }

  }
