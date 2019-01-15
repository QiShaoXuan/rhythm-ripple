import utils from './utils'

class RhythmDisk {
  constructor(container, params = {}) {
    const originParams = {
      size: 500,
      radius: 100,
      interval: 1000,
      centerColor: '#ddd',
      centerBg: '',
      borderWidth: 5,
      borderColor: '#aaa',
      rippeWidth: 4,
      rippeColor: '#fff',
      pointRadius: 8,
      rotateAngle: .3,
    }

    this.container = document.querySelector(container)

    this.params = Object.assign(originParams,params)

    this.radius = this.params.radius < 1 ? this.params.size * this.params.radius : this.params.radius

    this.center = this.params.size / 2

    this.rate = 0
    this.interval = Math.floor(this.params.interval / 16.7)
    this.rippeLines = []
    this.rippePoints = []

    this.init()
  }

  init() {
    this.container.innerHTML = `<canvas width="${this.params.size}" height="${this.params.size}"></canvas>${this.params.centerBg ? `<img src="${this.params.centerBg}" alt="">` : ''}`

    this.bg = this.container.querySelector('img')
    this.canvas = this.container.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.rotate = 0

    const containerStyle = {
      'position': 'relative',
      'overflow': 'hidden'
    }
    const canvasStyle = {
      'display': 'block',
      'background': 'transparent',
    }
    const bgStyle = {
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
    utils.addStyles(this.bg, bgStyle)
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

  strokeRippe() {
    if (this.rippeLines[0] > this.params.size) {
      this.rippeLines.shift()
      this.rippePoints.shift()
    }

    if (this.rate % this.interval === 0) {

      this.rippeLines.push({
        r: this.radius + this.params.borderWidth + this.params.rippeWidth / 2,
        color: utils.getRgbColor(this.params.rippeColor)
      })

      this.rippePoints.push({
        angle: utils.randomAngle()
      })
    }

    this.rippeLines = this.rippeLines.map((line, index) => {

      line.r += 1
      line.color[3] = (this.center - line.r) / (this.center - this.radius)
      line.gapAngle = Math.asin(this.params.pointRadius / 2 / line.r) * 2
      line.startAngle = this.rippePoints[index]['angle'] + line.gapAngle

      return line
    })

    this.rippePoints = this.rippeLines.map((line, index) => {
      const point = this.rippePoints[index]

      point.x = this.center + line.r * Math.cos(point.angle)
      point.y = this.center + line.r * Math.sin(point.angle)
      point.color = line.color

      return point
    })

    this.strokeRippeLine()
    this.strokeRippePoint()
  }

  strokeRippeLine() {

    const ctx = this.ctx
    this.rippeLines.forEach((line, index) => {

      ctx.beginPath()
      ctx.arc(this.center, this.center, line.r, line.startAngle, line.startAngle + 2 * Math.PI - line.gapAngle * 2)
      ctx.strokeStyle = `rgba(${line.color.join(',')})`
      ctx.lineWidth = this.params.rippeWidth
      ctx.stroke()
    })
  }

  strokeRippePoint() {
    const ctx = this.ctx
    this.rippePoints.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, this.params.pointRadius, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fillStyle = `rgba(${point.color.join(',')})`
      ctx.fill()
    })
  }

  animate() {
    this.ctx.clearRect(0, 0, this.params.size, this.params.size)
    this.strokeRippe()

    this.strokeCenterCircle()
    this.strokeBorder()

    if (this.params.centerBg) {
      this.rotate += this.params.rotateAngle
      this.bg.style.transform = `rotate(${this.rotate}deg)`
    }

    this.rate += 1

    requestAnimationFrame(this.animate.bind(this))
  }
}

window.RhythmDisk = RhythmDisk




