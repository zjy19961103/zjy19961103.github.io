var canvas = document.getElementById("cas");
var ctx = canvas.getContext("2d");
resize();
window.onresize = resize;

function resize() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

var RAF = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
// 鼠标活动时，获取鼠标坐标
var warea = {x: null, y: null, max: 20000};
window.onmousemove = function (e) {
    e = e || window.event;
    warea.x = e.clientX;
    warea.y = e.clientY;
};
window.onmouseout = function (e) {
    warea.x = null;
    warea.y = null;
};
// 添加粒子
// x，y为粒子坐标，xa, ya为粒子xy轴加速度，max为连线的最大距离
var dots = [];
for (var i = 0; i < 70; i++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var xa = Math.random() * 3 - 1;
    var ya = Math.random() * 3 - 1;
    dots.push({
        x: x,
        y: y,
        xa: xa,
        ya: ya,
        max: 16000
    })
}
// 延迟100秒开始执行动画，如果立即执行有时位置计算会出错
setTimeout(function () {
    animate();
}, 100);

// 每一帧循环的逻辑
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 将鼠标坐标添加进去，产生一个用于比对距离的点数组
    var ndots = [warea].concat(dots);
    dots.forEach(function (dot) {
        // 粒子位移
        dot.x += dot.xa;
        dot.y += dot.ya;
        // 遇到边界将加速度反向
        dot.xa *= (dot.x > canvas.width || dot.x < 0) ? -1 : 1;
        dot.ya *= (dot.y > canvas.height || dot.y < 0) ? -1 : 1;
        // 绘制点
        ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 3, 3);
        ctx.fillStyle = "#ffff80";
        // 循环比对粒子间的距离
        for (var i = 0; i < ndots.length; i++) {
            var d2 = ndots[i];
            if (dot === d2 || d2.x === null || d2.y === null) continue;
            var xc = dot.x - d2.x;
            var yc = dot.y - d2.y;
            // 两个粒子之间的距离
            var dis = xc * xc + yc * yc;
            // 距离比
            var ratio;
            // 如果两个粒子之间的距离小于粒子对象的max值，则在两个粒子间画线
            if (dis < d2.max) {
                // 如果是鼠标，则让粒子向鼠标的位置移动
                if (d2 === warea && dis > (d2.max / 2)) {
                    dot.x -= xc * 0.01;
                    dot.y -= yc * 0.01;
                }
                // 计算距离比
                ratio = (d2.max - dis) / d2.max;
                // 画线
                ctx.beginPath();
                ctx.lineWidth = ratio / 2;
                ctx.strokeStyle = 'rgba(255,255,255,' + (ratio + 0.2) + ')';
                ctx.moveTo(dot.x, dot.y);
                ctx.lineTo(d2.x, d2.y);
                ctx.stroke();
            }
        }
        // 将已经计算过的粒子从数组中删除
        ndots.splice(ndots.indexOf(dot), 1);
    });
    RAF(animate);
}


// var canvasPage3 = document.getElementById("cas");
// canvasPage3.width = 1600;
// canvasPage3.height = 770;
// var ctx = canvasPage3.getContext("2d");
// var zhongX = 800;
// var zhongY = 385;
//
// function randomNum(x, y) {
//     return Math.floor(Math.random() * (y - x + 1) + x);
// }
//
// function randomColor() {
//     return "rgb(" + randomNum(0, 255) + "," + randomNum(0, 255) + "," + randomNum(0, 255) + ")";
// }
//
// function Ball() {
//     this.r = randomNum(0.1, 2);
//     this.color = "#ffff80";
//
//     this.x = randomNum(this.r, canvasPage3.width - this.r);
//     this.y = randomNum(this.r, canvasPage3.height - this.r);
//
//     this.speedX = randomNum(1, 3) * (randomNum(0, 1) ? 1 : -1);
//     this.speedY = randomNum(1, 3) * (randomNum(0, 1) ? 1 : -1);
// }
//
// Ball.prototype.move = function () {
//     this.x += this.speedX * 0.2;
//     this.y += this.speedY * 0.2;
//
//     if (this.x <= this.r) {
//         this.x = this.r;
//         this.speedX *= -1;
//     }
//     if (this.x >= canvasPage3.width - this.r) {
//         this.x = canvasPage3.width - this.r
//         this.speedX *= -1;
//     }
//     //小球碰到上边界的处理 反弹
//     if (this.y <= this.r) {
//         this.y = this.r;
//         //反弹
//         this.speedY *= -1;
//     }
//     //小球碰到下边界的处理 反弹
//     if (this.y >= canvasPage3.height - this.r) {
//         this.y = canvasPage3.height - this.r;
//         //反弹
//         this.speedY *= -1;
//     }
// }
//
// Ball.prototype.draw = function () {
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
//     ctx.fillStyle = this.color;
//     ctx.fill();
// }
//
// var balls = [];
// var arr = [];
// for (var i = 0; i < 0.0002 * canvasPage3.width * canvasPage3.height; i++) {
//     var ball = new Ball();
//     balls.push(ball);
// }
//
// setInterval(function () {
//     arr = [];
//     ctx.clearRect(0, 0, canvasPage3.width, canvasPage3.height);
//     for (var i = 0; i < balls.length; i++) {
//         balls[i].move();
//         balls[i].draw();
//         if (ballAndMouse(balls[i]) < 130) {
//             ctx.lineWidth = (130 - ballAndMouse(balls[i])) * 1.5 / 130;
//             ctx.beginPath();
//             ctx.moveTo(balls[i].x, balls[i].y);
//             ctx.lineTo(zhongX, zhongY);
//             ctx.strokeStyle = balls[i].color;
//             ctx.stroke();
//         }
//     }
//
//
//     for (var i = 0; i < balls.length; i++) {
//         for (var j = 0; j < balls.length; j++) {
//             if (ballAndBall(balls[i], balls[j]) < 80) {
//                 ctx.lineWidth = (80 - ballAndBall(balls[i], balls[j])) * 0.6 / 80;
//                 ctx.globalAlpha = (130 - ballAndBall(balls[i], balls[j])) / 80;
//                 ctx.beginPath();
//                 ctx.moveTo(balls[i].x, balls[i].y);
//                 ctx.lineTo(balls[j].x, balls[j].y);
//                 ctx.strokeStyle = balls[i].color;
//                 ctx.stroke();
//             }
//         }
//     }
//     ctx.globalAlpha = 1.0;
//
// }, 30);
//
// canvasPage3.onmousemove = function (event) {
//     event = event || window.event;
//     zhongX = event.offsetX;
//     zhongY = event.offsetY;
// }
//
// function ballAndMouse(obj) {
//     var disX = Math.abs(zhongX - obj.x);
//     var disY = Math.abs(zhongY - obj.y);
//     return Math.sqrt(disX * disX + disY * disY);
// }
//
// function ballAndBall(obj1, obj2) {
//     var disX = Math.abs(obj1.x - obj2.x);
//     var disY = Math.abs(obj1.y - obj2.y);
//     return Math.sqrt(disX * disX + disY * disY);
// }
