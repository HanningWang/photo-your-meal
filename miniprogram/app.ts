// app.ts
App<IAppOption>({
  globalData: {
    auth: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWIxNDc1OWMtY2Q0MC00ZjBjLWEwNmMtNzUxOWEyNjg0MTQ1IiwidGFyZ2V0X2VuZXJneSI6bnVsbCwiZXhwIjoxNzIwMTkxNTIwfQ.DbUmVsjrXMKTpM-m5btPaU4fCGA_Flf8g9gSoexijU0'
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})