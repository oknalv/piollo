<?php
  class Language{
    public static function get($lang){
      if (file_exists('../lang.xml')) {
        $array=array();
        $xml = simplexml_load_file('../lang.xml');
        foreach($xml->$lang->children() as $text){
          $array[$text->getName()]=$text->__toString();
        }
        return $array;
      } else {
        return('Error opening lang.xml.');
      }
    }
    public static function getAll(){
      if (file_exists('../lang.xml')) {
        $array;
        $xml = simplexml_load_file('../lang.xml');
        foreach($xml->children() as $lang){
          $array[]=$lang->getName();
        }
        return $array;
      } else {
        return('Error opening lang.xml.');
      }
    }
  }
