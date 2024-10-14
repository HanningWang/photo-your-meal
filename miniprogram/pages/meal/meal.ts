Page({
  data: {
    mealSummary: {
      image_url: '../../images/breakfast1.jpg'
    },
    dishes: [
      {
        dish_name: '烤鸡胸肉',
        calories: '165',
        weight: '100克',
        carbs: '0克',
        protein: '31克',
        fat: '3.6克',
        ingredients: '鸡胸肉、橄榄油、香草',
        nutritional_value: '高蛋白，低脂肪'
      },
      {
        dish_name: '混合绿色沙拉',
        calories: '70',
        weight: '150克',
        carbs: '10克',
        protein: '2克',
        fat: '5克',
        ingredients: '混合绿叶、番茄、黄瓜、油醋汁',
        nutritional_value: '富含维生素和纤维'
      }
    ]
  },

  onReturnHome() {
    wx.switchTab({
      url: '/pages/analysis/analysis'
    })
  }
})
