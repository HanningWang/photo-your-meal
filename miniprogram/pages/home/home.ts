interface Item {
  label: string;
  value: number;
}

Page({
  data: {
    screenWidth: 0,

    goal: 2000,
    meal_num: 1,
    intake: 1440,
    carbIntake: 300,
    carbGoal: 400,
    proteinIntake: 200,
    proteinGoal: 275,
    fatIntake: 150,
    fatGoal: 195,
    userUploaded: true,
    meals: [
      {
        title: '午饭',
        img: '../../images/meal_sample.jpg',
        calorie: 1440,
        carb: 300,
        protein: 275,
        fat: 150,
        items: [
          '京酱肉丝：猪肉 200g，京葱 50g，甜面酱：15g',
          '西红柿鸡蛋： 西红柿 200g， 鸡蛋 200g',
          '米饭： 300g'
        ]
      }
    ]
  },
  
  onLoad() {
    const app = getApp();
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      screenWidth: systemInfo.screenWidth
    });

    wx.request({
      url: 'http://39.105.187.228/user/daily_energy',
      method: 'GET', // The HTTP method
      header: {
        'accept': 'application/json', // The Accept header
        'Authorization': app.globalData.auth // The Authorization header
      },
      success: (res) => {
        console.log('Get user daily energy ' + res.statusCode);
        if (Object.keys(res.data).length === 0) {
          console.error('Empty result')
        } else {
          console.log(res.data);
          if(typeof res.data === 'string') {
            const resJson= JSON.parse(res.data)
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
        const endAngle = (percentage / 100) * 2 * Math.PI;

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
    }
})