Page({
  data: {
    mealType: wx.getStorageSync('mealType'),
    imgSrc: wx.getStorageSync('imgSrc'),
    mealSummary: {},
    dishes: {}
  },

  onLoad() {
      const mealSummaryString:string = wx.getStorageSync('mealSummary');
      console.log('Meal summary ' + mealSummaryString);
      const mealSummary = JSON.parse(mealSummaryString)
      const dishesString:string = mealSummary.food_details
      const dishes:JSON = JSON.parse(dishesString)
      this.setData({
        'mealSummary': mealSummary,
        'dishes': dishes
      })
  },

  onSubmit() {
    console.log('Go to home');
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
})