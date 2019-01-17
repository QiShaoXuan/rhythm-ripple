# 音乐节奏动画

仿照网易云音乐 app 中音乐播放动画

## view online

https://qishaoxuan.github.io/rhythm-disk/

## 使用

```html
<div id="canvas-container"></div>
<audio src="./asset/LiquorWhisper.mp3" controls cover='./asset/cover.jpg' id="audio"></audio>


<script src="..../rhythmDisk.js"></script>
```

```js
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false
  const mobileOption = {
    size: window.innerWidth - 30,
    radius: .25,
    rippeWidth: 2,
    pointRadius: 4,
  }

  const rd = new RhythmDisk('#canvas-container', '#audio', isMobile? mobileOption : {})
```

## 参数

```js
/**
 * RhythmDisk
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
 * @param {number} [params.rippeWidth = 4] - 涟漪圆环的宽度
 * @param {string} [params.rippeColor = '#fff'] - 涟漪颜色
 * @param {number} [params.pointRadius = 8] - 涟漪圆点的半径
 * @param {number} [params.rotateAngle = .3] -封面图每帧旋转的角度
 */
```



