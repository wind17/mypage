//轮播
$(function () {
  var interval = 3000;//轮播时间
  var triggers = true;
  var switchfull = $(this);
  var slideshow = $("slideShow");
  var img = switchfull.find("#banner_slide ul li");
  img.first().css("opacity", 1);
  var nowindex = 1;//当前显示图片下标

  function slide(e) {
    $(".switchfull-triggers>li").eq(e - 1).addClass("current");
    $(".switchfull-triggers>li").eq(e - 1).siblings().removeClass("current");
    img.eq(e - 1).stop().animate({"opacity": 1}, 600).siblings().stop().animate({"opacity": 0}, 600);
  }
  var mytimer = setInterval(function () {
    nowindex++;
    if (nowindex > img.length) {
      nowindex = 1;
    }
    slide(nowindex);
  }, interval);

  $("#banner_slide").hover(function(){
    clearInterval(mytimer);
  },function(){
    mytimer=setInterval(function(){
      nowindex++;
      if(nowindex>img.length) nowindex=1;
      slide(nowindex);
    },interval);
  });
  if(triggers==true){
    var switchfull_triggers="<ul class='switchfull-triggers'>";
    for(var i=0;i<img.length;i++) {
      if(i==0){
        switchfull_triggers+="<li class='current'>&bull;</li>";
      }else{
        switchfull_triggers+="<li>&bull;</li>";
      }
    }
    switchfull_triggers+="</ul>";
    $("#banner_slide").after(switchfull_triggers);
    $(".switchfull-triggers").css("width",img.length*20+"px");
    $(".switchfull-triggers li").each(function(e){
      $(this).mouseover(function(){
        $(this).addClass("current");
        $(this).siblings().removeClass("current");
        nowindex=e+1;
        slide(nowindex);
      });
    });
  }

  $("#download").click(function () {
    $(".modal").css('display','block');
  })
  $(".modal span").click(function () {
    $(".modal").css('display','none');
  })
});









