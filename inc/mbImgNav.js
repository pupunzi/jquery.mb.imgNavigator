/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * Name:jquery.mb.imageNavigator
 * Version: 2.1
*/




(function($){
  jQuery.fn.imageNavigator = function (options){
    return this.each (function ()
    {

      this.options={
        areaWidth: 500,
        areaHeight:500,
        defaultnavWidth:150,
        draggerStyle:"2px dotted red",
        navOpacity:.8,
        loaderUrl:"loading.gif",
        additionalContenet:""
      };
      $.extend (this.options, options);

      options= this.options;
      var imgNav= this;

      var additionalContent, draggableElement, applContainer,image,imageW,imageH,imageContainer,imageContainerW,imageContainerH,navLocator,navigationThumb,navigationThumbW,navigationThumbH,nav,navW,navH,image_isHoriz,cont_isHoriz,ratio,actualIdx=0,onScreen=false,navCoordinateX,navCoordinateY;

      $(imgNav).css({
        width : imgNav.options.areaWidth
      });

      var images= $(imgNav).find(".imagesContainer");
      $(imgNav).empty();

      if ($.metadata){
        $.metadata.setType("class");
        $(images).each(function(){
          if ($(this).metadata().imageUrl) $(this).attr("imageUrl",$(this).metadata().imageUrl);
          if ($(this).metadata().navPosition) $(this).attr("navPosition",$(this).metadata().navPosition);
          if ($(this).metadata().navWidth) $(this).attr("navWidth",$(this).metadata().navWidth);
          if ($(this).metadata().NavCoordinates) $(this).attr("NavCoordinates",$(this).metadata().NavCoordinates);
        });
      }

      var imageURL=$(images[0]).attr("imageUrl");
      var navPos=$(images[0]).attr("navPosition");
      var navWidth= $(images[0]).attr("navWidth")?$(this).attr("navWidth"):imgNav.options.defaultnavWidth;//100;

      var titles=$(images).find(".title");
      var descriptions=$(images).find(".description");
      var additionalContents=$(images).find(".additionalContent");


      $(imgNav).append("<div class='imageContainer'></div>");

      imageContainer=$(imgNav).find(".imageContainer");
      $(imageContainer).css({
        overflow:"hidden",
        position: "relative",
        width:this.options.areaWidth+"px",
        height:this.options.areaHeight+"px"
      });
      var loader="<table id='loader' style='display:none;' cellpadding='0' cellspacing='0' width='100%' height='100%'><tr><td valign='middle' align='center'><img src='"+imgNav.options.loaderUrl+"' alt='loading'></td></tr></table>";
      $(imageContainer).append(loader);

      $(imgNav).prepend("<div class='imagesIndex'></div>");
      var imagesIndex=$(imgNav).find(".imagesIndex");
      $(imagesIndex).css({
        position: "relative",
        width:this.options.areaWidth,
        padding: "0"
      });
      $(imagesIndex).append(titles);

      var canClick=true;
      $(titles).each(function(i){
        $(this).click(function(){
          if (!canClick) return;
          actualIdx=i;
          canClick=false;
          imageURL=$(images[i]).attr("imageUrl");
          navPos=$(images[i]).attr("navPosition");
          navWidth= $(images[i]).attr("navWidth")?$(images[i]).attr("navWidth"):imgNav.options.defaultnavWidth;//100;
          if ($(images[i]).attr("NavCoordinates")){
            navCoordinateX=$(images[i]).attr("NavCoordinates").split(",")[0];
            navCoordinateY=$(images[i]).attr("NavCoordinates").split(",")[1];

            //console.log(navCoordinateX,navCoordinateY);
          }

          if(image)
            $(image).fadeOut(500, function() {
              startNav(imageURL);
            });
          else
            startNav(imageURL);
        });
      });

      $(imgNav).append("<div class='descriptionBox'></div>");
      var descriptionBox=$(imgNav).find(".descriptionBox");
      $(descriptionBox).html(descriptions[0]);

      function startNav(u) {
        navW=null;
        ratio=null;
        if (applContainer){
          $(applContainer).remove();
        }
        $(titles).each(function(i){
          if (i==actualIdx)
            $(this).addClass("selected");
          else
            $(this).removeClass("selected");
        });
        navW=navWidth;

        u=u+"?rdm="+Math.random();

        $("<img/>").attr({"src":u}).load(function(){buildnav(u);}).attr({"src":u}).error(imageFailed);
        $("#loader").fadeIn(500);
      }

      function imageFailed() {
        alert("non riesco a caricare: "+this.src);
      }

      function buildnav(u) {
        imageContainerW=$(imageContainer).width();
        imageContainerH=$(imageContainer).height();

        $("#loader").fadeOut(500, function(){canClick=true;});
        $(titles).bind("click",function(){return true;});
        $(imageContainer).click(function(){
          if($.browser.msie) $(nav).show();
          else
            $(nav).show();
        });
        $(imageContainer).mouseleave(function(){
          if($.browser.msie) $(nav).hide();
          else
            $(nav).hide();
        });

        //applContainer
        $(imageContainer).append("<div class='applContainer'></div>");
        applContainer = $(imgNav).find(".applContainer");
        $(applContainer).css({
          position:"relative",
          height:$(imageContainer).height()
        });

        $(applContainer).append("<div class='draggableElement'></div>");
        draggableElement=$(applContainer).find(".draggableElement");

        //todo: add a div for image containment

        //image
        $(draggableElement).append("<image class='navImage'>");
        image= $(draggableElement).find(".navImage");

        //additionalContent
        $(draggableElement).append("<div class='additionalContent'></div>");
        additionalContent=$(draggableElement).find(".additionalContent");
        $(additionalContent).css({position:"absolute", top:"0"});
        $(draggableElement).css({
          position:"absolute"
        });

        $(descriptionBox).html(descriptions[actualIdx]);
        $(additionalContent).html(additionalContents[actualIdx]);

        $(image).attr("src",u);
        $(image).hide();
        imageH=$(image).outerHeight();
        imageW=$(image).outerWidth();
        $(image).fadeIn(1000, function(){

          var t,l;
          if (!$(images[actualIdx]).attr("NavCoordinates")){
            t=-(imageH/2-($(nav).height()*3));
            l=-(imageW/2-($(nav).width()*3));
          }else{
            t=-(navCoordinateY-($(imageContainer).height()/2));
            l=-(navCoordinateX-($(imageContainer).width()/2));
            if (t>0) t=0;
            if (l>0) l=0;
          }
          //console.log(!$(images[actualIdx]).attr("NavCoordinates"), t, l)
          $(draggableElement).animate({
            top:t,
            left:l
          },500,"linear");
          refreshThumbPos(l,t);
        });
        $(draggableElement).draggable({
          containment:[$(imageContainer).offset().left-imageW+$(imageContainer).outerWidth(),$(imageContainer).offset().top-imageH+$(imageContainer).outerHeight(),$(imageContainer).offset().left,$(imageContainer).offset().top],
          start:function(){
            $(nav).hide();
            $(draggableElement).css({cursor:"move"});
          },
          stop:function(e,ui){
            refreshThumbPos(ui.position.left,ui.position.top);
            $(draggableElement).css({cursor:"default"});
            $(nav).show();
          }
        });
        $(draggableElement).bind("dblclick", function(){fitonScreen();});

        //nav SCREEN
        $(applContainer).append("<div class='nav'></div>");
        nav = $(imgNav).find(".nav");
        $(nav).css({
          position:"absolute",
          opacity: imgNav.options.navOpacity
        });

        //ZONE SELECTOR
        $(nav).append("<div id='navLocator'></div>");
        navLocator= $(imgNav).find("#navLocator");
        $(navLocator).css({
          zIndex: 10000,
          position: "absolute",
          border : imgNav.options.draggerStyle,
          backgroundColor: $.browser.msie?"white":"transparent",
          opacity: $.browser.msie?.5:1
        });
        $(nav).hide(1);
        $(navLocator).bind("dblclick",function(){fitonScreen();});
        $(navLocator).draggable({
          containment: 'parent',
          start:function(){
            $(navLocator).css({cursor:"move"});
          },
          drag:function(e,ui){
            refreshImagePos(ui.position.left,ui.position.top);
          },
          stop:function(){
            $(navLocator).css({cursor:"default"});
          }
        });

        //THUMB
        $(nav).append("<image class='navigationThumb'>");
        navigationThumb= $(imgNav).find(".navigationThumb");
        $(navigationThumb).attr("src",u);
        $(navigationThumb).bind("dblclick",function(){fitonScreen();});

        image_isHoriz= imageH < imageW;
        cont_isHoriz= imageContainerH < imageContainerW;
        ratio= imageH/navH;
        resetAllValue();
      }

      function fitonScreen(){
        if(!onScreen){
          navLocator.oldX=$(navLocator).css("left");
          navLocator.oldY=$(navLocator).css("top");
          draggableElement.oldX=$(draggableElement).css("left");
          draggableElement.oldY=$(draggableElement).css("top");
          var controller=((navW*imageContainerH)/navH)<imageContainerW;
          if(controller)
            $(image).css("width",imageContainerW);
          else
            $(image).css("height",imageContainerH);
          onScreen=true;
          $(navLocator).css("top",0);
          $(navLocator).css("left",0);
          $(draggableElement).css("top",0);
          $(draggableElement).css("left",0);
          $(draggableElement).bind("mousemove",imgNav.doNothing=function(){return false;});
          $(additionalContent).hide();

        } else{

          $(image).width("");
          $(image).height("");
          onScreen=false;
          $(draggableElement).css("top",draggableElement.oldY);
          $(draggableElement).css("left",draggableElement.oldX);
          $(navLocator).css("top",navLocator.oldY);
          $(navLocator).css("left",navLocator.oldX);
          $(draggableElement).unbind("mousemove",imgNav.doNothing);
          $(additionalContent).show();

        }
        resetAllValue();
        var x=$(navLocator).offsetLeft;
        var y=$(navLocator).offsetTop;
        refreshImagePos(x,y);
      }

      function refreshImagePos(x,y){
        ratio= imageH/navH;
        var posX=-(arguments[0]+1)*ratio;
        var posY=-(arguments [1]+1)*ratio;
        $(draggableElement).css("top",posY);
        $(draggableElement).css("left",posX);
      }

      function refreshThumbPos(x,y){
        ratio= imageH/navH;
        var posX=-(arguments[0]+1)/ratio;
        var posY=-(arguments [1]+1)/ratio;
        $(navLocator).css({
          top:posY,
          left:posX
        });
      }

      function setnavDim(){
        navW=!navW?imageContainerW/4:navW;
        navH=(navW*imageH)/imageW;
        $(navigationThumb).height(parseFloat(navH));
        navigationThumbW=$(navigationThumb).width();
        navigationThumbH=$(navigationThumb).height();
        //			$(nav).css({
        //				overflow:"hidden",
        //				width:navigationThumbW,
        //				height: navigationThumbH+10
        //			})
      }

      function setnavLocatorDim(){
        $(navLocator).width((imageContainerW*navW)/imageW);
        $(navLocator).height((imageContainerH*navH)/imageH);
      }

      function setnavPos(){
        switch(navPos){
          case "TL":
            $(nav).css("left",0);
            $(nav).css("top",0);
            break;
          case "TR":
            $(nav).css("top",0);
            $(nav).css("left",(imageContainerW-navigationThumbW));
            break;
          case "BL":
            $(nav).css("top",(imageContainerH-navigationThumbH));
            break;
          case "BR":
            $(nav).css("left",(imageContainerW-navigationThumbW));
            $(nav).css("top",(imageContainerH-navigationThumbH));
            break;
          default:
            var dim=($(imageContainer).width())-navigationThumbW;
            $(nav).css("left", dim);
            break;
        }
      }

      function resetAllValue(){
        imageContainerW=$(imageContainer).width();
        imageContainerH=$(imageContainer).height();
        cont_isHoriz= imageContainerH < imageContainerW;
        imageH=$(image).height();
        imageW=$(image).width();

        setnavDim();
        setnavLocatorDim();
        setnavPos();

      }

      function fullScreen(){
        if(!image) return;
        $(image).width("");
        $(image).height("");
        if($.browser.msie) $(nav).show();
        else
          $(nav).fadeIn(500);
        imageContainer.oldW=$(imageContainer).css("width");
        imageContainer.oldH=$(imageContainer).css("height");
        imageContainer.style.width= $(window).outerWidth();
        $(window).bind("resize", function(){fullScreen();});
        resetAllValue();
      }
      startNav(imageURL);
    });
  };

  jQuery.fn.extend (
  {
    getMouseX : function (e)
    {
      var mouseX;
      if ($.browser.msie) {
        mouseX = event.clientX + document.body.scrollLeft;
      } else {
        mouseX = e.pageX;
      }
      if (mouseX < 0) {
        mouseX = 0;
      }
      return mouseX;
    },
    getMouseY : function (e)
    {
      var mouseY;
      if ($.browser.msie) {
        mouseY = event.clientY + document.body.scrollTop;
      } else {
        mouseY = e.pageY;
      }
      if (mouseY < 0) {
        mouseY = 0;
      }
      return mouseY;
    }
  });

})(jQuery);
