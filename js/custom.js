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
    pic+="<tr>";
    pic+="<td>";
    pic+="</td>";
    pic+="<td class='text-right text-danger' colspan=2><i>"+texts["deleteAllImages"]+"</i></td>";
    pic+="<td>";
    pic+="<button class='btn btn-danger throwSureAll' value='img'>";
    pic+="<i class='glyphicon glyphicon-trash'></i>";
    pic+="</button>";
    pic+="</td>";
    pic+="</tr>";
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
  $("#imgFormat option[value='"+opts['imgFormat']+"']").attr("selected",true);
  $("#imgEffect").empty();
  put='<option class="none" value="none"></option>';
  put+='<option class="negative" value="negative"></option>';
  put+='<option class="solarize" value="solarize"></option>';
  put+='<option class="denoise" value="sketch"></option>';
  put+='<option class="sketch" value="denoise"></option>';
  put+='<option class="emboss" value="emboss"></option>';
  put+='<option class="oilpaint" value="oilpaint"></option>';
  put+='<option class="gpen" value="hatch"></option>';
  put+='<option class="hatch" value="gpen"></option>';
  put+='<option class="pastel" value="pastel"></option>';
  put+='<option class="watercolor" value="watercolor"></option>';
  put+='<option class="film" value="film"></option>';
  put+='<option class="blur" value="blur"></option>';
  put+='<option class="saturation" value="saturation"></option>';
  put+='<option class="colorswap" value="colorswap"></option>';
  put+='<option class="washedout" value="washedout"></option>';
  put+='<option class="posterise" value="posterise"></option>';
  put+='<option class="colorpoint" value="colorpoint"></option>';
  put+='<option class="colorbalance" value="colorbalance"></option>';
  put+='<option class="cartoon" value="cartoon"></option>';
  put+='<option class="deinterlace2" value="deinterlace1"></option>';
  put+='<option class="deinterlace1" value="deinterlace2"></option>';
  $("#imgEffect").append(put);
  $("#imgEffect option[value='"+opts['effect']+"']").attr("selected",true);
  $("#inputWidth").val(opts['width']);
  $("#inputHeight").val(opts['height']);
  $("#inputBrightness").val(opts['brightness']);
  $("#inputContrast").val(opts['contrast']);
  $("#inputSaturation").val(opts['saturation']);
  $("#inputSharpness").val(opts['sharpness']);
  $("#numWidth").html(opts['width']);
  $("#numHeight").html(opts['height']);
  $("#numBrightness").html(opts['brightness']);
  $("#numContrast").html(opts['contrast']);
  $("#numSaturation").html(opts['saturation']);
  $("#numSharpness").html(opts['sharpness']);
  $("#timer").val(opts['timer']);
  $("#hflip").attr("value",opts['hflip']);
  $("#vflip").attr("value",opts['vflip']);
  $("#rotate").attr("value",opts['rotate']);
  imgOr();
  $("#c"+opts['colorpointColor']).trigger("click");
  $("#m"+opts['colorswapMode']).trigger("click");
  $("#posteriseSteps").val(opts['posteriseSteps']);
  $("#ks"+opts['blurSize']).trigger("click");
  $("#watercolorEnableUV").prop("checked",opts['watercolorEnableUV']=="1");
  $("#watercolorU").val(opts['watercolorU']);
  $("#watercolorV").val(opts['watercolorV']);
  $("#numwaterU").html(opts['watercolorU']-128);
  $("#numwaterV").html(opts['watercolorV']-128);
  $("#watercolorUVPlaneSelectorV").css("margin-top",(255-opts['watercolorU'])+"px");
  $("#watercolorUVPlaneSelectorU").css("margin-left",opts['watercolorV']+"px");
  $("#filmStrength").val(opts['filmStrength']);
  $("#numFilmStrength").html(opts['filmStrength']);
  $("#filmU").val(opts['filmU']);
  $("#filmV").val(opts['filmV']);
  $("#numfilmU").html(opts['filmU']-128);
  $("#numfilmV").html(opts['filmV']-128);
  $("#filmUVPlaneSelectorV").css("margin-top",(255-opts['filmU'])+"px");
  $("#filmUVPlaneSelectorU").css("margin-left",opts['filmV']+"px");
}
function checkRecord(){
  var ret;
  jQuery.ajax("controllers/recordController.php?check",{async:false}).done(function(data){
    ret=data;
  });
  return ret;
}
function imgOr(){
  if($("#vflip").attr("value")=="1"&&$("#hflip").attr("value")=="1"){
    $("#rotName").addClass("custom-vhflip");
    $("#rotName").removeClass("custom-hflip custom-vflip custom-noflip");
  }
  else if($("#vflip").attr("value")=="1"){
    $("#rotName").addClass("custom-vflip");
    $("#rotName").removeClass("custom-hflip custom-vhflip custom-noflip");
  }
  else if($("#hflip").attr("value")=="1"){
    $("#rotName").addClass("custom-hflip");
    $("#rotName").removeClass("custom-vflip custom-vhflip custom-noflip");
  }
  else{
    $("#rotName").addClass("custom-noflip");
    $("#rotName").removeClass("custom-vflip custom-hflip custom-vhflip");
  }
  $("#rotIcon").removeClass("custom-r0 custom-r90 custom-r180 custom-r270");
  $("#rotIcon").addClass("custom-r"+$("#rotate").val());
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
    });
    $(".throwSureAll").on("click",function(){
      $("#delAll").attr("value",$(this).attr("value"));
      $("#elementsToDelete").html(texts[$(this).attr("value")+"Sure"]);
      $("#sureAll").modal("show");
    });
  });
  $("#delImg").on("click",function(){
    jQuery.ajax("controllers/fileController.php?del="+$(this).attr("value")+"&type=img",{async:false});
    $("#reload").trigger("click");
    $("#showImg").modal("hide");
    $("#sure").modal("hide");
  });
  $("#delAll").on("click",function(){
    jQuery.ajax("controllers/fileController.php?delAll&type="+$(this).attr("value"),{async:false});
    $("#reload").trigger("click");
    $("#sureAll").modal("hide");
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
  $("#genAOpt").on("click",function(){
    $("#fxLiOpt").removeClass("active");
    $("#genLiOpt").addClass("active");
    $("#fxOptionTab").removeClass("active in");
    $("#genOptionTab").addClass("active in");
  });
  $("#fxAOpt").on("click",function(){
    $("#genLiOpt").removeClass("active");
    $("#fxLiOpt").addClass("active");
    $("#genOptionTab").removeClass("active in");
    $("#fxOptionTab").addClass("active in");
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
  $(".closeSureAll").on("click",function(){
    $("#sureAll").modal("hide");
  });
  $("#saveb").on("click",function(){
    var get="";
    get+="imgFormat="+$("#imgFormat").val();
    get+="&width="+$("#inputWidth").val();
    get+="&height="+$("#inputHeight").val();
    get+="&brightness="+$("#inputBrightness").val();
    get+="&contrast="+$("#inputContrast").val();
    get+="&saturation="+$("#inputSaturation").val();
    get+="&sharpness="+$("#inputSharpness").val();
    get+="&effect="+$("#imgEffect").val();
    get+="&timer="+$("#timer").val();
    get+="&rotate="+$("#rotate").attr("value");
    get+="&hflip="+$("#hflip").attr("value");
    get+="&vflip="+$("#vflip").attr("value");
    get+="&colorpointColor="+$("input:radio[name=colorpointColor]:checked").attr("value");
    get+="&colorswapMode="+$("input:radio[name=colorswapMode]:checked").attr("value");
    get+="&posteriseSteps="+$("#posteriseSteps").val();
    get+="&blurSize="+$("input:radio[name=blurSize]:checked").attr("value");
    var uv="0";
    if($("#watercolorEnableUV").prop("checked")) uv="1";
    get+="&watercolorEnableUV="+uv;
    get+="&watercolorU="+$("#watercolorU").val();
    get+="&watercolorV="+$("#watercolorV").val();
    get+="&filmStrength="+$("#filmStrength").val();
    get+="&filmU="+$("#filmU").val();
    get+="&filmV="+$("#filmV").val();
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
    fillTexts(texts);
    $("#optionsMenu").modal("hide");
  });
  $("#inputWidth").on("input",function(){
    $("#numWidth").html($("#inputWidth").val());
  });
  $("#inputHeight").on("input",function(){
    $("#numHeight").html($("#inputHeight").val());
  });
  $("#inputBrightness").on("input",function(){
    $("#numBrightness").html($("#inputBrightness").val());
  });
  $("#inputContrast").on("input",function(){
    $("#numContrast").html($("#inputContrast").val());
  });
  $("#inputSaturation").on("input",function(){
    $("#numSaturation").html($("#inputSaturation").val());
  });
  $("#inputSharpness").on("input",function(){
    $("#numSharpness").html($("#inputSharpness").val());
  });
  $("#watercolorU").on("input",function(){
    $("#watercolorUVPlaneSelectorU").css("margin-left",$("#watercolorU").val()+"px");
    $("#numwaterU").html($("#watercolorU").val()-128);
  });
  $("#watercolorV").on("input",function(){
    $("#watercolorUVPlaneSelectorV").css("margin-top",(255-$("#watercolorV").val())+"px");
    $("#numwaterV").html($("#watercolorV").val()-128);
  });
  $("#filmStrength").on("input",function(){
    $("#numFilmStrength").html($("#filmStrength").val());
  });
  $("#filmU").on("input",function(){
    $("#filmUVPlaneSelectorU").css("margin-left",$("#filmU").val()+"px");
    $("#numfilmU").html($("#filmU").val()-128);
  });
  $("#filmV").on("input",function(){
    $("#filmUVPlaneSelectorV").css("margin-top",(255-$("#filmV").val())+"px");
    $("#numfilmV").html($("#filmV").val()-128);
  });
  $("#oclock").on("click",function(){
    var rot=parseInt($("#rotate").attr("value"));
    if(rot==270) rot=0;
    else rot+=90;
    $("#rotate").attr("value",rot);
    imgOr();
  });
  $("#noclock").on("click",function(){
    var rot=parseInt($("#rotate").attr("value"));
    if(rot==0) rot=270;
    else rot-=90;
    $("#rotate").attr("value",rot);
    imgOr();
  });
  $("#hflipb").on("click",function(){
    var hflip=$("#hflip").attr("value");
    if(hflip=="1") hflip="0";
    else hflip="1";
    $("#hflip").attr("value",hflip);
    imgOr();
  });
  $("#vflipb").on("click",function(){
    var vflip=$("#vflip").attr("value");
    if(vflip=="1") vflip="0";
    else vflip="1";
    $("#vflip").attr("value",vflip);
    imgOr();
  });
  var watercolorUVPlaneClick=false;
  var filmUVPlaneClick=false;
  $("#watercolorUVPlane").on("mousemove",function(e){
    $(this).on("mousedown",function(){
      watercolorUVPlaneClick=true;
    });
    $("#ustateWatercolor").html(Math.round(e.pageX - $("#watercolorUVPlane").offset().left - 128));
    $("#vstateWatercolor").html(-(Math.round(e.pageY - $("#watercolorUVPlane").offset().top) - 128));
    var height=$("#watercolorUVPlaneMousePosition").height();
    var width=$("#watercolorUVPlaneMousePosition").width();
    var top=Math.round(e.pageY - $("#watercolorUVPlane").offset().top)+5;
    var left=Math.round(e.pageX - $("#watercolorUVPlane").offset().left)+5;
    if(parseInt(left)+parseInt(width)>256) left=256-width;
    if(parseInt(top)+parseInt(height)>256) top=256-height;
    $("#watercolorUVPlaneMousePosition").css("margin-top",top+"px");
    $("#watercolorUVPlaneMousePosition").css("margin-left",left+"px");
    if(watercolorUVPlaneClick){
      $("#watercolorU").val(128 + Math.round(e.pageX - $("#watercolorUVPlane").offset().left - 128));
      $("#watercolorU").trigger("input");
      $("#watercolorV").val(128 - (Math.round(e.pageY - $("#watercolorUVPlane").offset().top) - 128));
      $("#watercolorV").trigger("input");
      $("#watercolorUVPlaneSelectorV").css("margin-top",Math.round(e.pageY - $("#watercolorUVPlane").offset().top));
      $("#watercolorUVPlaneSelectorU").css("margin-left",Math.round(e.pageX - $("#watercolorUVPlane").offset().left));
    }
  });
  $("#watercolorUVPlane").on("mousedown",function(e){
    $("#watercolorU").val(128 + Math.round(e.pageX - $("#watercolorUVPlane").offset().left - 128));
    $("#watercolorU").trigger("input");
    $("#watercolorV").val(128 - (Math.round(e.pageY - $("#watercolorUVPlane").offset().top) - 128));
    $("#watercolorV").trigger("input");
    $("#watercolorUVPlaneSelectorV").css("margin-top",Math.round(e.pageY - $("#watercolorUVPlane").offset().top));
    $("#watercolorUVPlaneSelectorU").css("margin-left",Math.round(e.pageX - $("#watercolorUVPlane").offset().left));
  });
  $("#watercolorUVPlane").on("mouseover",function(e){
    $("#watercolorUVPlaneMousePosition").addClass("in");
  });
  $("#watercolorUVPlane").on("mouseout",function(e){
    $("#watercolorUVPlaneMousePosition").removeClass("in");
  });


  $("#filmUVPlane").on("mousemove",function(e){
    $(this).on("mousedown",function(){
      watercolorUVPlaneClick=true;
    });
    $("#ustateFilm").html(Math.round(e.pageX - $("#filmUVPlane").offset().left - 128));
    $("#vstateFilm").html(-(Math.round(e.pageY - $("#filmUVPlane").offset().top) - 128));
    var height=$("#filmUVPlaneMousePosition").height();
    var width=$("#filmUVPlaneMousePosition").width();
    var top=Math.round(e.pageY - $("#filmUVPlane").offset().top)+5;
    var left=Math.round(e.pageX - $("#filmUVPlane").offset().left)+5;
    if(parseInt(left)+parseInt(width)>256) left=256-width;
    if(parseInt(top)+parseInt(height)>256) top=256-height;
    $("#filmUVPlaneMousePosition").css("margin-top",top+"px");
    $("#filmUVPlaneMousePosition").css("margin-left",left+"px");
    if(watercolorUVPlaneClick){
      $("#filmU").val(128 + Math.round(e.pageX - $("#filmUVPlane").offset().left - 128));
      $("#filmU").trigger("input");
      $("#filmV").val(128 - (Math.round(e.pageY - $("#filmUVPlane").offset().top) - 128));
      $("#filmV").trigger("input");
      $("#filmUVPlaneSelectorV").css("margin-top",Math.round(e.pageY - $("#filmUVPlane").offset().top));
      $("#filmUVPlaneSelectorU").css("margin-left",Math.round(e.pageX - $("#filmUVPlane").offset().left));
    }
  });
  $("#filmUVPlane").on("mousedown",function(e){
    $("#filmU").val(128 + Math.round(e.pageX - $("#filmUVPlane").offset().left - 128));
    $("#filmU").trigger("input");
    $("#filmV").val(128 - (Math.round(e.pageY - $("#filmUVPlane").offset().top) - 128));
    $("#filmV").trigger("input");
    $("#filmUVPlaneSelectorV").css("margin-top",Math.round(e.pageY - $("#filmUVPlane").offset().top));
    $("#filmUVPlaneSelectorU").css("margin-left",Math.round(e.pageX - $("#filmUVPlane").offset().left));
  });
  $("#filmUVPlane").on("mouseover",function(e){
    $("#filmUVPlaneMousePosition").addClass("in");
  });
  $("#filmUVPlane").on("mouseout",function(e){
    $("#filmUVPlaneMousePosition").removeClass("in");
  });
  $(document).on("mouseup",function(){
    watercolorUVPlaneClick=false;
    filmUVPlaneClick=false;
  });
  fillTexts(texts);
});
