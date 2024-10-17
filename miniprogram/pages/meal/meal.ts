Page({
  data: {
    mealSummary: wx.getStorageSync('mealSummary'),
    imgSrc: '',
  },

  onShow() {
    console.log('Meal summary is ' + this.data.mealSummary)
    this.setData({
      imgSrc: this.data.mealSummary.image_data
    })
  },

  onReturnHome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
})
