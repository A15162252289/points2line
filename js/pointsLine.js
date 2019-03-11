const pause = 'PAUSE';
const beginning = 'BEGINNING';
const continued = 'CONTINUED';
const end = 'END';
class PointsLine {
  constructor(canvas_width = 300, canvas_height = 150) {
    //初始化容纳多个点的数组
    this.points = [];
    //当前点的坐标
    this.cur_coordinate = [];
    //斜率以及偏移值
    this.arr_gradient_offset = [];
    //当前正在连接的起始点
    this.from = [];
    // 当前正在连接的终点
    this.to = [];
    //动画的速度
    this.rate = 5;
    //已连接的点数
    this.lined_points_number = 1;
    //暂停时，点的坐标
    this.pausedPoint = null;
    //检测传入的canvas宽高
    if (typeof canvas_width === 'number') {
      this.canvas_width = canvas_width;
    } else {
      this.canvas_width = 300;
    }
    if (typeof canvas_height === 'number') {
      this.canvas_height = canvas_height;
    } else {
      this.canvas_height = 150;
    }
  }
  //根据点的x值，斜率，偏移值，计算点的y值
  calcY(x, gradient, offset) {
    return x * gradient + offset;
  }
  //暂停
  pause() {
    this.status = this.status === pause ? continued : pause;
    if (this.status === pause) {
      this.pausedPoint = this.cur_coordinate;
    }
  }
  //结束
  end() {
    this.status = end;
  }
  //开始
  beginning() {
    this.status = beginning;
    this.initPoints(66);
  }
  //初始化点的坐标
  initPoints(points_number) {
    //生成points_number个点
    if (typeof points_number === 'number' && points_number > 1) {
      this.points[0] = [
        Math.round(Math.random() * this.canvas_width),
        Math.round(Math.random() * this.canvas_height)
      ];
      //随机生成点的坐标
      let gradient, offset, x, y;
      for (let i = 1; i < points_number; i++) {
        gradient = Math.random() > 0.5 ? Math.random() * 3 : -Math.random() * 3;
        offset = this.points[i - 1][1] - this.points[i - 1][0] * gradient;
        this.arr_gradient_offset.push([gradient, offset]);
        do {
          x =
            Math.random() > 0.5
              ? Math.round((Math.random() * this.canvas_width) / 2)
              : Math.round(
                  (Math.random() * this.canvas_width) / 2 +
                    this.canvas_width / 2
                );
          y = this.calcY(x, gradient, offset);
        } while (
          x <= 0 ||
          x >= this.canvas_width ||
          // x - this.points[i - 1][0] < 10 ||
          y <= 0 ||
          y >= this.canvas_height
        );
        this.points[i] = [x, y];
      }
    } else {
      alert('初始化多个点失败');
    }
    this.cur_coordinate = this.from = this.points[0];
    this.to = this.points[1];
  }
  //用白色实心圆表示点
  drawPoints(gd) {
    gd.fillStyle = 'white';
    this.points.forEach(x_y => {
      gd.beginPath();
      gd.arc(x_y[0], x_y[1], 2, Math.PI * 2, 0, true);
      gd.closePath();
      gd.fill();
    });
  }
  //绘图(核心)
  draw(gd) {
    gd.strokeStyle = '#E9967A';
    this.drawPoints(gd);
    if (this.status === pause || this.status === end) {
      this.drawLined(gd);
    } else {
      this.drawLine(gd);
    }
  }
  //画当前的线段
  drawLine(gd) {
    let [from_x, from_y] = this.from;
    let [to_x, to_y] = this.to;
    let [cur_x, cur_y] = this.cur_coordinate;
    let x_rate;
    if (from_x > to_x) {
      x_rate = -this.rate;
    } else {
      x_rate = this.rate;
    }

    cur_x = cur_x + x_rate;
    cur_y = this.calcY(
      cur_x,
      this.arr_gradient_offset[this.lined_points_number - 1][0],
      this.arr_gradient_offset[this.lined_points_number - 1][1]
    );

    gd.beginPath();

    gd.moveTo(from_x, from_y);
    if (this.status === pause) {
      gd.lineTo(this.pausedPoint[0], this.pausedPoint[1]);
    } else {
      gd.lineTo(cur_x, cur_y);
    }

    this.cur_coordinate = [cur_x, cur_y];
    gd.stroke();
    //当前线段结束的标志
    if (
      Math.pow(cur_x - from_x, 2) + Math.pow(cur_y - from_y, 2) >=
      Math.pow(to_x - from_x, 2) + Math.pow(to_y - from_y, 2)
    ) {
      this.from = this.to;
      this.lined_points_number++;
      this.to = this.points[this.lined_points_number];
    }

    if (this.lined_points_number > 1) {
      this.drawLined(gd);
    }
    if (this.lined_points_number === this.points.length) {
      this.end();
    }
  }
  //画已经连接上的线段
  drawLined(gd) {
    let [from_x, from_y] = this.points[0];
    gd.beginPath();
    gd.moveTo(from_x, from_y);
    for (let i = 1; i < this.lined_points_number; i++) {
      gd.lineTo(this.points[i][0], this.points[i][1]);
    }
    if (this.pausedPoint && this.status === pause) {
      gd.lineTo(this.pausedPoint[0], this.pausedPoint[1]);
    }
    gd.stroke();
  }
}
