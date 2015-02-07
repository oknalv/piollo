var attrs=[{}];
var langs=[{}];
var lang;
var texts=[{}];
var pics=[{}];
var vids=[{}];
function loadTexts(language){
  var ob;
  jQuery.ajax("controllers/languageController.php?get="+language,{async:false}).done(function(data){
    ob=JSON.parse(data);
  });
  return ob;
}
function fillTexts(texts){
  for(t in texts) $("#"+t).html(texts[t]);
  if(checkPower()) $("#switch").html(texts["switchOff"]);
}
function checkPower(){
  var ret;
  jQuery.ajax("controllers/powerController.php?check",{async:false}).done(function(data){
    ret=data;
  });
  return ret;
}
function loadPics(){
  var ob;
  jQuery.ajax("controllers/fileController.php?getPics",{async:false}).done(function(data){
    ob=JSON.parse(data);
  });
  return ob;
}
function fillPics(pics){
  $("#tpic").empty();
  var pic="";
  if(jQuery.isEmptyObject(pics)){
    pic+="<tr>";
    pic+="<td><i id='noPics'>"+texts["noPics"]+"</i></td>";
    pic+="<tr>";
  }
  else{
    pic+="<thead>";
    pic+="<tr>";
    pic+="<td>";
    pic+="<i class='glyphicon glyphicon-eye-open'></i>";
    pic+="</td>";
    pic+="<td>";
    pic+="</td>";
    pic+="<td>";
    pic+="</td>";
    pic+="<td>";
    pic+="</td>";
    pic+="</tr>";
    pic+="</thead>";
    pic+="<tbody>";
    for(p in pics){
      pic+="<tr>";
      pic+="<td>";
      pic+="<div class='custom-thumbnail'>";
      pic+="<a href='#'><img src='pictures/"+pics[p]+"' class='img-thumbnail custom-img'></a>";
      pic+="</div>";
      pic+="</td>";
      pic+="<td>"+pics[p]+"</td>";
      pic+="<td>";
      pic+="<a class='btn btn-primary' href='pictures/"+pics[p]+"' download>"
      pic+="<i class='glyphicon glyphicon-download-alt'></a></td>";
      pic+="<td><i class='glyphicon glyphicon-trash'></i></td>";
      pic+="</tr>";
    }
    pic+="</tbody>";
  }
  $("#tpic").append(pic);
}
function loadVids(){
  var ob;
  jQuery.ajax("controllers/fileController.php?getVids",{async:false}).done(function(data){
    ob=JSON.parse(data);
  });
  return ob;
}
function fillVids(vids){
  $("#tvid").empty();
  if(jQuery.isEmptyObject(vids)){
    var vid="<tr>";
    vid+="<td><i id='noVids'>"+texts["noVids"]+"</i></td>";
    vid+="<tr>";
    $("#tvid").append(vid);
  }
  else for(v in vids){
    var vid="<tr>"
    vid+="<td>"+vids[v]+"</td>";
    vid+="</tr>";
    $("#tvid").append(vid);
  }
}
function checkRecord(){
  var ret;
  jQuery.ajax("controllers/recordController.php?check",{async:false}).done(function(data){
    ret=data;
  });
  return ret;
}

jQuery.ajax("controllers/languageController.php?getAll",{async:false}).done(function(data){
  langs=JSON.parse(data);
});
var get=$(location).attr("search").substring(1);
if(get!=""){
  var v=get.split("&");
  for (var i=0;i<v.length;i++){
    var param = v[i].split('=');
    attrs[param[0]]=param[1];
  }
}
lang=attrs['lang'];
if(lang==undefined) lang=langs[0];
else{
  var flag=false;
  for(l in langs){
    if(langs[l]==lang){
      flag=true;
      break;
    }
  }
  if(!flag) lang=langs[0];
}
texts=loadTexts(lang);

$(document).ready(function(){
  fillTexts(texts);
  $("#reload").on("click",function(){
    pics=loadPics();
    fillPics(pics);
    vids=loadVids();
    fillVids(vids);
    $(".custom-img").on("click",function(){
      $("#imgPreview").attr('src',$(this).attr('src'));
      $("#modalImgA").attr('href',$(this).attr('src'));
      $("#showImg").modal("show");
    });
  });
  $("#reload").trigger("click");
  $('#languageSelector').append("<option disabled selected>---</option>");
  for(l in langs){
    $('#languageSelector').append("<option>"+langs[l]+"</option>");
  }
  if(!checkPower()){
    $("#cheeseb").prop("disabled",true);
    $("#filmb").prop("disabled",true);
    $("#optionsb").prop("disabled",true);
  }
  if(checkRecord()){
    $("#filmglyph").removeClass("glyphicon-record custom-record").addClass("glyphicon-stop");
    $("#film").html(texts['stop']);
    $("#cheeseb").prop("disabled",true);
    $("#switchb").prop("disabled",true);
    $("#optionsb").prop("disabled",true);
  }
  $("#languageSelector").on("change",function(){
    lang=$("#languageSelector").val();
    texts=loadTexts(lang);
    fillTexts(texts);
  });
  $("#switchb").on("click",function(){
    var sw="on";
    if(checkPower()) sw="off";
    jQuery.ajax("controllers/powerController.php?switch="+sw,{async:false});
    if(checkPower()){
      $("#switch").html(texts["switchOff"]);
      $("#cheeseb").prop("disabled",false);
      $("#filmb").prop("disabled",false);
      $("#optionsb").prop("disabled",false);
    }
    else{
      $("#optionsb").prop("disabled",true);
      $("#cheeseb").prop("disabled",true);
      $("#filmb").prop("disabled",true);
      $("#switch").html(texts["switch"]);
    }
  });
  $("#filmb").on("click",function(){
    var rc="stop";
    if(!checkRecord()) rc="play";
    jQuery.ajax("controllers/recordController.php?record="+rc,{async:false});
    if(checkRecord()){
      $("#filmglyph").removeClass("glyphicon-record custom-record").addClass("glyphicon-stop");
      $("#film").html(texts['stop']);
      $("#cheeseb").prop("disabled",true);
      $("#switchb").prop("disabled",true);
      $("#optionsb").prop("disabled",true);
    }
    else{
      $("#filmglyph").removeClass("glyphicon-stop").addClass("glyphicon-record custom-record");
      $("#film").html(texts['film']);
      $("#cheeseb").prop("disabled",false);
      $("#switchb").prop("disabled",false);
      $("#optionsb").prop("disabled",false);
    }
  });
  $("#pica").on("click",function(){
    $("#films").removeClass("active");
    $("#pics").addClass("active");
    $("#videos").removeClass("active in");
    $("#pictures").addClass("active in");
  });
  $("#filma").on("click",function(){
    $("#pics").removeClass("active");
    $("#films").addClass("active");
    $("#pictures").removeClass("active in");
    $("#videos").addClass("active in");
  });
  $("#optionsb").on("click",function(){
    $("#optionsMenu").modal("show");
  });
  $(".closeMenu").on("click",function(){
    $("#optionsMenu").modal("hide");
    //cargar las opciones
  });
  $(".closeImg").on("click",function(){
    $("#showImg").modal("hide");
  });
  $("#saveb").on("click",function(){
    //mandar datos al server
    $("#optionsMenu").modal("hide");
    //cargar las opciones
  });
  $("#cheeseb").on("click",function(){
    $("#pica").trigger("click");
    $("#tpic").empty();
    $("#tpic").append("<tr><td><i>Loading...</i></td></tr>");
    jQuery.ajax("controllers/photoController.php?take",{async:false}).done(function(data){
    });
    $("#reload").trigger("click");
  });
});
