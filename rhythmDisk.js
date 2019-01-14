class musicCircle {
  constructor(container, params = {
    size: 500,
    radius: 100,
    centerColor: '#009f9d',
    centerBg: './Qi.png',
    borderWidth: 5,
    borderColor: '#cdffeb',
    rippeWidth: 4,
    rippeColor: '#ddd',
    rippeSpace: 20,
    rippeRate: 5,
    pointRadius: 8,
    rotateAngle: .3,

  }) {
    this.container = document.querySelector(container)

    this.params = params

    this.radius = params.radius < 1 ? this.params.size * params.radius : params.radius

    this.center = this.params.size / 2

    this.rate = 0
    this.rippeLines = [this.radius + this.params.borderWidth + this.params.rippeWidth / 2]
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

    this.addStyles(this.container, containerStyle)
    this.addStyles(this.canvas, canvasStyle)
    this.addStyles(this.bg, bgStyle)
  }

  addStyles(dom, styles) {
    if (dom) {
      for (let key in styles) {
        dom['style'][key] = styles[key]
      }
    }
  }

  strokeCenterCircle() {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.arc(this.center, this.center, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = this.params.centerColor
    ctx.closePath()
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
    // console.log(this.rate, this.rate % 40 === 0)
    if (this.rate % 20 === 0) {
      this.rippeLines.push(this.radius + this.params.borderWidth + this.params.rippeWidth / 2)
    }

    if (this.rippeLines[0] > this.params.size) {
      this.rippeLines.shift()
    }

    this.rippeLines = this.rippeLines.map((r) => r += this.params.rippeWidth)

    this.strokeRippeLine()
  }

  strokeRippeLine() {
    const ctx = this.ctx
    this.rippeLines.forEach((r, index) => {
      ctx.beginPath()
      ctx.arc(this.center, this.center, r, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.strokeStyle = this.params.rippeColor
      ctx.lineWidth = this.params.rippeWidth
      ctx.stroke()
    })


  }

  strokeRippePoint() {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.arc(this.center, this.center, this.radius + this.params.borderWidth + this.params.rippeWidth / 2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.strokeStyle = this.params.rippeColor
    ctx.lineWidth = this.params.rippeWidth
    ctx.stroke()
  }

  animate() {
    this.ctx.clearRect(0, 0, this.params.size, this.params.size)
    this.strokeCenterCircle()
    this.strokeBorder()

    this.strokeRippe()

    if(this.params.centerBg){
      this.rotate += this.params.rotateAngle
      this.bg.style.transform = `rotate(${this.rotate}deg)`
    }

    this.rate += 1
    // this.rate = this.rate > 100 ? 0 : this.rate

    requestAnimationFrame(this.animate.bind(this))
  }
}

const m = new musicCircle('#canvas-container')


m.animate()