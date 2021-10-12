// pages/convas/convas.js
const cWidth = 295
const cHeight = 500
const avatar = {
  x: 0,
  y: 0,
  width: 60,
  height: 60,
}
const posterName = {
  x: 80,
  y: 30,
  width: 215,
}
const qrCode = {
  x: 0,
  y: 140
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shareInfo: {
      type: Object,
      value: '',
      observer(data) {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pixelRatio: 0,
    pix: 0,
    canvasWidth: 0,
    canvasHeight: 0
  },
  lifetimes: {
    ready: function () {
      debugger
      this.init()
    },
    attached: function () {
      debugger
      const {
        pixelRatio,
        windowWidth
      } = wx.getSystemInfoSync()
      const pix = windowWidth / 375
      this.setData({
        pixelRatio,
        pix,
        canvasWidth: Math.round(675 * pix),
        canvasHeight: Math.round(1200 * pix),
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
     init() {
      debugger
      // 在组件实例进入页面节点树时执行
      const {
        shareInfo
      } = this.data;
      const ctx = wx.createCanvasContext('shareCanvas', this)
      const avatarW = avatar.width;
      const avatarH = avatar.height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cWidth, cHeight)
      ctx.fillStyle = '#000';
      this.dealWords({ ctx, fontSize: 26, word: shareInfo.name, maxWidth: posterName.width, x: posterName.x, y: posterName.y, maxLine: 1 })
      // ctx.fillText(shareInfo.name, posterName.width - ctx.measureText(shareInfo.name).width + posterName.x - 10, posterName.y);
      // 绘制二维码
      ctx.drawImage(shareInfo.img2, qrCode.x, qrCode.y, cWidth, cWidth);
      // 绘制头像
      ctx.beginPath();
      ctx.arc(avatar.x + 5 + avatarW / 2, avatar.y + 5 + avatarW / 2, avatarW / 2, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(shareInfo.img1, 0, 0, avatarW + 5, avatarH + 5);
      ctx.restore();
      ctx.draw(false, () => {
        this.save();
      })
    },
    save() {
      debugger
      const {
        pixelRatio,
        canvasHeight,
        canvasWidth
      } = this.data;
      wx.canvasToTempFilePath({
        width: canvasWidth,
        height: canvasHeight,
        destWidth: canvasWidth * pixelRatio,
        destHeight: canvasHeight * pixelRatio,
        canvasId: 'shareCanvas',
        success: res => {
          console.log(res);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              console.log(11111);
              wx.showToast({
                title: '已保存到相册',
              })
            },
            fail: (err) => {
              console.log(err);
              this.showModal();
            }
          })
        }
      }, this)
    },
    /**
     * 弹出提示授权模态弹框
     */
    showModal: function () {
      debugger
      wx.showModal({
        title: '用户未授权',
        showCancel: false,
        content: '如果需要正常使用小程序功能，请按确定并在授权管理中打开"相册"。最后再进入小程序即可正常使用',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting();
          }
        }
      });
    },
    dealWords: function (options) {
      debugger
      options.ctx.setFontSize(options.fontSize); //设置字体大小
      var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth); //实际总共能分多少行
      var count = allRow >= options.maxLine ? options.maxLine : allRow; //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数

      var endPos = 0; //当前字符串的截断点
      for (var j = 0; j < count; j++) {
        var nowStr = options.word.slice(endPos); //当前剩余的字符串
        var rowWid = 0; //每一行当前宽度    
        if (options.ctx.measureText(nowStr).width > options.maxWidth) { //如果当前的字符串宽度大于最大宽度，然后开始截取
          for (var m = 0; m < nowStr.length; m++) {
            rowWid += options.ctx.measureText(nowStr[m]).width; //当前字符串总宽度
            if (rowWid > options.maxWidth) {
              if (j === options.maxLine - 1) { //如果是最后一行
                options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 18); //(j+1)*18这是每一行的高度        
              } else {
                options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 18);
              }
              endPos += m; //下次截断点
              break;
            }
          }
        } else { //如果当前的字符串宽度小于最大宽度就直接输出
          options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 18);
        }
      }
    },
  }
})