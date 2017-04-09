  var canvasWidth = 600;
  var canvasHeight = canvasWidth;

  var strokeColor = "black";
  var isMouseDown = false;
  var lastLoc = {x: 0, y: 0}
  var lastTimestamp = 0;
  var lastLineWidth = -1;

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  //画出米字格
  function drawGrid() {

    context.save();

    context.strokeStyle = "rgb(230,11,9)";

    context.beginPath();
    context.moveTo(3, 3);
    context.lineTo(canvasWidth - 3, 3);
    context.lineTo(canvasWidth - 3, canvasHeight - 3);
    context.lineTo(3, canvasHeight - 3);
    context.closePath();
    context.lineWidth = 6;
    context.stroke();

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvasWidth, canvasHeight);

    context.moveTo(canvasWidth, 0);
    context.lineTo(0, canvasHeight);

    context.moveTo(canvasWidth / 2, 0);
    context.lineTo(canvasWidth / 2, canvasHeight);

    context.moveTo(0, canvasHeight / 2);
    context.lineTo(canvasWidth, canvasHeight / 2);

    context.lineWidth = 1;
    context.stroke();

    context.restore();
  }

  //按钮位置
  $("#controller").css("width", canvasWidth + "px");
  drawGrid();
  //清除画布
  $("#clear_btn").click(function (e) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      //重绘米字格
      drawGrid();
  });
  //选择颜色
  $(".color_btn").click(function (e) {
      $(".color_btn").removeClass("color_btn_selected");
      $(this).addClass("color_btn_selected");
      strokeColor = $(this).css("background-color")
  });
  //鼠标点下开始画
  function beginStroke(point) {
    isMouseDown = true;
    //console.log("mouse down!");
    //鼠标点下坐标
    lastLoc = windowToCanvas(point.x, point.y);
    //console.log(lastLoc);
    //时间
    lastTimestamp = new Date().getTime();
  }

  //松开鼠标
  function endStroke() {
    isMouseDown = false;
  }

  function windowToCanvas(x, y) {
    //获得元素到页面边距的距离
    var bbox = canvas.getBoundingClientRect();
    //返回点下坐标  到画布边缘距离
    return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)}
  }

  //写字
  function moveStroke(point) {
    //点下坐标
    var curLoc = windowToCanvas(point.x, point.y);
    //console.log(curLoc);
    //点下时间
    var curTimestamp = new Date().getTime();
    var s = calcDistance(curLoc, lastLoc);
    var t = curTimestamp - lastTimestamp;

    var lineWidth = calcLineWidth(t, s);

    //开始写字
    context.beginPath();
    //从一开始点下的点开始画
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(curLoc.x, curLoc.y);
    //console.log("lastLoc");
    //console.log(lastLoc);
    //console.log("curLoc");
    //console.log(curLoc);

    context.strokeStyle = strokeColor;

    context.lineWidth = lineWidth;

    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();

    lastLoc = curLoc;
    lastTimestamp = curTimestamp;
    lastLineWidth = lineWidth;
  }

  //判断鼠标是否点下 是否移出画布 是否在移动
  canvas.onmousedown = function (e) {
    e.preventDefault();
    beginStroke({x: e.clientX, y: e.clientY})
  };
  canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke();
  };
  canvas.onmouseout = function (e) {
    e.preventDefault();
    endStroke();
  };
  canvas.onmousemove = function (e) {
    e.preventDefault();
    if (isMouseDown) {
      moveStroke({x: e.clientX, y: e.clientY})
    }
  };


  //优化 根据速度快慢改变笔画大小
  var maxLineWidth = 30;
  var minLineWidth = 1;
  var maxStrokeV = 10;
  var minStrokeV = 0.1;

  //计算路程用来算速度
  function calcDistance(loc1, loc2) {
    //x*x+y*y开平方
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y))
  }

  function calcLineWidth(t, s) {

    var v = s / t;

    var resultLineWidth;
    if (v <= minStrokeV)
      resultLineWidth = maxLineWidth;
    else if (v >= maxStrokeV)
      resultLineWidth = minLineWidth;
    else {
      resultLineWidth = maxLineWidth - (v - minStrokeV) / (maxStrokeV - minStrokeV) * (maxLineWidth - minLineWidth);
    }

    if (lastLineWidth == -1)
      return resultLineWidth;

    return resultLineWidth * 1 / 3 + lastLineWidth * 2 / 3;
  }



