# 音乐节奏动画

仿照网易云音乐 app 中音乐播放动画

## View online

### just animate 
https://qishaoxuan.github.io/rhythm-ripple/

### rhythm with music
https://qishaoxuan.github.io/rhythm-ripple/rhythm.html

## View in local
```bash
  git clone https://github.com/QiShaoXuan/rhythm-ripple.git
  cd rhythm-ripple
  npm install
  
  npm run rhythm 
  // OR
  npm run ripple
```

## Notice

鉴于 audiocontext 的兼容性问题 safari 无法实时获取到音乐数据（有解决的大神望告知），所以将依赖 audio 属性的动画改为随机（或固定）频率出现

- 依赖 audio 节奏引用 `./dist/rhythmRipple.js`
- 仅动画引用 `/dist/ripple.js`

## Usage

- Download the `rhythmRipple.js` in folder dist

```html
<body>
  <div id="canvas-container"></div>
  <audio src="./asset/LiquorWhisper.mp3" controls cover='./asset/cover.jpg' id="audio"></audio>
</body>


<script src="yourpath/rhythmRipple.js"></script>
<script>
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false
  
  const mobileOption = {
    size: window.innerWidth - 30,
    radius: .25,
    rippleWidth: 2,
    pointRadius: 4,
  }

  const rd = new RhythmRipple('#canvas-container', '#audio', isMobile? mobileOption : {})
</script>
```

## Options

### ripple.js
```js
/**
 * RhythmDisk
 * @constructor
 * @param {string | HtmlElement} container - 动画容器.
 * @param {object} [params] - 可自定义配置的参数
 *
 * @param {string} [params.size = ''] - 封面图路径
 * @param {number} [params.size = 500] - 画布 canvas 的尺寸
 * @param {number} [params.radius = 100] - 封面图，中心圆的半径，小于零则为容器的百分比
 * @param {number|Array} [params.randomInterval = [500,1500]] - 涟漪更新频率，数字为固定更新，数组则为在范围内的随机数
 * @param {number} [params.minInterval = 500] - 涟漪出现的最小频率（毫秒）
 * @param {string} [params.centerColor = '#ddd'] - 封面图位置的颜色（在没有封面图时显示）
 * @param {number} [params.borderWidth = 5] -  封面图边框的宽度
 * @param {string} [params.borderColor = '#aaa'] - 封面图边框的颜色
 * @param {number} [params.rippleWidth = 4] - 涟漪圆环的宽度
 * @param {string} [params.rippleColor = '#fff'] - 涟漪颜色
 * @param {number} [params.pointRadius = 8] - 涟漪圆点的半径
 * @param {number} [params.rotateAngle = .3] -封面图每帧旋转的角度
 */
```

### rhythmRipple.js
```js
/**
 * RhythmRipple
 * @constructor
 * @param {string | HtmlElement} container - 动画容器.
 * @param {string | HtmlElement} audioElement - 关联的 audio 标签
 * @param {object} [params] - 可自定义配置的参数
 *
 * @param {number} [params.size = 500] - 画布 canvas 的尺寸
 * @param {number} [params.radius = 100] - 封面图，中心圆的半径，小于零则为容器的百分比
 * @param {number} [params.minInterval = 500] - 涟漪出现的最小频率（毫秒）
 * @param {string} [params.centerColor = '#ddd'] - 封面图位置的颜色（在没有封面图时显示）
 * @param {number} [params.borderWidth = 5] -  封面图边框的宽度
 * @param {string} [params.borderColor = '#aaa'] - 封面图边框的颜色
 * @param {number} [params.rippleWidth = 4] - 涟漪圆环的宽度
 * @param {string} [params.rippleColor = '#fff'] - 涟漪颜色
 * @param {number} [params.pointRadius = 8] - 涟漪圆点的半径
 * @param {number} [params.rotateAngle = .3] -封面图每帧旋转的角度
 */
```
