// Html5のCanvasをラッピングしたクラス
class MyCanvas {
    // コンストラクタ
    constructor(id, w, h) {
        this.width = w;
        this.height = h;
        this.canvas = document.getElementById(id);
        this.canvas.setAttribute('width', (w * 2).toString());
        this.canvas.setAttribute('height', (h * 2).toString());
        this.ctx = this.canvas.getContext('2d');
        // フィールドは１次元配列で表す。ここで、色の有り無しを判断。
        this.field = new Array(w * h).fill(0);
    }

    // 点を打つ
    drawPoint(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * 2, y * 2, 2, 2);
        this.field[x + y * this.width] = 1;
    };

    // その地点の色を返す （0 or 1）
    getColor(x, y) {
        return this.field[x + y * this.width];
        // 以下のように書けば、this.field は不要になる。
        //var pixel  = this.ctx.getImageData(x*2, y*2, 1, 1);
        //var data = pixel.data;
        //return Util.toRgbaStr(data[0], data[1], data[2], data[3]);
    };

    // その地点の点を消す
    clearPoint(x, y) {
        this.ctx.clearRect(x * 2, y * 2, 2, 2);
        this.field[x + y * this.width] = 0;
    };

    // 全てを消す
    clear() {
        this.ctx.clearRect(0, 0, this.width * 2, this.height * 2);
    };
};

// ユーティリティクラス
class Util {
    // 0からmax未満の値を返す
    static random(max) {
        return Math.floor(Math.random() * max) + 1;
    };

    // r,g,bの値から、JavaScriptの rgb 文字列を作成する
    static toRgbaStr(r, g, b, a) {
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    };

    // ランダムに色を作り出す
    static makeColor() {
        let r = (Util.random(4) - 1) * 80;
        let g = (Util.random(4) - 1) * 60;
        let b = (Util.random(4) - 1) * 40;
        return Util.toRgbaStr(r, g, b, 1);
    };

}

// 一匹のアリを表す
class Ant {
    // コンストラクタ
    constructor(canvas, point) {
        this.canvas = canvas;
        this._width = canvas.width;
        this._height = canvas.height;
        this._direction = Util.random(4) - 1;

        this.point = { X: point.X, Y: point.Y };
        this.color = Util.makeColor();
    }

    // 一歩進む
    walk() {
        let x = this.point.X;
        let y = this.point.Y;
        let currColor = this.canvas.getColor(x, y);
        if (currColor === 0) { //'rgba(0,0,0,0)') {
            // 白だったら 方向を変えて  実際は白でなく何も描画していない状態なら
            this._direction = (this._direction + 1) % 4;
            // 色を反転
            this.canvas.drawPoint(x, y, this.color);
        } else {
            // 色があれば 方向を変えて
            this._direction = (this._direction + 3) % 4;
            // 色を反転
            this.canvas.clearPoint(x, y);
        }
        // 向きを変える
        switch (this._direction) {
            case 0:  //北
                this.point.Y = (this.point.Y + this._height - 1) % this._height;
                break;
            case 1:  //東
                this.point.X = (this.point.X + 1) % this._width;
                break;
            case 2:  //南
                this.point.Y = (this.point.Y + 1) % this._height;
                break;
            default:  //西
                this.point.X = (this.point.X + this._width - 1) % this._width;
                break;
        }
    };
}

// ラングトンのアリのシミュレーションクラス
class AntWorld {
    // コンストラクタ
    constructor(canvas) {
        this._canvas = canvas;
        this._timer = {};
    }

    // シミュレーション開始
    start(count) {
        // 最初にアリを配置
        let canvas = this._canvas;
        canvas.clear();
        let ants = [];
        for (let i = 0; i < count; i++) {
            let point = {
                X: Util.random(canvas.width - 90) + 45,
                Y: Util.random(canvas.height - 90) + 45
            };
            let ant = new Ant(canvas, point);
            ants.push(ant);
        }
        // アリを動かす stopされるまで繰り返す。
        this._timer = setInterval(() => {
            for (var ant of ants) {
                ant.walk();
            }
        }, 0);
    };

    // シミュレーション 停止
    stop() {
        clearInterval(this._timer);
    };
}

class Program {
    // コンストラクタ
    constructor(width, height) {
        let canvas = new MyCanvas('mycanvas', width, height);
        this.world = new AntWorld(canvas);
    }

    // プログラム開始 （イベントハンドラの設定）
    run(count) {
        document.getElementById('startButton')
            .addEventListener('click', () => this.start(count), false);
        document.getElementById('stopButton')
            .addEventListener('click', () => this.stop(), false);
    };

    // startボタンが押された時の処理    
    start(count) {
        this.world.start(count);
    };

    // stopボタンが押された時の処理    
    stop() {
        this.world.stop();
    };
}

window.onload = () => {
    let program = new Program(250, 150);
    program.run(2);  // 1匹を動かす
}; v