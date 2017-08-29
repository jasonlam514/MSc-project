var result = 0.9999999999999999;
var ini = 0;
var near = 0;
var far = 0;
var assist = false;
var prop = 'Pmax=? [ ((safe_drive)&(non_stop)) U (reach_end) ]';
var vars = ['car_pos','task_active','M_active','D_active','C_active','E_update','M_update','near_point','far_point','near_set','far_set','near_found','near_distracted','far_distracted','memory_1','memory_1_dist','memory_1_limit','memory_2','memory_2_dist','memory_3','memory_3_dist','process_near','process_far','decision','distance','velocity','set_acc','assist','light_signal','road_update','counter'];
var data = [
[0,true,false,false,false,true,false,4,44,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,1,6,6,true,0,1,false,1],
[6,true,false,false,false,true,false,10,50,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,1,false,2],
[18,true,false,false,false,true,false,22,62,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,1,false,3],
[30,true,false,false,false,true,false,34,74,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,1,false,4],
[42,true,false,false,false,true,false,46,86,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,1,false,5],
[54,true,false,false,false,true,false,58,98,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,2,false,1],
[66,true,false,false,false,true,false,70,110,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,3,false,1],
[78,true,false,false,false,true,false,82,122,true,true,true,false,false,3,43,9,0,-1,0,-1,false,true,0,12,6,true,0,3,false,2],
[90,true,false,false,false,true,false,94,134,true,true,true,false,false,3,31,9,3,31,0,-1,false,true,0,12,6,true,0,3,false,3],
[102,true,false,false,false,true,false,106,146,true,true,true,false,false,4,19,9,3,19,3,19,false,true,3,8,2,true,0,4,false,1],
[110,true,false,false,false,true,false,114,154,true,true,true,false,false,1,11,9,4,11,3,11,false,true,0,4,2,true,0,1,false,1],
[114,true,false,false,false,true,false,118,158,true,true,true,false,false,1,7,9,1,7,4,7,false,true,0,4,2,true,0,1,false,2],
[118,true,false,false,false,true,false,122,158,true,false,true,false,false,1,3,9,1,3,1,3,true,false,3,0,0,true,0,1,false,3],
[118,true,false,false,false,true,false,122,158,true,false,true,false,false,1,3,9,1,3,1,3,true,false,3,0,0,true,0,1,false,4],
[118,true,false,false,false,true,false,122,158,true,false,true,false,false,1,3,9,1,3,1,3,true,false,3,0,0,true,0,1,false,5],
[118,true,false,false,false,true,false,122,162,true,true,true,false,false,2,3,9,1,3,1,3,false,true,1,6,6,true,0,2,false,1],
[124,true,false,false,false,true,false,128,168,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,3,false,1],
[136,true,false,false,false,true,false,140,170,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,3,false,2],
[148,true,false,false,false,true,false,152,170,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,3,false,3],
[160,true,false,false,false,true,false,164,170,true,true,true,false,false,0,-1,9,0,-1,0,-1,false,true,0,12,6,true,0,4,false,1],
[170,true,true,false,false,false,false,170,170,true,false,false,false,false,0,-1,38,0,-1,0,-1,false,false,0,12,6,true,0,1,false,1]
];
var violation = false;
var t = 2;
var ratio = 4;
var car_pos = vars.indexOf("car_pos");
var near_distracted = vars.indexOf("near_distracted");
var far_distracted = vars.indexOf("far_distracted");
var memory_1 = vars.indexOf("memory_1");
var memory_1_dist = vars.indexOf("memory_1_dist");
var memory_1_limit = vars.indexOf("memory_1_limit");
var memory_2 = vars.indexOf("memory_2");
var memory_2_dist = vars.indexOf("memory_2_dist");
var memory_3 = vars.indexOf("memory_3");
var memory_3_dist = vars.indexOf("memory_3_dist");
var decision = vars.indexOf("decision");
var velocity = vars.indexOf("velocity");
var assist_acc = vars.indexOf("assist");
var light_signal = vars.indexOf("light_signal");
var near_point = vars.indexOf("near_point");
var far_point = vars.indexOf("far_point");
var acc = [0, 1, -1, -2];
$(".prop").html(prop);
$(".prob").html('Probability: ' + result);
$(".ini").html('Initial speed: ' + ini);
$(".near").html('Near point distraction probability: ' + near);
$(".far").html('Far point distraction probability: ' + far);
$(".assist").html('Assist mode: ' + assist);
data[data.length-1][car_pos] = Math.max(data[data.length-2][velocity]*t+Math.round(0.5*t*t*Math.max(acc[data[data.length-2][decision]]+data[data.length-2][assist_acc],-10))+data[data.length-2][car_pos],data[data.length-1][car_pos]);
var twolight = false;

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var pos = 275;
var car_w = 25;
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
var cycle;
var l;
var time;
var test = '2';
var road_length = 170;
var light_pos_1 = 121;
var light_pos_2 = 200;
var checked = true;

var BrowserDetect = {
  init: function() {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent) ||
      this.searchVersion(navigator.appVersion) ||
      "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function(data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      } else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function(dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
  },
  dataBrowser: [{
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {
      string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    { 
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    { 
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS: [{
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
      string: navigator.userAgent,
      subString: "iPhone",
      identity: "iPhone/iPod"
    },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

};
BrowserDetect.init();
var run = false;
if (BrowserDetect.browser == "Firefox") {
  var notify = confirm("Firefox seems to have an issue rendering this and can cause your machine to crash, so please use google chrome or safari");
  if (notify == true) {
    var notify2 = confirm("You sure you want to run this?");
    if (notify2 == true) {
      var run = true;
    } else {
      run = false;
    }
  } else {
    var run = false;
  }
} else {
  var run = true;
}
if (run == true) {
  if (!ctx.setLineDash) {
    ctx.setLineDash = function() {
      console.log("browser not supported for dashed lines");
    }
  }

  var w = road_length * ratio,
    h = 540;
  if(w > light_pos_2*ratio){
    twolight = true;
  }
  canvas.width = w;
  canvas.height = h;
  var roads = [],
    cars = [];
  var frame_no = $("#fr").val();

  function init() {
    frame_no = $("#fr").val();
    $(".frame_no").html(frame_no);
    cars = [];
    roads = [];
    l = new drawlight(light_pos_1);
    if(twolight){
      l2 = new drawlight(light_pos_2);
    }
    var car = new drawcar();
    car.s = 5;
    car.x = w + 25;
    car.y = 378;
    car.d = "e";
    var color = "#E22322";
    console.log(color);
    car.color = color;
    cars.push(car);

    var road = new drawroad();
    road.x = 0, road.y = pos, road.width = w, road.height = 80;
    roads.push(road);
  }

  function drawscene() {
    ctx.fillStyle = "#4DBB4C";
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < roads.length; i++) {
      roads[i].draw();
    }
    cycle += 1;
    drive_cars();
  }
  var left_green = false;
  setInterval("left_greenc()", 3000);

  function left_greenc() {
    left_green = !left_green;
  }

  function drive_cars() {
    var c = cars[0];
    if (c.d == "e") {
      if (c.x > canvas.width) {
        cycle = 0;
        c.x = -25;
        c.y = pos+69;
        c.x = 0;
        c.d = "e";
        c.y -= c.s;
      }
    }
    frame_no = $("#fr").val();
    $(".frame_no").html(frame_no);
    time = parseInt((cycle) / frame_no, 10);
    $(".ani_speed").html(ani_speed);

    if (cycle == 0) {
      c.x = data[parseInt(cycle / frame_no, 10)][car_pos];
    } else {
      c.x += next
    };
    if (parseInt(cycle / frame_no, 10) + 1 < data.length) {
      next = (data[parseInt((cycle) / frame_no, 10) + 1][car_pos] - data[parseInt((cycle) / frame_no, 10)][car_pos]) * ratio / frame_no;
    }

    l.current = data[parseInt(cycle / frame_no, 10)][light_signal] - 1;
    if(twolight){
      l2.current = data[parseInt(cycle / frame_no, 10)][light_signal] - 1;
    }

    ctx.fillStyle = 'black';
    var car_pos1 = Math.min(parseInt(Math.round(c.x) / ratio), road_length);
    ctx.fillText('car position: ' + car_pos1, 10, pos+135);
    ctx.fillText('cycle: ' + time, 10, pos+155);
    ctx.fillText('m1: ' + getlight(data[parseInt(cycle / frame_no, 10)][memory_1]) + ' ' + data[parseInt(cycle / frame_no, 10)][memory_1_dist] + '    limit:' + data[parseInt(cycle / frame_no, 10)][memory_1_limit], 10, pos+175);
    ctx.fillStyle = 'black';
    ctx.fillText(' m2: ' + getlight(data[parseInt(cycle / frame_no, 10)][memory_2]) + ' ' + data[parseInt(cycle / frame_no, 10)][memory_2_dist], 150, pos+175);
    ctx.fillStyle = 'black';
    ctx.fillText(' m3: ' + getlight(data[parseInt(cycle / frame_no, 10)][memory_3]) + ' ' + data[parseInt(cycle / frame_no, 10)][memory_3_dist], 290, pos+175);
    ctx.fillStyle = 'black';
    ctx.fillText('acceleration: ' + getacc(data[parseInt(cycle / frame_no, 10)][decision]), 10, pos+195);
    ctx.fillText('assistive acceleration: ' + data[parseInt(cycle / frame_no, 10)][assist_acc], 10, pos+215);
    ctx.fillText('velocity: ' + data[parseInt(cycle / frame_no, 10)][velocity], 10, pos+235);

    if (violation) {
      ctx.fillText('Property is violated!', 150, 185);
    }

    var near_dis = (data[parseInt(cycle / frame_no, 10)][near_point] - data[parseInt(cycle / frame_no, 10)][car_pos]);
    var far_dis = (data[parseInt(cycle / frame_no, 10)][far_point] - data[parseInt(cycle / frame_no, 10)][car_pos]);
    document.getElementById('distraction').onclick = function() {
      near_dis = (data[parseInt(cycle / frame_no, 10)][near_point] - data[parseInt(cycle / frame_no, 10)][car_pos]);
      far_dis = (data[parseInt(cycle / frame_no, 10)][far_point] - data[parseInt(cycle / frame_no, 10)][car_pos]);
      if (this.checked) {
        checked = true;
        if (checked) {
          if (!data[parseInt(cycle / frame_no, 10)][near_distracted]) {
            ctx.fillStyle = "rgba(20, 20, 155, 0.4)";
            ctx.fillRect(c.x + car_w, c.y - 3, near_dis * ratio, 19);
          }
          if (!data[parseInt(cycle / frame_no, 10)][far_distracted]) {
            ctx.fillStyle = "rgba(155, 20, 20, 0.4)";
            ctx.fillRect(c.x + near_dis * ratio + car_w, c.y - 3, far_dis * ratio, 19);
          }
        }
        l.draw();
		l2.draw();
      } else {
        checked = false;
        roads[0].draw();
        c.draw();
        l.draw();
		l2.draw();
      }
    }
    if (checked) {
      if (!data[parseInt(cycle / frame_no, 10)][near_distracted]) {
        ctx.fillStyle = "rgba(20, 20, 155, 0.4)";
        ctx.fillRect(c.x + car_w, c.y - 3, near_dis * ratio, 19);
      }
      if (!data[parseInt(cycle / frame_no, 10)][far_distracted]) {
        ctx.fillStyle = "rgba(155, 20, 20, 0.4)";
        ctx.fillRect(c.x + near_dis * ratio + car_w, c.y - 3, far_dis * ratio, 19);
      }
    }


    c.draw();
    l.draw();
	l2.draw();
    l.counter++;
	l2.counter++;
  }

  function getlight(val) {
    this.colors = ["no sign", "red", "red-yellow", "green", "yellow"];
    if (val > 0) {
      ctx.fillStyle = this.colors[val];
      if (val == 2) {
        ctx.fillStyle = "yellow"
      }
    }
    return this.colors[val];
  }

  function getacc(val) {
    this.acc = [0, 3, -1, -2];
    return this.acc[val];
  }

  Object.getPrototypeOf(ctx).rounded_rect = function(x, y, w, h, r) {
    if (typeof r === "undefined") {
      r = 2;
    }
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    this.fill();
  }

  function drawlight(light_pos) {
    this.x = light_pos * ratio + 6 + car_w;
    this.y = pos+75;
    this.current = 0; //red=0, red-yellow=1, green=2, yellow=3
    this.colors = ["red", "yellow", "green", "grey"];
    this.counter = 1;
    this.draw = function() {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.fillRect(this.x - 6.5, this.y - 6.5, 13, 33.5, 2);
      ctx.arc(this.x, this.y, 4, 0, 12 * Math.PI);
      if (this.current == 0 | this.current == 1) {
        ctx.fillStyle = this.colors[0];
      } else {
        ctx.fillStyle = this.colors[3];
      }
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y + 10, 4, 0, 12 * Math.PI);
      if (this.current == 1 | this.current == 3) {
        ctx.fillStyle = this.colors[1];
      } else {
        ctx.fillStyle = this.colors[3];
      }
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y + 20, 4, 0, 12 * Math.PI);
      if (this.current == 2) {
        ctx.fillStyle = this.colors[2];
      } else {
        ctx.fillStyle = this.colors[3];
      }
      ctx.fill();
    }
  }

  function drawcar() {
    this.x = 0;
    this.y = 0;
    this.s = 5;
    this.l = 25; 
    this.d = "e";
    this.dd = false;
    this.color = "#F5D600";

    this.draw = function() {
      ctx.fillStyle = this.color;
      if (this.d == "e") {
        this.w = car_w;
        ctx.rounded_rect(this.x - 25 + this.w, this.y, this.l, 12);
        ctx.fillStyle = "#99B3CE";
        ctx.fillRect(this.x - 10 + this.w, this.y, 5, 12);
        ctx.fillRect(this.x - 21 + this.w, this.y, 2, 12);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 11 + this.w, this.y - 2, 2, 2);
        ctx.fillRect(this.x - 11 + this.w, this.y + 12, 2, 2);
      }
    }
  }

  function drawroad() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.color = "#605A4C";

    this.draw = function() {

      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);

      ctx.fillStyle = "#A68B44";
      if (this.width < this.height && this.width > 40) {
        ctx.fillRect(this.x + ((this.width / 2) - 1), this.y, 2, this.height);

        ctx.beginPath();
        ctx.setLineDash([2, 5]);
        ctx.moveTo(this.x + ((this.width / 4) - 1), this.y);
        ctx.lineTo(this.x + ((this.width / 4) - 1), (this.y + this.height));
        ctx.closePath();
        ctx.strokeStyle = "#A09383";
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([2, 5]);
        ctx.moveTo(this.x + ((this.width / (4 / 3)) - 1), this.y);
        ctx.lineTo(this.x + ((this.width / (4 / 3)) - 1), (this.y + this.height));
        ctx.closePath();
        ctx.strokeStyle = "#A09383";
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x - 10, this.y, 10, this.height);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x + this.width, this.y, 10, this.height);

      } else if (this.width > this.height && this.height > 40) {
        ctx.fillRect(this.x, this.y + ((this.height / 2) - 1), this.width, 2);

        ctx.beginPath();
        ctx.setLineDash([2, 5]);
        ctx.moveTo(this.x, this.y + ((this.height / 4) - 1));
        ctx.lineTo((this.x + this.width), this.y + ((this.height / 4) - 1));
        ctx.closePath();
        ctx.strokeStyle = "#A09383";
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([2, 5]);
        ctx.moveTo(this.x, this.y + ((this.height / (4 / 3)) - 1));
        ctx.lineTo((this.x + this.width), this.y + ((this.height / (4 / 3)) - 1));
        ctx.closePath();
        ctx.strokeStyle = "#A09383";
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x, this.y - 10, this.width, 10);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x, this.y + this.height, this.width, 10);

      } else if (this.width > this.height && this.height < 41) {
        ctx.fillRect(this.x, this.y + ((this.height / 2) - 1), this.width, 2);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x, this.y - 10, this.width, 10);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x, this.y + this.height, this.width, 10);
      } else if (this.width < this.height && this.width < 41) {
        ctx.fillRect(this.x + ((this.width / 2) - 1), this.y, 2, this.height);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x - 10, this.y, 10, this.height);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x + this.width, this.y, 10, this.height);
      }
      ctx.fillStyle = "#A09383";
      ctx.fillRect(light_pos_1*ratio+car_w,this.y+this.height/2,2,(this.height/2)+1);
      if(twolight){
        ctx.fillRect(light_pos_2*ratio+car_w,this.y+this.height/2,2,(this.height/2)+1);         	
      }
    }
  }

  function animloop() {
    drawscene();
    idd = requestAnimFrame(animloop);
  }
  init();
  //animloop();
  var ani_speed = $("#sp").val();
  var idd;

  function set() {
    ani_speed = $("#sp").val();
    $(".ani_speed").html(ani_speed);
    fpsInterval = 1000 / ani_speed;
    cancelAnimationFrame(idd);
    var elem = document.getElementById("as");
    if (elem.value == "Pause") {
      startAnimating(ani_speed);
    }
  }

  function pause() {
    var elem = document.getElementById("as");
    if (elem.value == "Pause") {
      elem.value = "Run";
      cancelAnimationFrame(idd);
    } else {
      startAnimating(ani_speed);
      elem.value = "Pause";
    }
  }
  startAnimating(ani_speed);


  function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    console.log(startTime);
    animate();
  }

  function animate() {

    idd = requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
      drawscene();
    }
  }

}