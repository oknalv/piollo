var attrs=[{}];
var langs=[{}];
var lang;
var texts=[{}];
var pics=[{}];
var vids=[{}];
var opts=[{}];
function loadTexts(language){
  var ob;
  jQuery.ajax("controllers/languageController.php?get="+language,{async:false}).done(function(data){
    ob=JSON.parse(data);
  });
  return ob;
}
function fillTexts(texts){
  for(t in texts) $("."+t).html(texts[t]);
  if(checkPower()) $(".switch").html(texts["switchOff"]);
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
    for(p in pics){
      pic+="<tr>";
      pic+="<td>";
      pic+="<div class='custom-thumbnail'>";
      pic+="<a href='#'><img  alt='"+pics[p]+"' src='pictures/"+pics[p]+"' class='img-thumbnail custom-img'></a>";
      pic+="</div>";
      pic+="</td>";
      pic+="<td>"+pics[p]+"</td>";
      pic+="<td>";
      pic+="<a class='btn btn-primary' href='pictures/"+pics[p]+"' download>"
      pic+="<i class='glyphicon glyphicon-download-alt'></a></td>";
      pic+="<td>";
      pic+="<button class='btn btn-danger throwSureI' value='"+pics[p]+"'>"
      pic+="<i class='glyphicon glyphicon-trash'></i>";
      pic+="</button>"
      pic+="</td>";
      pic+="</tr>";
    }
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

function loadOpts(){
  var ob;
  jQuery.ajax("controllers/optionController.php?get",{async:false}).done(function(data){
    ob=JSON.parse(data);
  });
  return ob;
}

function setOpts(opts){
  $("#imgFormat").empty();
  var put='<option value="jpeg">jpeg</option>';
  put+='<option value="png">png</option>';
  put+='<option value="gif">gif</option>';
  put+='<option value="bmp">bmp</option>';
  put+='<option value="yuv">yuv</option>';
  put+='<option value="rgb">rgb</option>';
  put+='<option value="rgba">rgba</option>';
  put+='<option value="bgr">bgr</option>';
  put+='<option value="bgra">bgra</option>';
  put+='<option value="raw">raw</option>';
  $("#imgFormat").append(put);
  $("#imgFormat option[value='"+opts['img']['format']+"']").attr("selected",true);
  $("#imgEffect").empty();
  put='<option value="none">'+texts['none']+'</option>';
  put+='<option value="negative">'+texts['negative']+'</option>';
  put+='<option value="solarize">'+texts['solarize']+'</option>';
  put+='<option value="sketch">'+texts['sketch']+'</option>';
  put+='<option value="denoise">'+texts['denoise']+'</option>';
  put+='<option value="emboss">'+texts['emboss']+'</option>';
  put+='<option value="oilpaint">'+texts['oilpaint']+'</option>';
  put+='<option value="hatch">'+texts['hatch']+'</option>';
  put+='<option value="gpen">'+texts['gpen']+'</option>';
  put+='<option value="pastel">'+texts['pastel']+'</option>';
  put+='<option value="watercolor">'+texts['watercolor']+'</option>';
  put+='<option value="film">'+texts['film']+'</option>';
  put+='<option value="blur">'+texts['blur']+'</option>';
  put+='<option value="saturation">'+texts['saturation']+'</option>';
  put+='<option value="colorswap">'+texts['colorswap']+'</option>';
  put+='<option value="washedout">'+texts['washedout']+'</option>';
  put+='<option value="posterise">'+texts['posterise']+'</option>';
  put+='<option value="colorpoint">'+texts['colorpoint']+'</option>';
  put+='<option value="colorbalance">'+texts['colorbalance']+'</option>';
  put+='<option value="cartoon">'+texts['cartoon']+'</option>';
  put+='<option value="deinterlace1">'+texts['deinterlace1']+'</option>';
  put+='<option value="deinterlace2">'+texts['deinterlace2']+'</option>';
  $("#imgEffect").append(put);
  $("#imgEffect option[value='"+opts['img']['effect']+"']").attr("selected",true);
  $("#inputWidth").attr("value",opts['img']['width']);
  $("#inputHeight").attr("value",opts['img']['height']);
  $("#numWidth").html(opts['img']['width']);
  $("#numHeight").html(opts['img']['height']);
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
opts=loadOpts();

$(document).ready(function(){
  fillTexts(texts);
  setOpts(opts);
  $("#reload").on("click",function(){
    pics=loadPics();
    fillPics(pics);
    vids=loadVids();
    fillVids(vids);
    $(".custom-img").on("click",function(){
      $("#imgPreview").attr('src',$(this).attr('src'));
      $("#modalImgA").attr('href',$(this).attr('src'));
      $("#removePreview").attr('value',$(this).attr('alt'));
      $("#showImg").modal("show");
    });
    $(".throwSureI").on("click",function(){
      $("#delImg").attr("value",$(this).attr("value"));
      $("#fileToDel").html($(this).attr("value"));
      $("#type").attr("value","img");
      $("#sure").modal("show");
    })
  });
  $("#delImg").on("click",function(){
    jQuery.ajax("controllers/fileController.php?del="+$(this).attr("value")+"&type=img",{async:false});
    $("#reload").trigger("click");
    $("#showImg").modal("hide");
    $("#sure").modal("hide");
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
    $("#reload").trigger("click");
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
  $("#imgAOpt").on("click",function(){
    $("#vidLiOpt").removeClass("active");
    $("#imgLiOpt").addClass("active");
    $("#vidOptionTab").removeClass("active in");
    $("#imgOptionTab").addClass("active in");
  });
  $("#vidAOpt").on("click",function(){
    $("#imgLiOpt").removeClass("active");
    $("#vidLiOpt").addClass("active");
    $("#imgOptionTab").removeClass("active in");
    $("#vidOptionTab").addClass("active in");
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
  $(".closeSure").on("click",function(){
    $("#sure").modal("hide");
  });
  $("#saveb").on("click",function(){
    var get="";
    get+="iformat="+$("#imgFormat").val();
    get+="&iwidth="+$("#inputWidth").val();
    get+="&iheight="+$("#inputHeight").val();
    get+="&ieffect="+$("#imgEffect").val();
    jQuery.ajax("controllers/optionController.php?change&"+get,{async:false});
    $("#optionsMenu").modal("hide");
  });
  $("#cheeseb").on("click",function(){
    $("#cheeseb").prop("disabled",true);
    $("#filmb").prop("disabled",true);
    $("#optionsb").prop("disabled",true);
    $("#switchb").prop("disabled",true);
    $("#pica").trigger("click");
    $("#tpic").empty();
    $("#tpic").append("<tr><td><i>"+texts["loading"]+"</i></td></tr>");
    jQuery.ajax("controllers/photoController.php?take",{async:false});
    $("#cheeseb").prop("disabled",false);
    $("#filmb").prop("disabled",false);
    $("#optionsb").prop("disabled",false);
    $("#switchb").prop("disabled",false);
    $("#reload").trigger("click");
  });
  $("#resetConf").on("click",function(){
    jQuery.ajax("controllers/optionController.php?reset",{async:false});
    opts=loadOpts();
    setOpts(opts);
    $("#optionsMenu").modal("hide");
  });
  $("#inputWidth").on("input",function(){
    $("#numWidth").html($("#inputWidth").val());
  });
  $("#inputHeight").on("input",function(){
    $("#numHeight").html($("#inputHeight").val());
  });
});
