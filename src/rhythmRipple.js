import utils from './utils'

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
 * @param {number} [params.rippleWidth = 4] - 涟漪圆环的宽度
 * @param {string} [params.rippleColor = '#fff'] - 涟漪颜色
 * @param {number} [params.pointRadius = 8] - 涟漪圆点的半径
 * @param {number} [params.rotateAngle = .3] -封面图每帧旋转的角度
 */

class RhythmRipple {
  constructor(container, audioElement, params = {}) {
    const originParams = {
      size: 500,  // 画布 canvas 的尺寸
      radius: 100,  // 封面图，中心圆的半径，小于零则为容器的百分比
      minInterval: 500,  // 涟漪出现的最小频率（毫秒）
      centerColor: '#ddd',  // 封面图位置的颜色（在没有封面图时显示）
      borderWidth: 5,  //  封面图边框的宽度
      borderColor: '#aaa',  // 封面图边框的颜色
      rippleWidth: 4,  // 涟漪圆环的宽度
      rippleColor: '#fff',  // 涟漪颜色
      pointRadius: 8,  // 涟漪圆点的半径
      rotateAngle: .3, // 封面图每帧旋转的角度
    }

    this.container = typeof container === "string" ? document.querySelector(container) : container

    this.audio = typeof audioElement === "string" ? document.querySelector(audioElement) : audioElement

    this.params = Object.assign(originParams, params)

    this.cover = undefined  // 封面图，应当存在 audio 标签的 cover 属性中

    this.radius = this.params.radius < 1 ? this.params.size * this.params.radius : this.params.radius

    this.center = this.params.size / 2  // 中心点

    this.rate = 0  // 记录播放的帧数
    this.frame = null  // 帧动画，用于取消
    this.rippleLines = []  // 存储涟漪圆环的半径
    this.ripplePoints = []  // 存储涟漪点距离中心点的距离

    this.audioContext = null
    this.analyser = null
    this.source = null
    this.lastripple = 0

    this.initAudio()
    this.initCanvas()
  }

  initCanvas() {
    this.container.innerHTML = `<canvas width="${this.params.size}" height="${this.params.size}"></canvas>${this.cover ? `<img src="${this.cover}" alt="">` : ''}`

    this.cover = this.container.querySelector('img')
    this.canvas = this.container.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.rotate = 0

    const containerStyle = {
      'position': 'relative',
      'overflow': 'hidden',
      'width':`${this.params.size}px`,
      'height':`${this.params.size}px`,
    }
    const canvasStyle = {
      'display': 'block',
      'background': 'transparent',
    }
    const coverStyle = {
      'width': `${this.radius * 2}px`,
      'height': `${this.radius * 2}px`,
      'border-radius': '50%',
      'object-fit': 'cover',
      'position': 'absolute',
      'left': '0',
      'right': '0',
      'top': '0',
      'bottom': '0',
      'margin': 'auto'
    }

    utils.addStyles(this.container, containerStyle)
    utils.addStyles(this.canvas, canvasStyle)
    utils.addStyles(this.cover, coverStyle)

    this.strokeBorder()
  }

  initAudio() {
    const that = this

    this.cover = this.audio.getAttribute('cover')

    this.audio.addEventListener('playing', function () {
      that.animate()
    })

    this.audio.addEventListener('pause', function () {
      that.cancelAnimate()
    })

    this.audio.addEventListener('ended', function () {
      that.cancelAnimate()
      that.strokeCenterCircle()
      that.strokeBorder()
      that.cover.style.transform = 'rotate(0deg)'
    })
  }

  initAtx() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.analyser = this.audioContext.createAnalyser()
    this.source = this.audioContext.createMediaElementSource(this.audio)
    this.source.connect(this.analyser)
    this.analyser.connect(this.audioContext.destination)

    this.analyser.fftSize = 32
    this.bufferLength = this.analyser.fftSize
    this.dataArray = new Float32Array(this.bufferLength)
  }

  strokeCenterCircle() {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.arc(this.center, this.center, this.radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = this.params.centerColor
    ctx.fill()
  }

  strokeBorder() {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.arc(this.center, this.center, this.radius + this.params.borderWidth / 2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.strokeStyle = this.params.borderColor
    ctx.lineWidth = 5
    ctx.stroke()
  }

  strokeRipple() {
    if (this.rippleLines[0] > this.params.size) {
      this.rippleLines.shift()
      this.ripplePoints.shift()
    }

    this.analyser.getFloatTimeDomainData(this.dataArray)

    if (this.rate - this.lastripple > this.params.minInterval && Math.max(...this.dataArray) > .3) {
      this.rippleLines.push({
        r: this.radius + this.params.borderWidth + this.params.rippleWidth / 2,
        color: utils.getRgbColor(this.params.rippleColor)
      })

      this.ripplePoints.push({
        angle: utils.randomAngle()
      })

      this.lastripple = this.rate
    }

    this.rippleLines = this.rippleLines.map((line, index) => {

      line.r += 1
      line.color[3] = (this.center - line.r) / (this.center - this.radius)
      line.gapAngle = Math.asin(this.params.pointRadius / 2 / line.r) * 2
      line.startAngle = this.ripplePoints[index]['angle'] + line.gapAngle

      return line
    })

    this.ripplePoints = this.rippleLines.map((line, index) => {
      const point = this.ripplePoints[index]

      point.x = this.center + line.r * Math.cos(point.angle)
      point.y = this.center + line.r * Math.sin(point.angle)
      point.color = line.color

      return point
    })

    this.strokeRippleLine()
    this.strokeRipplePoint()
  }

  strokeRippleLine() {
    const ctx = this.ctx
    this.rippleLines.forEach((line, index) => {

      ctx.beginPath()
      ctx.arc(this.center, this.center, line.r, line.startAngle, line.startAngle + 2 * Math.PI - line.gapAngle * 2)
      ctx.strokeStyle = `rgba(${line.color.join(',')})`
      ctx.lineWidth = this.params.rippleWidth
      ctx.stroke()
    })
  }

  strokeRipplePoint() {
    const ctx = this.ctx
    this.ripplePoints.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, this.params.pointRadius, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fillStyle = `rgba(${point.color.join(',')})`
      ctx.fill()
    })
  }

  animate() {
    this.ctx.clearRect(0, 0, this.params.size, this.params.size)

    if (!this.audioContext) {
      this.initAtx()
    }

    this.strokeRipple()
    this.strokeBorder()

    if (this.cover) {
      this.rotate += this.params.rotateAngle
      this.cover.style.transform = `rotate(${this.rotate}deg)`
    }else{
      this.strokeCenterCircle()
    }

    this.rate += 16.7

    var that = this
    this.frame = requestAnimationFrame(function () {
      that.animate()
    })
  }

  cancelAnimate() {
    cancelAnimationFrame(this.frame)
  }
}

window.RhythmRipple = RhythmRipple

export default RhythmRipple
