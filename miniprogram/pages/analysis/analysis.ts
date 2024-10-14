import { getDailyEnergy } from '../../services/api';
import { getNutrients, getMeals } from '../../services/nutritionService'

Page({
  data: {
    baseGoal: 2080,
    foodCalories: 2400,
    remainingCalories: 0,
    consumptionPercentage: 0,
    nutrients: [],
    meals: [],
  },

  onLoad() {
    const currentDate = this.getCurrentDateFormatted();
    this.getDailyEnergy();
    this.calculateCalories()
    this.setData({
      nutrients: getNutrients(),
      meals: getMeals(),
    })
    this.drawCalorieCircle()
  },

  calculateCalories() {
    const { baseGoal, foodCalories } = this.data
    const remainingCalories = baseGoal - foodCalories
    const consumptionPercentage = (foodCalories / baseGoal) * 100

    this.setData({
      remainingCalories,
      consumptionPercentage,
    })
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

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 12
        ctx.lineCap = 'round'
        ctx.stroke()

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

  getCurrentDateFormatted(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  async getDailyEnergy() {
    const response = await getDailyEnergy();
    const dailyEnergyResult = response.data;
    console.log('Daily energy result ' + JSON.stringify(response));
  },

  getFoodRecords() {

  }
})