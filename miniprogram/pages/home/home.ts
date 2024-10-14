import { endpoint } from "../../constants/global";

interface Item {
  label: string;
  value: number;
}

Page({
  data: {
    screenWidth: 0,

    goal: 2000,
    meal_num: 0,
    intake: 0,
    carbIntake: 0,
    carbGoal: 200,
    proteinIntake: 0,
    proteinGoal: 150,
    fatIntake: 0,
    fatGoal: 75,
    userUploaded: true,
    meals: Array.of()
  },
  
  onShow() {
    const systemInfo = wx.getSystemInfoSync();
    const currentDate = this.getCurrentDateFormatted();
    const accessToken = wx.getStorageSync('openId');
    console.log('Access token is Bearer' + accessToken);
    this.setData({
      screenWidth: systemInfo.screenWidth
    });

    wx.request({
      url: `${endpoint}/user/daily_energy`,
      method: 'GET', // The HTTP method
      header: {
        'accept': 'application/json', // The Accept header
        'Authorization': `Bearer ${accessToken}` // The Authorization header
      },
      success: (res) => {
        console.log('Get user daily energy ' + res.statusCode);
        console.log(res.data);
        if (res.data && typeof res.data === 'object' && 'data' in res.data) {
          if (Object.keys(res.data.data).length === 0) {
            console.error('Empty result');
          } else {
            console.log(res.data.data);
            if (typeof res.data.data === 'string') {
            const resJson = JSON.parse(res.data.data)
            this.setData({
              goal: resJson.target_energy.calories,
              carbGoal: resJson.target_energy.carbs,
              proteinGoal: resJson.target_energy.protein,
              fatGoal: resJson.target_energy.fat,
              intake: resJson.actual_energy.calories,
              carbIntake: resJson.actual_energy.carbs,
              proteinIntake: resJson.actual_energy.protein,
              fatIntake: resJson.actual_energy.fat
            })

            console.log(this.data.goal);
            const goal = this.data.goal;
            const intake = this.data.intake;
            this.drawRadialBar(goal, intake); // Example percentage value
            this.drawHorizontalBars([
              { label: `碳水 ${this.data.carbIntake}/${this.data.carbGoal}g`, value: this.data.carbIntake/this.data.carbGoal*100 },
              { label: `蛋白质 ${this.data.proteinIntake}/${this.data.proteinGoal}g`, value:  this.data.proteinIntake/this.data.proteinGoal*100},
              { label: `脂肪 ${this.data.fatIntake}/${this.data.fatGoal}g`, value:  this.data.fatIntake/this.data.fatGoal*100}
            ]);
          }
        }
      }
    });


    console.log('Current date is ', currentDate);
    wx.request({
      url: `${endpoint}/food/food_records/?record_date=${currentDate}`,
      method: 'GET', // The HTTP method
      header: {
        'accept': 'application/json', // The Accept header
        'Authorization': `Bearer ${accessToken}` // The Authorization header
      },
      success: (res) => {
        const result =res.data.data
        console.log(result)
        if (Array.isArray(result)) {
          this.setData({
            'meals': result,
          })
        }
        
      },
      fail: (err) => {
        console.error(err.errMsg)
      }
    })
  },

  rpxToPx(rpx: number) {
    return (rpx * this.data.screenWidth) / 750;
  },

  drawRadialBar(goal: number, intake: number) {
    const percentage = (intake / goal) * 100;
    const remaining = goal - intake;
    console.log('percentage: ' + percentage);
    console.log('remaining: ' + remaining);

    const query = wx.createSelectorQuery();
    query.select('#radialBarCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const radiusInRpx = 125;
        const radius = this.rpxToPx(radiusInRpx);
        const centerX = res[0].width / 2;
        const centerY = res[0].height / 2;
        const startAngle = 0;
        const endAngle = percentage > 100 ? 2 * Math.PI : (percentage / 100) * 2 * Math.PI;

        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#e6e6e6';
        ctx.stroke();

        // Draw foreground arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#1AAD19';
        ctx.stroke();

        // Draw surplus arc


        // Draw the percentage text
        ctx.font = '18px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`剩余：${remaining}`, centerX, centerY);
      });
    },

  drawHorizontalBars(data: Item[]) {
    const query = wx.createSelectorQuery();
    query.select('#horizontalBarCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const startX = 25;
        const startY = 20; // Starting Y position for horizontal bars
        const barWidthInRpx = 375;
        const barWidth = this.rpxToPx(barWidthInRpx);
        const barHeight = 15;
        const gap = 30; // Gap between bars

        data.forEach((item, index) => {
          const yPosition = startY + index * gap;

          // Draw background bar
          ctx.beginPath();
          ctx.rect(startX, yPosition, barWidth, barHeight);
          ctx.fillStyle = '#e6e6e6';
          ctx.fill();

          // Draw foreground bar
          ctx.beginPath();
          ctx.rect(startX, yPosition, this.rpxToPx(item.value * 3.75), barHeight); // item.value * 1.5 to scale the bar width
          ctx.fillStyle = '#1AAD19';
          ctx.fill();

          // Draw text label
          ctx.font = '12px Arial';
          ctx.fillStyle = '#000';
          ctx.fillText(item.label, startX + barWidth + 10, yPosition + barHeight - 5);
        });
      });
    },

    getCurrentDateFormatted(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    validFoodRecords(): boolean {
      return (
        true
      )
    }
})