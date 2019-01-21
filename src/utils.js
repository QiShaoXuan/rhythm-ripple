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
    return Math.PI / 180 * parseInt(Math.random() * 360, 10)
  },

  randomInterval(min,max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10)
  },

  addStyles(dom, styles) {
    if (dom) {
      for (let key in styles) {
        dom['style'][key] = styles[key]
      }
    }
  },

  loadSource(url){
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function () {
        resolve(request.response)
      }
      request.send()
    })

  }
}

export default utils
