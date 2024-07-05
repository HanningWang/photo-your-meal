Page({

  data: {
    nickName: wx.getStorageSync('nickName'),
    avatarUrl: wx.getStorageSync('avatarUrl')
  },

  formSubmit(e:any) {
    const app = getApp();
    const formData = e.detail.value;
    console.log('Form data:', formData);

    if (!formData.gender || !formData.age || !formData.weight || !formData.goal || !formData.habit) {
      wx.showToast({
        title: '请填写所有问题',
        icon: 'none'
      });
      return;
    }
    
    if(formData.age < 1 || formData.age > 120) {
      wx.showToast({
        title: '年龄应在1至120岁之间',
        icon: 'none'
      });
      return;
    }

    if(formData.weight < 1 || formData.weight > 260) {
      wx.showToast({
        title: '体重应在1至260kg之间',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: 'http://39.105.187.228/user/update_info', // The URL from the curl command
      method: 'POST', // The HTTP method
      header: {
        'accept': 'application/json', // The Accept header
        'Authorization': app.globalData.auth, // The Authorization header
        'Content-Type': 'application/json' // The Content-Type header
      },
      data: {
        user_name: this.data.nickName,
        gender: formData.gender,
        birthday: "1991-04-23",
        height: "175",
        weight: formData.age,
        target: formData.goal,
        exercise_frequency: formData.habit
      },
      success: (res) => {
        console.log('User Info Updated:', res.data);
        // Handle the response data as needed
        wx.switchTab({
          url: '/pages/home/home'
        })
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  }
});