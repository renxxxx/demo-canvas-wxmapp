// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    shareInfo: {
      img1: '../../assets/balance_card.png',
      img2: '../../assets/network-error.png',
      name: 'xxxx医院医院医院医院医院医院'
    },
    isShowCanvas: false,
  },

  onLoad() {
  },
  save() {
    this.setData({
      isShowCanvas: true
    })
  },

})