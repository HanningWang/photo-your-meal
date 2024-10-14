Page({
  data: {
    mealType: wx.getStorageSync('mealType'),
    imgSrc: wx.getStorageSync('imgSrc'),
    mealSummary: wx.getStorageSync('mealSummary'),
    dishes: {}
  },

  onLoad() {
      const mealSummary = wx.getStorageSync('mealSummary');
      console.log('Meal summary ' + JSON.stringify(mealSummary));
      console.log(typeof(mealSummary));
      const dishes:JSON = mealSummary.food_details;
      this.setData({
        'mealSummary': mealSummary,
        'dishes': dishes
      })
  },

  onSubmit() {
    console.log('Back to the main page');
    wx.switchTab({
      url: '/pages/analysis/analysis'
    })
  }
})