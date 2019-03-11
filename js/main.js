window.onload = () => {
  //获取canvasDOM元素以及绘图上下文
  let oC = document.getElementById('canvas');
  let gd = oC.getContext('2d');
  let [canvas_height, canvas_width] = [oC.width, oC.height];
  //画灰色背景
  gd.fillStyle = 'gray';
  gd.fillRect(0, 0, canvas_height, canvas_width);
  //获取开始/重新开始，暂停/继续的dom
  let oStart = document.getElementById('start');
  let oPause = document.getElementById('pause');
  let pointsLine;
  //requestAnimationFrame将要执行的函数
  function animate() {
    requestAnimationFrame(animate);
    gd.clearRect(0, 0, canvas_height, canvas_width);
    gd.fillStyle = 'gray';
    gd.fillRect(0, 0, canvas_height, canvas_width);
    pointsLine.draw(gd);
  }
  let count = 0;
  //为button添加事件
  oStart.onclick = () => {
    pointsLine = new PointsLine(canvas_height, canvas_width);
    pointsLine.beginning();
    count === 0 && requestAnimationFrame(animate);
    count++;
  };
  oPause.onmousedown = oStart.onmousedown = function() {
    this.style.color = '#9555af';
    this.style.borderColor = 'currentColor';
    this.style.backgroundColor = 'white';
  };
  oPause.onmouseup = oStart.onmouseup = function() {
    this.style.color = '#ffffff';
    this.style.borderColor = '#9555af';
    this.style.backgroundColor = '#9555af';
  };
  oPause.onclick = oC.onclick = () => {
    if (pointsLine) {
      pointsLine.pause();
      if (pointsLine.status === pause) {
        console.log(pointsLine.status);
        oPause.innerHTML = '继续';
      } else if (pointsLine.status === continued) {
        oPause.innerHTML = '暂停';
      }
    }
  };
};
