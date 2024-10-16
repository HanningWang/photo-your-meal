Page({
  data: {
    mealSummary: {},
  },

  onShow() {
    const mealSummary = wx.getStorageSync('mealSummary');
    console.log('Meal summary is ' + mealSummary)
    this.setData({
      mealSummary: mealSummary,
    });
  },

  onReturnHome() {
    wx.switchTab({
      url: '/pages/analysis/analysis'
    })
  }
})
