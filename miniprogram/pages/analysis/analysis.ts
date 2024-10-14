import { getDailyEnergy, getFoodRecords } from '../../services/api';
import { getNutrients, getMeals as getMockMeals, getInitialNutrients } from '../../services/nutritionService'
import { getCurrentDateFormatted } from '../../utils/common';

Page({
  data: {
    baseGoal: 2080,
    foodCalories: 0,
    remainingCalories: 0,
    consumptionPercentage: 0,
    nutrients: getInitialNutrients(),
    meals: [],
  },

  onShow() {
    this.getDailyEnergy();
    this.getFoodRecords();
    this.drawCalorieCircle()
  },

  drawCalorieCircle() {
    const query = wx.createSelectorQuery()
    query.select('#calorieCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        const centerX = canvas.width / (2 * dpr)
        const centerY = canvas.height / (2 * dpr)
        const radius = 80

        // Background circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 12
        ctx.stroke()

        // Consumption arc
        const startAngle = -Math.PI / 2
        const endAngle = startAngle + (2 * Math.PI * Math.min(this.data.consumptionPercentage, 100) / 100)

        if (this.data.consumptionPercentage > 0) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.strokeStyle = '#3b82f6'
          ctx.lineWidth = 12
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        // Surplus arc (if applicable)
        if (this.data.consumptionPercentage > 100) {
          const surplusEndAngle = endAngle + (2 * Math.PI * (this.data.consumptionPercentage - 100) / 100)
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, endAngle, surplusEndAngle)
          ctx.strokeStyle = '#f97316'
          ctx.lineWidth = 12
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        // Text
        ctx.fillStyle = '#000000'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.data.remainingCalories.toString(), centerX, centerY - 10)

        ctx.font = '16px sans-serif'
        ctx.fillText('剩余', centerX, centerY + 15)
      })
  },

  async getDailyEnergy() {
    try {
      const response = await getDailyEnergy();
      const res = JSON.parse(response.data);
      console.log('Daily energy result ' + JSON.stringify(res));

      const baseGoal = res.target_energy.calories;
      const foodCalories = res.actual_energy.calories;
      const remainingCalories = baseGoal - foodCalories;
      const consumptionPercentage = (foodCalories / baseGoal) * 100;
      
      this.setData({
        baseGoal: baseGoal,
        foodCalories: foodCalories,
        remainingCalories: remainingCalories,
        consumptionPercentage: consumptionPercentage,
        nutrients: getNutrients({
          carbGoal: res.target_energy.carbs,
          proteinGoal: res.target_energy.protein,
          fatGoal: res.target_energy.fat,
          foodCarb: res.actual_energy.carbs,
          foodProtein: res.actual_energy.protein,
          foodFat: res.actual_energy.fat,
        }),
      })
    } catch (error) {
      console.error('Get user daily energy info err:', error);
      wx.showToast({ title: '获取用户营养信息失败', icon: 'none' });
    }
    
  },

  async getFoodRecords() {
    const currentDate = getCurrentDateFormatted();
    try {
      const response = await getFoodRecords(currentDate);
      const res = response.data;
      console.log('Food records ' + res);

      this.setData({
        meals: getMockMeals(),
      })
    } catch (error) {
      console.error('Get user food records err:', error);
      wx.showToast({ title: '获取用户饮食记录失败', icon: 'none' });
    }
  },

  handleNavigation() {
    // Navigate to the target page programmatically
    wx.navigateTo({
      url: '/pages/meal/meal',
    });
  }
})