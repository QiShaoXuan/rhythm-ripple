const utils = {
  colorHex(color) {
    var that = color
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(that)) {
      var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",")
      var strHex = "#"
      for (var i = 0; i < aColor.length; i++) {
        var hex = Number(aColor[i]).toString(16)
        if (hex.length < 2) {
          hex = '0' + hex
        }
        strHex += hex
      }
      if (strHex.length !== 7) {
        strHex = that
      }
      return strHex
    } else if (reg.test(that)) {
      ;
      var aNum = that.replace(/#/, "").split("")
      if (aNum.length === 6) {
        return that
      } else if (aNum.length === 3) {
        var numHex = "#"
        for (var i = 0; i < aNum.length; i += 1) {
          numHex += (aNum[i] + aNum[i])
        }
        return numHex
      }
    }
    return that
  },

  colorRgb(color) {
    var sColor = color.toLowerCase()
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = "#"
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      //处理六位的颜色值
      var sColorChange = []
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)))
      }
      // return "RGB(" + sColorChange.join(",") + ")"
      return sColorChange
    }
    return sColor
  },

  getRgbColor(color) {
    return this.colorRgb(this.colorHex(color))
  },

  randomAngle() {
    return parseInt(Math.random() * 360, 10)
  }
}

class musicCircle {
  constructor(container, params = {
    size: 500,
    radius: 100,
    interval: 1000,
    centerColor: '#009f9d',
    centerBg: './Qi.png',
    borderWidth: 5,
    borderColor: '#aaa',
    rippeWidth: 4,
    rippeColor: '#fff',
    pointRadius: 8,
    rotateAngle: .3,
  }) {
    this.container = document.querySelector(container)

    this.params = params

    this.radius = params.radius < 1 ? this.params.size * params.radius : params.radius

    this.center = this.params.size / 2

    this.rate = 0
    this.interval = Math.floor(this.params.interval / 16.7)
    this.rippeLines = []
    this.rippePoints = []

    this.rippeLineColor = utils.getRgbColor(this.params.rippeColor)

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
      const point = this.rippePoints[index]
      line.r += 1
      line.color[3] = (this.center - line.r) / (this.center - this.radius)
      line.gapAngle = Math.PI / 180 * point.angle

      return line
    })

    this.rippePoints = this.rippeLines.map((line, index) => {
      const point = this.rippePoints[index]
      point.x = this.center - line.r * Math.cos(point.angle)
      point.y = this.center - line.r * Math.sin(point.angle)
      point.color = line.color
      return point
    })

    this.strokeRippeLine()
    this.strokeRippePoint()
  }

  strokeRippeLine() {

    const ctx = this.ctx
    this.rippeLines.forEach((line, index) => {
      const gapAngle = Math.acos(Math.cos(this.params.pointRadius / line.r))
      console.log('line.gapAngle',line.gapAngle)
      ctx.beginPath()
      ctx.arc(this.center, this.center, line.r, line.gapAngle, 2 * Math.PI )
      // ctx.closePath()
      ctx.strokeStyle = `rgba(${line.color.join(',')})`
      ctx.lineWidth = this.params.rippeWidth
      console.log('l', `rgba(${line.color.join(',')})`)
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
      console.log('p', `rgba(${point.color.join(',')})`)
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

    // requestAnimationFrame(this.animate.bind(this))
  }
}

const m = new musicCircle('#canvas-container')


m.animate()




